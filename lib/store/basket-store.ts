'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BasketItem } from '@/types/basket';
import type { Good } from '@/types/goods';
import { safeJSONStorage } from './safe-storage';

interface BasketState {
  items: BasketItem[];
  /** Додати товар з API (сторінка товару, картки). Той самий розмір — зливається в одну позицію */
  addGood: (good: Good, size: string, quantity?: number) => void;
  addItem: (item: BasketItem) => void;
  removeItem: (goodId: string, size: string) => void;
  setQuantity: (goodId: string, size: string, quantity: number) => void;
  /** Очистити після оформлення замовлення */
  clear: () => void;
}

const isSame = (item: BasketItem, goodId: string, size: string) =>
  item.goodId === goodId && item.size === size;

const toPositiveInt = (n: number) => Math.max(1, Math.floor(n) || 1);

export const goodToBasketItem = (
  good: Good,
  size: string,
  quantity = 1,
): BasketItem => ({
  goodId: good._id,
  name: good.name,
  image: good.image,
  price: good.price.value,
  currency: good.price.currency,
  size,
  quantity: toPositiveInt(quantity),
  rating: good.rating ?? 0,
  feedbacksCount: good.feedbacksCount ?? 0,
});

// Кошик зберігається в localStorage між сесіями (до оформлення замовлення).
// Якщо запис не вдався — safeJSONStorage покаже модалку «Помилка збереження».
export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],

      addGood: (good, size, quantity = 1) =>
        get().addItem(goodToBasketItem(good, size, quantity)),

      // Той самий товар у тому ж розмірі — збільшуємо кількість, інший розмір — окрема позиція
      addItem: (item) =>
        set((s) => {
          const quantity = toPositiveInt(item.quantity);
          if (!s.items.some((i) => isSame(i, item.goodId, item.size))) {
            return { items: [...s.items, { ...item, quantity }] };
          }
          return {
            items: s.items.map((i) =>
              isSame(i, item.goodId, item.size)
                ? {
                    ...i,
                    // свіжі дані товару (ціна, рейтинг) + сумарна кількість
                    ...item,
                    quantity: i.quantity + quantity,
                  }
                : i,
            ),
          };
        }),

      removeItem: (goodId, size) =>
        set((s) => ({
          items: s.items.filter((i) => !isSame(i, goodId, size)),
        })),

      setQuantity: (goodId, size, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            isSame(i, goodId, size)
              ? { ...i, quantity: toPositiveInt(quantity) }
              : i,
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'basket',
      storage: safeJSONStorage, skipHydration: true,
      version: 1,
      // У localStorage — лише товари, без функцій
      partialize: (s) => ({ items: s.items }),
      // Захист від зіпсованих/старих даних у localStorage
      migrate: (persisted) => {
        const items = (persisted as { items?: unknown })?.items;
        return {
          items: Array.isArray(items)
            ? (items as BasketItem[]).filter(
                (i) =>
                  i &&
                  typeof i.goodId === 'string' &&
                  typeof i.size === 'string',
              )
            : [],
        } as BasketState;
      },
    },
  ),
);

// Селектори: кількість для бейджа в Header і сума
export const selectBasketCount = (s: BasketState) => s.items.length;

export const selectBasketTotal = (s: BasketState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
