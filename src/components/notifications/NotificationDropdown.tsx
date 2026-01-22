import React from 'react'
import { Button, Empty, Spin, Typography } from 'antd'
import { Link } from 'react-router-dom'
import NotificationItem from './NotificationItem'
import './NotificationDropdown.css'
import { useNotificationActions, useNotificationList } from '../../hooks/useNotifications'
import type { NotificationItem as NotificationItemType } from '../../types/notification'

interface Props {
  onClose?: () => void
  onNavigate?: () => void
}

const NotificationDropdown: React.FC<Props> = ({ onClose, onNavigate }) => {
  const { data, isLoading } = useNotificationList({ page: 1, limit: 8 })
  const { markAsRead, markAllAsRead, deleteOne } = useNotificationActions()

  console.log('🔔 Dropdown - data from hook:', data)
  console.log('🔔 Dropdown - isLoading:', isLoading)
  
  const notifications = data?.notifications || []
  const total = notifications.length
  
  console.log('🔔 Dropdown - notifications array:', notifications)
  console.log('🔔 Dropdown - total count:', total)

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__header">
        <Typography.Text strong>Thông báo</Typography.Text>
        <Button
          type="link"
          size="small"
          onClick={() => markAllAsRead.mutate()}
          loading={markAllAsRead.isPending}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <div className="notification-dropdown__list">
        {isLoading ? (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Spin size="small" />
          </div>
        ) : total === 0 ? (
          <div style={{ padding: 24 }}>
            <Empty description="Không có thông báo" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          notifications.map((notification: NotificationItemType) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              compact
              onMarkAsRead={(id) => markAsRead.mutate(id)}
              onDelete={(id) => deleteOne.mutate(id)}
              onNavigate={() => {
                if (onNavigate) onNavigate()
                if (onClose) onClose()
              }}
            />
          ))
        )}
      </div>

      <div className="notification-dropdown__footer">
        <Link to="/admin/notifications" onClick={onClose}>
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  )
}

export default NotificationDropdown
