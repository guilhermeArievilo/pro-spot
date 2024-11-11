import { User, UserScheme } from '../entities';

export default abstract class UserRepository {
  abstract getUserByAuthServiceId(
    userServiceAuthId: string
  ): Promise<User | null>;
  abstract createUser(user: UserScheme): Promise<User>;
  abstract updateUser({
    id,
    userData
  }: {
    id: string;
    userData: UserScheme;
  }): Promise<User>;
  abstract deleteUser(id: string): Promise<void>;
}
