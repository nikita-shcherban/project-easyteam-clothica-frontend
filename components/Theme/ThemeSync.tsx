'use client';

import { useEffect } from 'react';
import { applyTheme, isTheme, readTheme, THEME_STORAGE_KEY } from '@/lib/theme';
import { useThemeStore } from '@/lib/store/theme-store';

export default function ThemeSync() {
  useEffect(() => {
    const { syncTheme } = useThemeStore.getState();
    syncTheme(readTheme());

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (useThemeStore.getState().theme === 'system') applyTheme('system');
    };
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        syncTheme(isTheme(event.newValue) ? event.newValue : 'light');
      }
    };
    media.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return null;
}
