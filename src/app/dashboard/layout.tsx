'use client';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
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
import { AsideMenu } from '@/components/dashboard/aside-menu';
import Loading from '@/components/loading';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [toggleModal, setToggleModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const { setUser, user: userData } = useUserStore();
  const { setPages, setSelectedPage } = usePagesStore();
  const userRepository = new StrapiUserRepository(GraphQlClient, axiosInstance);
  const pagesRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

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

      if (createdUser?.id) {
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

  useEffect(() => {
    createUserIfNotExist(userId!);
  }, [userId, user]);

  useEffect(() => {
    if (userData) {
      fetchPages(userData?.id as string);
    }
  }, [userData]);

  if (isLoading) {
    return <Loading />;
  }

  function toggleModalTrigger() {
    setToggleModal(!toggleModal);
  }

  if (!isLoaded || !userId) {
    return redirect('./auth/sign-in');
  }
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader
        onPressToCreatePage={toggleModalTrigger}
        handlePageClick={(page) => setSelectedPage(page)}
        userName={user?.firstName || 'Pro Spot'}
      />
      <div className="flex-grow flex overflow-hidden">
        <AsideMenu />
        {children}
      </div>
      <Drawer open={toggleModal}>
        <DrawerContent>
          <div className="container">
            <DrawerHeader>
              <DrawerTitle>Vamos criar uma Página</DrawerTitle>
              <DrawerDescription>Preencha os campos a seguir</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={toggleModalTrigger}>
                  Cancelar
                </Button>
                <Button>Criar</Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <Toaster />
    </div>
  );
}
