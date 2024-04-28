import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = {
  theme: string;
  switchTheme: () => void;
};

const useStore = create(
  persist<Theme>(
    (set, get) => ({
      theme: 'light',
      switchTheme: () =>
        set((state) => ({
          ...state,
          theme: get().theme === 'dark' ? 'light' : 'dark',
        })),
    }),
    {
      name: 'theme',
    }
  )
);

export const useTheme = () => useStore((state) => state.theme);
export const useSwitchTheme = () => useStore((state) => state.switchTheme);
