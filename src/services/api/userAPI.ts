/**
 * User Management API
 * CRUD và thao tác trạng thái người dùng
 */

import axiosInstance from './axiosInstance'

// ========== Types ==========
export type UserRole = 'ADMIN' | 'USER' | 'SUPER_ADMIN'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface UserFilters {
  search?: string
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE'
  role?: 'ALL' | 'ADMIN' | 'USER' | 'SUPER_ADMIN'
  verified?: 'ALL' | 'VERIFIED' | 'UNVERIFIED'
  page?: number
  pageSize?: number
}

export interface PaginatedUsersResponse {
  success: boolean
  data: User[]
  total: number
  page: number
  pageSize: number
}

export interface SimpleResponse {
  success: boolean
  message?: string
}

// ========== API Functions ==========

/**
 * GET /auth/users
 */
export const getUsers = async (filters?: UserFilters): Promise<PaginatedUsersResponse> => {
  const params: Record<string, string | number> = {}
  if (filters?.search) params.search = filters.search
  if (filters?.status && filters.status !== 'ALL') params.status = filters.status
  if (filters?.role && filters.role !== 'ALL') params.role = filters.role
  if (filters?.verified && filters.verified !== 'ALL') params.verified = filters.verified
  if (filters?.page) params.page = filters.page
  if (filters?.pageSize) params.pageSize = filters.pageSize

  // axiosInstance đã unwrap response.data, nên trả thẳng payload
  return await axiosInstance.get<PaginatedUsersResponse>('/auth/users', { params })
}

/**
 * PATCH /auth/users/:userId/deactivate
 */
export const deactivateUser = async (userId: string): Promise<SimpleResponse> => {
  return await axiosInstance.patch<SimpleResponse>(`/auth/users/${userId}/deactivate`)
}

/**
 * PATCH /auth/users/:userId/reactivate
 */
export const reactivateUser = async (userId: string): Promise<SimpleResponse> => {
  return await axiosInstance.patch<SimpleResponse>(`/auth/users/${userId}/reactivate`)
}

/**
 * DELETE /auth/users/:userId
 */
export const deleteUser = async (userId: string): Promise<SimpleResponse> => {
  return await axiosInstance.delete<SimpleResponse>(`/auth/users/${userId}`)
}

export const userAPI = {
  getUsers,
  deactivateUser,
  reactivateUser,
  deleteUser,
}

export default userAPI
