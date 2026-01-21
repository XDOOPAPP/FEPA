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
  rejectionReason?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email?: string;
  };
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
  note?: string;
}

export interface RejectParams {
  reason: string;
}
