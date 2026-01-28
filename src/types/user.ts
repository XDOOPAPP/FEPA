/**
 * User Type Definitions
 */

export interface User {
  id: string
  email: string
  fullName: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  avatar?: string
  isVerified?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AdminUser extends User {
  role: 'ADMIN' | 'SUPER_ADMIN'
}

export interface UserFilters {
  search?: string
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE'
  role?: 'ALL' | 'ADMIN' | 'USER' | 'SUPER_ADMIN'
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserStatsResponse {
  total: number
  active: number
  inactive: number
  verified: number
  admin: number
  user: number
}

export interface UsersOverTimeResponse {
  period: string
  count: number
  date?: string
}

export interface RegisterAdminRequest {
  email: string
  fullName: string
  password: string
}
