import React from 'react'
import { Layout, Space, Avatar, Dropdown, Button, Typography } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from '../components/notifications/NotificationBell'

const { Text } = Typography

const { Header: AntHeader } = Layout

interface AdminHeaderProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onCollapsedChange }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
        <NotificationBell />
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
