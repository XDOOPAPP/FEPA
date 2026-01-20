import React, { useState, useEffect } from 'react'
import { Layout, Space, Avatar, Dropdown, Button, Badge, List, Typography, Empty, Tag, Tooltip } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, LogoutOutlined, UserOutlined, SettingOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined, CrownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Text } = Typography

const { Header: AntHeader } = Layout

interface HeaderProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

const Header: React.FC<HeaderProps> = ({ collapsed, onCollapsedChange }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        const allNotifications = JSON.parse(stored)
        const unread = allNotifications.filter((n: Notification) => !n.read)
        setNotifications(unread)
        setUnreadCount(unread.length)
      }
    }
    
    loadNotifications()
    // Reload every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMarkAsRead = (id: string) => {
    const stored = localStorage.getItem('notifications')
    if (stored) {
      const allNotifications = JSON.parse(stored)
      const updated = allNotifications.map((n: Notification) => 
        n.id === id ? { ...n, read: true } : n
      )
      localStorage.setItem('notifications', JSON.stringify(updated))
      
      const unread = updated.filter((n: Notification) => !n.read)
      setNotifications(unread)
      setUnreadCount(unread.length)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />
    }
  }

  const notificationItems = notifications.length > 0 ? (
    <div style={{ width: '360px', maxHeight: '400px', overflowY: 'auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>
        Thông báo mới
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ 
              padding: '12px 16px', 
              cursor: 'pointer',
              background: '#fafafa'
            }}
            onClick={() => handleMarkAsRead(item.id)}
          >
            <List.Item.Meta
              avatar={getNotificationIcon(item.type)}
              title={<Text strong>{item.title}</Text>}
              description={
                <>
                  <div>{item.message}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
      <div 
        style={{ 
          padding: '12px 16px', 
          borderTop: '1px solid #f0f0f0', 
          textAlign: 'center',
          cursor: 'pointer',
          color: '#1890ff'
        }}
        onClick={() => navigate('/notifications')}
      >
        Xem tất cả thông báo
      </div>
    </div>
  ) : (
    <div style={{ width: '360px', padding: '24px', textAlign: 'center' }}>
      <Empty description="Không có thông báo mới" />
    </div>
  )

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ]

  return (
    <AntHeader className="user-header" style={{
      background: '#fff',
      padding: '0 24px',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapsedChange(!collapsed)}
        size="large"
      />

      <Space size="large">
        {user?.subscriptionPlan && (
          <Tooltip title="Current Subscription Plan">
            <Tag 
              icon={<CrownOutlined />}
              color={user.subscriptionPlan.tier === 'premium' ? 'gold' : 'blue'}
              style={{ cursor: 'pointer', marginRight: '8px' }}
              onClick={() => navigate('/admin/subscription')}
            >
              {user.subscriptionPlan.name}
            </Tag>
          </Tooltip>
        )}
        <Dropdown 
          popupRender={() => notificationItems}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={unreadCount}>
            <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: menuItems }}>
          <Avatar 
            size="large" 
            icon={<UserOutlined />} 
            src={user?.avatar}
            style={{ cursor: 'pointer', background: '#1890ff' }} 
          />
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header
