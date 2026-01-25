import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== RESPONSE TYPES ==========
export interface BudgetAdminStats {
  totalBudgets: number
  totalAmount: number
  totalSpent: number
  totalUsers?: number // Số người dùng có budget
  averageBudgetAmount: number
  categoriesBreakdown: {
    [key: string]: {
      count: number
      totalAmount: number
    }
  }
  periodBreakdown: {
    MONTHLY: number
    WEEKLY: number
    YEARLY: number
  }
  statusBreakdown: {
    ON_TRACK: number
    AT_RISK: number
    EXCEEDED: number
  }
}

export interface BudgetStatsResponse {
  success?: boolean
  message?: string
  data?: BudgetAdminStats
}

// ========== API FUNCTIONS ==========
const budgetAPI = {
  /**
   * Lấy thống kê budget toàn hệ thống (Admin)
   * GET /api/v1/budgets/admin/stats
   */
  getAdminStats: async () => {
    const response = await axiosInstance.get<BudgetStatsResponse>(
      '/budgets/admin/stats' // Fixed: direct path
    )
    
    // Normalize response
    const payload = response.data || (response as any)
    return payload?.data ?? payload
  },
}

export default budgetAPI
