import React, { Suspense } from 'react'
import { Layout } from 'antd'
import AdminHeader from './components/AdminHeader'
import AdminSidebar from './components/AdminSidebar'
import Footer from '../Footer'
import { ErrorBoundary } from '../../components/common/ErrorBoundary'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import './AdminLayout.css'

const { Content } = Layout

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <Layout className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`} style={{ minHeight: '100vh' }}>
      <AdminSidebar collapsed={collapsed} />
      <Layout className="admin-main-layout">
        <AdminHeader collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <Content className="admin-content">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  )
}

export default AdminLayout
