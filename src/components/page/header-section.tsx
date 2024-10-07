import { AlignContent } from '@/application/entities';
import { cn } from '@/lib/utils';

interface HeaderSectionProps {
  title: string;
  subtitle?: string;
  alignContent: AlignContent;
}

export default function HeaderSection({
  title,
  subtitle,
  alignContent
}: HeaderSectionProps) {
  return (
    <div
      className={cn('px-4 flex flex-col gap-2 items-start text-start', {
        'text-center items-center': alignContent === 'center'
      })}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <h2 className="text-sm">{subtitle}</h2>}
    </div>
  );
}
