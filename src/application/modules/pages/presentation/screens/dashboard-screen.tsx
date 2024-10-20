import { Page } from '@/application/entities';
import { AsideMenu } from '@/components/dashboard/aside-menu';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { ReactNode } from 'react';

interface DashboardScreenProps {
  onPressToCreatePage: () => void;
  navigateToPage: (page: Page) => void;
  userName: string;
  avatarUrl: string;
  children: ReactNode;
  onSignOut: () => void;
}

export default function DashboardScreen({
  onPressToCreatePage,
  navigateToPage,
  userName,
  children,
  avatarUrl,
  onSignOut
}: DashboardScreenProps) {
  return (
    <div className="h-screen w-screen flex flex-col">
      <DashboardHeader
        onPressToCreatePage={onPressToCreatePage}
        handlePageClick={navigateToPage}
        userName={userName}
        avatarUrl={avatarUrl}
        onSignOut={onSignOut}
      />
      <div className="flex-1 flex overflow-hidden">
        <AsideMenu />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
