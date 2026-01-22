import React, { useEffect, useRef, useState } from 'react'
import { Badge, Button } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import NotificationDropdown from './NotificationDropdown'
import './NotificationBell.css'
import { useNotificationUnreadCount } from '../../hooks/useNotifications'

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: unreadCount } = useNotificationUnreadCount()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="notification-bell" ref={containerRef}>
      <Badge count={unreadCount || 0} overflowCount={99} size="small">
        <Button
          className="notification-bell__button"
          shape="circle"
          icon={<BellOutlined />}
          onClick={() => setOpen((prev) => !prev)}
        />
      </Badge>

      {open && (
        <div className="notification-bell__dropdown">
          <NotificationDropdown onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default NotificationBell
