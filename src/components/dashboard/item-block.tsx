import { Item } from '@/application/entities';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import { z } from 'zod';
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
import {
  RadioGroup,
  RadioGroupBlockItem,
  RadioGroupItem
} from '../ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

import BannerSkeleton from '@/assets/svg/elements/types/banner.svg';
import CardSkeleton from '@/assets/svg/elements/types/card.svg';
import HorizontalCardSkeleton from '@/assets/svg/elements/types/h-card.svg';
import ShowcaseSkeleton from '@/assets/svg/elements/types/showcase.svg';
import ButtonSkeleton from '@/assets/svg/elements/types/button.svg';

const formSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  type: z.enum(['row', 'col', 'banner', 'showcase', 'button']),
  link: z.string().optional()
});

interface ItemBlockProps {
  item: Item;
  open?: boolean;
  togglePublish?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onSave?: (page: Item) => void;
}

export default function ItemBlock({
  item: { id, title, subtitle, type, link, image },
  open,
  togglePublish,
  onDelete,
  onSave
}: ItemBlockProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      subtitle,
      type,
      link
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (onSave) {
      onSave(values as Item);
    }
  }

  return (
    <div className="w-full">
      <Accordion type="single" collapsible>
        <AccordionItem
          value={id}
          className="p-4 dark:bg-dark-surfaceContainerLow/50 bg-light-surfaceContainerLow/40 border-0 rounded-2xl w-full"
        >
          <AccordionTrigger className="py-0 pb-4 text-base text-start">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-0 flex flex-col gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-6 gap-8"
              >
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
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Tipo do card</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center gap-2 bg-dark-surface p-2 rounded-4xl"
                        >
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <FormControl className="w-full flex items-center">
                              <RadioGroupBlockItem value="banner">
                                <div className="flex flex-col gap-4">
                                  <BannerSkeleton className="w-full" />
                                  <span>Banner</span>
                                </div>
                              </RadioGroupBlockItem>
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <FormControl className="w-full flex items-center">
                              <RadioGroupBlockItem value="col">
                                <div className="flex flex-col gap-4">
                                  <CardSkeleton className="w-full" />
                                  <span>Card</span>
                                </div>
                              </RadioGroupBlockItem>
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <FormControl className="w-full flex items-center">
                              <RadioGroupBlockItem value="row">
                                <div className="flex flex-col gap-4">
                                  <HorizontalCardSkeleton className="w-full" />
                                  <span>Card na horizontal</span>
                                </div>
                              </RadioGroupBlockItem>
                            </FormControl>
                          </FormItem>
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <RadioGroupBlockItem value="showcase">
                              <div className="flex flex-col gap-4">
                                <ShowcaseSkeleton className="w-full" />
                                <span>Vitrine</span>
                              </div>
                            </RadioGroupBlockItem>
                          </FormItem>
                          <FormItem className="flex-1 flex items-center space-x-3">
                            <RadioGroupBlockItem value="button">
                              <div className="flex flex-col gap-4">
                                <ButtonSkeleton className="w-full" />
                                <span>Botão</span>
                              </div>
                            </RadioGroupBlockItem>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-6">
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
            <div className="col-span-4 w-full flex items-center gap-4">
              <Button variant={'outline'} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
