'use client';
import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';
import DashboardMenu from './dashboard-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '../ui/sheet';

interface DashboardHeaderProps {
  onPressToCreatePage: () => void;
  handlePageClick: (page: Page) => void;
  onSignOut: () => void;
  userName: string;
  avatarUrl: string;
}

export default function DashboardHeader({
  onPressToCreatePage,
  userName,
  handlePageClick,
  avatarUrl,
  onSignOut
}: DashboardHeaderProps) {
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
      <Sheet>
        <SheetTrigger>
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{fallbackChar}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{`Olá, ${userName}`}</SheetTitle>
            <SheetDescription>Configurações da sua conta</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-6">
            <Button variant={'ghost'}>Perfil</Button>
            <Button variant={'ghost'}>Suporte</Button>
            <Button variant={'destructive'}>Sair</Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
