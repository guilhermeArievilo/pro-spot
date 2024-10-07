import ProSpotLogo from '@/assets/svg/icons/footer-logo.svg';
export default function Loading() {
  return (
    <main className="h-screen w-screen flex items-center justify-center">
      <ProSpotLogo className="animate-pulse w-16 h-16 fill-foreground" />
    </main>
  );
}
