import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import authAPI from '../services/api/authAPI'
import { decodeJWT } from '../utils/jwtDecode'

export interface User {
  id?: string
  _id?: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  role?: 'ADMIN' | 'USER' | 'SUPER_ADMIN'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verify token on mount and restore user
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken')
      const savedUser = localStorage.getItem('user')
      
      if (token) {
        try {
          const response = await authAPI.verifyToken()
          const userData = response.data?.user || response.user
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          console.log('Token verification failed, clearing storage')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          setUser(null)
        }
      } else if (savedUser) {
        // Restore user from localStorage if token exists
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    verifyToken()
  }, [])
  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    
    const token = response.accessToken || response.data?.accessToken
    
    // Decode JWT to get user info
    const decodedToken = decodeJWT(token)
    
    const userData: User = {
      _id: decodedToken?.userId || decodedToken?._id,
      email: email,
      role: decodedToken?.role || 'USER',
    }
    
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', response.refreshToken || '')
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await authAPI.register({ firstName, lastName, email, password })
    console.log('🔐 Raw register response:', response)
    
    const token = response.accessToken || response.data?.accessToken
    const decodedToken = decodeJWT(token)
    
    const userData: User = {
      _id: decodedToken?.userId || decodedToken?._id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: decodedToken?.role || 'USER',
    }
    
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', response.refreshToken || '')
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.log('Logout error:', error)
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
