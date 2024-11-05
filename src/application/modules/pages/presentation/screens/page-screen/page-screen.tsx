'use client';

import Image from 'next/image';
import { GetPageResponse } from '../../../entities';
import Section from '@/components/page/section';
import SlideItems from '@/components/page/slide-items';
import GridItems from '@/components/page/grid-items';
import { Item } from '@/application/entities';
import { useRef } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { INTRODUCE_DURATION } from './animation-config-values';

export interface PageScreenProps {
  page: GetPageResponse;
  groups: Item[][] | null;
}

export default function PageScreen({ page, groups }: PageScreenProps) {
  const mainPageScope = useRef(null);

  useGSAP(
    () => {
      gsap.from('#hero .cover', {
        scale: 2,
        delay: INTRODUCE_DURATION,
        duration: 0.8,
        ease: 'power2.inOut'
      });

      gsap.from('.section-container', {
        translateX: 1000,
        scale: 2,
        delay: INTRODUCE_DURATION,
        duration: 1.5,
        stagger: 0.5,
        ease: 'power2.inOut'
      });
    },
    {
      scope: mainPageScope
    }
  );

  return (
    <main ref={mainPageScope} className="flex flex-col gap-6">
      <section
        id="hero"
        className="w-full aspect-[3/4] relative -z-20 overflow-clip"
      >
        <Image
          src={page.backgroundMedia.src}
          width={page.backgroundMedia.width}
          height={page.backgroundMedia.height}
          alt={page.name}
          className="h-full w-full object-cover cover"
        />
        <div className="absolute w-full h-2/5 bottom-0 left-0 bg-gradient-to-b from-transparent to-background" />
      </section>
      <div className="-translate-y-24 flex flex-col gap-12 overflow-x-hidden">
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
