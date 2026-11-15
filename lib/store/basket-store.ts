'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BasketItem } from '@/types/basket';
import { safeJSONStorage } from './safe-storage';

interface BasketState {
  items: BasketItem[];
  addItem: (item: BasketItem) => void;
  removeItem: (goodId: string, size: string) => void;
  setQuantity: (goodId: string, size: string, quantity: number) => void;
  clear: () => void;
}

const isSame = (item: BasketItem, goodId: string, size: string) =>
  item.goodId === goodId && item.size === size;

// Кошик зберігається в localStorage між сесіями (до оформлення замовлення).
// Якщо запис не вдався — safeJSONStorage покаже модалку «Помилка збереження».
export const useBasketStore = create<BasketState>()(
  persist(
    (set) => ({
      items: [],
      // Той самий товар у тому ж розмірі — збільшуємо кількість, інший розмір — окрема позиція
      addItem: (item) =>
        set((s) =>
          s.items.some((i) => isSame(i, item.goodId, item.size))
            ? {
                items: s.items.map((i) =>
                  isSame(i, item.goodId, item.size)
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i,
                ),
              }
            : { items: [...s.items, item] },
        ),
      removeItem: (goodId, size) =>
        set((s) => ({ items: s.items.filter((i) => !isSame(i, goodId, size)) })),
      setQuantity: (goodId, size, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            isSame(i, goodId, size) ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'basket', storage: safeJSONStorage, skipHydration: true },
  ),
);
