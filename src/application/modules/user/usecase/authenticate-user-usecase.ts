import { AuthenticateData } from '../entities';
import UserRepository from '../repository/user-repository';

export default class AuthenticateUserUseCase {
  constructor(private repository: UserRepository) {}

  async execute(authId: string): Promise<AuthenticateData> {
    const result = await this.repository.authenticate(authId);

    return result;
  }
}
