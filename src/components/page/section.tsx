import HeaderSection from './header-section';
import SlideItems from './slide-items';
import GridItems from './grid-items';
import { AlignContent, Item } from '@/application/entities';

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
      <section className="flex flex-col gap-4">
        <HeaderSection
          title={title}
          subtitle={subtitle}
          alignContent={alignContent}
        />
      </section>
    );

  const groups = groupByType(items);
  return (
    <section className="flex flex-col gap-4">
      <HeaderSection
        title={title}
        subtitle={subtitle}
        alignContent={alignContent}
      />
      {groups.map((items) => {
        const currentType = items[0].type;

        if (currentType === 'col' || currentType === 'banner') {
          return <SlideItems items={items} key={`slide-${title}`} />;
        }

        return <GridItems items={items} key={`grid-${title}`} />;
      })}
    </section>
  );
}

function groupByType(items: Item[]) {
  const groups: Item[][] = [];

  items.forEach((item) => {
    const { type } = item;

    const groupIndex = groups.findIndex((items) => {
      const foundType = items.find((currentItem) => type === currentItem.type);
      return foundType;
    });

    if (groupIndex !== -1) {
      groups[groupIndex].push(item);
    } else {
      groups.push([item]);
    }
  });

  return groups;
}
