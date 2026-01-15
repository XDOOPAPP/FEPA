import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
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
import UserManagement from './pages/admin/UserManagement'
import AdminExpenses from './pages/admin/AdminExpenses'
import AdminBudgets from './pages/admin/AdminBudgets'
import AdminCategories from './pages/admin/AdminCategories'
import AdminReports from './pages/admin/AdminReports'
import AdminNotifications from './pages/admin/AdminNotifications'
import AdminSubscription from './pages/admin/AdminSubscription'
import BlogManagement from './pages/admin/BlogManagement'
import AdsManagement from './pages/admin/AdsManagement'
import PartnerPortal from './pages/admin/PartnerPortal'
import SystemSettings from './pages/admin/SystemSettings'
import SystemHealth from './pages/admin/SystemHealth'

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
              path="/admin/expenses" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminExpenses />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/budgets" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminBudgets />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/categories" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminCategories />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/reports" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminReports />
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
              path="/admin/notifications" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminNotifications />
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
              path="/admin/blogs" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <BlogManagement />
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
            
            <Route 
              path="/admin/system-settings" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <SystemSettings />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route 
              path="/admin/system-health" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <SystemHealth />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App


