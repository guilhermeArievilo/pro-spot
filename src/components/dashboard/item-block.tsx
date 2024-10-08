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
import PlusIcon from '@/assets/svg/icons/plus.svg';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

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
                    <FormItem className="col-span-2">
                      <FormLabel>Tipo do card</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="banner" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Banner
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="col" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Coluna
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="row" />
                            </FormControl>
                            <FormLabel className="font-normal">Linha</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="showcase" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Vitrine
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="button" />
                            </FormControl>
                            <FormLabel className="font-normal">Botão</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
