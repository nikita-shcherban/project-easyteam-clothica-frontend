'use client';

import { createJSONStorage, type StateStorage } from 'zustand/middleware';
import { useSaveErrorStore } from './save-error-store';

// localStorage, який не падає: якщо запис/читання не вдалося
// (переповнене сховище, приватний режим, заблоковані cookies),
// показуємо модалку «Помилка збереження», а стан лишається в пам'яті.
//
// Використання в persist (#148):
//   persist((set) => ({ ... }), { name: 'basket', storage: safeJSONStorage })
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      useSaveErrorStore.getState().showSaveError();
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      useSaveErrorStore.getState().showSaveError();
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      useSaveErrorStore.getState().showSaveError();
    }
  },
};

export const safeJSONStorage = createJSONStorage(() => safeLocalStorage);
