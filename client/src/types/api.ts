export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

