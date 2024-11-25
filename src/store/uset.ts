import { User } from '@/application/modules/user/entities';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  jwtToken?: string;
  setJwtToken: (token: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  jwtToken: '',
  setJwtToken: (token: string) => {
    set({
      jwtToken: token
    });
  },
  setUser: (user: User) =>
    set({
      user
    })
}));

export default useUserStore;
