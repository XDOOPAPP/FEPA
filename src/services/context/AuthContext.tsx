import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import authAPI from '../api/authAPI'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
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

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await authAPI.verifyToken()
          setUser(response.user)
        } catch (error) {
          console.log('Token verification failed, clearing storage')
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setLoading(false)
    }
    verifyToken()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    localStorage.setItem('token', response.token)
    setUser(response.user)
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await authAPI.register({ firstName, lastName, email, password })
    localStorage.setItem('token', response.token)
    setUser(response.user)
  }

  const logout = async () => {
    await authAPI.logout()
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
