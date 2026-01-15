/**
 * API Configuration - Tập trung quản lý tất cả URLs và Endpoints
 * Một nơi duy nhất để thay đổi URL mà không cần sửa ở khắp mọi nơi
 */

// ========== BASE URLs ==========
const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://10.74.11.14:3000/api/v1'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

// ========== API ENDPOINTS ==========
export const API_CONFIG = {
  // Base URLs
  BASE_URL,
  SOCKET_URL,

  // ===== AUTH ENDPOINTS =====
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY: '/auth/verify',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },

  // ===== SUBSCRIPTION ENDPOINTS =====
  SUBSCRIPTIONS: {
    // Public - Plans
    PLANS: '/subscriptions/plans',                                    // GET
    PLAN_DETAIL: (id: string) => `/subscriptions/plans/${id}`,        // GET
    HEALTH: '/subscriptions/health',                                  // GET
    
    // User (requires x-user-id)
    CURRENT: '/subscriptions/current',                                // GET
    SUBSCRIBE: '/subscriptions',                                      // POST
    CANCEL: '/subscriptions/cancel',                                  // POST
    HISTORY: '/subscriptions/history',                                // GET
    FEATURES: '/subscriptions/features',                              // GET
    CHECK_FEATURE: '/subscriptions/check',                            // GET ?feature=NAME
    
    // Admin - Plans Management
    CREATE_PLAN: '/subscriptions/plans',                              // POST
    UPDATE_PLAN: (id: string) => `/subscriptions/plans/${id}`,        // PATCH
    DELETE_PLAN: (id: string) => `/subscriptions/plans/${id}`,        // DELETE
    ADMIN_STATS: '/subscriptions/admin/stats',                        // GET
  },

  // ===== BUDGET ENDPOINTS =====
  BUDGETS: {
    LIST: '/budgets',
    DETAIL: (id: string) => `/budgets/${id}`,
    PROGRESS: (id: string) => `/budgets/${id}/progress`,
  },

  // ===== CATEGORY ENDPOINTS =====
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
  },

  // ===== EXPENSE ENDPOINTS =====
  EXPENSES: {
    LIST: '/expenses',
    DETAIL: (id: string) => `/expenses/${id}`,
    BY_DATE_RANGE: '/expenses/by-date-range',
    BY_CATEGORY: (category: string) => `/expenses/by-category/${category}`,
  },

  // ===== BLOG ENDPOINTS =====
  BLOGS: {
    LIST: '/blogs',
    DETAIL: (id: string) => `/blogs/${id}`,
    BY_SLUG: (slug: string) => `/blogs/${slug}`,
  },

  // ===== NOTIFICATION ENDPOINTS =====
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // ===== SYSTEM ENDPOINTS =====
  SYSTEM: {
    SETTINGS: '/system/settings',
    HEALTH: '/system/health',
  },
}

export default API_CONFIG
