'use client';

import { useQuery } from '@tanstack/react-query';
import { getGoodById } from '@/lib/api/client-api';
import type { Good } from '@/types/goods';

export function useGood(id: string) {
  const query = useQuery<Good>({
    queryKey: ['goods', id],
    queryFn: () => getGoodById(id),
    enabled: Boolean(id),
  });

  return {
    ...query,
    good: query.data,
  };
}
