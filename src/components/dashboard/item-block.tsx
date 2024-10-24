import { CardType, Item } from '@/application/entities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import { object, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import CardItem from '../ui/card-item';
import { Separator } from '../ui/separator';
import { ImageInput } from '../ui/image-input';
import CarouselSelect from '../ui/carousel-select';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { cn, getImageURLByFile } from '@/lib/utils';
import { ItemSchema } from '@/application/modules/pages/entities';
import TrashIcon from '@/assets/svg/icons/trash.svg';
import PlayIcon from '@/assets/svg/icons/play.svg';

const formSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  link: z.string().optional()
});

const typeOptions = [
  { label: 'Card', value: 'col' },
  { label: 'Card na horizontal', value: 'row' },
  { label: 'Vitrine', value: 'showcase' },
  { label: 'Banner', value: 'banner' },
  { label: 'Botão', value: 'button' }
];

interface ItemBlockProps {
  item: Item;
  open?: boolean;
  togglePublish?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onSave?: (page: ItemSchema) => void;
  onUpdateItem?: (item: Item) => void;
}

export default function ItemBlock({
  item,
  open,
  togglePublish,
  onDelete,
  onSave,
  onUpdateItem
}: ItemBlockProps) {
  const { id, title, subtitle, type, link, image } = item;
  const [typeItem, setTypeItem] = useState<CardType>(type);
  const [itemBackup, setItemBackup] = useState<Item>();
  const [itemPreview, setItemPreview] = useState<Item>(item);
  const [imageItem, setImageItem] = useState<File>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      subtitle,
      link
    }
  });

  const titleWatcher = form.watch('title');
  const subtitleWatcher = form.watch('subtitle');
  const linkWatcher = form.watch('link');

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, subtitle, link } = values;

    if (onSave) {
      const formData = {
        title,
        subtitle,
        link,
        type: typeItem
      };

      if (imageItem instanceof File) {
        Object.assign(formData, {
          image: imageItem
        });
      }

      onSave(formData);
    }
  }

  function setFileImagem(file?: File) {
    if (file) {
      setImageItem(file);
    }
  }

  function onDeleteImage() {
    setItemPreview({
      ...itemPreview,
      image: undefined
    });
  }

  useEffect(() => {
    let image = item.image;
    if (imageItem) {
      if (item.image) {
        image = {
          ...item.image,
          src: getImageURLByFile(imageItem)
        };
      } else {
        image = {
          id: '1',
          height: 236,
          width: 166,
          src: getImageURLByFile(imageItem)
        };
      }
    }

    setItemPreview({
      ...item,
      title: titleWatcher,
      subtitle: subtitleWatcher,
      link: linkWatcher,
      image,
      type: typeItem
    });

    if (onUpdateItem) {
      onUpdateItem({
        ...item,
        title: titleWatcher,
        subtitle: subtitleWatcher,
        link: linkWatcher,
        image,
        type: typeItem
      });
    }
  }, [titleWatcher, subtitleWatcher, linkWatcher, imageItem, typeItem]);

  useEffect(() => {
    if (!itemBackup) {
      setItemBackup(_.cloneDeep(item));
    }
  }, []);
  return (
    <div className="w-full">
      <Accordion type="single" collapsible>
        <AccordionItem
          value={id}
          className="relative p-4 dark:bg-dark-surfaceContainerLow/50 bg-light-surfaceContainerLow/40 border-0 rounded-2xl w-full"
        >
          <div className="flex absolute top-2 right-12 gap-2">
            <Button variant={'ghost'} type="button" className="p-2">
              <PlayIcon />
            </Button>
            <Button
              variant={'ghost'}
              type="button"
              className="p-2"
              onClick={() => {
                if (onDelete) {
                  onDelete(id);
                }
              }}
            >
              <TrashIcon />
            </Button>
          </div>
          <AccordionTrigger className="py-0 pb-4 text-base text-start flex justify-between">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-0 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="min-w-60 w-2/5 max-w-80 h-96 flex flex-col items-center justify-between gap-3 z-10">
                <div className="flex-1 w-full flex items-center justify-center">
                  <div
                    className={cn('', {
                      'min-w-60 w-2/5 max-w-64': typeItem === 'col',
                      'min-w-60 w-full max-w-80': typeItem === 'banner',
                      'w-full': typeItem === 'button',
                      'min-w-60 w-full max-w-72': typeItem === 'row',
                      'min-w-48 w-2/5 max-w-56': typeItem === 'showcase'
                    })}
                  >
                    <CardItem
                      type={itemPreview.type}
                      title={itemPreview.title}
                      link={itemPreview.link}
                      image={itemPreview.image}
                      subtitle={itemPreview.subtitle}
                      preview
                    />
                  </div>
                </div>
                <div className="w-full">
                  <CarouselSelect
                    options={typeOptions}
                    value={typeItem}
                    onChange={(type) => {
                      setTypeItem(type as CardType);
                    }}
                  />
                </div>
              </div>
              <Separator orientation="vertical" />
              <Form {...form}>
                <form className="flex-1 grid grid-cols-6 gap-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
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
                      <FormItem className="col-span-3">
                        <FormLabel>Subtítulo</FormLabel>
                        <FormControl>
                          <Input placeholder="Insira um subtítulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagem</FormLabel>
                          <FormControl>
                            <ImageInput
                              {...field}
                              image={itemPreview.image}
                              enableDelete
                              onDelete={onDeleteImage}
                              onChange={(e) => {
                                setFileImagem(e.target.files?.[0]);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input placeholder="Insira um link" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
            <div className="col-span-4 w-full flex items-center gap-4">
              <Button variant={'outline'} type="button" className="flex-1">
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
