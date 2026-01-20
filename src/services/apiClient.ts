import axios, { type AxiosInstance, type AxiosError } from 'axios';
// Avoid using Ant Design's static `message.*` here because it may be
// invoked before React's `<App>`/theme context is mounted. Log errors
// instead and let UI components show notifications via `message.useMessage()`.
import { API_CONFIG } from '../config/api.config';

// Base API URL từ config tập trung
const API_BASE_URL = API_CONFIG.BASE_URL;

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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 401:
          console.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          break;
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
  }
);

export default apiClient;
