import {
  AuthenticateData,
  User,
  UserScheme
} from '@/application/modules/user/entities';
import UserRepository from '@/application/modules/user/repository/user-repository';
import { AxiosInstance } from 'axios';
import {
  BackendAuthenticateResponse,
  BackendSignUpResponse,
  BackendUser
} from '../entities/backend-user-entities';
import { toUserDomain, toUserRemote } from '../mapper/backend-user-mapper';

export default class BackendUserRepository implements UserRepository {
  private token: string | null = null;
  constructor(private AxiosClientService: AxiosInstance) {}

  async authenticate(userServiceAuthId: string): Promise<AuthenticateData> {
    const authRes =
      await this.AxiosClientService.post<BackendAuthenticateResponse>(
        '/sign-in',
        {
          authId: userServiceAuthId
        }
      );

    return {
      accessToken: authRes.data.accessToken,
      expiresIn: authRes.data.expiresIn
    };
  }

  async getUser(): Promise<User> {
    const remoteUser = await this.AxiosClientService.get<BackendUser>(
      '/api/user',
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    return toUserDomain(remoteUser.data, '');
  }

  async getUserByAuthServiceId(
    userServiceAuthId: string
  ): Promise<User | null> {
    if (!this.token) return null;
    const remoteUser = await this.AxiosClientService.get<BackendUser>(
      '/api/user',
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }
    );

    return toUserDomain(remoteUser.data, userServiceAuthId);
  }

  async createUser(
    { name, lastName, email, phoneNumber, authId }: UserScheme,
    injectJwtProperties?: (token: string, expiresIn: number) => void
  ): Promise<User> {
    const remoteUser =
      await this.AxiosClientService.post<BackendSignUpResponse>('/sign-up', {
        name,
        lastName,
        email,
        phoneNumber,
        authId
      }).catch((e: any) => {
        throw new Error('User not created');
      });

    this.token = remoteUser.data.accessToken;
    if (injectJwtProperties) {
      injectJwtProperties(
        remoteUser.data.accessToken,
        remoteUser.data.expiresIn
      );
    }
    return toUserDomain(remoteUser.data.userData, authId!);
  }

  async updateUser({
    id,
    userData
  }: {
    id: string;
    userData: UserScheme;
  }): Promise<User> {
    const { name, lastName, email, phoneNumber, photoProfile } = userData;

    try {
      const remoteUser = await this.AxiosClientService.put<BackendUser>(
        `/api/user`,
        {
          name,
          lastName,
          email,
          phoneNumber,
          photoProfile
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );

      return toUserDomain(remoteUser.data, userData.authId!);
    } catch (e: any) {
      console.error(e);
      throw new Error('Could not update user.');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.AxiosClientService.delete(`/api/user`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
    } catch (e) {
      console.error(e);
      throw new Error('Could not delete user.');
    }
  }

  setJwtToken(token: string) {
    this.token = token;
  }
}
