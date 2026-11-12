'use client';
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { getCategories, getGoods } from '@/lib/api/client-api';
import type { GoodsFilters } from '@/types/goods';
import { useMediaQuery } from './useMediaQuery';
import { Category } from '@/types/goods';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  });
}

export function useGoods(filters: GoodsFilters) {
  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const limit = isDesktop === null ? null : isDesktop ? 12 : 8;

  const query = useInfiniteQuery({
    queryKey: ['goods', filters, limit],
    queryFn: ({ pageParam }) => getGoods(filters, pageParam, limit as number),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.hasNextPage ? last.pagination.page + 1 : undefined,
    enabled: limit !== null,
    placeholderData: keepPreviousData,
  });

  const goods = query.data?.pages.flatMap((p) => p.data) ?? [];
  const total = query.data?.pages.at(-1)?.pagination.totalCount ?? 0;
  const loading =
    limit === null || (query.isFetching && !query.isFetchingNextPage);

  return { ...query, goods, total, loading };
}
