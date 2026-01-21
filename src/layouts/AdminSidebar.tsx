import React from 'react'
import { Layout, Menu } from 'antd'
import { 
  DashboardOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined, 
  BellOutlined, 
  SettingOutlined,
  TeamOutlined,
  CrownOutlined,
  ReadOutlined,
  ControlOutlined,
  BookOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

const { Sider } = Layout

interface AdminSidebarProps {
  collapsed: boolean
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard')
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'User Management',
      onClick: () => navigate('/admin/users')
    },
    // Core Management removed per admin UI decisions
    {
      key: '/admin/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
      onClick: () => navigate('/admin/reports')
    },
    {
      key: '/admin/subscription',
      icon: <CrownOutlined />,
      label: 'Subscription',
      onClick: () => navigate('/admin/subscription')
    },
    {
      key: 'blogs',
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
      key: 'content',
      icon: <ReadOutlined />,
      label: 'Content Management',
      children: [
        {
          key: '/admin/ads',
          label: 'Advertisements',
          onClick: () => navigate('/admin/ads')
        },
        {
          key: '/admin/partners',
          label: 'Partner Portal',
          onClick: () => navigate('/admin/partners')
        }
      ]
    },
    {
      key: 'system',
      icon: <ControlOutlined />,
      label: 'System',
      children: [
        {
          key: '/admin/system-settings',
          label: 'Settings',
          onClick: () => navigate('/admin/system-settings')
        },
        {
          key: '/admin/system-health',
          label: 'Health Monitor',
          onClick: () => navigate('/admin/system-health')
        }
      ]
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
      onClick: () => navigate('/admin/notifications')
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
        items={menuItems}
      />
    </Sider>
  )
}

export default AdminSidebar
