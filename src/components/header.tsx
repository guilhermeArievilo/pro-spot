import Link from 'next/link';
import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="fixed w-full flex items-center justify-between gap-3 py-4 px-10 dark:bg-dark-scrim/60 border-b border-b-light-outlineVariant/20 dark:border-b-dark-outlineVariant/20 backdrop-blur-md z-20">
      <Link href={'/'}>
        <ProSpotLogo className="w-12 h-12 fill-foreground" />
      </Link>

      <nav className="flex items-center gap-4">
        <Link href={'/contact-us'} className="p-2 text-sm">
          Fale com a gente
        </Link>
        <Link href={'/prices'} className="p-2 text-sm">
          Preços
        </Link>
        <Link href={'/auth/sign-in'} className="p-2 text-sm">
          Entrar
        </Link>

        <Button asChild className="w-auto">
          <Link href={'/auth/sign-up'}>Crie sua página</Link>
        </Button>
      </nav>
    </header>
  );
}
