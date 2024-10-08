import Image from 'next/image';
import { HeaderPage } from '../page/header-page';
import { Page } from '@/application/entities';
import Section from '../page/section';
import FooterPage from '../page/footer-page';

interface PreviewProps {
  page: Page;
}

export default function Preview({ page }: PreviewProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-4xl">
      <HeaderPage name={page.name} profileImage={page.photoProfile} />
      <div className="h-full overflow-y-scroll">
        <div className="w-full flex flex-col gap-6">
          <section className="w-full h-[640px] relative -z-20">
            <Image
              src={page.backgroundMedia.src}
              width={page.backgroundMedia.width}
              height={page.backgroundMedia.height}
              alt="adidas"
              className="h-full w-full object-cover"
              unoptimized
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
          </div>
        </div>
      </div>
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
  );
}
