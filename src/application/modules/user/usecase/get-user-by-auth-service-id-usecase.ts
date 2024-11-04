import { User } from '../entities';
import UserRepository from '../repository/user-repository';

export default class GetUserByAuthServiceIdUsecase {
  constructor(private repository: UserRepository) {}

  async execute(userAuthServiceId: string): Promise<User | null> {
    try {
      if (!userAuthServiceId) return null;
      const user =
        await this.repository.getUserByAuthServiceId(userAuthServiceId);

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
