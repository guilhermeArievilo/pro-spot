'use client';

import BannerSkeleton from '@/assets/svg/elements/types/banner.svg';
import CardSkeleton from '@/assets/svg/elements/types/card.svg';
import { Button } from '../ui/button';
import PlusIcon from '@/assets/svg/icons/plus.svg';
import AlignCenterIcon from '@/assets/svg/icons/align-center.svg';
import AlignStartIcon from '@/assets/svg/icons/align-left.svg';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useState } from 'react';
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
import { AlignContent } from '@/application/entities';
import { SectionSchema } from '@/application/modules/pages/entities';
const formSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório' })
});

interface CreateSectionEntryProps {
  onCreateASection: (data: SectionSchema) => void;
}

export default function CreateSectionEntry({
  onCreateASection
}: CreateSectionEntryProps) {
  const [alignContent, setAlignContent] = useState<AlignContent>('center');
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  });

  function initializeAItem({ title }: z.infer<typeof formSchema>) {
    onCreateASection({
      title,
      alignContent
    });
    form.reset();
    setOpenDialog(false);
  }

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
            Escolha como você quer alinhar o conteúdo textual da sua secção
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex justify-center items-center gap-12">
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setAlignContent('center');
                setOpenDialog(true);
              }}
            >
              <div className="flex justify-center items-center gap-4">
                <AlignCenterIcon className="" />
                <span>Centro</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-3"
              onClick={() => {
                setAlignContent('start');
                setOpenDialog(true);
              }}
            >
              <div className="flex justify-center items-center gap-4">
                <AlignStartIcon />
                <span>Esquerda</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Vamos definir um Título para sua nova secção
            </DialogTitle>
            <DialogDescription>Escolha um título chamativo.</DialogDescription>
          </DialogHeader>
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
          <DialogFooter className="flex items-center gap-4">
            <Button
              type="button"
              variant={'ghost'}
              onClick={() => setOpenDialog(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={form.handleSubmit(initializeAItem)}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
