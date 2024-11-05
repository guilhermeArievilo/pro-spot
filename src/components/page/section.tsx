import HeaderSection from './header-section';
import SlideItems from './slide-items';
import GridItems from './grid-items';
import { AlignContent, Item } from '@/application/entities';
import { groupByType } from '@/lib/utils';

interface SectionProps {
  title: string;
  subtitle?: string;
  alignContent: AlignContent;
  items?: Item[];
}

export default function Section({
  title,
  subtitle,
  alignContent,
  items
}: SectionProps) {
  if (!items)
    return (
      <section className="section-container flex flex-col gap-4">
        <HeaderSection
          title={title}
          subtitle={subtitle}
          alignContent={alignContent}
        />
      </section>
    );

  const groups = groupByType(items);
  return (
    <section className="section-container flex flex-col gap-4">
      <HeaderSection
        title={title}
        subtitle={subtitle}
        alignContent={alignContent}
      />
      {groups.map((items, index) => {
        const currentType = items[0].type;

        if (currentType === 'col' || currentType === 'banner') {
          return <SlideItems items={items} key={`slide-${title}-${index}`} />;
        }

        return <GridItems items={items} key={`grid-${title}-${index}`} />;
      })}
    </section>
  );
}
