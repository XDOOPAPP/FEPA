/**
 * Comprehensive Admin API Service
 * Consolidates all admin-specific API calls
 */

import axiosInstance from './axiosInstance';
import { API_CONFIG } from '../../config/api.config';

// ========== Admin Dashboard Stats ==========
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
}

export interface AdminRevenueTotals {
  totalRevenue: number;
  activeSubscriptions?: number;
  cancelledSubscriptions?: number;
  totalSubscriptions?: number;
}

// ========== Subscription Admin ==========
export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  features: {
    OCR: boolean;
    AI: boolean;
  };
  isFree: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  price: number;
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  features: { OCR: boolean; AI: boolean };
  isFree?: boolean;
  isActive?: boolean;
}

export interface UpdatePlanRequest {
  name?: string;
  price?: number;
  features?: { OCR?: boolean; AI?: boolean };
  isFree?: boolean;
  isActive?: boolean;
}

// ========== Revenue Stats ==========
export interface RevenueOverTimeParams {
  period?: 'daily' | 'weekly' | 'monthly';
  days?: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface RevenueByPlanItem {
  plan: string;
  revenue: number;
  count?: number;
}

// ========== Blog Admin ==========
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

// ========== Notification Admin ==========
export interface CreateNotificationRequest {
  title: string;
  message: string;
  type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  target: 'ALL' | 'ADMINS';
}

class AdminApiService {
  // ========== User Management ==========
  async getUsers(filters?: {
    search?: string;
    status?: 'ALL' | 'ACTIVE' | 'INACTIVE';
    role?: 'ALL' | 'ADMIN' | 'USER' | 'SUPER_ADMIN';
    verified?: 'ALL' | 'VERIFIED' | 'UNVERIFIED';
    page?: number;
    pageSize?: number;
  }): Promise<any> {
    try {
      const params: Record<string, any> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
      if (filters?.role && filters.role !== 'ALL') params.role = filters.role;
      if (filters?.verified && filters.verified !== 'ALL') params.verified = filters.verified;
      if (filters?.page) params.page = filters.page;
      if (filters?.pageSize) params.pageSize = filters.pageSize;

      const response = await axiosInstance.get('/auth/users', { params });
      return response;
    } catch (error) {
      console.error('❌ Get users failed:', error);
      throw error;
    }
  }

  async deactivateUser(userId: string): Promise<any> {
    try {
      const response = await axiosInstance.patch(`/auth/users/${userId}/deactivate`);
      return response;
    } catch (error) {
      console.error('❌ Deactivate user failed:', error);
      throw error;
    }
  }

