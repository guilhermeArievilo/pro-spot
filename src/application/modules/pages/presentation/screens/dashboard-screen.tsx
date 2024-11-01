import { Page } from '@/application/entities';
import { User } from '@/application/modules/user/entities';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { ReactNode } from 'react';

interface DashboardScreenProps {
  onPressToCreatePage: () => void;
  navigateToPage: (page: Page) => void;
  user: User;
  children: ReactNode;
  onSignOut: () => void;
}

export default function DashboardScreen({
  onPressToCreatePage,
  navigateToPage,
  children,
  onSignOut,
  user
}: DashboardScreenProps) {
  return (
    <div className="h-screen w-screen flex flex-col">
      <DashboardHeader
        onPressToCreatePage={onPressToCreatePage}
        handlePageClick={navigateToPage}
        onSignOut={onSignOut}
        user={user}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* <AsideMenu /> */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
