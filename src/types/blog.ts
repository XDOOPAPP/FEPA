export type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected';

export interface Blog {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  images: string[];
  status: BlogStatus;
  author?: string | null;
  rejectionReason?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface BlogListResponse {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
}

export interface BlogActionResponse {
  success: boolean;
  message: string;
  data?: Blog;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApproveParams {
  adminId?: string;
}

export interface RejectParams {
  adminId?: string;
  rejectionReason: string;
}
