import React from 'react'
import { Layout, Menu, Badge } from 'antd'
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined,
  CrownOutlined,
  BellOutlined,
  BookOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNotificationUnreadCount } from '../hooks/useNotifications'
import './Sidebar.css'

const { Sider } = Layout

interface AdminSidebarProps {
  collapsed: boolean
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: unreadCount } = useNotificationUnreadCount()

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard')
    },
    {
      key: '/admin/blogs',
      icon: <BookOutlined />,
      label: 'Blog Management',
      children: [
        {
          key: '/admin/blogs/pending',
          label: 'Pending Reviews',
          onClick: () => navigate('/admin/blogs/pending')
        },
        {
          key: '/admin/blogs/published',
          label: 'Published Blogs',
          onClick: () => navigate('/admin/blogs/published')
        },
        {
          key: '/admin/blogs/rejected',
          label: 'Rejected Blogs',
          onClick: () => navigate('/admin/blogs/rejected')
        }
      ]
    },
    {
      key: '/admin/notifications',
      icon: (
        <Badge count={unreadCount || 0} offset={[12, 0]} size="small">
          <BellOutlined />
        </Badge>
      ),
      label: 'Notifications',
      onClick: () => navigate('/admin/notifications')
    },
    // Core Management removed per admin UI decisions
    {
      key: '/admin/subscription',
      icon: <CrownOutlined />,
      label: 'Subscription',
      onClick: () => navigate('/admin/subscription')
    },
    {
      key: '/admin/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile')
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => navigate('/admin/settings')
    }
  ]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={200}
      theme="dark"
      className="sidebar"
      trigger={null}
      style={{ position: 'fixed', height: '100vh', left: 0 }}
    >
      <div style={{ padding: '16px', textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
        {!collapsed && 'FEPA'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={location.pathname.startsWith('/admin/blogs') ? ['/admin/blogs'] : []}
        items={menuItems}
      />
    </Sider>
  )
}

export default AdminSidebar
