import React from 'react'
import { Layout, Menu } from 'antd'
import { 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined,
  CrownOutlined,
  TeamOutlined,
  SafetyOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  DollarCircleOutlined,
  CreditCardOutlined,
  AppstoreAddOutlined,
  ScanOutlined,
  RobotOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import '../Sidebar.css'

const { Sider } = Layout

interface AdminSidebarProps {
  collapsed: boolean
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Gom nhóm quản lý người dùng vào một menu cha
  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: 'user-management',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
      children: [
        {
          key: '/admin/admins',
          icon: <SafetyOutlined />,
          label: 'Quản lý Admin',
          onClick: () => navigate('/admin/admins'),
        },
        {
          key: '/admin/users',
          icon: <TeamOutlined />,
          label: 'Quản lý User',
          onClick: () => navigate('/admin/users'),
        },
        {
          key: '/admin/user-stats',
          icon: <AreaChartOutlined />,
          label: 'Thống kê User',
          onClick: () => navigate('/admin/user-stats'),
        },
      ],
    },
    {
      key: 'blog-management',
      icon: <BarChartOutlined />,
      label: 'Blog',
      children: [
        {
          key: '/admin/blogs/pending',
          icon: <FileSearchOutlined />,
          label: 'Duyệt bài',
          onClick: () => navigate('/admin/blogs/pending'),
        },
        {
          key: '/admin/blogs/published',
          icon: <FileDoneOutlined />,
          label: 'Đã duyệt',
          onClick: () => navigate('/admin/blogs/published'),
        },
        {
          key: '/admin/blogs/rejected',
          icon: <FileExclamationOutlined />,
          label: 'Từ chối',
          onClick: () => navigate('/admin/blogs/rejected'),
        },
        {
          key: '/admin/blog-analytics',
          icon: <BarChartOutlined />,
          label: 'Thống kê Blog',
          onClick: () => navigate('/admin/blog-analytics'),
        },
      ],
    },
    {
      key: 'ai-ocr-analytics',
      icon: <RobotOutlined />,
      label: 'AI / OCR',
      children: [
        {
          key: '/admin/ai-analytics',
          icon: <RobotOutlined />,
          label: 'Thống kê AI',
          onClick: () => navigate('/admin/ai-analytics'),
        },
        {
          key: '/admin/ocr-analytics',
          icon: <ScanOutlined />,
          label: 'Thống kê OCR',
          onClick: () => navigate('/admin/ocr-analytics'),
        },
      ],
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Thông báo',
      onClick: () => navigate('/admin/notifications'),
    },
    {
      key: '/admin/revenue',
      icon: <DollarCircleOutlined />,
      label: 'Doanh thu',
      onClick: () => navigate('/admin/revenue'),
    },
    {
      key: '/admin/subscription',
      icon: <CrownOutlined />,
      label: 'Subscription',
      onClick: () => navigate('/admin/subscription'),
    },
    {
      key: '/admin/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => navigate('/admin/settings'),
    },
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
        defaultOpenKeys={['user-management', 'blog-management', 'ai-ocr-analytics']}
        items={menuItems}
      />
    </Sider>
  )
}

export default AdminSidebar
