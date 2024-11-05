'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { Media } from '@/application/entities';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRef } from 'react';

interface HeaderPageProps {
  name: string;
  lastName?: string;
  content?: string;
  profileImage?: Media;
}

export function HeaderPage({ name, lastName, profileImage }: HeaderPageProps) {
  const headerContainer = useRef(null);
  const fullName = name + (lastName ? ' ' + lastName : '');

  const fallbackChar = fullName.split(' ').reduce((prevName, currentName) => {
    return prevName
      ? prevName.split('')[0] + currentName.split('')[0]
      : currentName.split('')[0];
  }, '');

  useGSAP(
    () => {
      gsap.from('#profile-container', {
        translateX: 360,
        opacity: 1,
        delay: 3.5,
        duration: 0.7,
        ease: 'power2.inOut'
      });
    },
    { scope: headerContainer }
  );

  return (
    <header
      ref={headerContainer}
      className="absolute top-0 left-0 flex flex-row justify-end items-center gap-3 w-full py-3 px-4 z-20"
    >
      <div
        id="profile-container"
        className="flex gap-3 items-center rounded-full bg-light-surface dark:bg-dark-surfaceContainerLowest/70 p-1 backdrop-blur-sm"
      >
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
