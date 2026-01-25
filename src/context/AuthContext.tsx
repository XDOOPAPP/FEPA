import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import { authAPI } from '../services/api';

// Helper function to decode JWT token
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Failed to parse JWT:', error);
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from sessionStorage on mount - only if authenticated
  // sessionStorage tự động xóa khi đóng tab/browser
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const storedUser = sessionStorage.getItem('user');

    // Only restore user if both token and user exist
    if (accessToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Optionally verify token with backend
        authAPI.getCurrentUser()
          .then(response => {
            console.log('✅ getCurrentUser response:', response);
            // Response from auth-service could be direct user object or wrapped
            const userData = response.user || response;
            if (userData?.email) {
              const userProfile: User = {
                id: userData.id || userData._id,
                email: userData.email,
                fullName: userData.fullName,
                role: userData.role || 'ADMIN',
                avatar: userData.avatar || parsedUser.avatar
              };
              setUser(userProfile);
              sessionStorage.setItem('user', JSON.stringify(userProfile));
              console.log('✅ User verified successfully');
            } else {
              console.error('❌ No user data in response');
              logout();
            }
          })
          .catch(error => {
            // Token invalid, clear everything
            console.error('❌ getCurrentUser failed:', error);
            logout();
          });
      } catch (error) {
        // Clear invalid data
        logout();
      }
    }

    setLoading(false);
  }, []);

  // Real API login
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    try {
      console.log('🔐 Login attempt:', { email });

      // Call real auth API
      const response = await authAPI.login({ email, password });
      console.log('✅ Full login response:', JSON.stringify(response, null, 2));

      // Response structure from auth-service: { accessToken, refreshToken, user: {...} }
      // Check if this is the direct response (not wrapped in success/message)
      let accessToken, refreshToken, userData;

      // Handle different response formats
      const responseAny = response as any;
      if (responseAny?.accessToken) {
        // Direct format: { accessToken, refreshToken, user }
        accessToken = responseAny.accessToken;
        refreshToken = responseAny.refreshToken;
        userData = responseAny.user;
      } else if (response?.data?.accessToken) {
        // Wrapped format: { data: { accessToken, refreshToken, user } }
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        userData = response.data.user;
      }

      console.log('🔐 Extracted tokens:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData,
        tokenPreview: accessToken ? accessToken.substring(0, 30) + '...' : 'N/A'
      });

      // Save tokens FIRST before anything else
      if (accessToken) {
        console.log('💾 Saving accessToken to localStorage (PRIORITY)');
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        console.log('💾 Saving refreshToken to localStorage');
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Validate tokens and user data exist
      if (!userData) {
        console.log('❌ No user in login response, fetching from /auth/me');

        // Try to fetch user info from /auth/me endpoint
        try {
          const userResponse = await authAPI.getCurrentUser();
          console.log('✅ getCurrentUser response:', userResponse);

          // Extract user data
          userData = userResponse.user || userResponse;

          if (!userData?.email) {
            throw new Error('No user email found in response');
          }
        } catch (userFetchError: any) {
          console.error('❌ Failed to fetch user info:', userFetchError);
          
          // Fallback: Decode JWT token to get basic user info
          console.log('🔄 Attempting to decode JWT token as fallback...');
          const decodedToken = parseJwt(accessToken);
          
          if (decodedToken && decodedToken.userId) {
            // Create user object from JWT payload
            userData = {
              id: decodedToken.userId,
              email: decodedToken.email || 'admin@fepa.com',
              fullName: decodedToken.fullName || 'Admin',
              role: decodedToken.role || 'ADMIN',
              avatar: decodedToken.avatar || null,
            };
            console.log('✅ Successfully decoded user from JWT:', userData);
          } else {
            // Clear tokens if we can't get user info at all
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw new Error('Không thể lấy thông tin người dùng từ token');
          }
        }
      }

      // Create user object with required fields (tokens already saved above)
      const userProfile: User = {
        id: userData.id || userData._id,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || 'ADMIN',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=1890ff&color=fff`
      };

      // Save to both state and sessionStorage
      console.log('👤 Setting user state:', userProfile);
      setUser(userProfile);
      sessionStorage.setItem('user', JSON.stringify(userProfile));

      console.log('✅ Login successful');
      console.log('📦 Verification - localStorage:', {
        accessToken: localStorage.getItem('accessToken') ? 'SET (' + localStorage.getItem('accessToken')!.substring(0, 30) + '...)' : 'NOT SET',
        refreshToken: localStorage.getItem('refreshToken') ? 'SET' : 'NOT SET',
        user: sessionStorage.getItem('user') ? 'SET' : 'NOT SET'
      });
      console.log('👤 Verification - User:', userProfile);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      // Error từ axios interceptor có format { message, status } hoặc là Error object
      const errorMessage = error?.message || error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
      console.error('❌ Full login error:', error);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear all authentication data
    sessionStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // changePassword removed for admin users

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
    updateProfile,
    // changePassword intentionally omitted
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
