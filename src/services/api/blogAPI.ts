import axiosInstance from './axiosInstance';
import { API_CONFIG } from '../../config/api.config';
import type {
	Blog,
	BlogListResponse,
	BlogActionResponse,
	PaginationParams,
	ApproveParams,
	RejectParams,
	BlogStatus,
} from '../../types/blog';

interface GetBlogsParams extends PaginationParams {
	status?: BlogStatus;
	author?: string;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
}

export const blogAPI = {
	/**
	 * Get blogs with filters. Backend now ignores pagination; only status (and optional filters) are needed.
	 */
	getBlogs: async (params: GetBlogsParams): Promise<BlogListResponse> => {
		const { page, limit, ...rest } = params;

		const queryParams: Record<string, unknown> = {
			...rest,
			// Explicitly drop page/limit per new endpoint contract.
		};

		const response = await axiosInstance.get(API_CONFIG.BLOGS.LIST, { params: queryParams });
		
		// Backend returns array directly, need to wrap in BlogListResponse format
		if (Array.isArray(response)) {
			return {
				data: response,
				total: response.length,
				page: 1,
				limit: response.length,
			};
		}
		
		// If already in correct format, return as is
		return response as BlogListResponse;
	},

	/**
	 * Get pending blogs
	 */
	getPendingBlogs: async (params?: PaginationParams): Promise<BlogListResponse> => {
		return blogAPI.getBlogs({ ...params, status: 'pending' });
	},

	/**
	 * Get published blogs
	 */
	getPublishedBlogs: async (params?: PaginationParams): Promise<BlogListResponse> => {
		return blogAPI.getBlogs({ ...params, status: 'published' });
	},

	/**
	 * Get rejected blogs
	 */
	getRejectedBlogs: async (params?: PaginationParams): Promise<BlogListResponse> => {
		return blogAPI.getBlogs({ ...params, status: 'rejected' });
	},

	/**
	 * Get blog detail by ID
	 */
	getBlogDetail: async (id: string): Promise<Blog> => {
		const response = await axiosInstance.get(API_CONFIG.BLOGS.DETAIL(id));
		return response as Blog;
	},

	/**
	 * Approve a blog
	 */
	approveBlog: async (id: string, params?: ApproveParams): Promise<BlogActionResponse> => {
		const response = await axiosInstance.post(API_CONFIG.BLOGS.APPROVE(id), params);
		return response as BlogActionResponse;
	},

	/**
	 * Reject a blog
	 */
	rejectBlog: async (id: string, params: RejectParams): Promise<BlogActionResponse> => {
		const response = await axiosInstance.post(API_CONFIG.BLOGS.REJECT(id), params);
		return response as BlogActionResponse;
	},

	/**
	 * Get pending blogs count (for badge)
	 */
	getPendingCount: async (): Promise<number> => {
		const response = await blogAPI.getPendingBlogs({ page: 1, limit: 1 });
		return response.total;
	},
};

export default blogAPI;
