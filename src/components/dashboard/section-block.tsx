'use client';

import { Item, Media, Section } from '@/application/entities';
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
import { RadioGroup, RadioGroupBlockItem } from '../ui/radio-group';
import ItemBlock from './item-block';

import AlignStartIcon from '@/assets/svg/icons/align-left.svg';
import AlignCenterIcon from '@/assets/svg/icons/align-center.svg';
import { useEffect, useState } from 'react';
import {
  ItemSchema,
  SectionSchema
} from '@/application/modules/pages/entities';
import CreateItemRotine from './choose-type-item';

const formSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  alignContent: z.enum(['start', 'center'])
});

interface SectionBlockProps {
  section: Section;
  open?: boolean;
  togglePublish?: (sectionId: string) => void;
  togglePublishItem?: (item: Item) => void;
  onDelete?: (sectionId: string) => void;
  onSave?: (page: SectionSchema) => void;
  onUpdated?: (section: Section) => void;
  onItemSave?: (item: ItemSchema, id: string) => void;
  onCreateItem?: (item: ItemSchema) => void;
  onDeleteItem?: (id: string, title: string) => void;
  onUploadMedia: (media: File) => Promise<Media>;
}

export default function SectionBlock({
  section,
  onSave,
  open,
  onUpdated,
  onItemSave,
  onCreateItem,
  onDeleteItem,
  onUploadMedia,
  togglePublishItem
}: SectionBlockProps) {
  const { id, title, subtitle, alignContent, items } = section;
  const [liveItems, setLiveItems] = useState<Item[]>(items ? items : []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      subtitle,
      alignContent
    }
  });

  const titleWatcher = form.watch('title');
  const subtitleWatcher = form.watch('subtitle');
  const alignContentWatcher = form.watch('alignContent');

  function onSubmit({
    title,
    subtitle,
    alignContent
  }: z.infer<typeof formSchema>) {
    if (onSave) {
      const schema: SectionSchema = {
        title,
        subtitle,
        alignContent
      };

      if (items) {
        const itemsId = items.map((item) => item.id);
        Object.assign(schema, {
          items: itemsId
        });
      }

      onSave(schema);
    }
  }

  function liveUpdateItems(item: Item, index: number) {
    if (liveItems) {
      setLiveItems((prevArray) =>
        prevArray.map((currentItem, i) => (i === index ? item : currentItem))
      );
    }
  }

  function addItem(item: ItemSchema) {
    if (onCreateItem) {
      onCreateItem(item);
    }
  }

  useEffect(() => {
    if (onUpdated) {
      onUpdated({
        ...section,
        title: titleWatcher,
        subtitle: subtitleWatcher,
        alignContent: alignContentWatcher,
        items: liveItems
      });
    }
  }, [titleWatcher, subtitleWatcher, alignContentWatcher, liveItems]);

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
              {items?.map((item, index) => (
                <ItemBlock
                  item={item}
                  key={item.id}
                  onUpdateItem={(item) => liveUpdateItems(item, index)}
                  onSave={(currentItem) => {
                    if (onItemSave) {
                      onItemSave(currentItem, item.id);
                    }
                  }}
                  onDelete={(id) => {
                    if (onDeleteItem) {
                      onDeleteItem(id, item.title);
                    }
                  }}
                  onUploadMedia={onUploadMedia}
                  togglePublish={togglePublishItem}
                />
              ))}
              <div className="h-6 w-[1px] dark:bg-dark-outlineVariant bg-light-outlineVariant" />
              <CreateItemRotine
                onCreateAItem={addItem}
                onUploadMedia={onUploadMedia}
              />
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
