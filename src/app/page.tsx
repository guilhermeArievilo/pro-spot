import Footer from '@/components/footer';
import Header from '@/components/header';
import HeaderSection from '@/components/page/header-section';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList
} from '@/components/ui/command';

export default function Home() {
  return (
    <>
      <Header />
      <main className="container flex flex-col h-screen items-center justify-center gap-8">
        <HeaderSection
          alignContent="center"
          title="Procure por alguma página"
        />
      </main>
      <Footer />
    </>
  );
}
