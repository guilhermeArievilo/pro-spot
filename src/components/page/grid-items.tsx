import { Item } from '@/application/entities';
import CardItem from '../ui/card-item';

interface GridItemsProps {
  items: Item[];
}

export default function GridItems({ items }: GridItemsProps) {
  return (
    <div className="px-4 grid grid-cols-4 gap-4">
      {items.map(({ id, title, type, image, link, subtitle }) => {
        if (type !== 'row' && type !== 'button') {
          return (
            <div className="col-span-2" key={id}>
              <CardItem
                title={title}
                type={type}
                image={image}
                link={link}
                subtitle={subtitle}
              />
            </div>
          );
        }

        return (
          <div className="col-span-4" key={id}>
            <CardItem
              title={title}
              type={type}
              image={image}
              link={link}
              subtitle={subtitle}
            />
          </div>
        );
      })}
    </div>
  );
}
