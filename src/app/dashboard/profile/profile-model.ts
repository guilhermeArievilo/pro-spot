import { Media, mediaObjectSchema } from '@/application/entities';
import useMediaModel from '@/application/modules/pages/presentation/models/media-model';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import useUserStore from '@/store/uset';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const profileOptionsTabs = [
  {
    label: 'Seu perfil',
    tab: 'profile'
  },
  {
    label: 'Seu plano',
    tab: 'plan'
  },
  {
    label: 'Suporte para sua conta',
    tab: 'account-support'
  }
];

export type ProfileTabs = 'profile' | 'plan' | 'account-support';

export default function useProfileModel() {
  const [currentTab, setCurrentTab] = useState<ProfileTabs>('profile');
  const pageRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

  const { uploadMedia } = useMediaModel({ pageRepository });

  const { user } = useUserStore();

  async function uploadProfilePhoto(
    photo: File,
    onSuccessUpload: (photo: Media) => void
  ) {
    const uploadedPhoto = await uploadMedia(photo);
    onSuccessUpload(uploadedPhoto);
  }

  return {
    user,
    pageRepository,
    uploadMedia,
    uploadProfilePhoto,
    profileOptionsTabs,
    currentTab,
    setCurrentTab
  };
}
