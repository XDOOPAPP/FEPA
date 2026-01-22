export interface NotificationMeta {
  blogId?: string
  authorId?: string
  [key: string]: unknown
}

export interface NotificationItem {
  _id: string
  userId: string
  type: string
  title: string
  message: string
  metadata?: NotificationMeta
  isRead: boolean
  createdAt: string
}

export interface NotificationListResponse {
  notifications: NotificationItem[]
  pagination: {
    total: number
    page: number
    limit: number
  }
}

export interface NotificationFilters {
  page?: number
  limit?: number
  unreadOnly?: boolean
  search?: string
}
