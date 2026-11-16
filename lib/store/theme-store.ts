'use client';

import { create } from 'zustand';
import { applyTheme, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  syncTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Switching still works when browser storage is unavailable.
    }
  },
  syncTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
