import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Nullable } from '@/types/common';
import { User } from '@/types/user';

export type AuthStore = {
  user: Nullable<User>;
  saveUser: (user: User) => void;
  logout: () => void;
};

export default create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      saveUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
