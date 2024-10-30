'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import useUserStore from '@/store/uset';
import usePagesStore from '@/store/pages';
import StrapiUserRepository from '@/infra/http/strapi/users/repository/strapi-user-repository';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import axiosInstance from '@/infra/http/axiosService';
import CreateUserUsecase from '@/application/modules/user/usecase/create-user-usecase';
import GetUserByAuthServiceIdUsecase from '@/application/modules/user/usecase/get-user-by-auth-service-id-usecase';
import GetPagesByUserId from '@/application/modules/pages/usecases/get-pages-by-user-id';
import { UserScheme } from '@/application/modules/user/entities';
import { Toaster } from '@/components/ui/sonner';
import Loading from '@/components/loading';
import DashboardScreen from '@/application/modules/pages/presentation/screens/dashboard-screen';
import Error from '@/components/error';
import CreatePageScreen from '@/application/modules/pages/presentation/screens/create-page-screen';
import UploadMediaUsecase from '@/application/modules/pages/usecases/upload-media-usecase';
import { PageSchema } from '@/application/modules/pages/entities';
import CreatePageUsecase from '@/application/modules/pages/usecases/create-page-usecase';
import { toast } from 'sonner';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId, signOut } = useAuth();
  const { user } = useUser();
  const [toggleModal, setToggleModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [onError, setError] = useState(false);
  const { setUser, user: userData } = useUserStore();
  const { setPages, setSelectedPage, pages } = usePagesStore();
  const userRepository = new StrapiUserRepository(GraphQlClient, axiosInstance);
  const pagesRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

  async function uploadMedia(media: File) {
    const uploadMediaCase = new UploadMediaUsecase(pagesRepository);

    return await uploadMediaCase.execute(media);
  }

  async function fetchPages(userId: string) {
    const getPagesByUserId = new GetPagesByUserId(pagesRepository);
    const pages = await getPagesByUserId.execute(userId);

    if (!pages) return;
    setPages(pages);
  }

  async function handlerCreateUser(userData: UserScheme) {
    const createUser = new CreateUserUsecase(userRepository);
    const user = await createUser.execute(userData);

    return user;
  }

  async function fetchUserByAuthServiceId(userAuthServiceId: string) {
    const getUserByAuthServiceId = new GetUserByAuthServiceIdUsecase(
      userRepository
    );
    const user = await getUserByAuthServiceId.execute(userAuthServiceId);
    return user;
  }

  async function createUserIfNotExist(userAuthServiceId: string) {
    const fetchedUser = await fetchUserByAuthServiceId(userAuthServiceId);

    if (!fetchedUser && user) {
      const createdUser = await handlerCreateUser({
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
    const createPageCase = new CreatePageUsecase(pagesRepository);

    if (userData?.id) {
      await createPageCase
        .execute(data, userData.id)
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
    setToggleModal(!toggleModal);
  }

  if (!isLoaded || !userId) {
    return redirect('./auth/sign-in');
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && onError) {
    return <Error />;
  }

  return (
    <>
      <DashboardScreen
        onPressToCreatePage={toggleModalTrigger}
        navigateToPage={(page) => setSelectedPage(page)}
        userName={user?.firstName || ''}
        avatarUrl={userData?.photoProfile?.src || ''}
        onSignOut={signOut}
      >
        {children}
      </DashboardScreen>
      <CreatePageScreen
        open={toggleModal}
        changeOpen={(isOpen) => setToggleModal(isOpen)}
        onUploadMedia={uploadMedia}
        onSubmit={handleCreatePage}
      />
      <Toaster />
    </>
  );
}
