'use client';

import { Section } from '@/application/entities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import { Button } from '../ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import {
  RadioGroup,
  RadioGroupBlockItem,
  RadioGroupItem
} from '../ui/radio-group';
import PlusIcon from '@/assets/svg/icons/plus.svg';
import ItemBlock from './item-block';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

import AlignStartIcon from '@/assets/svg/icons/align-left.svg';
import AlignCenterIcon from '@/assets/svg/icons/align-center.svg';

const formSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  alignContent: z.enum(['start', 'center'])
});

interface SectionBlockProps {
  section: Section;
  open?: boolean;
  togglePublish?: (sectionId: string) => void;
  onDelete?: (sectionId: string) => void;
  onSave?: (page: Section) => void;
}

export default function SectionBlock({
  section: { id, title, subtitle, alignContent, items },
  onSave,
  open
}: SectionBlockProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      subtitle,
      alignContent
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (onSave) {
      onSave(values as Section);
    }
  }

  return (
    <div className="full">
      <Accordion type="single" collapsible>
        <AccordionItem
          value={id}
          className="p-4 dark:bg-dark-surfaceContainerLowest bg-light-surbg-dark-surfaceContainerLowest border-0 rounded-2xl w-full"
        >
          <AccordionTrigger className="py-0 pb-4 text-base text-start">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-0 flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-4 gap-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira um título" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira um subtítulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alignContent"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>Alinhamento do título e subtítulo</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="w-fit flex dark:bg-dark-surface bg-light-surface p-1 rounded-lg"
                        >
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <FormControl className="w-full flex items-center">
                              <RadioGroupBlockItem
                                value="start"
                                className="flex items-center gap-3 rounded-md px-4"
                              >
                                <AlignStartIcon />
                                <span>Esquerda</span>
                              </RadioGroupBlockItem>
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <FormControl className="w-full flex items-center">
                              <RadioGroupBlockItem
                                value="center"
                                className="flex items-center gap-3 rounded-md px-4"
                              >
                                <AlignCenterIcon />
                                <span>Centro</span>
                              </RadioGroupBlockItem>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="col-span-4 flex flex-col items-center gap-4">
              <div className="self-start flex flex-col gap-1">
                <span className="text-sm font-semibold">Itens da secção</span>
                <span className="text-xs">
                  Os itens que forem de tipos diferentes serão separados
                </span>
              </div>
              {items?.map((item) => <ItemBlock item={item} key={item.id} />)}
              <div className="h-6 w-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
              <Button
                className="rounded-full dark:bg-dark-surfaceContainer dark:hover:bg-dark-surfaceContainerHighest bg-light-surfaceContainer hover:bg-light-surfaceContainerHighest border dark:border-dark-outline border-light-outline transition-all ease-in-out"
                variant={'ghost'}
              >
                <PlusIcon />
              </Button>
            </div>
            <div className="col-span-4 w-full flex items-center gap-4">
              <Button variant={'outline'} className="flex-1" type="button">
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={form.handleSubmit(onSubmit)}
              >
                Salvar
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
