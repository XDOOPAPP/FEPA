import { io, Socket } from 'socket.io-client'

/**
 * Socket.IO Client Configuration
 * Kết nối WebSocket cho real-time notifications và updates
 */

let socket: Socket | null = null

/**
 * Khởi tạo Socket.IO connection
 */
export const initializeSocket = (token?: string) => {
  if (socket) {
    return socket
  }

  // TODO: Thay đổi URL theo backend của bạn
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

  socket = io(SOCKET_URL, {
    auth: {
      token: token || localStorage.getItem('accessToken'),
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
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
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
 * Ngắt kết nối socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/**
 * Subscribe to admin notifications
 */
export const subscribeToNotifications = (callback: (notification: any) => void) => {
  if (!socket) {
    console.warn('Socket not initialized')
    return
  }

  socket.on('admin:notification', callback)
  
  // Cleanup function
  return () => {
    socket?.off('admin:notification', callback)
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
