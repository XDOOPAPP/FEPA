import apiClient from './apiClient';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  tags?: string[];
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  tags?: string[];
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  tags?: string[];
}

export interface BlogQueryParams {
  status?: string;
  page?: number;
  limit?: number;
}

class BlogService {
  private readonly endpoint = '/blogs';

  /**
   * Get all blogs with optional filters
   */
  async getAll(params?: BlogQueryParams): Promise<Blog[]> {
    const response = await apiClient.get<Blog[]>(this.endpoint, { params });
    return response.data;
  }

  /**
   * Get blog by slug
   */
  async getBySlug(slug: string): Promise<Blog> {
    const response = await apiClient.get<Blog>(`${this.endpoint}/${slug}`);
    return response.data;
  }

  /**
   * Get blog by ID
   */
  async getById(id: string): Promise<Blog> {
    const response = await apiClient.get<Blog>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Create new blog (Admin only)
   */
  async create(data: CreateBlogDto): Promise<Blog> {
    const response = await apiClient.post<Blog>(this.endpoint, data);
    return response.data;
  }

  /**
   * Update blog (Admin only)
   */
  async update(id: string, data: UpdateBlogDto): Promise<Blog> {
    const response = await apiClient.patch<Blog>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  /**
   * Delete blog (Admin only)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Bulk delete blogs (Admin only)
   */
  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.delete(id)));
  }
}

export const blogService = new BlogService();
