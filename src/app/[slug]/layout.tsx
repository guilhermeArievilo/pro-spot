import FooterPage from '@/components/page/footer-page';
import { HeaderPage } from '@/components/page/header-page';
import { notFound } from 'next/navigation';
import useSlugPageModel from './slug-page-model';
import Introduce from '@/components/page/introduce';

export default async function PageLayout({
  params,
  children
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const { getPageBySlug } = useSlugPageModel();

  const page = await getPageBySlug(params.slug);

  if (!page) return notFound();

  return (
    <>
      <Introduce page={page} />
      <div className="fixed top-0 left-0 w-full z-30">
        <div className="relative">
          <HeaderPage name={page.name} profileImage={page.photoProfile} />
        </div>
      </div>
      {children}
      <div className="fixed bottom-0 left-0 w-full z-30">
        <div className="relative">
          <FooterPage
            instagram={page.instagram}
            linkedin={page.linkedin}
            whatsapp={page.whatsapp}
            x={page.x}
            location={page.locationLink}
            site={page.site}
            facebook={page.facebook}
          />
        </div>
      </div>
    </>
  );
}
