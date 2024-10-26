import GetPageUsecase from '@/application/modules/pages/usecases/get-page-usecase';
import GridItems from '@/components/page/grid-items';
import Section from '@/components/page/section';
import SlideItems from '@/components/page/slide-items';
import CardItem from '@/components/ui/card-item';
import { getClient } from '@/infra/http/apolloService';
import axiosInstance from '@/infra/http/axiosService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import { groupByType } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface HomePageProps {
  params: {
    slug: string;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const strapiPageRepository = new StrapiPagesApiRepository(
    getClient(),
    axiosInstance
  );
  const getPageUsecase = new GetPageUsecase(strapiPageRepository);

  const page = await getPageUsecase.execute(params.slug);

  if (!page) return notFound();

  const groups = page.items?.length ? groupByType(page.items) : null;
  return (
    <main className="flex flex-col gap-6">
      <section className="w-full h-screen relative -z-20">
        <Image
          src={page.backgroundMedia.src}
          width={page.backgroundMedia.width}
          height={page.backgroundMedia.height}
          alt={page.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute w-full h-2/5 bottom-0 left-0 bg-gradient-to-b from-transparent to-background" />
      </section>
      <div className="-translate-y-48 flex flex-col gap-12">
        {page.sectionsPages?.map(
          ({ id, title, subtitle, alignContent, items }) => (
            <Section
              title={title}
              subtitle={subtitle}
              alignContent={alignContent}
              items={items}
              key={id}
            />
          )
        )}
        <div className="flex flex-col gap-4">
          {groups?.map((items, index) => {
            const currentType = items[0].type;

            if (currentType === 'col' || currentType === 'banner') {
              return (
                <SlideItems items={items} key={`slide-${page.name}-${index}`} />
              );
            }

            return (
              <GridItems items={items} key={`grid-${page.name}-${index}`} />
            );
          })}
        </div>
      </div>
    </main>
  );
}
