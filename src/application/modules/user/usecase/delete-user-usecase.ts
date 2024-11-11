import UserRepository from '../repository/user-repository';

export default class DeleteUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    await this.userRepository.deleteUser(id);
  }
}
