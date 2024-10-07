import { User } from '@/application/modules/user/entities';
import { StrapiMedia } from '../../shared/entities';
import { toMediadomain } from '../../shared/mappers/indext';

interface StrapiUser {
  documentId: string;
  name: string;
  lastName: string;
  email: string;
  authId: string;
  phoneNumber: string;
  photoProfile: StrapiMedia | null;
}

export function toUserDomain({
  documentId,
  authId,
  email,
  name,
  lastName,
  phoneNumber,
  photoProfile
}: StrapiUser): User {
  return {
    id: documentId,
    authId,
    name,
    lastName,
    email,
    phoneNumber,
    photoProfile: photoProfile ? toMediadomain(photoProfile) : undefined
  };
}
