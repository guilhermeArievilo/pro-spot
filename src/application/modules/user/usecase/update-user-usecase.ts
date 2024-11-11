import { UserScheme } from '../entities';
import UserRepository from '../repository/user-repository';

export default class UpdateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, userData: UserScheme) {
    const user = await this.userRepository.updateUser({
      userData,
      id
    });

    return user;
  }
}
