import { io, Socket } from 'socket.io-client'
import { API_CONFIG } from '../config/api.config'
import type { NotificationItem } from '../types/notification'

/**
 * Socket.IO Client Configuration
 * Kết nối WebSocket cho real-time updates
 */

let socket: Socket | null = null
let listeners: Map<string, { event: string; handler: Function }> = new Map()

/**
 * Khởi tạo Socket.IO connection
 */
export const initializeSocket = (token?: string) => {
  if (socket?.connected) {
    console.log('🔌 Socket already connected:', socket.id)
    return socket
  }

  // Socket URL từ config tập trung - Port 3102 cho Socket Gateway
  const SOCKET_URL = API_CONFIG.SOCKET_URL
  const authToken = token || localStorage.getItem('accessToken')

  console.log('🔌 Initializing socket connection to:', SOCKET_URL)
  console.log('🔑 Auth token:', authToken ? 'Present' : 'Missing')

  socket = io(SOCKET_URL, {
    auth: {
      token: authToken,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  })

  // Event listeners
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason)
    if (reason === 'io server disconnect') {
      // Server manually disconnected, attempt reconnection
      socket?.connect()
    }
  })

  socket.on('connect_error', (error: any) => {
    console.error('🔴 Socket connection error:', error.message)
    
    // Handle authentication errors
    if (error.message?.includes('Authentication') || error.message?.includes('jwt')) {
      console.log('🔑 Token might be expired, attempting to reconnect with fresh token')
      const freshToken = localStorage.getItem('accessToken')
      if (freshToken && socket) {
        socket.auth = { token: freshToken }
      }
    }
  })

  return socket
}

/**
 * Lấy socket instance hiện tại
 */
export const getSocket = (): Socket | null => {
  return socket
}

/**
 * Subscribe to notification events
 */
export const subscribeToNotifications = (callback: (notification: NotificationItem) => void): string => {
  if (!socket) {
    console.warn('⚠️ Socket not initialized. Call initializeSocket() first.')
    throw new Error('Socket not initialized')
  }

  const listenerId = `notification_${Date.now()}_${Math.random()}`

  const handler = (data: NotificationItem) => {
    console.log('📬 New notification received:', data)
    callback(data)
  }

  socket.on('notification:new', handler)
  listeners.set(listenerId, { event: 'notification:new', handler })

  console.log('👂 Subscribed to notifications with ID:', listenerId)
  return listenerId
}

/**
 * Unsubscribe from notification events
 */
export const unsubscribeFromNotifications = (listenerId: string) => {
  const listener = listeners.get(listenerId)
  if (listener && socket) {
    socket.off(listener.event, listener.handler as any)
    listeners.delete(listenerId)
    console.log('🔇 Unsubscribed from notifications:', listenerId)
  }
}

/**
 * Reconnect with new token
 */
export const reconnectWithNewToken = (token: string) => {
  if (socket) {
    socket.auth = { token }
    if (!socket.connected) {
      socket.connect()
    }
    console.log('🔄 Reconnecting with new token')
  }
}

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected || false
}

/**
 * Ngắt kết nối socket
 */
export const disconnectSocket = () => {
  if (socket) {
    // Clear all listeners
    listeners.forEach((listener) => {
      socket?.off(listener.event, listener.handler as any)
    })
    listeners.clear()

    socket.disconnect()
    socket = null
    console.log('🔌 Socket disconnected and cleaned up')
  }
}

/**
 * Subscribe to system alerts
 */
export const subscribeToSystemAlerts = (callback: (alert: any) => void) => {
  if (!socket) {
    console.warn('Socket not initialized')
    return
  }

  socket.on('system:alert', callback)
  
  return () => {
    socket?.off('system:alert', callback)
  }
}

/**
 * Subscribe to user activities
 */
export const subscribeToUserActivities = (callback: (activity: any) => void) => {
  if (!socket) {
    console.warn('Socket not initialized')
    return
  }

  socket.on('user:activity', callback)
  
  return () => {
    socket?.off('user:activity', callback)
  }
}
