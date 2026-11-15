import type { Category } from './goods';

export interface CategoriesQueryParams {
  page?: number;
  perPage?: number;
}

export interface CategoriesResponse {
  page: number;
  perPage: number;
  totalCategories: number;
  totalPages: number;
  categories: Category[];
}
