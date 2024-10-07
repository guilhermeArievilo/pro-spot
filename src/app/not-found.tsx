import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';

export default function NotFoundPage() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4 pb-12 gap-6">
      <div className="text-center flex flex-col gap-2 items-center justify-center">
        <ProSpotLogo className="w-1/3 fill-card-foreground" />
        <h1 className="text-xl font-semibold">Opa, não achamos essa página</h1>
        <h2 className="text-sm">Você pode criar uma, com este nome</h2>
      </div>
      <Button asChild>
        <Link href="/">Começe agora !</Link>
      </Button>
    </main>
  );
}
