import { SignUp } from '@clerk/nextjs';
import LogoMosaic from '@/assets/svg/elements/logo-mosaic.svg';
import HeaderSection from '@/components/page/header-section';
export default function SignupPage() {
  return (
    <main className="container w-full min-h-screen grid grid-cols-12 gap-4">
      <div className="col-span-6 flex flex-col items-start justify-center">
        <HeaderSection
          title="Crie sua conta, é gratis !"
          subtitle="Fácil Acesso, Mais Conexões"
          alignContent="start"
        />
        <LogoMosaic className="w-full" />
      </div>
      <div className="col-span-6 flex flex-col items-center justify-center">
        <SignUp />
      </div>
    </main>
  );
}
