import { BackendMedia } from '../../shared/entities/backend-media-entities';

export interface BackendAuthenticateResponse {
  accessToken: string;
  expiresIn: number;
}

export interface BackendUser {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  phoneNumber: string;
  photoProfile?: BackendMedia | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface BackendSignUpResponse {
  userData: BackendUser;
  accessToken: string;
  expiresIn: number;
}
