import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== REQUEST TYPES ==========
export interface CreatePlanRequest {
  name: string
  price: number
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
  features: { OCR: boolean; AI: boolean }
  isFree?: boolean
  isActive?: boolean
}

export interface UpdatePlanRequest {
  name?: string
  price?: number
  features?: { OCR?: boolean; AI?: boolean }
  isFree?: boolean
  isActive?: boolean
}

// ========== RESPONSE TYPES ==========
export interface SubscriptionPlan {
  _id: string
  name: string
  price: number
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
  features: { OCR: boolean; AI: boolean }
  isFree: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSubscription {
  _id: string
  userId: string
  planId: SubscriptionPlan
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  startDate: string
  endDate: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionResponse {
  success: boolean
  message: string
  data: any
}

export interface PlansListResponse {
  success: boolean
  message: string
  data: SubscriptionPlan[]
}

export interface UserSubscriptionsResponse {
  success: boolean
  message: string
  data: UserSubscription[]
}

export type SubscriptionStatsMap = Record<string, { name: string; count: number }>

export interface StatsResponse {
  success?: boolean
  message?: string
  data?: SubscriptionStatsMap
}

export interface RevenueOverTimeParams {
  period?: 'daily' | 'weekly' | 'monthly'
  days?: number
}

export interface RevenuePoint {
  date: string
  revenue: number
}

export interface RevenueOverTimeResponse {
  success?: boolean
  data?: RevenuePoint[]
  period?: string
}

export interface RevenueByPlanItem {
  plan: string
  revenue: number
  count?: number
}

export interface RevenueTotalsResponse {
  success?: boolean
  data?: {
    totalRevenue: number
    activeSubscriptions?: number
    cancelledSubscriptions?: number
    totalSubscriptions?: number
  }
}

export interface HealthCheckResponse {
  success: boolean
  message: string
  data?: {
    alive: boolean
    timestamp: string
  }
}

// ========== API FUNCTIONS ==========
const subscriptionAPI = {
  /**
   * Lấy danh sách tất cả các gói đang hoạt động
   * GET /api/v1/subscriptions/plans
   */
  getPlans: async () => {
    const response = await axiosInstance.get<PlansListResponse>(
      API_CONFIG.SUBSCRIPTIONS.PLANS
    )
    return response.data || response
  },

  /**
   * Lấy chi tiết một gói
   * GET /api/v1/subscriptions/plans/:id
   */
  getPlanDetail: async (id: string) => {
    const response = await axiosInstance.get<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.PLAN_DETAIL(id)
    )
    return response.data || response
  },

  /**
   * Tạo gói mới (Admin)
   * POST /api/v1/subscriptions/plans
   */
  createPlan: async (data: CreatePlanRequest) => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.CREATE_PLAN,
      data
    )
    // Response from axiosInstance is already the body
    return response.data || response
  },

  /**
   * Cập nhật gói (Admin)
   * PATCH /api/v1/subscriptions/plans/:id
   */
  updatePlan: async (id: string, data: UpdatePlanRequest) => {
    const response = await axiosInstance.patch<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.UPDATE_PLAN(id),
      data
    )
    return response.data || response
  },

  /**
   * Vô hiệu hóa gói (Admin)
   * DELETE /api/v1/subscriptions/plans/:id
   */
  disablePlan: async (id: string) => {
    const response = await axiosInstance.delete<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.DELETE_PLAN(id)
    )
    return response.data || response
  },

  /**
   * Lấy thống kê subscriptions (Admin)
   * GET /api/v1/subscriptions/admin/stats
   */
  getStats: async () => {
    const response = await axiosInstance.get<StatsResponse>(
      API_CONFIG.SUBSCRIPTIONS.ADMIN_STATS
    )

    // Ưu tiên field data (nếu backend bọc), fallback trả map thô
    const payload = response.data || (response as any)
    return payload?.data ?? payload
  },

  /**
   * Kiểm tra trạng thái service
   * GET /api/v1/subscriptions/health
   */
  /**
   * Kiểm tra trạng thái service
   * NOTE: Sử dụng endpoint /plans làm proxy vì Gateway thiếu route /health
   */
  checkHealth: async () => {
    try {
      // Gọi getPlans để kiểm tra kết nối
      await axiosInstance.get(API_CONFIG.SUBSCRIPTIONS.PLANS)
      // Nếu thành công, trả về mock status UP
      return {
        success: true,
        message: 'Service is reachable',
        data: {
          alive: true,
          timestamp: new Date().toISOString()
        }
      } as HealthCheckResponse
    } catch (error) {
      throw error
    }
  },

  /**
   * Lấy subscription hiện tại của user
   * GET /api/v1/subscriptions/current
   */
  getCurrent: async () => {
    const response = await axiosInstance.get<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.CURRENT
    )
    return response.data || response
  },

  /**
   * Đăng ký gói mới
   * POST /api/v1/subscriptions
   */
  subscribe: async (planId: string) => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.SUBSCRIBE,
      { planId }
    )
    return response.data || response
  },

  /**
   * Hủy subscription hiện tại
   * POST /api/v1/subscriptions/cancel
   */
  cancel: async () => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.CANCEL
    )
    return response.data
  },

  /**
   * Lấy lịch sử đăng ký
   * GET /api/v1/subscriptions/history
   */
  getHistory: async () => {
    const response = await axiosInstance.get<UserSubscriptionsResponse>(
      API_CONFIG.SUBSCRIPTIONS.HISTORY
    )
    return response.data.data
  },

  /**
   * Lấy danh sách tính năng được phép dùng
   * GET /api/v1/subscriptions/features
   */
  getUserFeatures: async () => {
    const response = await axiosInstance.get<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.FEATURES
    )
    return response.data.data
  },

  /**
   * Kiểm tra quyền truy cập một tính năng
   * GET /api/v1/subscriptions/check?feature=NAME
   */
  checkFeature: async (feature: string) => {
    const response = await axiosInstance.get<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.CHECK_FEATURE,
      { params: { feature } }
    )
    return response.data.data
  },

  /**
   * Thống kê doanh thu theo thời gian
   * GET /subscriptions/stats/revenue-over-time?period=daily&days=30
   */
  getRevenueOverTime: async (params: RevenueOverTimeParams = { period: 'daily', days: 30 }) => {
    const response = await axiosInstance.get<RevenueOverTimeResponse>(
      API_CONFIG.SUBSCRIPTIONS.REVENUE_OVER_TIME,
      { params }
    )
    return response.data || response
  },

  /**
   * Tổng hợp doanh thu
   * GET /subscriptions/stats/total-revenue
   */
  getRevenueTotals: async () => {
    const response = await axiosInstance.get<RevenueTotalsResponse>(
      API_CONFIG.SUBSCRIPTIONS.REVENUE_TOTAL
    )
    return response.data || response
  },

  /**
   * Doanh thu theo gói
   * GET /subscriptions/stats/revenue-by-plan
   */
  getRevenueByPlan: async () => {
    const response = await axiosInstance.get<RevenueByPlanItem[] | { data: RevenueByPlanItem[] }>(
      API_CONFIG.SUBSCRIPTIONS.REVENUE_BY_PLAN
    )
    const payload: any = response.data || response
    return Array.isArray(payload) ? payload : payload.data
  },
}

export default subscriptionAPI
