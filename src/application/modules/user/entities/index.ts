import { Media } from '@/application/entities';

export type User = {
  id: string;
} & UserScheme;

export type UserScheme = {
  name: string;
  lastName?: string;
  authId: string;
  email: string;
  phoneNumber: string;
  photoProfile?: Media;
};
