/**
 * Authentication & Authorization Utilities
 */

import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  userId: string
  email: string
  role: 'ADMIN' | 'USER' | 'admin' | 'user'
  iat?: number
  exp?: number
}

/**
 * Kiểm tra xem có access token trong localStorage không
 */
export const hasAccessToken = (): boolean => {
  const token = localStorage.getItem('accessToken')
  return !!token
}

/**
 * Lấy access token từ localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

/**
 * Decode JWT token và lấy payload
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token)
  } catch (error) {
    console.error('❌ Failed to decode token:', error)
    return null
  }
}

/**
 * Kiểm tra xem token có hết hạn không
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Date.now() / 1000 // Convert to seconds
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

/**
 * Kiểm tra xem user có role ADMIN không
 */
export const isAdmin = (token?: string): boolean => {
  try {
    const accessToken = token || getAccessToken()
    if (!accessToken) return false
    
    const decoded = decodeToken(accessToken)
    if (!decoded) return false
    
    // Support both uppercase and lowercase role
    return decoded.role === 'ADMIN' || decoded.role === 'admin'
  } catch (error) {
    console.error('❌ Failed to check admin role:', error)
    return false
  }
}

/**
 * Lấy thông tin user từ token
 */
export const getUserFromToken = (token?: string): JWTPayload | null => {
  try {
    const accessToken = token || getAccessToken()
    if (!accessToken) return null
    
    return decodeToken(accessToken)
  } catch (error) {
    console.error('❌ Failed to get user from token:', error)
    return null
  }
}

/**
 * Validate token (check if exists, not expired, and has admin role for admin endpoints)
 */
export const validateAdminToken = (): { 
  valid: boolean
  error?: string 
  token?: string
  user?: JWTPayload 
} => {
  const token = getAccessToken()
  
  if (!token) {
    return { 
      valid: false, 
      error: 'No access token found in localStorage' 
    }
  }
  
  if (isTokenExpired(token)) {
    return { 
      valid: false, 
      error: 'Access token has expired',
      token 
    }
  }
  
  const user = decodeToken(token)
  if (!user) {
    return { 
      valid: false, 
      error: 'Failed to decode token',
      token 
    }
  }
  
  if (!isAdmin(token)) {
    return { 
      valid: false, 
      error: 'User does not have ADMIN role',
      token,
      user 
    }
  }
  
  return { 
    valid: true, 
    token,
    user 
  }
}

/**
 * Log token info for debugging
 */
export const debugToken = (): void => {
  const token = getAccessToken()
  
  if (!token) {
    console.warn('🔐 No access token found')
    return
  }
  
  console.group('🔐 Token Debug Info')
  console.log('Token exists:', !!token)
  console.log('Token length:', token.length)
  
  const decoded = decodeToken(token)
  if (decoded) {
    console.log('User ID:', decoded.userId)
    console.log('Email:', decoded.email)
    console.log('Role:', decoded.role)
    console.log('Issued at:', decoded.iat ? new Date(decoded.iat * 1000).toISOString() : 'N/A')
    console.log('Expires at:', decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'N/A')
    console.log('Is expired:', isTokenExpired(token))
    console.log('Is admin:', isAdmin(token))
  } else {
    console.error('Failed to decode token')
  }
  
  console.groupEnd()
}
