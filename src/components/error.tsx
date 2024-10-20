import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';

export default function Error() {
  return (
    <main className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <ProSpotLogo className="animate-pulse w-16 h-16 fill-destructive" />
      <span className="text-destructive">
        Algo deu errado, tente atualizar a página.
      </span>
    </main>
  );
}
