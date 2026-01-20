import axios from 'axios'

// Prefer going through API Gateway by default (port 3000).
// If you want to target the auth service directly, set `VITE_AUTH_SERVICE_URL` in .env.local
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://76.13.21.84:3000/api/v1'

const authServiceAxios = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
authServiceAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (unwrap data like axiosInstance)
authServiceAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error)
  }
)

export default authServiceAxios
