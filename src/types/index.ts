// Type definitions
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
  // changePassword removed for admin UI
}

// Export blog types
export * from './blog'
export * from './blog';
export * from './notification';