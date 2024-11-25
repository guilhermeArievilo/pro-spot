import { User, UserScheme } from '@/application/modules/user/entities';
import { BackendUser } from '../entities/backend-user-entities';
import {
  toMediaDomain,
  toMediaRemote
} from '../../shared/mapper/backend-media-mapper';

export function toUserDomain(
  { id, email, name, lastName, phoneNumber, photoProfile }: BackendUser,
  authId: string
): User {
  return {
    id,
    authId,
    name,
    lastName: lastName ? lastName : undefined,
    email,
    phoneNumber,
    photoProfile: photoProfile ? toMediaDomain(photoProfile) : undefined
  };
}

export function toUserRemote({
  id,
  name,
  lastName,
  email,
  phoneNumber,
  photoProfile
}: User): BackendUser {
  return {
    id,
    name,
    lastName: lastName ? lastName : null,
    email,
    phoneNumber,
    photoProfile: photoProfile ? toMediaRemote(photoProfile) : null
  };
}
