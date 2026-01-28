/**
 * Decode JWT token to extract payload
 * Note: This is NOT secure verification, only for reading payload
 */
export const decodeJWT = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    const decoded = atob(parts[1])
    return JSON.parse(decoded)
  } catch (error) {
    console.error('❌ Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) {
    return true
  }
  
  // exp is in seconds, convert to milliseconds
  const expirationTime = payload.exp * 1000
  return Date.now() > expirationTime
}
