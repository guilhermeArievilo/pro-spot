import { Media } from '@/application/entities';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface HeaderPageProps {
  name: string;
  lastName?: string;
  content?: string;
  profileImage?: Media;
}

export function HeaderPage({
  name,
  lastName,
  content,
  profileImage
}: HeaderPageProps) {
  const fullName = name + (lastName ? ' ' + lastName : '');

  const fallbackChar = fullName.split(' ').reduce((prevName, currentName) => {
    return prevName
      ? prevName.split('')[0] + currentName.split('')[0]
      : currentName.split('')[0];
  }, '');

  return (
    <header className="absolute top-0 left-0 flex flex-row justify-end items-center gap-3 w-full py-3 px-4 z-20">
      <div className="flex gap-3 items-center rounded-full bg-light-surface dark:bg-dark-surfaceContainerLowest/70 p-1 backdrop-blur-sm">
        <span className="ps-2 text-sm opacity-90 font-medium">{fullName}</span>
        <Avatar>
          {profileImage && (
            <AvatarImage
              src={profileImage.src}
              width={profileImage.width}
              height={profileImage.height}
              alt={'Foto de: ' + fullName}
            />
          )}
          <AvatarFallback>{fallbackChar}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
