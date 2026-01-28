import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== REQUEST TYPES ==========
export interface LoginRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

// ========== API SERVICE ==========
const authAPI = {
  /**
   * Đăng nhập - POST /auth/login
   */
  login: async (data: LoginRequest) => {
    console.log('🔐 Calling login API with:', { email: data.email })
    const res = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, data)
    console.log('🔐 Login API response:', res)
    return res
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: async () => {
    return await axiosInstance.get(API_CONFIG.AUTH.GET_USER)
  },

  /**
   * Quên mật khẩu - gửi OTP
   */
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return await axiosInstance.post(API_CONFIG.AUTH.FORGOT_PASSWORD, data)
  },

  /**
   * Đặt lại mật khẩu
   */
  resetPassword: async (data: ResetPasswordRequest) => {
    return await axiosInstance.post(API_CONFIG.AUTH.RESET_PASSWORD, data)
  },

  /**
   * Verify token
   */
  verifyToken: async () => {
    return await axiosInstance.post('/auth/verify')
  },

  /**
   * Logout
   */
  logout: async () => {
    return await axiosInstance.post('/auth/logout')
  },

  /**
   * Register
   */
  register: async (data: any) => {
    return await axiosInstance.post(API_CONFIG.AUTH.REGISTER, data)
  }
}

export default authAPI
