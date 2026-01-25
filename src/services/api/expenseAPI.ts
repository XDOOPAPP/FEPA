import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== RESPONSE TYPES ==========
export interface ExpenseAdminStats {
  totalExpenses: number
  totalAmount: number
  totalUsers: number
  byCategory: {
    category: string
    total: number
    count: number
  }[]
  recentExpenses: {
    id: string
    userId: string
    description: string
    amount: number
    category: string
    spentAt: string
    createdAt: string
  }[]
}

export interface ExpenseStatsResponse {
  success?: boolean
  message?: string
  data?: ExpenseAdminStats
}

// ========== API FUNCTIONS ==========
const expenseAPI = {
  /**
   * Lấy thống kê expense toàn hệ thống (Admin)
   * GET /api/v1/expenses/admin/stats
   */
  getAdminStats: async () => {
    const response = await axiosInstance.get<ExpenseStatsResponse>(
      '/expenses/admin/stats' // Fixed: direct path without API_CONFIG
    )
    
    // Normalize response
    const payload = response.data || (response as any)
    return payload?.data ?? payload
  },
}

export default expenseAPI
