import { api } from './api';
import type {
  CategoriesQueryParams,
  CategoriesResponse,
} from '@/types/category';

export const getCategories = async (
  params: CategoriesQueryParams = {},
): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>('/categories', {
    params,
  });

  return data;
};
