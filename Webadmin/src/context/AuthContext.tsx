import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from sessionStorage on mount - only if authenticated
  // sessionStorage tự động xóa khi đóng tab/browser
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUser = sessionStorage.getItem('user');
    
    // Only restore user if both flags exist
    if (isAuthenticated && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Clear invalid data
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isAuthenticated');
      }
    } else {
      // Clear incomplete data
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('isAuthenticated');
    }
    
    setLoading(false);
  }, []);

  // Temporary login with hardcoded credentials
  // TODO: Replace with real API call when backend is ready
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Hardcoded admin accounts for testing
    const validAccounts = [
      { email: 'admin@fepa.com', password: 'admin123', name: 'Admin FEPA' },
      { email: 'admin@gmail.com', password: '123456', name: 'Administrator' },
      { email: 'test@admin.com', password: 'test123', name: 'Test Admin' }
    ];
    
    // Check credentials
    const account = validAccounts.find(
      acc => acc.email === email && acc.password === password
    );
    
    if (!account) {
      setLoading(false);
      throw new Error('Email hoặc mật khẩu không đúng!');
    }
    
    // Create admin user data
    const fakeUser: User = {
      id: 'admin-' + Date.now(),
      email: account.email,
      fullName: account.name,
      role: 'admin',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=667eea&color=fff`
    };
    
    // Save to state and sessionStorage (auto-clear on tab close)
    setUser(fakeUser);
    sessionStorage.setItem('user', JSON.stringify(fakeUser));
    sessionStorage.setItem('isAuthenticated', 'true');
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    // Clear session authentication
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
    // Keep localStorage data (users, expenses, etc.) for next session
    // Only clear if user explicitly wants to clear all data
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
