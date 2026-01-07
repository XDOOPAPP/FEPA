/**
 * Storage utility for managing tokens in localStorage
 * Quản lý token trong localStorage
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const storage = {
  // Lưu access token
  setAccessToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Lấy access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Lưu refresh token
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // Lấy refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Lưu cả 2 tokens cùng lúc
  setTokens: (accessToken: string, refreshToken: string): void => {
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
  },

  // Lưu thông tin user
  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Lấy thông tin user
  getUser: (): any | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Xóa tất cả (khi logout)
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Kiểm tra đã login chưa
  isAuthenticated: (): boolean => {
    return !!storage.getAccessToken();
  }
};
