import { User, UserScheme } from '@/application/modules/user/entities';
import UserRepository from '@/application/modules/user/repository/user-repository';
import { ApolloClient, gql } from '@apollo/client';
import { AxiosInstance } from 'axios';
import { toUserDomain } from '../mappers/strapi-user-mappers';

import qs from 'qs';

export default class StrapiUserRepository implements UserRepository {
  constructor(
    private ApolloClientService: ApolloClient<any>,
    private AxiosClientService: AxiosInstance
  ) {}

  async getUserByAuthServiceId(
    userServiceAuthId: string
  ): Promise<User | null> {
    const query = gql`
      query AppUser($filters: AppUserFiltersInput) {
        appUsers(filters: $filters) {
          documentId
          name
          lastName
          email
          authId
          phoneNumber
          photoProfile {
            documentId
            alternativeText
            width
            height
            mime
            url
          }
        }
      }
    `;

    const { data, error } = await this.ApolloClientService.query({
      query,
      variables: {
        filters: {
          authId: {
            eq: userServiceAuthId
          }
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.appUsers?.length) {
      throw new Error('User not found');
    }

    return toUserDomain(data.appUsers[0]);
  }

  async createUser({
    name,
    email,
    authId,
    phoneNumber,
    lastName
  }: UserScheme): Promise<User> {
    const result = await this.AxiosClientService.post('/app-users', {
      data: {
        name,
        email,
        authId,
        phoneNumber,
        lastName
      }
    });

    if (!result?.data) {
      throw new Error('User not created');
    }

    return toUserDomain(result.data.data);
  }

  async updateUser({
    id,
    userData: { name, lastName, photoProfile }
  }: {
    id: string;
    userData: UserScheme;
  }): Promise<User> {
    const bodyData = {
      name,
      lastName
    };

    if (photoProfile) {
      Object.assign(bodyData, {
        photoProfile: {
          set: [photoProfile]
        }
      });
    }

    const query = qs.stringify({
      populate: ['photoProfile']
    });

    const remoteUser = await this.AxiosClientService.put(
      `/app-users/${id}?${query}`,
      {
        data: bodyData
      }
    );

    if (!remoteUser?.data) {
      throw new Error('Could not update user');
    }

    return toUserDomain(remoteUser.data.data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.AxiosClientService.delete(`/app-users/${id}`);
  }
}
