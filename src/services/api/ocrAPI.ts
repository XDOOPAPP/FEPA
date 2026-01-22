import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== RESPONSE TYPES ==========
export interface OcrAdminStats {
  totalJobs: number
  totalUsers: number
  successfulScans?: number
  failedScans?: number
  successRate?: number
  averageProcessingTime?: number
  typeBreakdown?: {
    RECEIPT: number
    QR_CODE: number
  }
}

export interface OcrStatsResponse {
  success?: boolean
  message?: string
  data?: OcrAdminStats
}

// ========== API FUNCTIONS ==========
const ocrAPI = {
  /**
   * Lấy thống kê OCR toàn hệ thống (Admin)
   * GET /api/v1/ocr/admin/stats
   */
  getAdminStats: async () => {
    const response = await axiosInstance.get<OcrStatsResponse>(
      '/ocr/admin/stats'
    )
    
    // Normalize response
    const payload = response.data || (response as any)
    return payload?.data ?? payload
  },
}

export default ocrAPI
