import GetPageUsecase from '@/application/modules/pages/usecases/get-page-usecase';
import FooterPage from '@/components/page/footer-page';
import { HeaderPage } from '@/components/page/header-page';
import { getClient } from '@/infra/http/apolloService';
import axiosInstance from '@/infra/http/axiosService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import { notFound } from 'next/navigation';

export default async function PageLayout({
  params,
  children
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const strapiPageRepository = new StrapiPagesApiRepository(
    getClient(),
    axiosInstance
  );
  const getPageUsecase = new GetPageUsecase(strapiPageRepository);

  const page = await getPageUsecase.execute(params.slug);

  if (!page) return notFound();

  return (
    <>
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
