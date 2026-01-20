import React from 'react'
import { Layout, Space, Avatar, Dropdown, Button, Badge, List, Typography, Empty } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, LogoutOutlined, UserOutlined, SettingOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications, useMarkNotificationRead } from '../services/queries'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Text } = Typography

const { Header: AntHeader } = Layout

interface AdminHeaderProps {
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

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapsedChange }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  // Use React Query hooks
  const { data: notifications = [] } = useNotifications()
  const markAsReadMutation = useMarkNotificationRead()

  const unreadCount = notifications.filter((n: Notification) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id)
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
        Thông báo quản trị
      </div>
      <List
        dataSource={notifications}
        renderItem={(item: Notification) => (
          <List.Item
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              background: item.read ? '#fff' : '#e6f7ff'
            }}
            onClick={() => !item.read && handleMarkAsRead(item.id)}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Space>
                {getNotificationIcon(item.type)}
                <Text strong>{item.title}</Text>
              </Space>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {item.message}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {dayjs(item.createdAt).fromNow()}
              </Text>
            </Space>
          </List.Item>
        )}
      />
    </div>
  ) : (
    <div style={{ width: '300px', padding: '20px' }}>
      <Empty description="Không có thông báo mới" />
    </div>
  )

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true
    }
  ]

  return (
    <AntHeader style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => onCollapsedChange(!collapsed)}
        style={{ fontSize: '16px', width: 48, height: 48 }}
      />

      <Space size="large">
        <Dropdown
          popupRender={() => notificationItems}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={unreadCount} offset={[-5, 5]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: '18px' }} />}
              style={{ width: 48, height: 48 }}
            />
          </Badge>
        </Dropdown>

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=120"
              icon={<UserOutlined />}
            />
            <Text>{user?.fullName || 'Admin'}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default AdminHeader
