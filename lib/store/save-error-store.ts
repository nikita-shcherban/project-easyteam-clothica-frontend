'use client';

import { create } from 'zustand';

export const DEFAULT_SAVE_ERROR_MESSAGE =
  'Не вдалося зберегти дані кошика. Можливо, сховище браузера переповнене або вимкнене. Ваші товари залишаться в кошику до закриття сторінки.';

interface SaveErrorState {
  isOpen: boolean;
  message: string;
  showSaveError: (message?: string) => void;
  hideSaveError: () => void;
}

// Глобальний стан модалки «Помилка збереження».
// Викликати showSaveError() можна з будь-якого місця, у т. ч. поза React (наприклад, зі сховища persist).
export const useSaveErrorStore = create<SaveErrorState>((set) => ({
  isOpen: false,
  message: DEFAULT_SAVE_ERROR_MESSAGE,
  showSaveError: (message = DEFAULT_SAVE_ERROR_MESSAGE) =>
    set({ isOpen: true, message }),
  hideSaveError: () => set({ isOpen: false }),
}));
