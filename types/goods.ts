export const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type Size = (typeof SIZES)[number];
export type Gender = 'man' | 'women' | 'unisex';

export interface Good {
  _id: string;
  name: string;
  category: { _id: string; name: string };
  image?: string;
  price: { value: number; currency: string };
  size: string[];
  gender?: Gender;
  description?: string;
  rating: number;
  feedbacksCount: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GoodsResponse {
  success: boolean;
  data: Good[];
  pagination: Pagination;
}

export interface GoodsFilters {
  category?: string;
  gender?: Gender;
  sizes: Size[];
  minPrice?: number;
  maxPrice?: number;
}
