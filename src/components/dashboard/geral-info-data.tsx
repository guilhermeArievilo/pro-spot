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
import { Media, mediaObjectSchema, Page } from '@/application/entities';
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
import { createSlug } from '@/lib/utils';
import { PageSchema } from '@/application/modules/pages/entities';
import GetPageUsecase from '@/application/modules/pages/usecases/get-page-usecase';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import PlayIcon from '@/assets/svg/icons/play.svg';
import PauseIcon from '@/assets/svg/icons/pause.svg';
import TrashIcon from '@/assets/svg/icons/trash.svg';
import DeletePageDialog from '@/application/modules/pages/presentation/screens/delete-page-screen/delete-page-dialog';
interface GeralInfoDataProps {
  page: Page;
  onUpdatePage?: (page: Page) => void;
  onSubmitGeralInfo?: (formData: PageSchema) => void;
  onUploadMedia: (media: File) => Promise<Media>;
  togglePublish?: (page: Page) => void;
  onDelete?: (pageId: string) => Promise<void>;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .refine(
      async (nome) => {
        const pagesRepository = new StrapiPagesApiRepository(
          GraphQlClient,
          axiosInstance
        );
        const getPageBySlugCase = new GetPageUsecase(pagesRepository);

        const page = await getPageBySlugCase.execute(createSlug(nome));

        return !page;
      },
      {
        message: 'Já existe uma página com esse nome'
      }
    ),
  content: z.string(),
  instagram: z.string().optional(),
  x: z.string().optional(),
  whatsapp: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  locationLink: z.string().optional(),
  photoProfile: mediaObjectSchema,
  backgroundMedia: mediaObjectSchema
});

type GeralInfoFormData = z.infer<typeof formSchema>;

export default function GeralInfoData({
  page,
  onUpdatePage,
  onSubmitGeralInfo,
  onUploadMedia,
  togglePublish,
  onDelete
}: GeralInfoDataProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageBackup, setPageBackup] = useState<Page>(page);
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
      locationLink: page.locationLink,
      photoProfile: page.photoProfile,
      backgroundMedia: page.backgroundMedia
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
  const profilePhotoWatcher = form.watch('photoProfile');
  const backgroundMediaWatcher = form.watch('backgroundMedia');

  async function uploadProfilePhoto(photo: File) {
    const media = await onUploadMedia(photo);

    form.setValue('photoProfile', media);
  }

  async function uploadBackgroundMedia(image: File) {
    const media = await onUploadMedia(image);

    form.setValue('backgroundMedia', media);
  }

  const onSubmit = (data: GeralInfoFormData) => {
    const {
      name,
      content,
      instagram,
      x,
      whatsapp,
      linkedin,
      facebook,
      locationLink,
      photoProfile,
      backgroundMedia
    } = data;

    if (onSubmitGeralInfo) {
      const formData = {
        slug: name !== pageBackup?.name ? createSlug(name) : undefined,
        name: name !== pageBackup?.name ? name : undefined,
        content: content !== pageBackup?.content ? content : undefined,
        instagram: instagram !== pageBackup?.instagram ? instagram : undefined,
        x: x !== pageBackup?.x ? x : undefined,
        whatsapp: whatsapp !== pageBackup?.whatsapp ? whatsapp : undefined,
        linkedin: linkedin !== pageBackup?.linkedin ? linkedin : undefined,
        facebook: facebook !== pageBackup?.facebook ? facebook : undefined,
        locationLink:
          locationLink !== pageBackup?.locationLink ? locationLink : undefined,
        photoProfile:
          photoProfile.id === pageBackup?.photoProfile.id
            ? undefined
            : photoProfile.id,
        backgroundMedia:
          backgroundMedia.id === pageBackup?.backgroundMedia.id
            ? undefined
            : backgroundMedia.id
      };

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
        photoProfile: profilePhotoWatcher,
        backgroundMedia: backgroundMediaWatcher
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
    profilePhotoWatcher,
    backgroundMediaWatcher
  ]);

  return (
    <div className="flex flex-col gap-12">
      <Form {...form}>
        <form>
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
              <span className="text-2xl">Informações Gerais</span>
              <div className="flex gap-2">
                {togglePublish && (
                  <Button
                    variant={'ghost'}
                    type="button"
                    className="p-2"
                    onClick={() => togglePublish(page)}
                  >
                    {page.publishedAt ? <PauseIcon /> : <PlayIcon />}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant={'ghost'}
                    type="button"
                    className="p-2"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <TrashIcon />
                  </Button>
                )}
              </div>
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
                control={form.control}
                name="photoProfile"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Foto de perfil</FormLabel>
                    <FormControl>
                      <ImageInput
                        {...field}
                        image={field.value}
                        value={field.value.src}
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
                        value={field.value.src}
                        onChange={(e) => {
                          uploadBackgroundMedia(e.target.files?.[0]!);
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
                      <SocialInput {...field} placeholder="insira o link aqui">
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
                      <SocialInput {...field} placeholder="insira o link aqui">
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
                      <SocialInput {...field} placeholder="insira o link aqui">
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
                      <SocialInput {...field} placeholder="insira o link aqui">
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
                      <SocialInput {...field} placeholder="insira o link aqui">
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
                      <SocialInput
                        {...field}
                        placeholder="insira o link do google maps aqui"
                      >
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
      <DeletePageDialog
        open={isDeleteDialogOpen}
        onChangeOpen={setIsDeleteDialogOpen}
        page={page}
        onSubmitConfirm={onDelete!}
      />
    </div>
  );
}
