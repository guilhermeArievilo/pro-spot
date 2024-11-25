import {
  AuthenticateData,
  UserScheme
} from '@/application/modules/user/entities';
import CreateUserUsecase from '@/application/modules/user/usecase/create-user-usecase';
import UserRepository from '@/application/modules/user/repository/user-repository';
import GetUserByAuthServiceIdUsecase from '@/application/modules/user/usecase/get-user-by-auth-service-id-usecase';
import DeleteUserUsecase from '@/application/modules/user/usecase/delete-user-usecase';
import UpdateUserUsecase from '@/application/modules/user/usecase/update-user-usecase';
import AuthenticateUserUseCase from '@/application/modules/user/usecase/authenticate-user-usecase';
import GetUserUseCase from '@/application/modules/user/usecase/get-user-usecase copy';

interface useUserModelProps {
  userRepository: UserRepository;
}

export default function useUserModel({ userRepository }: useUserModelProps) {
  async function authenticate(authId: string): Promise<AuthenticateData> {
    const authenticator = new AuthenticateUserUseCase(userRepository);

    const result = await authenticator.execute(authId);
    userRepository.setJwtToken(result.accessToken);

    return result;
  }

  async function createUser(userData: UserScheme) {
    const createUser = new CreateUserUsecase(userRepository);
    const user = await createUser.execute(userData);

    return user;
  }

  async function fetchUserByAuthServiceId(userAuthServiceId: string) {
    const getUserByAuthServiceId = new GetUserByAuthServiceIdUsecase(
      userRepository
    );

    const user = await getUserByAuthServiceId.execute(userAuthServiceId);
    return user;
  }

  async function getUser() {
    const fetchUserResult = new GetUserUseCase(userRepository);

    return fetchUserResult.execute();
  }

  async function deleteUser(id: string) {
    const deleteUserCase = new DeleteUserUsecase(userRepository);
    await deleteUserCase.execute(id);
  }

  async function updateUser({
    id,
    userData
  }: {
    id: string;
    userData: UserScheme;
  }) {
    const updateUserCase = new UpdateUserUsecase(userRepository);

    return await updateUserCase.execute(id, userData);
  }

  return {
    createUser,
    getUser,
    fetchUserByAuthServiceId,
    deleteUser,
    updateUser,
    authenticate
  };
}
