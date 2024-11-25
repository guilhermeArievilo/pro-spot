import { AuthenticateData, User, UserScheme } from '../entities';

export default abstract class UserRepository {
  abstract getUserByAuthServiceId(
    userServiceAuthId: string
  ): Promise<User | null>;
  abstract getUser(): Promise<User>;
  abstract authenticate(userServiceAuthId: string): Promise<AuthenticateData>;
  abstract setJwtToken(token: string): void;
  abstract createUser(
    user: UserScheme,
    injectJwtProperties?: (token: string, expiresIn: number) => void
  ): Promise<User>;
  abstract updateUser({
    id,
    userData
  }: {
    id: string;
    userData: UserScheme;
  }): Promise<User>;
  abstract deleteUser(id: string): Promise<void>;
}
