import axiosInstance from './axiosInstance';
import { API_CONFIG } from '../../config/api.config';
import type { Blog, CreateBlogDto, UpdateBlogDto, BlogQueryParams } from '../../types/blog';

const BLOG_ENDPOINTS = API_CONFIG.BLOGS;

export const blogAPI = {
    /**
     * Get all blogs with optional filters
     */
    getAll: (params?: BlogQueryParams): Promise<Blog[]> => {
        return axiosInstance.get(BLOG_ENDPOINTS.LIST, { params });
    },

    /**
     * Get blog by slug
     */
    getBySlug: (slug: string): Promise<Blog> => {
        return axiosInstance.get(BLOG_ENDPOINTS.BY_SLUG(slug));
    },

    /**
     * Get blog by ID
     */
    getById: (id: string): Promise<Blog> => {
        return axiosInstance.get(BLOG_ENDPOINTS.DETAIL(id));
    },

    /**
     * Create new blog (Admin only)
     */
    create: (data: CreateBlogDto): Promise<Blog> => {
        return axiosInstance.post(BLOG_ENDPOINTS.LIST, data);
    },

    /**
     * Update blog (Admin only)
     */
    update: (id: string, data: UpdateBlogDto): Promise<Blog> => {
        return axiosInstance.patch(BLOG_ENDPOINTS.DETAIL(id), data);
    },

    /**
     * Delete blog (Admin only)
     */
    delete: (id: string): Promise<void> => {
        return axiosInstance.delete(BLOG_ENDPOINTS.DETAIL(id));
    },

    /**
     * Bulk delete blogs (Admin only) - If backend supports it, otherwise manual loop
     */
    bulkDelete: async (ids: string[]): Promise<void> => {
        // Assuming backend might not have a dedicated bulk delete endpoint for blogs specifically in the current config
        // We follow the pattern of calling delete multiple times or implementing if exists
        await Promise.all(ids.map(id => axiosInstance.delete(BLOG_ENDPOINTS.DETAIL(id))));
    }
};

export default blogAPI;
