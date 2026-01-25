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

export interface BlogStatusStats {
	draft?: number;
	pending?: number;
	published?: number;
	rejected?: number;
}

export interface BlogMonthlyStat {
	month: number;
	count: number;
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
		console.log('📝 Blog List API Response:', response);
		
		// Backend returns array directly
		if (Array.isArray(response)) {
			return {
				data: response,
				total: response.length,
				page: 1,
				limit: response.length,
			};
		}
		
		// If response has data property (wrapped format)
		if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
			return {
				data: response.data,
				total: response.data.length,
				page: 1,
				limit: response.data.length,
			};
		}
		
		// If already in correct format with pagination
		if (response && typeof response === 'object' && 'data' in response && 'total' in response) {
			return response as unknown as BlogListResponse;
		}
		
		console.warn('📝 Unexpected blog list response format, returning empty');
		return {
			data: [],
			total: 0,
			page: 1,
			limit: 10,
		};
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
	 * Get blog status distribution
	 */
	getStatusStats: async (): Promise<BlogStatusStats> => {
		const response = await axiosInstance.get(API_CONFIG.BLOGS.STATS_STATUS);
		const payload: any = response.data || response;
		return payload?.data || payload || {};
	},

	/**
	 * Get monthly blog counts for a year
	 */
	getMonthlyStats: async (year: number): Promise<BlogMonthlyStat[]> => {
		const response = await axiosInstance.get(API_CONFIG.BLOGS.STATS_MONTHLY(year));
		const payload: any = response.data || response;
		return payload?.data || payload || [];
	},

	/**
	 * Get blog detail by ID
	 */
	getBlogDetail: async (id: string): Promise<Blog> => {
		const response = await axiosInstance.get(API_CONFIG.BLOGS.DETAIL(id));
		console.log('📝 Blog Detail API Response:', response);
		
		// Backend có thể trả về trực tiếp object hoặc trong wrapper {data: {...}}
		if (response && typeof response === 'object') {
			// Nếu có data property, lấy nó
			if ('data' in response && response.data) {
				return response.data as unknown as Blog;
			}
			// Nếu không, response chính là blog object
			return response as unknown as Blog;
		}
		
		throw new Error('Invalid response format');
	},

	/**
	 * Approve a blog
	 */
	approveBlog: async (id: string, params?: ApproveParams): Promise<BlogActionResponse> => {
		const response = await axiosInstance.post(API_CONFIG.BLOGS.APPROVE(id), params);
		return response as unknown as BlogActionResponse;
	},

	/**
	 * Reject a blog
	 */
	rejectBlog: async (id: string, params: RejectParams): Promise<BlogActionResponse> => {
		const response = await axiosInstance.post(API_CONFIG.BLOGS.REJECT(id), params);
		return response as unknown as BlogActionResponse;
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
