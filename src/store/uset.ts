import { User } from '@/application/modules/user/entities';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (state: boolean) => void;
  jwtToken?: string;
  setJwtToken: (token: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  jwtToken: '',
  setIsAuthenticated: (state: boolean) => {
    set({
      isAuthenticated: state
    });
  },
  setJwtToken: (token: string) => {
    set({
      isAuthenticated: true,
      jwtToken: token
    });
  },
  setUser: (user: User) =>
    set({
      user
    })
}));

export default useUserStore;
