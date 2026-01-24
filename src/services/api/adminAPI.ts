/**
 * Admin Management API
 * Quản lý tài khoản admin: tạo admin mới, liệt kê danh sách admin
 */

import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== Types ==========
export interface RegisterAdminRequest {
  email: string
  fullName: string
  password: string
}

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RegisterAdminResponse {
  success: boolean
  message: string
  data?: AdminUser
}

export interface GetAllAdminsResponse {
  success: boolean
  data: AdminUser[]
  total: number
}

// ========== API Functions ==========

/**
 * Đăng ký admin mới
 * POST /auth/register-admin
 */
export const registerAdmin = async (data: RegisterAdminRequest): Promise<RegisterAdminResponse> => {
  try {
    const response = await axiosInstance.post<RegisterAdminResponse>(
      `${API_CONFIG.BASE_URL}/auth/register-admin`,
      data
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to register admin')
  }
}

/**
 * Lấy danh sách tất cả admin
 * GET /auth/all-admin
 */
export const getAllAdmins = async (): Promise<GetAllAdminsResponse> => {
  try {
    const response = await axiosInstance.get<GetAllAdminsResponse>(
      `${API_CONFIG.BASE_URL}/auth/all-admin`
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admins')
  }
}

// ========== Export ==========
export const adminAPI = {
  registerAdmin,
  getAllAdmins,
}

export default adminAPI
