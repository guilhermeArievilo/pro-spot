'use client';
import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';
import DashboardMenu from './dashboard-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import usePagesStore from '@/store/pages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAuth } from '@clerk/nextjs';
import { Page } from '@/application/entities';

interface DashboardHeaderProps {
  onPressToCreatePage: () => void;
  handlePageClick: (page: Page) => void;
  userName: string;
}

export default function DashboardHeader({
  onPressToCreatePage,
  userName,
  handlePageClick
}: DashboardHeaderProps) {
  const { signOut } = useAuth();
  const { pages, pageSelected } = usePagesStore();

  const fallbackChar = userName.split(' ').reduce((prevName, currentName) => {
    return prevName
      ? prevName.split('')[0] + currentName.split('')[0]
      : currentName.split('')[0];
  }, '');
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-background/60 z-30">
      <Link href={'/dashboard/'}>
        <ProSpotLogo className="w-10 h-10 fill-foreground" />
      </Link>
      <DashboardMenu
        onPressToCreatePage={onPressToCreatePage}
        pages={pages}
        pageSelected={pageSelected}
        onPageClick={handlePageClick}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>{fallbackChar}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{`Olá, ${userName}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              className="w-full"
              variant={'destructive'}
              onClick={() =>
                signOut({
                  redirectUrl: '/'
                })
              }
            >
              Sair
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
