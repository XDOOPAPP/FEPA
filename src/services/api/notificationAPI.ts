import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'
import type { NotificationListResponse, NotificationFilters } from '../../types/notification'

export const notificationAPI = {
  /**
   * Tạo thông báo mới (Admin only)
   */
  createNotification: async (data: {
    title: string
    message: string
    type?: string
    target: 'ALL' | 'ADMINS'
  }) => {
    const response = await axiosInstance.post(API_CONFIG.NOTIFICATIONS.CREATE, data)
    return response
  },

  /**
   * Lấy danh sách thông báo với filter/pagination
   * Theo API doc: Backend trả về array trực tiếp [{...}, {...}]
   */
  getNotifications: async (params: NotificationFilters): Promise<NotificationListResponse> => {
    // Convert frontend pagination params to backend params
    const queryParams: Record<string, any> = {}
    
    if (params.page !== undefined) queryParams.page = params.page
    if (params.limit !== undefined) queryParams.limit = params.limit
    if (params.unreadOnly !== undefined) queryParams.unreadOnly = params.unreadOnly ? 'true' : undefined
    if (params.search) queryParams.search = params.search
    
    const response = await axiosInstance.get(API_CONFIG.NOTIFICATIONS.LIST, { params: queryParams })
    console.log('🔔 Notification API Response:', response)
    console.log('🔔 Response type:', typeof response, Array.isArray(response) ? '(Array)' : '')
    
    // Theo API doc: Backend trả về array trực tiếp
    if (Array.isArray(response)) {
      console.log('🔔 Backend returned array directly (expected format)')
      return {
        notifications: response,
        pagination: {
          total: response.length,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }
    }
    
    // Fallback: nếu response không phải array
    console.warn('🔔 Unexpected response format (not array), returning empty')
    return {
      notifications: [],
      pagination: {
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
      },
    }
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get(API_CONFIG.NOTIFICATIONS.UNREAD_COUNT)
    // API trả về { count: number }
    if (typeof response === 'object' && response !== null && 'count' in response) {
      return (response as { count: number }).count
    }
    return Number(response) || 0
  },

  /**
   * Đánh dấu đã đọc một thông báo
   */
  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.post(API_CONFIG.NOTIFICATIONS.READ(id))
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.post(API_CONFIG.NOTIFICATIONS.READ_ALL)
  },

  /**
   * Xóa một thông báo
   */
  deleteNotification: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.NOTIFICATIONS.DELETE(id))
  },

  /**
   * Xóa toàn bộ thông báo
   */
  deleteAll: async (): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.NOTIFICATIONS.DELETE_ALL)
  },
}

export default notificationAPI
