import Image from 'next/image';
import ArrowUpRight from '@/assets/svg/icons/arrow-up-right.svg';
import Link from '@/assets/svg/icons/link.svg';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { CardType, Media } from '@/application/entities';

interface CardItemProps {
  title: string;
  subtitle?: string;
  link?: string;
  image?: Media;
  type: CardType | string;
  preview?: boolean;
}

export default function CardItem(props: CardItemProps) {
  switch (props.type) {
    case 'col':
      return <ColItem {...props} />;
    case 'row':
      return <RowItem {...props} />;
    case 'banner':
      return <BannerItem {...props} />;
    case 'button':
      return <ButtonItem {...props} />;
    default:
      return <ShowcaseItem {...props} />;
  }
}

function RowItem({
  title,
  subtitle,
  link,
  image,
  type,
  preview
}: CardItemProps) {
  return (
    <div className="flex justify-between dark:bg-light-surface bg-dark-scrim dark:text-light-onSurface text-dark-onSurface p-3 rounded-xl">
      <div className="flex flex-col">
        {link && <Link />}
        <span className="text-base font-semibold">{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
      {link && <LinkButton inverse={!!image} />}
    </div>
  );
}

function ColItem({
  title,
  subtitle,
  link,
  image,
  type,
  preview
}: CardItemProps) {
  console.log(image);
  return (
    <div
      className={cn(
        'relative w-full aspect-[9/12] p-4 rounded-3xl flex flex-col justify-between overflow-clip',
        {
          'justify-end': !link
        }
      )}
    >
      {image && (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl -z-10"
        />
      )}
      <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-b from-transparent to-background" />
      {link && <LinkButton selfEnd />}
      <div className="flex flex-col z-10">
        {link && <Link />}
        <span className="text-base font-semibold">{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

function BannerItem({ title, subtitle, link, image, type }: CardItemProps) {
  return (
    <div className="relative w-full aspect-video">
      {image && (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl"
        />
      )}
      {link && (
        <div className="absolute w-full h-full flex justify-end p-4">
          <LinkButton />
        </div>
      )}
    </div>
  );
}

function ShowcaseItem({ title, subtitle, link, image, type }: CardItemProps) {
  return (
    <div className="relative w-full flex flex-col gap-2">
      {link && (
        <div className="absolute -top-2 left-2 w-full flex justify-end">
          <LinkButton selfEnd />
        </div>
      )}
      {image && (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={title}
          className="w-full aspect-[9/12] object-cover rounded-3xl"
        />
      )}
      <div className="flex flex-col z-10">
        <span className="text-base font-semibold">{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

function ButtonItem({ title, link }: CardItemProps) {
  return <Button className="w-full">{title}</Button>;
}

function LinkButton({
  inverse,
  selfEnd
}: {
  inverse?: boolean;
  selfEnd?: boolean;
}) {
  return (
    <div
      className={cn(
        'self-start flex items-center justify-center px-3 py-3 rounded-full',
        {
          'dark:bg-dark-surface bg-light-surface': inverse,
          'bg-dark-surface dark:bg-light-surface': !inverse,
          'self-end': selfEnd
        }
      )}
    >
      <ArrowUpRight
        className={cn('stroke-card-foreground', {
          'stroke-card': !inverse
        })}
      />
    </div>
  );
}
