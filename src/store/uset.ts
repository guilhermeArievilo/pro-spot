import { User } from '@/application/modules/user/entities';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) =>
    set({
      user
    })
}));

export default useUserStore;
