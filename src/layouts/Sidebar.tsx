import React from 'react'
import { Layout, Menu } from 'antd'
import { DashboardOutlined, ShoppingOutlined, DollarOutlined, FileOutlined, CameraOutlined, HomeOutlined, CrownOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

const { Sider } = Layout

interface SidebarProps {
  collapsed: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: '/expenses',
      icon: <ShoppingOutlined />,
      label: 'Expenses',
      onClick: () => navigate('/expenses')
    },
    {
      key: '/budgets',
      icon: <DollarOutlined />,
      label: 'Budgets',
      onClick: () => navigate('/budgets')
    },
    {
      key: '/categories',
      icon: <HomeOutlined />,
      label: 'Categories',
      onClick: () => navigate('/categories')
    },
    {
      key: '/ocr',
      icon: <CameraOutlined />,
      label: 'OCR Scanner',
      onClick: () => navigate('/ocr')
    },
    {
      key: '/reports',
      icon: <FileOutlined />,
      label: 'Reports',
      onClick: () => navigate('/reports')
    },
    {
      key: '/subscription',
      icon: <CrownOutlined />,
      label: 'Subscription',
      onClick: () => navigate('/subscription')
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    }
  ]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={200}
      theme="dark"
      className="sidebar"
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

export default Sidebar
