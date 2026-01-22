import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { queryClient } from './services/queryClient'
import AdminRoute from './components/AdminRoute'
import RootRedirect from './components/RootRedirect'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import ProfilePage from './pages/profile/ProfilePage'
import SettingsPage from './pages/settings/SettingsPage'
import ClearStorage from './pages/ClearStorage'
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSubscription from './pages/admin/AdminSubscription'
import AdsManagement from './pages/admin/AdsManagement'
import PartnerPortal from './pages/admin/PartnerPortal'
import NotificationsPage from './pages/admin/notifications/NotificationsPage'
import { PendingBlogs, PublishedBlogs, RejectedBlogs, BlogDetail } from './pages/admin/blogs'

const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/clear-storage" element={<ClearStorage />} />
            
            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/notifications" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <NotificationsPage />
                  </AdminLayout>
                </AdminRoute>
              } 
            />

            {/* Blog Management Routes */}
            <Route 
              path="/admin/blogs/pending" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <PendingBlogs />
                  </AdminLayout>
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/blogs/published" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <PublishedBlogs />
                  </AdminLayout>
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/blogs/rejected" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <RejectedBlogs />
                  </AdminLayout>
                </AdminRoute>
              } 
            />

            <Route 
              path="/admin/blogs/:id" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <BlogDetail />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            {/* Core management routes removed */}
            
            <Route 
              path="/admin/subscription" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminSubscription />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/profile" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ProfilePage />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/settings" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <SettingsPage />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/ads" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdsManagement />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/partners" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <PartnerPortal />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </Router>
      </AuthProvider>
      </AntdApp>
    </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App


