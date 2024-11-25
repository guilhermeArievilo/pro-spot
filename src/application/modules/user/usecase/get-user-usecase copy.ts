import { User } from '../entities';
import UserRepository from '../repository/user-repository';

export default class GetUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(): Promise<User> {
    const user = await this.repository.getUser();
    return user;
  }
}
