'use client';

import { mediaObjectSchema } from '@/application/entities';
import useMediaModel from '@/application/modules/pages/presentation/models/media-model';
import Loading from '@/components/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import useUserStore from '@/store/uset';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string({
      message: 'Nome obrigatório'
    })
    .min(1, {
      message: 'Nome obrigatório'
    }),
  lastName: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  photoProfile: mediaObjectSchema.optional()
});

type ProfileFormData = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const pageRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );
  const { user } = useUserStore();

  if (!user) return <Loading />;

  const { uploadMedia } = useMediaModel({ pageRepository });
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoProfile: user.photoProfile
    }
  });

  async function uploadProfilePhoto(photo: File) {
    const uploadedPhoto = await uploadMedia(photo);

    form.setValue('photoProfile', uploadedPhoto);
  }

  return (
    <main className="container grid grid-cols-12 gap-6 py-36">
      <div className="col-span-4 p-6 flex flex-col gap-6 border-r border-r-dark-outlineVariant">
        <Button variant={'ghost'} className="w-full">
          Seu perfil
        </Button>
        <Button variant={'ghost'} className="w-full">
          Seu plano
        </Button>
        <Button variant={'ghost'} className="w-full">
          Suporte para conta
        </Button>
        <Button variant={'destructive'} className="w-full">
          Excluir conta
        </Button>
      </div>
      <Form {...form}>
        <form
          className="col-span-8 flex flex-col gap-6"
          onSubmit={form.handleSubmit((values) => console.log(values))}
        >
          <div className="flex items-center justify-start gap-6">
            <div className="relative">
              <Avatar className="w-40 h-40">
                <AvatarImage src={user.photoProfile?.src} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="photoProfile"
                render={({ field }) => (
                  <FormItem className="absolute top-0 -right-4">
                    <FormControl>
                      <ImageInput
                        {...field}
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
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl">
                {user.lastName ? `${user.name} ${user.lastName}` : user.name}
              </span>
              <span className="text-sm text-dark-outline">Plano FREE</span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="E-mail" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Número de celular</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-12 flex justify-center">
              <Button type="submit" className="w-60">
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
