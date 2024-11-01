import { PageSchema } from '@/application/modules/pages/entities';
import useMediaModel from '@/application/modules/pages/presentation/models/media-model';
import usePageModel from '@/application/modules/pages/presentation/models/page-model';
import useUserModel from '@/application/modules/pages/presentation/models/user-model';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import StrapiUserRepository from '@/infra/http/strapi/users/repository/strapi-user-repository';
import usePagesStore from '@/store/pages';
import useUserStore from '@/store/uset';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useDashboardLayoutModel() {
  const { isLoaded, userId, signOut } = useAuth();
  const { user } = useUser();
  const [toggleModal, setToggleModal] = useState(false);

  const userRepository = new StrapiUserRepository(GraphQlClient, axiosInstance);
  const pageRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

  const { createPage, fetchPagesByUserId } = usePageModel({ pageRepository });
  const { uploadMedia } = useMediaModel({ pageRepository });
  const { createUser, fetchUserByAuthServiceId } = useUserModel({
    userRepository
  });

  const [isLoading, setIsLoading] = useState(true);
  const [onError, setError] = useState(false);
  const { setUser, user: userData } = useUserStore();
  const { setPages, setSelectedPage, pages } = usePagesStore();

  async function fetchPages(userId: string) {
    const pages = await fetchPagesByUserId(userId);
    if (!pages) return;
    setPages(pages);
  }

  async function createUserIfNotExist(userAuthServiceId: string) {
    const fetchedUser = await fetchUserByAuthServiceId(userAuthServiceId);

    if (!fetchedUser && user) {
      const createdUser = await createUser({
        authId: userAuthServiceId,
        name: user.firstName!,
        email: user.primaryEmailAddress?.emailAddress!,
        lastName: user.lastName!,
        phoneNumber: user.phoneNumbers[0]?.phoneNumber!
      });

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

    await createPage(data, id)
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

  useEffect(() => {
    createUserIfNotExist(userId!);
  }, [userId, user]);

  useEffect(() => {
    if (userData) {
      fetchPages(userData?.id as string);
    }
  }, [userData]);

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
    user,
    userId,
    userData,
    signOut
  };
}
