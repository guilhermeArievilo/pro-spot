import { User, UserScheme } from '../entities';
import UserRepository from '../repository/user-repository';

export default class CreateUserUsecase {
  constructor(private repository: UserRepository) {}

  async execute(toCreateUser: UserScheme): Promise<User | null> {
    try {
      const user = await this.repository.createUser(toCreateUser);

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
