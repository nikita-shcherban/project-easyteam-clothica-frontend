'use client';

import { api } from '@/lib/api/api';
import { User } from '@/types/user';
import type { Category, GoodsFilters, GoodsResponse } from '@/types/goods';

export interface RegisterUserData {
  username: string;
  phone: string;
  password: string;
}

export interface LoginUserData {
  phone: string;
  password: string;
}
export const register = async (data: RegisterUserData) => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginUserData) => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export async function getGoods(
  filters: GoodsFilters,
  page: number,
  limit: number,
) {
  const { data } = await api.get<GoodsResponse>('/goods', {
    params: {
      page,
      limit,
      category: filters.category,
      gender: filters.gender,
      size: filters.sizes.length ? filters.sizes : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    },
  });
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<{ categories: Category[] }>('/categories', {
    params: { perPage: 50 },
  });
  return data.categories;
}
