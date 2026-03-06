export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PageParams {
  page?: number;
  size?: number;
  search?: string;
  searchType?: "title" | "author" | "all";
}
