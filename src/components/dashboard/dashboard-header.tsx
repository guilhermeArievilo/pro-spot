'use client';
import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';
import DashboardMenu from './dashboard-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import usePagesStore from '@/store/pages';
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
import { User } from '@/application/modules/user/entities';
import { Separator } from '../ui/separator';

interface DashboardHeaderProps {
  onPressToCreatePage: () => void;
  handlePageClick: (page: Page) => void;
  onSignOut: () => void;
  user: User;
}

export default function DashboardHeader({
  onPressToCreatePage,
  handlePageClick,
  onSignOut,
  user
}: DashboardHeaderProps) {
  const { pages, pageSelected } = usePagesStore();

  const fallbackChar = user.name.split(' ').reduce((prevName, currentName) => {
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
            <AvatarImage src={user.photoProfile?.src} />
            <AvatarFallback>{fallbackChar}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{`Olá, ${user.name}`}</SheetTitle>
            <SheetDescription>Configurações da sua conta</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.photoProfile?.src} />
                <AvatarFallback>{fallbackChar}</AvatarFallback>
              </Avatar>
              <span>
                {user.lastName ? `${user.name} ${user.lastName}` : user.name}
              </span>
            </div>
            <Separator />
            <Button variant={'secondary'}>Editar perfil</Button>
            <Button variant={'secondary'}>Suporte</Button>
            <Button variant={'destructive'}>Sair</Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
