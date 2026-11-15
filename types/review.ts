export interface Review {
  _id: string;
  good: string;
  author?: string;
  /** Для неавторизованих бекенд повертає «Гість» + authorName */
  authorName: string;
  rating: number;
  text?: string;
  /** Назва товару, якщо бекенд її повертає */
  goodName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
