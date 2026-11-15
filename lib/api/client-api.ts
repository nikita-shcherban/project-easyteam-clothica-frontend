'use client';

import { api } from '@/lib/api/api';
import { User } from '@/types/user';
import type {
  Category,
  Good,
  GoodsFilters,
  GoodsResponse,
} from '@/types/goods';
import type { ReviewsResponse } from '@/types/review';
import type { CreateOrderPayload, UserOrdersResponse } from '@/types/order';

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

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
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

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export interface UpdateUserData {
  name?: string;
  surname?: string;
  phone?: string;
  city?: string;
  novaPoshtaBranch?: string;
}

export const updateCurrentUser = async (
  values: UpdateUserData,
): Promise<User> => {
  const { data } = await api.patch<{ data: User }>('/users/me', values);
  return data.data;
};

export async function subscribe(email: string) {
  const { data } = await api.post<{ message: string }>('/subscriptions', {
    email,
  });
  return data;
}

export async function getReviews(
  params: { limit?: number; goodId?: string } = {},
) {
  const { data } = await api.get<ReviewsResponse>('/feedbacks', { params });
  return data;
}

export async function getGoodById(id: string): Promise<Good> {
  const { data } = await api.get<{ data: Good }>(`/goods/${id}`);
  return data.data;
}

export const refreshSession = async (): Promise<void> => {
  await api.post('/auth/refresh');
};

export const getUserOrders = async (): Promise<UserOrdersResponse> => {
  const { data } = await api.get<UserOrdersResponse>('/orders');
  return data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};
