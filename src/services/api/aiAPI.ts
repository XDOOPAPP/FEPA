import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== RESPONSE TYPES ==========
export interface AiAdminStats {
  totalRequests?: number
  totalUsers?: number
  successfulRequests?: number
  failedRequests?: number
  successRate?: number
  averageProcessingTime?: number
  requestsByType?: {
    [key: string]: number
  }
}

export interface AiStatsResponse {
  success?: boolean
  message?: string
  data?: AiAdminStats
}

// ========== API FUNCTIONS ==========
const aiAPI = {
  /**
   * Lấy thống kê AI toàn hệ thống (Admin)
   * GET /api/v1/ai/admin/stats
   */
  getAdminStats: async () => {
    const response = await axiosInstance.get<AiStatsResponse>(
      API_CONFIG.AI.ADMIN_STATS
    )
    
    // Normalize response
    const payload = response.data || (response as any)
    return payload?.data ?? payload
  },
}

export default aiAPI
