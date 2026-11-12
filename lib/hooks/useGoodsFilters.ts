'use client';
import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SIZES, type Gender, type GoodsFilters, type Size } from '@/types/goods';

export const PRICE_MAX = 5000; // TODO: підставити реальний максимум цін

const isSize = (v: string): v is Size => (SIZES as readonly string[]).includes(v);
const isGender = (v: string | null): v is Gender =>
  v === 'male' || v === 'female' || v === 'unisex';

/** Єдине джерело правди для фільтрів — query-параметри URL */
export function useGoodsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters = useMemo<GoodsFilters>(() => {
    const num = (k: string) => {
      const v = params.get(k);
      return v !== null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : undefined;
    };
    const gender = params.get('gender');
    return {
      category: params.get('category') || undefined,
      gender: isGender(gender) ? gender : undefined,
      sizes: params.getAll('size').filter(isSize).sort((a, b) => SIZES.indexOf(a) - SIZES.indexOf(b)),
      minPrice: num('minPrice'),
      maxPrice: num('maxPrice'),
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<GoodsFilters>) => {
      const next = { ...filters, ...patch };
      const p = new URLSearchParams();
      if (next.category) p.set('category', next.category);
      if (next.gender) p.set('gender', next.gender);
      next.sizes.forEach((s) => p.append('size', s));
      if (next.minPrice !== undefined) p.set('minPrice', String(next.minPrice));
      if (next.maxPrice !== undefined) p.set('maxPrice', String(next.maxPrice));
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, router, pathname],
  );

  const reset = useCallback(() => router.replace(pathname, { scroll: false }), [router, pathname]);

  return { filters, update, reset };
}
