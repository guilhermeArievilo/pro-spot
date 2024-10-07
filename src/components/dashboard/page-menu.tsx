import { Media } from '@/application/entities';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface PageMenuProps {
  name: string;
  photoProfile: Media;
  isSelected: boolean;
}

export default function PageMenu({
  name,
  photoProfile,
  isSelected
}: PageMenuProps) {
  return (
    <div
      className={cn('flex items-center gap-4 p-2 rounded-full', {
        'bg-foreground text-background': isSelected,
        'bg-light-surfaceContainerHigh hover:bg-light-surfaceContainer dark:hover:bg-dark-surfaceContainer dark:bg-dark-surfaceContainerLow transition-all ease-in-out':
          !isSelected
      })}
    >
      <span className="text-xs ps-2">{name}</span>
      <Avatar>
        <AvatarFallback>{name.split('')[0]}</AvatarFallback>
        <AvatarImage src={photoProfile.src} />
      </Avatar>
    </div>
  );
}
