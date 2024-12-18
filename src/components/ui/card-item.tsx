import Image from 'next/image';
import ArrowUpRight from '@/assets/svg/icons/arrow-up-right.svg';
import LinkIcon from '@/assets/svg/icons/link.svg';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { CardType, Media } from '@/application/entities';
import Link from 'next/link';
import { Skeleton } from './skeleton';

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

function RowItem({ title, subtitle, link, image, preview }: CardItemProps) {
  return (
    <div className="flex justify-between dark:bg-light-surface bg-dark-scrim dark:text-light-onSurface text-dark-onSurface p-3 rounded-xl">
      <div className="flex flex-col">
        {link && <LinkIcon />}
        <span className="text-base font-semibold">{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
      {link && <LinkButton inverse href={link} />}
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
  return (
    <div
      className={cn(
        'relative w-full aspect-[9/12] p-4 rounded-3xl flex flex-col justify-between overflow-clip',
        {
          'justify-end': !link
        }
      )}
    >
      {image ? (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl -z-10"
        />
      ) : (
        <Skeleton className="absolute top-0 left-0 w-full h-full rounded-3xl -z-10 bg-dark-surface" />
      )}
      <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-b from-transparent to-background" />
      {link && <LinkButton selfEnd href={link} />}
      <div className="flex flex-col z-10">
        {link && <LinkIcon />}
        <span className="text-base font-semibold">{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

function BannerItem({ title, subtitle, link, image, type }: CardItemProps) {
  return (
    <div className="relative w-full aspect-video">
      {image ? (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl"
        />
      ) : (
        <Skeleton className="absolute top-0 left-0 w-full h-full rounded-3xl bg-dark-surface" />
      )}
      {link && (
        <div className="absolute w-full h-full flex justify-end p-4">
          <LinkButton href={link} />
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
          <LinkButton selfEnd href={link} />
        </div>
      )}
      {image ? (
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={title}
          className="w-full aspect-[9/12] object-cover rounded-3xl"
        />
      ) : (
        <Skeleton className="w-full aspect-[9/12] rounded-3xl bg-dark-surface -z-10" />
      )}
      <div className="flex flex-col z-10">
        <span className="text-base font-semibold">{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

function ButtonItem({ title, link }: CardItemProps) {
  return link ? (
    <Link href={link}>
      <Button className="w-full">{title}</Button>
    </Link>
  ) : (
    <Button className="w-full">{title}</Button>
  );
}

function LinkButton({
  inverse,
  selfEnd,
  href
}: {
  inverse?: boolean;
  selfEnd?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
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
    </Link>
  );
}
