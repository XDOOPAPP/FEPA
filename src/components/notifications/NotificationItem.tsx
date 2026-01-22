import React from 'react'
import { Button, Tooltip, Typography } from 'antd'
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import type { NotificationItem as NotificationItemType } from '../../types/notification'
import './NotificationItem.css'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const iconMap: Record<string, string> = {
  BLOG_SUBMITTED: '📝',
  BLOG_APPROVED: '✅',
  BLOG_REJECTED: '❌',
  PAYMENT_SUCCESS: '💳',
  PAYMENT_FAILED: '⚠️',
  SUBSCRIPTION_EXPIRED: '⏰',
  SYSTEM_ERROR: '🛑',
}

interface Props {
  notification: NotificationItemType
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onNavigate?: (notification: NotificationItemType) => void
  compact?: boolean
}

const NotificationItem: React.FC<Props> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onNavigate,
  compact,
}) => {
  const timeAgo = dayjs(notification.createdAt).fromNow()

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification._id)
    }
    if (onNavigate) {
      onNavigate(notification)
    }
  }

  const icon = iconMap[notification.type] || '🔔'

  return (
    <div
      className={`notification-item ${notification.isRead ? '' : 'unread'}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="notification-item__icon" aria-hidden>
        {icon}
      </div>

      <div className="notification-item__body">
        <Typography.Text className="notification-item__title">
          {notification.title}
        </Typography.Text>
        {!compact && (
          <Typography.Paragraph className="notification-item__message" ellipsis={{ rows: 2 }}>
            {notification.message}
          </Typography.Paragraph>
        )}
        <div className="notification-item__meta">
          {!notification.isRead && <span className="notification-item__dot" aria-hidden />}
          <span>{timeAgo}</span>
        </div>
      </div>

      <div className="notification-item__actions" onClick={(event) => event.stopPropagation()}>
        {!notification.isRead && onMarkAsRead && (
          <Tooltip title="Đánh dấu đã đọc">
            <Button
              size="small"
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => onMarkAsRead(notification._id)}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Xóa">
            <Button
              size="small"
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(notification._id)}
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default NotificationItem
