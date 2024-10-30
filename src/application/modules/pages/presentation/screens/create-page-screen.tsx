import { Media, mediaObjectSchema, Page } from '@/application/entities';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ImageInput } from '@/components/ui/image-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageSchema } from '../../entities';

interface CreatePageScreenProps {
  open: boolean;
  changeOpen: (openSate: boolean) => void;
  onUploadMedia: (media: File) => Promise<Media>;
  onSubmit: (page: PageSchema) => void;
}

const formSchema = z.object({
  name: z.string(),
  content: z.string(),
  photoProfile: mediaObjectSchema,
  backgroundMedia: mediaObjectSchema
});

type GeralInfoFormData = z.infer<typeof formSchema>;

export default function CreatePageScreen({
  open,
  changeOpen,
  onUploadMedia,
  onSubmit
}: CreatePageScreenProps) {
  const form = useForm<GeralInfoFormData>({
    resolver: zodResolver(formSchema)
  });

  function onCancel() {
    changeOpen(false);
    form.reset();
  }

  async function uploadProfilePhoto(photo: File) {
    const media = await onUploadMedia(photo);

    form.setValue('photoProfile', media);
  }

  async function uploadBackgroundMedia(image: File) {
    const media = await onUploadMedia(image);

    form.setValue('backgroundMedia', media);
  }

  async function handleSubmit(data: GeralInfoFormData) {
    onSubmit({
      ...data,
      photoProfile: data.photoProfile.id,
      backgroundMedia: data.backgroundMedia.id
    });
    form.reset();
    changeOpen(false);
  }

  return (
    <Drawer open={open}>
      <DrawerContent>
        <div className="container">
          <DrawerHeader>
            <DrawerTitle>Vamos criar uma Página</DrawerTitle>
            <DrawerDescription>Preencha os campos a seguir</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form className="grid grid-cols-12 gap-4 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Nome da página</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alguma coisa descritiva sobre a página"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photoProfile"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Foto de perfil</FormLabel>
                    <FormControl>
                      <ImageInput
                        {...field}
                        image={field.value}
                        value={field.value?.src}
                        onChange={(e) => {
                          uploadProfilePhoto(e.target.files?.[0]!);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backgroundMedia"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Imagem de fundo</FormLabel>
                    <FormControl>
                      <ImageInput
                        {...field}
                        image={field.value}
                        value={field.value?.src}
                        onChange={(e) => {
                          uploadBackgroundMedia(e.target.files?.[0]!);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DrawerFooter>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                Criar
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
