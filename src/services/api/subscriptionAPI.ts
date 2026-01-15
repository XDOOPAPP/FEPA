import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== REQUEST TYPES ==========
export interface CreatePlanRequest {
  name: string
  price: number
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
  features: string[]
  isActive?: boolean
}

export interface UpdatePlanRequest {
  name?: string
  price?: number
  features?: string[]
  isActive?: boolean
}

// ========== RESPONSE TYPES ==========
export interface SubscriptionPlan {
  _id: string
  name: string
  price: number
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
  features: string[]
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

export interface StatsResponse {
  success: boolean
  message: string
  data: {
    totalPlans: number
    activeSubscriptions: number
    totalRevenue: number
    subscriptionsByPlan: Record<string, number>
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
    return response.data.data
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
    return response.data.data
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
    return response.data.data
  },

  /**
   * Vô hiệu hóa gói (Admin)
   * DELETE /api/v1/subscriptions/plans/:id
   */
  disablePlan: async (id: string) => {
    const response = await axiosInstance.delete<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.DELETE_PLAN(id)
    )
    return response.data
  },

  /**
   * Lấy thống kê subscriptions (Admin)
   * GET /api/v1/subscriptions/admin/stats
   */
  getStats: async () => {
    const response = await axiosInstance.get<StatsResponse>(
      API_CONFIG.SUBSCRIPTIONS.ADMIN_STATS
    )
    return response.data || response
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
    return response.data.data
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
   * Toggle auto-renewal
   * POST /api/v1/subscriptions/auto-renew
   */
  toggleAutoRenew: async () => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      API_CONFIG.SUBSCRIPTIONS.AUTO_RENEW
    )
    return response.data.data
  },
}

export default subscriptionAPI
