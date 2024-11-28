import { User, UserScheme } from '../entities';
import UserRepository from '../repository/user-repository';

export default class CreateUserUsecase {
  constructor(private repository: UserRepository) {}

  async execute(
    toCreateUser: UserScheme,
    injectJwtProperties?: (token: string, expiresIn: number) => void
  ): Promise<User | null> {
    try {
      const user = await this.repository.createUser(
        toCreateUser,
        injectJwtProperties
      );

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
