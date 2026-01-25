import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '../../config/api.config'
import { sanitizeObjectKeys } from '../../utils/security'

const API_BASE_URL = API_CONFIG.BASE_URL

let isRefreshing = false
let refreshQueue: Array<(token: string | null) => void> = []

const processQueue = (token: string | null) => {
  refreshQueue.forEach((resolve) => resolve(token))
  refreshQueue = []
}

const clearAuthState = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  sessionStorage.removeItem('user')
}

const redirectToLogin = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/verify-otp') ||
      config.url?.includes('/auth/forgot-password') ||
      config.url?.includes('/auth/reset-password')

    if (!isAuthEndpoint) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    const csrfToken = sessionStorage.getItem('csrf-token')
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }

    if (config.data && typeof config.data === 'object') {
      config.data = sanitizeObjectKeys(config.data)
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        clearAuthState()
        redirectToLogin()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) return reject(error)
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const payload: any = refreshResponse.data?.data ?? refreshResponse.data ?? {}
        const newAccessToken: string | undefined = payload.accessToken
        const newRefreshToken: string | undefined = payload.refreshToken

        if (!newAccessToken) {
          throw new Error('No accessToken returned from refresh endpoint')
        }

        localStorage.setItem('accessToken', newAccessToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        processQueue(newAccessToken)
        isRefreshing = false

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(null)
        isRefreshing = false
        clearAuthState()
        redirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    const errorMessage = (error.response?.data as any)?.message || error.message || 'Đã xảy ra lỗi'
    const errorDetails = {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    }

    return Promise.reject(errorDetails)
  }
)

export default axiosInstance
