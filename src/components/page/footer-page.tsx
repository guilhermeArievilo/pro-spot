'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import WhatsappLogoIcon from '@/assets/svg/icons/whatsapp.svg';
import XLogoIcon from '@/assets/svg/icons/x.svg';
import MapPin from '@/assets/svg/icons/map-pin.svg';
import FacebookIcon from '@/assets/svg/icons/facebook.svg';
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  OpenInNewWindowIcon
} from '@radix-ui/react-icons';
import { useRef } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface FooterPageProps {
  instagram?: string;
  x?: string;
  linkedin?: string;
  site?: string;
  whatsapp?: string;
  location?: string;
  facebook?: string;
}

export default function FooterPage({
  instagram,
  x,
  linkedin,
  site,
  whatsapp,
  location,
  facebook
}: FooterPageProps) {
  const footerContainer = useRef(null);

  useGSAP(
    () => {
      gsap.from('#contacts', {
        translateX: 360,
        opacity: 1,
        delay: 3.5,
        duration: 0.7,
        ease: 'power2.inOut'
      });
    },
    {
      scope: footerContainer
    }
  );

  return (
    <footer
      ref={footerContainer}
      className="absolute bottom-0 left-0 w-full z-30 flex flex-col gap-2 justify-center items-center pb-2 pt-10"
    >
      <div
        id="contacts"
        className="flex justify-center items-center gap-2 p-2 bg-light-surfaceContainer/60 dark:bg-dark-surfaceContainerLowest/60 rounded-full backdrop-blur-sm"
      >
        {instagram && (
          <Button className="rounded-full" asChild>
            <Link href={instagram}>
              <InstagramLogoIcon className="w-4 h-4 fill-card" />
            </Link>
          </Button>
        )}
        {x && (
          <Button className="rounded-full" asChild>
            <Link href={x}>
              <XLogoIcon className="w-4 h-4 fill-card" />
            </Link>
          </Button>
        )}
        {linkedin && (
          <Button className="rounded-full" asChild>
            <Link href={linkedin}>
              <LinkedInLogoIcon className="w-4 h-4 fill-card" />
            </Link>
          </Button>
        )}
        {facebook && (
          <Button className="rounded-full" asChild>
            <Link href={facebook}>
              <FacebookIcon className="w-4 h-4 stroke-card" />
            </Link>
          </Button>
        )}
        {whatsapp && (
          <Button className="rounded-full" asChild>
            <Link href={whatsapp}>
              <WhatsappLogoIcon className="w-4 h-4 fill-card" />
            </Link>
          </Button>
        )}
        {site && (
          <Button className="rounded-full" asChild>
            <Link href={site}>
              <OpenInNewWindowIcon />
            </Link>
          </Button>
        )}
        {location && (
          <Button className="rounded-full" asChild>
            <Link href={location}>
              <MapPin className="w-4 h-4 fill-card" />
            </Link>
          </Button>
        )}
      </div>
      {/* <div className="flex justify-center items-center gap-1 text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant opacity-40">
        <span className="text-xs">built with</span>
        <FooterLogo className="w-6 dark:fill-dark-onSurfaceVariant fill-light-onSurfaceVariant" />
        <span className="text-xs">ProSpot</span>
      </div> */}
    </footer>
  );
}
