import React from 'react'
import { Layout, Space, Avatar, Dropdown, Button, Tooltip, Tag } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined, SettingOutlined, CrownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const { Header: AntHeader } = Layout

interface HeaderProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ collapsed, onCollapsedChange }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
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
