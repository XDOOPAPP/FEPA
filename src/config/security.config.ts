/**
 * Content Security Policy Configuration
 * Thêm vào index.html hoặc config server để chống XSS
 */

export const CSP_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob:;
  connect-src 'self' http://76.13.21.84:3000 http://76.13.21.84:3102 ws://76.13.21.84:3102;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s+/g, ' ').trim()

/**
 * Security Headers recommendations
 * Cần config ở server/nginx/CDN level
 */
export const SECURITY_HEADERS = {
  // Chống clickjacking
  'X-Frame-Options': 'DENY',
  
  // Chống XSS
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  
  // HTTPS only
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  
  // CSP
  'Content-Security-Policy': CSP_POLICY,
}

/**
 * Secure token storage strategies
 */
export const TOKEN_STORAGE = {
  // Option 1: localStorage (hiện tại đang dùng)
  // Ưu: Đơn giản, persist across tabs
  // Nhược: Dễ bị XSS attack
  
  // Option 2: sessionStorage (tốt hơn)
  // Ưu: Tự động xóa khi đóng tab
  // Nhược: Vẫn dễ bị XSS
  
  // Option 3: httpOnly cookies (best practice)
  // Ưu: Không thể access từ JS, chống XSS
  // Nhược: Cần backend support, dễ bị CSRF (cần CSRF token)
  
  // Recommendation: Dùng httpOnly cookies + CSRF token
}

/**
 * Input validation rules
 */
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
  },
  
  password: {
    minLength: 8,
    maxLength: 128,
    requireUpperCase: true,
    requireLowerCase: true,
    requireNumber: true,
    requireSpecialChar: false, // Optional
  },
  
  username: {
    pattern: /^[a-zA-Z0-9_-]{3,20}$/,
    minLength: 3,
    maxLength: 20,
  },
  
  phone: {
    pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
  },
  
  search: {
    maxLength: 200,
    disallowedChars: /[<>{}()[\]'"`;]/g,
  },
}

/**
 * Rate limiting configuration (client-side)
 */
export const RATE_LIMITS = {
  // Login attempts
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // API calls
  api: {
    maxCalls: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Search queries
  search: {
    maxCalls: 20,
    windowMs: 60 * 1000, // 1 minute
  },
}

/**
 * Sensitive data masking
 */
export const maskSensitiveData = (value: string, type: 'email' | 'phone' | 'card'): string => {
  if (!value) return ''
  
  switch (type) {
    case 'email':
      // user@example.com -> u***@example.com
      const [local, domain] = value.split('@')
      return `${local[0]}***@${domain}`
      
    case 'phone':
      // 0123456789 -> 012***6789
      return value.replace(/(\d{3})\d{4}(\d{3})/, '$1***$2')
      
    case 'card':
      // 1234567890123456 -> ************3456
      return '*'.repeat(12) + value.slice(-4)
      
    default:
      return value
  }
}

/**
 * Secure random string generator
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export default {
  CSP_POLICY,
  SECURITY_HEADERS,
  VALIDATION_RULES,
  RATE_LIMITS,
  maskSensitiveData,
  generateSecureToken,
}
