'use client';

import { Avatar, AvatarImage } from '../ui/avatar';
import { GetPageResponse } from '@/application/modules/pages/entities';
import AppLogo from '@/assets/svg/icons/footer-logo.svg';

import { useRef } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';

interface Introduce {
  page: GetPageResponse;
}

export default function Introduce({ page }: Introduce) {
  const introduceScope = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.to('#in-avatar', {
        opacity: 1,
        ease: 'power3.inOut',
        duration: 1
      })
        .to('#infos', {
          opacity: 1,
          ease: 'power3.inOut',
          duration: 0.4
        })
        .from('#description', {
          opacity: 0,
          ease: 'power3.inOut',
          duration: 0.3
        })
        .to('#app-logo', {
          opacity: 1,
          ease: 'power3.inOut',
          delay: 0.5,
          duration: 0.8
        })
        .to('#introduce-container', {
          translateY: -1000,
          ease: 'power3.inOut',
          duration: 1
        });
    },
    {
      revertOnUpdate: false
    }
  );

  return (
    <div
      id="introduce-container"
      ref={introduceScope}
      className="fixed h-screen w-screen bg-background flex flex-col justify-center items-center gap-4 z-50"
    >
      <Avatar className="w-32 h-32 opacity-0" id="in-avatar">
        <AvatarImage src={page.photoProfile.src} />
      </Avatar>
      <div
        id="infos"
        className="text-center flex flex-col items-center gap-1 opacity-0"
      >
        <span className="text-4xl">{page.name}</span>
        <span id="description" className="text-sm">
          {page.content}
        </span>
      </div>
      <AppLogo id="app-logo" className="w-6 opacity-0" />
    </div>
  );
}
