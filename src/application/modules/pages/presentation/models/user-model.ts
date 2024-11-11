import { UserScheme } from '@/application/modules/user/entities';
import CreateUserUsecase from '@/application/modules/user/usecase/create-user-usecase';
import UserRepository from '@/application/modules/user/repository/user-repository';
import GetUserByAuthServiceIdUsecase from '@/application/modules/user/usecase/get-user-by-auth-service-id-usecase';
import DeleteUserUsecase from '@/application/modules/user/usecase/delete-user-usecase';
import UpdateUserUsecase from '@/application/modules/user/usecase/update-user-usecase';

interface useUserModelProps {
  userRepository: UserRepository;
}

export default function useUserModel({ userRepository }: useUserModelProps) {
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
    fetchUserByAuthServiceId,
    deleteUser,
    updateUser
  };
}
