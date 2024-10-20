'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ImageInput } from '../ui/image-input';
import { Page } from '@/application/entities';
import { Button } from '../ui/button';
import { SocialInput } from '../ui/social-input';
import InstagramIcon from '@/assets/svg/icons/instagram.svg';
import XIcon from '@/assets/svg/icons/x.svg';
import WhatsappIcon from '@/assets/svg/icons/whatsapp.svg';
import FacebookIcon from '@/assets/svg/icons/facebook.svg';
import LinkedInIcon from '@/assets/svg/icons/linkedin.svg';
import PinIcon from '@/assets/svg/icons/map-pin.svg';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { createSlug, getImageURLByFile } from '@/lib/utils';
import { PageSchema } from '@/application/modules/pages/entities';
import { toast } from 'sonner';

interface GeralInfoDataProps {
  page: Page;
  onUpdatePage?: (page: Page) => void;
  onSubmitGeralInfo?: (formData: PageSchema) => void;
}

// const fileSchema = z.union([z.string(), z.instanceof(File)]);

const formSchema = z.object({
  name: z.string(),
  content: z.string(),
  instagram: z.string().optional(),
  x: z.string().optional(),
  whatsapp: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  locationLink: z.string().optional()
  // profilePhoto: fileSchema,
  // backgroundMedia: fileSchema
});

type GeralInfoFormData = z.infer<typeof formSchema>;

export default function GeralInfoData({
  page,
  onUpdatePage,
  onSubmitGeralInfo
}: GeralInfoDataProps) {
  const [pageBackup, setPageBackup] = useState<Page>();
  const [profilePhoto, setProfilePhoto] = useState<File>();
  const [backgroundMedia, setBackgroundMedia] = useState<File>();
  const form = useForm<GeralInfoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: page.name,
      content: page.content,
      instagram: page.instagram,
      x: page.x,
      whatsapp: page.whatsapp,
      linkedin: page.linkedin,
      facebook: page.facebook,
      locationLink: page.locationLink
      // profilePhoto: page.photoProfile.src,
      // backgroundMedia: page.backgroundMedia.src
    }
  });

  const nameWatcher = form.watch('name');
  const contentWatcher = form.watch('content');
  const instagramWatcher = form.watch('instagram');
  const xWatcher = form.watch('x');
  const whatsappWatcher = form.watch('whatsapp');
  const linkedinWatcher = form.watch('linkedin');
  const facebookWatcher = form.watch('facebook');
  const locationLinkWatcher = form.watch('locationLink');

  const onSubmit = (data: GeralInfoFormData) => {
    const {
      name,
      content,
      instagram,
      x,
      whatsapp,
      linkedin,
      facebook,
      locationLink
    } = data;

    if (onSubmitGeralInfo) {
      const formData = {
        id: page.id,
        slug: createSlug(name),
        name,
        content,
        instagram,
        x,
        whatsapp,
        linkedin,
        facebook,
        locationLink
      };

      if (backgroundMedia instanceof File) {
        Object.assign(formData, {
          backgroundMedia
        });
      }

      if (profilePhoto instanceof File) {
        Object.assign(formData, {
          photoProfile: profilePhoto
        });
      }

      if (!backgroundMedia && !page.backgroundMedia) {
        toast('Você não selecionou uma mídia de fundo', {
          description: 'Adicione uma mídia de fundo para continuar'
        });
      }

      if (!profilePhoto && !page.photoProfile) {
        toast('Você não selecionou uma imagem de perfil', {
          description: 'Adicione uma imagem de perfil para continuar'
        });
      }

      onSubmitGeralInfo(formData);
    }
  };

  const onCancel = () => {
    form.setValue('name', pageBackup?.name || '');
    form.setValue('content', pageBackup?.content || '');
    form.setValue('instagram', pageBackup?.instagram || '');
    form.setValue('x', pageBackup?.x || '');
    form.setValue('whatsapp', pageBackup?.whatsapp || '');
    form.setValue('linkedin', pageBackup?.linkedin || '');
    form.setValue('facebook', pageBackup?.facebook || '');
    form.setValue('locationLink', pageBackup?.locationLink || '');
  };

  useEffect(() => {
    if (onUpdatePage) {
      onUpdatePage({
        ...page,
        name: nameWatcher,
        content: contentWatcher,
        instagram: instagramWatcher,
        x: xWatcher,
        whatsapp: whatsappWatcher,
        linkedin: linkedinWatcher,
        facebook: facebookWatcher,
        locationLink: locationLinkWatcher,
        photoProfile: {
          ...page.photoProfile,
          src: profilePhoto
            ? getImageURLByFile(profilePhoto)
            : page.photoProfile.src
        },
        backgroundMedia: {
          ...page.backgroundMedia,
          src: backgroundMedia
            ? getImageURLByFile(backgroundMedia)
            : page.backgroundMedia.src
        }
      });
    }
  }, [
    nameWatcher,
    contentWatcher,
    instagramWatcher,
    xWatcher,
    whatsappWatcher,
    linkedinWatcher,
    facebookWatcher,
    locationLinkWatcher,
    profilePhoto,
    backgroundMedia
  ]);

  useEffect(() => {
    if (!pageBackup) {
      setPageBackup(_.cloneDeep(page));
    }
  }, []);

  function setFileProfilePhoto(file?: File) {
    if (file) {
      setProfilePhoto(file);
    }
  }

  function setFileBackgroundMedia(file?: File) {
    if (file) {
      setBackgroundMedia(file);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <span className="text-2xl">Informações Gerais</span>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                  <FormItem className="col-span-4">
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
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Foto de perfil</FormLabel>
                    <FormControl>
                      <ImageInput
                        {...field}
                        image={page.photoProfile}
                        onChange={(e) => {
                          setFileProfilePhoto(e.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="backgroundMedia"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Imagem de fundo</FormLabel>
                    <FormControl>
                      <ImageInput
                        {...field}
                        image={page.backgroundMedia}
                        onChange={(e) => {
                          setFileBackgroundMedia(e.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <span className="text-2xl">Redes sociais e contato</span>
            </div>
            <div className="col-span-6 flex flex-wrap items-center gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SocialInput {...field}>
                        <div className="p-1">
                          <InstagramIcon className="w-8 h-8 stroke-foreground" />
                        </div>
                      </SocialInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SocialInput {...field}>
                        <div className="p-1">
                          <XIcon className="w-8 h-8 fill-foreground" />
                        </div>
                      </SocialInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SocialInput {...field}>
                        <div className="p-1">
                          <WhatsappIcon className="w-8 h-8 fill-foreground" />
                        </div>
                      </SocialInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SocialInput {...field}>
                        <div className="p-1">
                          <FacebookIcon className="w-8 h-8 stroke-foreground" />
                        </div>
                      </SocialInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SocialInput {...field}>
                        <div className="p-1">
                          <LinkedInIcon className="w-8 h-8 stroke-foreground" />
                        </div>
                      </SocialInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SocialInput {...field}>
                        <div className="p-1">
                          <PinIcon className="w-8 h-8 stroke-foreground" />
                        </div>
                      </SocialInput>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <div className="col-span-4 w-full flex items-center gap-4">
        <Button variant={'outline'} className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          onClick={form.handleSubmit(onSubmit)}
          disabled={_.isEqual(page, pageBackup)}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
