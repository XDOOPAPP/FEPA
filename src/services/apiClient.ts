import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
// Avoid using Ant Design's static `message.*` here because it may be
// invoked before React's `<App>`/theme context is mounted. Log errors
// instead and let UI components show notifications via `message.useMessage()`.
import { API_CONFIG } from '../config/api.config';

// Base API URL từ config tập trung
const API_BASE_URL = API_CONFIG.BASE_URL;

// Avoid concurrent refresh storms
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
};

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle errors & auto refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 with refresh flow
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) return reject(error);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const payload: any = refreshResponse.data?.data || refreshResponse.data || {};
        const newAccessToken: string | undefined = payload.accessToken || refreshResponse.data?.accessToken;
        const newRefreshToken: string | undefined = payload.refreshToken || refreshResponse.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error('No accessToken returned from refresh endpoint');
        }

        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        processQueue(newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(null);
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Other errors
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 403:
          console.error('Bạn không có quyền thực hiện thao tác này.');
          break;
        case 404:
          console.error('Không tìm thấy dữ liệu.');
          break;
        case 500:
          console.error('Lỗi máy chủ. Vui lòng thử lại sau.');
          break;
        default:
          console.error(data?.message || 'Đã có lỗi xảy ra.');
      }
    } else if (error.request) {
      console.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      console.error('Đã có lỗi xảy ra.');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
