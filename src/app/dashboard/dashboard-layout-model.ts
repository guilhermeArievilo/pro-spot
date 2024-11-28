'use client';

import { Page } from '@/application/entities';
import { PageSchema } from '@/application/modules/pages/entities';
import useUserModel from '@/application/modules/pages/presentation/models/user-model';
import CreatePageUsecase from '@/application/modules/pages/usecases/create-page-usecase';
import GetPagesByUserId from '@/application/modules/pages/usecases/get-pages-by-user-id';
import UploadMediaUsecase from '@/application/modules/pages/usecases/upload-media-usecase';
import axiosInstance from '@/infra/http/axiosService';
import BackendPagesRepository from '@/infra/http/backend/pages/repository/backend-pages-repository';
import BackendUserRepository from '@/infra/http/backend/user/repository/backend-user-repository';
import usePagesStore from '@/store/pages';
import useUserStore from '@/store/uset';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useDashboardLayoutModel() {
  const userRepository = new BackendUserRepository(axiosInstance);

  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  const [toggleModal, setToggleModal] = useState(false);

  const { createUser, authenticate, getUser } = useUserModel({
    userRepository
  });

  const [isLoading, setIsLoading] = useState(true);
  const [onError, setError] = useState(false);
  const {
    setUser,
    user: userData,
    setJwtToken,
    jwtToken,
    isAuthenticated
  } = useUserStore();
  const { setPages, setSelectedPage, pages, fetchPages } = usePagesStore();

  async function createUserIfNotExist(user: UserResource) {
    const fetchedUser = await authenticate(user.id)
      .then(async ({ accessToken }) => {
        setJwtToken(accessToken);
        const user = await getUser();
        return {
          ...user,
          authId: user.id
        };
      })
      .catch(() => null);

    if (!fetchedUser && user) {
      const createdUser = await createUser(
        {
          authId: user.id,
          name: user.firstName!,
          email: user.primaryEmailAddress?.emailAddress!,
          lastName: user.lastName!,
          phoneNumber: user.phoneNumbers[0]?.phoneNumber!
        },
        (token) => {
          setJwtToken(token);
        }
      );

      if (!createdUser) {
        setIsLoading(false);
        setError(true);
        return;
      }

      if (createdUser.id) {
        setIsLoading(false);
        setUser(createdUser);
      }

      return createdUser;
    }

    if (fetchedUser?.id) {
      setIsLoading(false);
      setUser(fetchedUser);
    }
    return fetchedUser;
  }

  async function handleCreatePage(data: PageSchema) {
    if (!userData?.id) return;
    const { id } = userData;

    const pageRepository = new BackendPagesRepository(axiosInstance, jwtToken);
    const createPageCase = new CreatePageUsecase(pageRepository);

    await createPageCase
      .execute(data, id)
      .then((page) => {
        if (pages.length) {
          setPages([...pages, page]);
          toast(`Ôba, a página: "${page.name}" foi criada !`);
        } else {
          setPages([page]);
        }
      })
      .catch((e) => {
        console.error(e);
        toast('Ops, tivemos um problema', {
          description: 'Por algum motivo não conseguimos criar sua página'
        });
      });
  }

  async function uploadMedia(media: File) {
    const pageRepository = new BackendPagesRepository(axiosInstance, jwtToken);

    const uploadMediaCase = new UploadMediaUsecase(pageRepository);

    return await uploadMediaCase.execute(media);
  }

  async function handlerNavigateToPage(page: Page) {
    setSelectedPage(page);
  }

  async function handlerSignOut() {
    await signOut().then(() => {
      setPages([]);
    });
  }

  useEffect(() => {
    if (user) {
      createUserIfNotExist(user);
    }
  }, [user]);

  useEffect(() => {
    if (userData && isAuthenticated) {
      fetchPages();
    }
  }, [userData, isAuthenticated]);

  function toggleModalTrigger() {
    setToggleModal((prev) => !prev);
  }

  return {
    isLoaded,
    isLoading,
    onError,
    uploadMedia,
    toggleModal,
    setToggleModal,
    toggleModalTrigger,
    handleCreatePage,
    setSelectedPage,
    handlerNavigateToPage,
    user,
    userData,
    handlerSignOut
  };
}
