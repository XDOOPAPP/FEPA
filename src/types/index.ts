/**
 * Central Export Point for All Types
 */

// ========== Auth & User Types ==========
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'USER' | 'ADMIN') => Promise<void>
  logout: () => void;
  loading: boolean;
  updateProfile?: (data: Partial<User>) => void;
}

// ========== Feature Types ==========
export * from './blog'
export * from './notification'
export * from './user'
export * from './subscription'
export * from './payment'
export * from './analytics'
export * from './category'
