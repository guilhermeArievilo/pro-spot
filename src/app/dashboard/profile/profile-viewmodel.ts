import { Media, mediaObjectSchema } from '@/application/entities';
import useMediaModel from '@/application/modules/pages/presentation/models/media-model';
import useUserModel from '@/application/modules/pages/presentation/models/user-model';
import axiosInstance from '@/infra/http/axiosService';
import { GraphQlClient } from '@/infra/http/onClientApolloService';
import StrapiPagesApiRepository from '@/infra/http/strapi/pages/repository/strapi-pages-api-repository';
import StrapiUserRepository from '@/infra/http/strapi/users/repository/strapi-user-repository';
import useUserStore from '@/store/uset';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ProfileFormData } from './edit-profile-model';
import { toast } from 'sonner';
import { useAuth, useUser } from '@clerk/nextjs';
import Router from 'next/router';

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
  const { user: clerkUser } = useUser();
  const { signOut } = useAuth();

  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<ProfileTabs>('profile');

  const userRepository = new StrapiUserRepository(GraphQlClient, axiosInstance);
  const { updateUser, deleteUser } = useUserModel({
    userRepository
  });

  const pageRepository = new StrapiPagesApiRepository(
    GraphQlClient,
    axiosInstance
  );

  const { uploadMedia } = useMediaModel({ pageRepository });

  const { user, setUser } = useUserStore();

  async function uploadProfilePhoto(
    photo: File,
    onSuccessUpload: (photo: Media) => void
  ) {
    const uploadedPhoto = await uploadMedia(photo);
    onSuccessUpload(uploadedPhoto);
  }

  async function handlerEditProfileSubmit({
    name,
    lastName,
    email,
    phoneNumber,
    photoProfile
  }: ProfileFormData) {
    if (user) {
      await updateUser({
        id: user.id,
        userData: {
          name,
          lastName,
          email,
          phoneNumber,
          photoProfile: photoProfile?.id
        }
      })
        .then((user) => {
          setUser(user);
          toast('Atualizamos seu perfil !');
        })
        .catch((e) => {
          console.error(e);
          toast('Algo deu errado ao atualizar seu perfil, tente mais tarde.');
        });
    }
  }

  async function handlerDeleteProfile(id: string) {
    await deleteUser(id).then(async () => {
      await signOut();
      await clerkUser?.delete();
    });
  }

  return {
    user,
    pageRepository,
    uploadMedia,
    uploadProfilePhoto,
    profileOptionsTabs,
    currentTab,
    setCurrentTab,
    handlerEditProfileSubmit,
    deleteUserDialogOpen,
    setDeleteUserDialogOpen,
    handlerDeleteProfile
  };
}
