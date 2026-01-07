// Type definitions
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'user' | 'admin') => Promise<void>
  logout: () => void;
  loading: boolean;
  updateProfile?: (data: Partial<User>) => void;
}
