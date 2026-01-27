import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { queryClient } from './services/queryClient'
import AdminRoute from './components/AdminRoute'
import RootRedirect from './components/RootRedirect'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import ForgotPassword from './pages/auth/ForgotPassword'
import ProfilePage from './pages/profile/ProfilePage'
import SettingsPage from './pages/settings/SettingsPage'
import ClearStorage from './pages/ClearStorage'
import { LoadingOverlay } from './components/LoadingOverlay'
import { initializeSocket, disconnectSocket } from './services/socket'

// Lazy-loaded admin pages to reduce initial bundle size
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminSubscription = lazy(() => import('./pages/admin/AdminSubscription'))
const AdminManagement = lazy(() => import('./pages/admin/AdminManagement'))
const AdsManagement = lazy(() => import('./pages/admin/AdsManagement'))
const PartnerPortal = lazy(() => import('./pages/admin/PartnerPortal'))
const NotificationsPage = lazy(() => import('./pages/admin/notifications/NotificationsPage'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const UserStatistics = lazy(() => import('./pages/admin/UserStatistics'))
const BlogAnalytics = lazy(() => import('./pages/admin/BlogAnalytics'))
const RevenueDashboard = lazy(() => import('./pages/admin/RevenueDashboard'))
const OcrAnalytics = lazy(() => import('./pages/admin/OcrAnalytics'))
const AiAnalytics = lazy(() => import('./pages/admin/AiAnalytics'))
const PendingBlogs = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.PendingBlogs })))
const PublishedBlogs = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.PublishedBlogs })))
const RejectedBlogs = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.RejectedBlogs })))
const BlogDetail = lazy(() => import('./pages/admin/blogs').then(m => ({ default: m.BlogDetail })))

const themeConfig = {
  token: {
    colorPrimary: '#0EA5E9',      // Sky Blue - FEPA Brand Primary
    colorSuccess: '#10B981',       // Green - Success states
    colorError: '#F43F5E',         // Rose - Error states  
    colorWarning: '#F59E0B',       // Amber - Warning states
    colorInfo: '#0EA5E9',          // Info messages
    colorBgBase: '#F8FAFC',        // Slate 50 - Page background
    colorBgContainer: '#FFFFFF',   // White - Card/Container background
    colorText: '#0F172A',          // Slate 900 - Primary text
    colorTextSecondary: '#64748B', // Slate 500 - Secondary text
    borderRadius: 12,              // 12px - Modern rounded corners
    fontSize: 14,                  // Base font size
  },
}

/**
 * Socket Initializer Component
 * Tự động kết nối socket khi user login và ngắt kết nối khi logout
 */
function SocketInitializer() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        console.log('🔌 User logged in, initializing socket...')
        initializeSocket(token)
      }
    } else {
      console.log('🔌 User logged out, disconnecting socket...')
      disconnectSocket()
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket()
    }
  }, [user])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>
        <AuthProvider>
          <SocketInitializer />
          <Router>
          <Suspense fallback={<LoadingOverlay fullscreen loading tip="Đang tải trang..." />}>
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
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <UserManagement />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/user-stats" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <UserStatistics />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />

              <Route 
                path="/admin/blog-analytics" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <BlogAnalytics />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />

              <Route 
                path="/admin/revenue" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <RevenueDashboard />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />

              <Route 
                path="/admin/ocr-analytics" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <OcrAnalytics />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />

              <Route 
                path="/admin/ai-analytics" 
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AiAnalytics />
                    </AdminLayout>
                  </AdminRoute>
                } 
              />
            
            <Route 
              path="/admin/admins" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminManagement />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
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
          </Suspense>
        </Router>
      </AuthProvider>
      </AntdApp>
    </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App


