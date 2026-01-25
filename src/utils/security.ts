/**
 * Security Utilities - Input Sanitization & Validation
 * Chống XSS, SQL Injection, và các threats khác
 */

/**
 * Sanitize HTML để chống XSS
 * Loại bỏ các thẻ HTML và script tags nguy hiểm
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return ''
  
  // Replace các ký tự đặc biệt HTML
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize input cho search queries
 * Loại bỏ các ký tự đặc biệt có thể gây SQL injection (nếu backend không validate)
 */
export const sanitizeSearchInput = (input: string): string => {
  if (!input) return ''
  
  // Loại bỏ các ký tự đặc biệt nguy hiểm
  return input
    .replace(/[<>{}()[\]]/g, '')
    .replace(/['";]/g, '')
    .trim()
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Ít nhất 8 ký tự, có chữ hoa, chữ thường, số
 */
export const isStrongPassword = (password: string): boolean => {
  if (!password || password.length < 8) return false
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return hasUpperCase && hasLowerCase && hasNumber
}

/**
 * Sanitize file name để chống path traversal
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return ''
  
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Chỉ giữ ký tự an toàn
    .replace(/\.\./g, '') // Loại bỏ ..
    .substring(0, 255) // Giới hạn độ dài
}

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false
  
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

/**
 * Sanitize object keys để chống prototype pollution
 */
export const sanitizeObjectKeys = <T extends Record<string, any>>(obj: T): T => {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype']
  
  const sanitized: any = {}
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (!dangerousKeys.includes(key)) {
        sanitized[key] = obj[key]
      }
    }
  }
  
  return sanitized
}

/**
 * Escape regex special characters
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Validate số điện thoại Việt Nam
 */
export const isValidVietnamesePhone = (phone: string): boolean => {
  if (!phone) return false
  
  // Format: 0XXXXXXXXX (10 số) hoặc +84XXXXXXXXX
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Rate limiting helper (client-side)
 * Giới hạn số lần gọi API trong khoảng thời gian
 */
export const createRateLimiter = (maxCalls: number, timeWindow: number) => {
  const callTimestamps: number[] = []
  
  return () => {
    const now = Date.now()
    
    // Loại bỏ các calls cũ ngoài time window
    while (callTimestamps.length > 0 && callTimestamps[0] < now - timeWindow) {
      callTimestamps.shift()
    }
    
    // Kiểm tra rate limit
    if (callTimestamps.length >= maxCalls) {
      return false // Đã vượt giới hạn
    }
    
    callTimestamps.push(now)
    return true // Cho phép
  }
}

export default {
  sanitizeHtml,
  sanitizeSearchInput,
  isValidEmail,
  isStrongPassword,
  sanitizeFileName,
  isValidUrl,
  sanitizeObjectKeys,
  escapeRegex,
  isValidVietnamesePhone,
  createRateLimiter,
}
