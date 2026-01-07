import React from 'react'
import { Layout } from 'antd'
import AdminHeader from '../AdminHeader'
import AdminSidebar from '../AdminSidebar'
import Footer from '../Footer'
import './AdminLayout.css'

const { Content } = Layout

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
      <AdminSidebar collapsed={collapsed} />
      <Layout>
        <AdminHeader collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <Content className="admin-content">
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  )
}

export default AdminLayout
