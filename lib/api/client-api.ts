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
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (filters.category) params.set('category', filters.category);
  if (filters.gender) params.set('gender', filters.gender);
  filters.sizes.forEach((s) => params.append('size', s)); // size=M&size=L
  if (filters.minPrice !== undefined)
    params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.set('maxPrice', String(filters.maxPrice));

  const { data } = await api.get<GoodsResponse>(`/goods?${params.toString()}`);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<{ categories: Category[] }>('/categories', {
    params: { perPage: 20 },
  });
  return data.categories;
}
