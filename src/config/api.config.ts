/**
 * API Configuration - Tập trung quản lý tất cả URLs và Endpoints
 * Một nơi duy nhất để thay đổi URL mà không cần sửa ở khắp mọi nơi
 */

// ========== BASE URLs ==========
const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://76.13.21.84:3000/api/v1'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://76.13.21.84:3000'

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
    // Expense service exposes categories under /expenses/categories
    LIST: '/expenses/categories',
    DETAIL: (id: string) => `/expenses/categories/${id}`,
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
    LIST: '/blogs',                                                   // GET - with query params
    DETAIL: (id: string) => `/blogs/${id}`,                           // GET
    APPROVE: (id: string) => `/blogs/${id}/approve`,                  // POST
    REJECT: (id: string) => `/blogs/${id}/reject`,                    // POST
  },

  // ===== NOTIFICATION ENDPOINTS =====
  NOTIFICATIONS: {
    LIST: '/notifications',
    CREATE: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    DELETE_ALL: '/notifications',
    STREAM: '/notifications/stream', // Optional SSE endpoint
  },

  // ===== SYSTEM ENDPOINTS =====
  SYSTEM: {
    SETTINGS: '/system/settings',
    HEALTH: '/system/health',
  },
}

export default API_CONFIG
