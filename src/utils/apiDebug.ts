/**
 * API Debug Utilities
 * Kiểm tra connectivity và debug API issues
 */

import axios from 'axios'
import { API_CONFIG } from '../config/api.config'

export const apiDebug = {
  /**
   * Test basic connectivity to API
   */
  async testConnection(): Promise<void> {
    console.log('🔍 Testing API Connection...')
    console.log('📍 Base URL:', API_CONFIG.BASE_URL)
    
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/subscriptions/plans`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      console.log('✅ API Connection OK')
      console.log('📦 Response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ API Connection Failed')
      if (error.response) {
        console.error('Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        })
      } else if (error.request) {
        console.error('Network Error: No response received')
        console.error('Check if backend is running at:', API_CONFIG.BASE_URL)
      } else {
        console.error('Request Setup Error:', error.message)
      }
      throw error
    }
  },

  /**
   * Test authenticated endpoint
   */
  async testAuth(): Promise<void> {
    const token = localStorage.getItem('accessToken')
    console.log('🔍 Testing Authenticated Endpoint...')
    console.log('🔑 Token:', token ? `${token.substring(0, 30)}...` : 'No token found')
    
    if (!token) {
      console.warn('⚠️ No access token found. Please login first.')
      return
    }

    // Decode token to get userId
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const decoded = JSON.parse(jsonPayload)
      console.log('👤 Decoded Token:', decoded)
      
      const userId = decoded.userId || decoded.sub || decoded.id
      console.log('👤 User ID:', userId)
      
      // Test with subscription stats endpoint
      const response = await axios.get(`${API_CONFIG.BASE_URL}/subscriptions/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId || '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      console.log('✅ Authenticated API Call OK')
      console.log('📦 Response:', response.data)
    } catch (error: any) {
      console.error('❌ Authenticated API Call Failed')
      if (error.response) {
        console.error('Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        })
      } else {
        console.error('Error:', error.message)
      }
    }
  },

  /**
   * Test all endpoints used in dashboard
   */
  async testDashboardEndpoints(): Promise<void> {
    console.log('🔍 Testing All Dashboard Endpoints...')
    
    const endpoints = [
      { name: 'Subscription Stats', url: '/subscriptions/admin/stats' },
      { name: 'Revenue Totals', url: '/subscriptions/stats/total-revenue' },
      { name: 'Blog Stats', url: '/blogs/statistics/status' },
      { name: 'Expense Stats', url: '/expenses/admin/stats' },
      { name: 'Budget Stats', url: '/budgets/admin/stats' },
      { name: 'OCR Stats', url: '/ocr/admin/stats' },
      { name: 'AI Stats', url: '/ai/admin/stats' }
    ]

    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.error('❌ No access token. Please login first.')
      return
    }

    // Get userId from token
    let userId = ''
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const decoded = JSON.parse(jsonPayload)
      userId = decoded.userId || decoded.sub || decoded.id || ''
    } catch (error) {
      console.error('❌ Failed to decode token')
    }

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${endpoint.url}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-user-id': userId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        console.log(`✅ ${endpoint.name}: OK`)
        console.log(`   Data:`, response.data)
      } catch (error: any) {
        console.error(`❌ ${endpoint.name}: FAILED`)
        if (error.response) {
          console.error(`   Status: ${error.response.status}`)
          console.error(`   Message:`, error.response.data)
        } else {
          console.error(`   Error:`, error.message)
        }
      }
    }
  },

  /**
   * Print current configuration
   */
  printConfig(): void {
    console.log('⚙️ Current Configuration:')
    console.log('  Base URL:', API_CONFIG.BASE_URL)
    console.log('  Socket URL:', API_CONFIG.SOCKET_URL)
    console.log('  Access Token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing')
    console.log('  Refresh Token:', localStorage.getItem('refreshToken') ? 'Present' : 'Missing')
    console.log('  User Session:', sessionStorage.getItem('user') ? 'Present' : 'Missing')
  }
}

// Export to window for console debugging
if (typeof window !== 'undefined') {
  (window as any).apiDebug = apiDebug
}

export default apiDebug
