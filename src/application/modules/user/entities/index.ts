import { Media } from '@/application/entities';

export type User = {
  id: string;
  name: string;
  lastName?: string;
  authId: string;
  email: string;
  phoneNumber: string;
  photoProfile?: Media;
};

export type UserScheme = {
  name?: string;
  lastName?: string;
  authId?: string;
  email?: string;
  phoneNumber?: string;
  photoProfile?: string | number;
};

export type AuthenticateData = {
  accessToken: string;
  expiresIn: number;
};
