'use client';

import BannerSkeleton from '@/assets/svg/elements/types/banner.svg';
import CardSkeleton from '@/assets/svg/elements/types/card.svg';
import HorizontalCardSkeleton from '@/assets/svg/elements/types/h-card.svg';
import ShowcaseSkeleton from '@/assets/svg/elements/types/showcase.svg';
import ButtonSkeleton from '@/assets/svg/elements/types/button.svg';
import { Button } from '../ui/button';
import PlusIcon from '@/assets/svg/icons/plus.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { CardType, Media, mediaObjectSchema } from '@/application/entities';
import { ItemSchema } from '@/application/modules/pages/entities';
import { ImageInput } from '../ui/image-input';

const formSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório' })
});

const formImageSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório' }),
  image: mediaObjectSchema
});

interface CreateItemRotineProps {
  onCreateAItem: (item: ItemSchema) => void;
  onUploadMedia: (media: File) => Promise<Media>;
}

export default function CreateItemRotine({
  onCreateAItem,
  onUploadMedia
}: CreateItemRotineProps) {
  const [type, setType] = useState<CardType>('banner');
  const [containImage, setContainImage] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  });

  const imageForm = useForm<z.infer<typeof formImageSchema>>({
    resolver: zodResolver(formImageSchema),
    defaultValues: {
      title: ''
    }
  });

  async function uploadImage(photo: File) {
    const media = await onUploadMedia(photo);

    imageForm.setValue('image', media);
  }

  function initializeAItem({ title, image }: { title: string; image?: Media }) {
    onCreateAItem({
      title,
      type,
      image: image?.id
    });
    if (containImage) {
      imageForm.reset();
    } else {
      form.reset();
    }
    setOpenDialog(false);
  }

  useEffect(() => {
    if (type === 'banner' || type === 'col' || type === 'showcase') {
      setContainImage(true);
    } else {
      setContainImage(false);
    }
  }, [type]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-fit rounded-full dark:bg-dark-surfaceContainer dark:hover:bg-dark-surfaceContainerHighest bg-light-surfaceContainer hover:bg-light-surfaceContainerHighest border dark:border-dark-outline border-light-outline transition-all ease-in-out"
            variant={'ghost'}
          >
            <PlusIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="my-4 p-4 gap-3 bg-background/60 backdrop-blur-md rounded-2xl">
          <DropdownMenuLabel>
            Escolha o tipo de item que você deseja adicionar a sua página
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex items-center">
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setType('banner');
                setOpenDialog(true);
              }}
            >
              <div className="flex flex-col gap-4">
                <BannerSkeleton className="w-32" />
                <span>Banner</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setType('col');
                setOpenDialog(true);
              }}
            >
              <div className="flex flex-col gap-4">
                <CardSkeleton className="w-32" />
                <span>Card</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setType('row');
                setOpenDialog(true);
              }}
            >
              <div className="flex flex-col gap-4">
                <HorizontalCardSkeleton className="w-32" />
                <span>Card na horizontal</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setType('showcase');
                setOpenDialog(true);
              }}
            >
              <div className="flex flex-col gap-4">
                <ShowcaseSkeleton className="w-32" />
                <span>Vitrine</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setType('button');
                setOpenDialog(true);
              }}
            >
              <div className="flex flex-col gap-4">
                <ButtonSkeleton className="w-32" />
                <span>Botão</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Vamos definir um Título para seu novo item
            </DialogTitle>
            <DialogDescription>Escolha um título chamativo.</DialogDescription>
          </DialogHeader>
          {containImage ? (
            <Form {...imageForm}>
              <form className="w-full grid grid-cols-6 gap-6 py-6">
                <FormField
                  control={imageForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormControl>
                        <Input
                          placeholder="Insira um título"
                          {...field}
                          className="text-center bg-transparent"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={imageForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Imagem</FormLabel>
                      <FormControl>
                        <ImageInput
                          {...field}
                          image={field.value}
                          value={field.value?.src || ''}
                          onChange={(e) => {
                            uploadImage(e.target.files?.[0]!);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form className="w-full grid grid-cols-6 gap-6 py-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormControl>
                        <Input
                          placeholder="Insira um título"
                          {...field}
                          className="text-center bg-transparent"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          <DialogFooter className="flex items-center gap-4">
            <Button
              type="button"
              variant={'ghost'}
              onClick={() => {
                imageForm.reset();
                form.reset();
                setOpenDialog(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={
                containImage
                  ? imageForm.handleSubmit(initializeAItem)
                  : form.handleSubmit(initializeAItem)
              }
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
