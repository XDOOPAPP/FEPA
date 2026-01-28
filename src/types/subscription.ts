/**
 * Subscription Type Definitions
 */

export interface SubscriptionPlan {
  _id: string
  name: string
  price: number
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
  features: {
    OCR: boolean
    AI: boolean
  }
  isFree?: boolean
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSubscription {
  _id: string
  userId: string
  planId: string
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  startDate: string
  endDate: string
  autoRenew: boolean
  plan?: SubscriptionPlan
  createdAt: string
  updatedAt: string
}

export interface SubscriptionResponse {
  success: boolean
  message?: string
  subscription?: UserSubscription
  data?: UserSubscription
}

export interface SubscriptionStats {
  totalRevenue: number
  activeSubscriptions?: number
  cancelledSubscriptions?: number
  totalSubscriptions?: number
}

export interface RevenueByPlanItem {
  plan: string
  revenue: number
  count?: number
}

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
