'use client';

import { Page } from '@/application/entities';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import QRCodeStyling from 'qr-code-styling';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import { useEffect, useRef } from 'react';

interface CardDialogProps {
  open: boolean;
  onChangeOpen: (isOpen: boolean) => void;
  page: Page;
  qrCode: QRCodeStyling | null;
  baseUrl: string;
}

export default function CardDialog({
  open,
  onChangeOpen,
  page,
  qrCode,
  baseUrl
}: CardDialogProps) {
  const cardRef = useRef(null);

  const handleDownloadImage = async () => {
    if (cardRef.current) {
      htmlToImage.toPng(cardRef.current).then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `card-${page.slug}.png`;
        link.click();
      });
    }
  };

  useEffect(() => {
    if (qrCode && open) {
      setTimeout(() => {
        const container = document.getElementById('qrcode-container');
        if (container) {
          qrCode.append(container);
        }
      }, 10);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="bg-background/60 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Seu card</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <div
            ref={cardRef}
            className="text-center flex flex-col gap-6 bg-dark-surfaceContainerLowest py-10 px-20 rounded-3xl"
          >
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={page.photoProfile.src}
                  alt={page.name}
                  crossOrigin="anonymous"
                />
                <AvatarFallback>{page.name}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-2xl">{page.name}</span>
                <span className="text-sm opacity-60">{page.content}</span>
              </div>
            </div>
            <div
              key={'qrcode'}
              id="qrcode-container"
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs opacity-60">
                Escaneie o QR Code abaixo
              </span>
            </div>
            <Link
              href={`${baseUrl}/${page.slug}`}
              className="text-xs bg-dark-surface py-3 px-3 rounded-full text-opacity-60"
            >
              {`${baseUrl}/${page.slug}`}
            </Link>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={'ghost'}>
              Fechar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={'default'}
            onClick={handleDownloadImage}
          >
            Baixar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
