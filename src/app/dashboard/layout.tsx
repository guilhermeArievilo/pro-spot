'use client';

import { Toaster } from '@/components/ui/sonner';
import Loading from '@/components/loading';
import DashboardScreen from '@/application/modules/pages/presentation/screens/dashboard-screen';
import Error from '@/components/error';
import CreatePageScreen from '@/application/modules/pages/presentation/screens/create-page-screen';
import useDashboardLayoutModel from './dashboard-layout-model';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isLoading,
    onError,
    user,
    userData,
    setSelectedPage,
    toggleModalTrigger,
    signOut,
    toggleModal,
    setToggleModal,
    uploadMedia,
    handleCreatePage
  } = useDashboardLayoutModel();

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
