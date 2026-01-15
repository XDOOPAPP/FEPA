import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

// ========== REQUEST TYPES ==========
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string  // Backend dùng fullName thay vì firstName/lastName
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

// ========== RESPONSE TYPES ==========
export interface AuthResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      email: string
      fullName: string
      isVerified: boolean
    }
  }
}

// ========== API FUNCTIONS ==========
const authAPI = {
  /**
   * Đăng nhập - POST /auth/login
   * Trả về accessToken, refreshToken và thông tin user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>(API_CONFIG.AUTH.LOGIN, data)
    return res
  },

  /**
   * Đăng ký - POST /auth/register
   * Backend sẽ tự động gửi OTP qua email
   */
  register: async (data: RegisterRequest): Promise<any> => {
    return axiosInstance.post(API_CONFIG.AUTH.REGISTER, data)
  },

  /**
   * Xác thực OTP sau khi đăng ký - POST /auth/verify-otp
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<any> => {
    return axiosInstance.post(API_CONFIG.AUTH.VERIFY_OTP, data)
  },

  /**
   * Gửi OTP để reset password - POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<any> => {
    return axiosInstance.post(API_CONFIG.AUTH.FORGOT_PASSWORD, data)
  },

  /**
   * Reset password với OTP - POST /auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<any> => {
    return axiosInstance.post(API_CONFIG.AUTH.RESET_PASSWORD, data)
  },

  /**
   * Verify token - POST /auth/verify
   */
  verifyToken: async (): Promise<any> => {
    return axiosInstance.post(API_CONFIG.AUTH.VERIFY)
  },

  /**
   * Lấy thông tin user hiện tại - GET /auth/me
   */
  getCurrentUser: async (): Promise<any> => {
    return axiosInstance.get(API_CONFIG.AUTH.ME)
  },

  /**
   * Refresh token - POST /auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<any> => {
    return axiosInstance.post('/auth/refresh', { refreshToken })
  },

  /**
   * Health check - GET /auth/health
   */
  healthCheck: async (): Promise<any> => {
    return axiosInstance.get('/auth/health')
  },
}

export default authAPI
