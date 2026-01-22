import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import notificationAPI from '../services/api/notificationAPI'
import { initializeSocket } from '../services/socket'
import type { NotificationFilters, NotificationItem } from '../types/notification'

export const notificationKeys = {
  base: ['notifications'] as const,
  list: (filters: NotificationFilters) => ['notifications', 'list', filters] as const,
  unreadCount: () => ['notifications', 'unread-count'] as const,
}

export const useNotificationUnreadCount = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationAPI.getUnreadCount,
    refetchInterval: 30000,
  })

  useEffect(() => {
    const socket = initializeSocket()
    if (!socket) return

    const handleNew = (notification: NotificationItem) => {
      console.log('📬 useNotificationUnreadCount - Received notification:', notification)
      
      // Update unread count
      if (!notification.isRead) {
        queryClient.setQueryData<number | undefined>(notificationKeys.unreadCount(), (prev) => {
          const newCount = typeof prev === 'number' ? prev + 1 : 1
          console.log('🔔 Unread count updated:', prev, '->', newCount)
          return newCount
        })
      }
      
      // Invalidate all notification queries để refresh danh sách
      queryClient.invalidateQueries({ queryKey: notificationKeys.base })
      
      // Show console notification
      console.log(`🔔 NEW NOTIFICATION: ${notification.title}`)
    }

    const handleUnreadCount = (count: number) => {
      console.log('🔢 Received unread count update:', count)
      queryClient.setQueryData(notificationKeys.unreadCount(), count)
    }

    const handleRead = () => {
      console.log('✅ Notification marked as read')
      queryClient.invalidateQueries({ queryKey: notificationKeys.base })
    }

    socket.on('notification:new', handleNew)
    socket.on('notification:unread-count', handleUnreadCount)
    socket.on('notification:read', handleRead)

    console.log('👂 Subscribed to notification events')

    return () => {
      socket.off('notification:new', handleNew)
      socket.off('notification:unread-count', handleUnreadCount)
      socket.off('notification:read', handleRead)
      console.log('🔇 Unsubscribed from notification events')
    }
  }, [queryClient])

  return query
}

export const useNotificationList = (filters: NotificationFilters) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationAPI.getNotifications(filters),
  })
}

export const useNotificationActions = () => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.base })
  }

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationAPI.markAsRead(id),
    onSuccess: () => {
      invalidate()
      queryClient.setQueryData<number | undefined>(notificationKeys.unreadCount(), (prev) => {
        if (typeof prev === 'number') {
          return Math.max(prev - 1, 0)
        }
        return 0
      })
      message.success('Đã đánh dấu đã đọc')
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Không thể đánh dấu thông báo'
      message.error(errorMessage)
    },
  })

  const markAllAsRead = useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      invalidate()
      queryClient.setQueryData(notificationKeys.unreadCount(), 0)
      message.success('Đã đánh dấu tất cả đã đọc')
    },
    onError: (error: any) => {
      message.error(error?.message || 'Không thể đánh dấu tất cả')
    },
  })

  const deleteOne = useMutation({
    mutationFn: (id: string) => notificationAPI.deleteNotification(id),
    onSuccess: () => {
      invalidate()
      message.success('Đã xóa thông báo')
    },
    onError: (error: any) => {
      message.error(error?.message || 'Không thể xóa thông báo')
    },
  })

  const deleteAll = useMutation({
    mutationFn: () => notificationAPI.deleteAll(),
    onSuccess: () => {
      invalidate()
      message.success('Đã xóa tất cả thông báo')
    },
    onError: (error: any) => {
      message.error(error?.message || 'Không thể xóa tất cả thông báo')
    },
  })

  return {
    markAsRead,
    markAllAsRead,
    deleteOne,
    deleteAll,
  }
}