  async reactivateUser(userId: string): Promise<any> {
    try {
      const response = await axiosInstance.patch(`/auth/users/${userId}/reactivate`);
      return response;
    } catch (error) {
      console.error('❌ Reactivate user failed:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(`/auth/users/${userId}`);
      return response;
    } catch (error) {
      console.error('❌ Delete user failed:', error);
      throw error;
    }
  }

  // ========== User Statistics ==========
  async getUserStats(): Promise<any> {
    try {
      const response = await axiosInstance.get('/auth/stats/total');
      return response;
    } catch (error) {
      console.error('❌ Get user stats failed:', error);
      throw error;
    }
  }

  async getUsersOverTime(period: 'daily' | 'weekly' | 'monthly', days: number): Promise<any> {
    try {
      const response = await axiosInstance.get('/auth/stats/users-over-time', {
        params: { period, days },
      });
      return response;
    } catch (error) {
      console.error('❌ Get users over time failed:', error);
      throw error;
    }
  }

  // ========== Admin Management ==========
  async registerAdmin(data: {
    email: string;
    fullName: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/register-admin', data);
      return response;
    } catch (error) {
      console.error('❌ Register admin failed:', error);
      throw error;
    }
  }

  async getAllAdmins(): Promise<any> {
    try {
      const response = await axiosInstance.get('/auth/all-admin');
      return response;
    } catch (error) {
      console.error('❌ Get all admins failed:', error);
      throw error;
    }
  }

  // ========== Subscription Management (Admin) ==========
  async createPlan(data: CreatePlanRequest): Promise<SubscriptionPlan> {
    try {
      const response = await axiosInstance.post(
        API_CONFIG.SUBSCRIPTIONS.CREATE_PLAN,
        data,
      );
      return response;
    } catch (error) {
      console.error('❌ Create plan failed:', error);
      throw error;
    }
  }

  async updatePlan(id: string, data: UpdatePlanRequest): Promise<SubscriptionPlan> {
    try {
      const response = await axiosInstance.patch(
        API_CONFIG.SUBSCRIPTIONS.UPDATE_PLAN(id),
        data,
      );
      return response;
    } catch (error) {
      console.error('❌ Update plan failed:', error);
      throw error;
    }
  }

  async deletePlan(id: string): Promise<any> {
    try {
      const response = await axiosInstance.delete(
        API_CONFIG.SUBSCRIPTIONS.DELETE_PLAN(id),
      );
      return response;
    } catch (error) {
      console.error('❌ Delete plan failed:', error);
      throw error;
    }
  }

  // ========== Subscription Revenue Stats ==========
  async getRevenueTotal(): Promise<AdminRevenueTotals> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.SUBSCRIPTIONS.REVENUE_TOTAL,
      );
      return response;
    } catch (error) {
      console.error('❌ Get revenue total failed:', error);
      throw error;
    }
  }

  async getRevenueOverTime(params?: RevenueOverTimeParams): Promise<RevenuePoint[]> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.SUBSCRIPTIONS.REVENUE_OVER_TIME,
        { params },
      );
      return response;
    } catch (error) {
      console.error('❌ Get revenue over time failed:', error);
      throw error;
    }
  }

  async getRevenueByPlan(): Promise<RevenueByPlanItem[]> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.SUBSCRIPTIONS.REVENUE_BY_PLAN,
      );
      return response;
    } catch (error) {
      console.error('❌ Get revenue by plan failed:', error);
      throw error;
    }
  }

  async getSubscriptionStats(): Promise<any> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.SUBSCRIPTIONS.ADMIN_STATS,
      );
      return response;
    } catch (error) {
      console.error('❌ Get subscription stats failed:', error);
      throw error;
    }
  }

  // ========== Blog Management (Admin) ==========
  async getBlogStatusStats(): Promise<BlogStatusStats> {
    try {
      const response = await axiosInstance.get(API_CONFIG.BLOGS.STATS_STATUS);
      return response;
    } catch (error) {
      console.error('❌ Get blog status stats failed:', error);
      throw error;
    }
  }

  async getBlogMonthlyStats(year: number): Promise<BlogMonthlyStat[]> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.BLOGS.STATS_MONTHLY(year),
      );
      return response;
    } catch (error) {
      console.error('❌ Get blog monthly stats failed:', error);
      throw error;
    }
  }

  async approveBlog(id: string, adminId?: string): Promise<any> {
    try {
      const response = await axiosInstance.post(
        API_CONFIG.BLOGS.APPROVE(id),
        { adminId },
      );
      return response;
    } catch (error) {
      console.error('❌ Approve blog failed:', error);
      throw error;
    }
  }

  async rejectBlog(id: string, adminId: string, rejectionReason: string): Promise<any> {
    try {
      const response = await axiosInstance.post(
        API_CONFIG.BLOGS.REJECT(id),
        { adminId, rejectionReason },
      );
      return response;
    } catch (error) {
      console.error('❌ Reject blog failed:', error);
      throw error;
    }
  }

  // ========== Notifications (Admin) ==========
  async createNotification(data: CreateNotificationRequest): Promise<any> {
    try {
      const response = await axiosInstance.post(
        API_CONFIG.NOTIFICATIONS.CREATE,
        data,
      );
      return response;
    } catch (error) {
      console.error('❌ Create notification failed:', error);
      throw error;
    }
  }

  async getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.NOTIFICATIONS.LIST,
        { params },
      );
      return response;
    } catch (error) {
      console.error('❌ Get notifications failed:', error);
      throw error;
    }
  }

  // ========== Service Statistics ==========
  async getExpenseStats(): Promise<any> {
    try {
      const response = await axiosInstance.get('/expenses/admin/stats');
      return response;
    } catch (error) {
      console.error('❌ Get expense stats failed:', error);
      throw error;
    }
  }

  async getBudgetStats(): Promise<any> {
    try {
      const response = await axiosInstance.get('/budgets/admin/stats');
      return response;
    } catch (error) {
      console.error('❌ Get budget stats failed:', error);
      throw error;
    }
  }

  async getOcrStats(): Promise<any> {
    try {
      const response = await axiosInstance.get('/ocr/admin/stats');
      return response;
    } catch (error) {
      console.error('❌ Get OCR stats failed:', error);
      throw error;
    }
  }

  async getAiStats(): Promise<any> {
    try {
      const response = await axiosInstance.get(API_CONFIG.AI.ADMIN_STATS);
      return response;
    } catch (error) {
      console.error('❌ Get AI stats failed:', error);
      throw error;
    }
  }

  // ========== Payment Management (Admin) ==========
  async getPaymentStatus(ref: string): Promise<any> {
    try {
      const response = await axiosInstance.get(
        API_CONFIG.PAYMENTS.LOOKUP(ref),
      );
      return response;
    } catch (error) {
      console.error('❌ Get payment status failed:', error);
      throw error;
    }
  }
}

const adminApiService = new AdminApiService();
export default adminApiService;
