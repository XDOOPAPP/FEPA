/**
 * 📊 Analytics Pages - Integration Guide
 * 
 * Hướng dẫn tích hợp các trang thống kê AI & OCR vào ứng dụng
 */

// ============================================
// 1. IMPORT STATEMENTS
// ============================================

// In your main Router/App component:
import AiAnalytics from '@/pages/admin/analytics/AiAnalytics'
import OcrAnalytics from '@/pages/admin/analytics/OcrAnalytics'
import AnalyticsDashboard from '@/pages/admin/analytics/AnalyticsDashboard'

// ============================================
// 2. ROUTER CONFIGURATION
// ============================================

// Add these routes to your admin router:
const adminRoutes = [
  {
    path: 'analytics',
    children: [
      {
        path: '',
        element: <AnalyticsDashboard />,
        // Breadcrumb: Admin > Analytics
      },
      {
        path: 'ai',
        element: <AiAnalytics />,
        // Breadcrumb: Admin > Analytics > AI
      },
      {
        path: 'ocr',
        element: <OcrAnalytics />,
        // Breadcrumb: Admin > Analytics > OCR
      },
    ]
  }
]

// ============================================
// 3. SIDEBAR NAVIGATION UPDATE
// ============================================

// Add to your sidebar menu configuration:
const sidebarItems = [
  {
    key: 'analytics',
    icon: <BarChartOutlined />,
    label: 'Analytics',
    children: [
      {
        key: 'analytics-dashboard',
        label: 'Dashboard',
        onClick: () => navigate('/admin/analytics'),
      },
      {
        key: 'analytics-ai',
        label: 'AI Service',
        onClick: () => navigate('/admin/analytics/ai'),
      },
      {
        key: 'analytics-ocr',
        label: 'OCR Service',
        onClick: () => navigate('/admin/analytics/ocr'),
      },
    ]
  }
]

// ============================================
// 4. REQUIRED API SERVICES
// ============================================

// Ensure these API services are properly configured:

// src/services/api/aiAPI.ts
export default {
  getAdminStats: async () => {
    const response = await axiosInstance.get('/ai/admin/stats')
    return response.data
  }
}

// src/services/api/ocrAPI.ts
export default {
  getAdminStats: async () => {
    const response = await axiosInstance.get('/ocr/admin/stats')
    return response.data
  }
}

// ============================================
// 5. AXIOS INSTANCE CONFIGURATION
// ============================================

// Ensure your axiosInstance includes:
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://76.13.21.84:3000/api/v1',
  timeout: 10000,
})

// Add auth interceptor:
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance

// ============================================
// 6. REACT QUERY SETUP
// ============================================

// In your main App component or _app.tsx:
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app content */}
    </QueryClientProvider>
  )
}

// ============================================
// 7. TYPE DEFINITIONS
// ============================================

// Add to your types file (e.g., src/types/analytics.ts):

export interface AIStats {
  totalConversations: number
  totalMessages: number
  totalUsers: number
  avgMessagesPerConversation: string
  messagesByRole: Array<{
    role: 'user' | 'assistant'
    count: number
  }>
  recentConversations: Array<{
    id: string
    userId: string
    messageCount: number
    createdAt: string
  }>
}

export interface OCRStats {
  totalJobs: number
  totalUsers: number
  successRate: number
  byStatus: Array<{
    status: 'completed' | 'failed' | 'processing'
    count: number
  }>
  recentJobs: Array<{
    id: string
    userId: string
    status: 'completed' | 'failed' | 'processing'
    createdAt: string
    completedAt?: string
  }>
}

// ============================================
// 8. ENVIRONMENT VARIABLES
// ============================================

// Add to .env file:
REACT_APP_API_URL=http://76.13.21.84:3000/api/v1
REACT_APP_ANALYTICS_REFRESH_INTERVAL=120000  # 2 minutes

// ============================================
// 9. CUSTOM HOOKS (Optional)
// ============================================

// Create reusable hooks for analytics:

// src/hooks/useAIStats.ts
import { useQuery } from '@tanstack/react-query'
import aiAPI from '@/services/api/aiAPI'

export const useAIStats = () => {
  return useQuery({
    queryKey: ['ai-admin-stats'],
    queryFn: aiAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })
}

// src/hooks/useOCRStats.ts
import { useQuery } from '@tanstack/react-query'
import ocrAPI from '@/services/api/ocrAPI'

export const useOCRStats = () => {
  return useQuery({
    queryKey: ['ocr-admin-stats'],
    queryFn: ocrAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })
}

// ============================================
// 10. THEME CONFIGURATION
// ============================================

// If using Ant Design theme customization:
import { ConfigProvider } from 'antd'

const theme = {
  token: {
    colorPrimary: '#8b5cf6',
    colorSuccess: '#10b981',
    colorError: '#f43f5e',
    colorWarning: '#f59e0b',
    colorInfo: '#06b6d4',
  },
  components: {
    Card: {
      borderRadius: 8,
    },
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      {/* Your app content */}
    </ConfigProvider>
  )
}

// ============================================
// 11. ERROR HANDLING
// ============================================

// Add error boundary for analytics pages:
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

<ErrorBoundary>
  <AnalyticsDashboard />
</ErrorBoundary>

// ============================================
// 12. PERFORMANCE OPTIMIZATION
// ============================================

// Use React.memo for chart components if needed:
const AIChart = React.memo(({ data }) => (
  // chart component
))

// Memoize chart data transformations:
const messagesByRoleData = useMemo(() => {
  return stats?.messagesByRole || []
}, [stats])

// ============================================
// 13. TESTING SETUP
// ============================================

// Example test file: AiAnalytics.test.tsx
import { render, screen } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import AiAnalytics from './AiAnalytics'

describe('AiAnalytics', () => {
  it('should render analytics page', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AiAnalytics />
      </QueryClientProvider>
    )
    expect(screen.getByText(/Thống kê AI Service/i)).toBeInTheDocument()
  })
})

// ============================================
// 14. MONITORING & LOGGING
// ============================================

// Add logging for analytics data fetching:
const { data, isLoading, error } = useQuery({
  queryKey: ['ai-admin-stats'],
  queryFn: async () => {
    console.log('[Analytics] Fetching AI stats...')
    try {
      const result = await aiAPI.getAdminStats()
      console.log('[Analytics] AI stats loaded:', result)
      return result
    } catch (err) {
      console.error('[Analytics] Failed to load AI stats:', err)
      throw err
    }
  },
  staleTime: 2 * 60 * 1000,
})

// ============================================
// 15. ACCESSIBILITY
// ============================================

// Ensure proper ARIA labels and semantic HTML:
<Card
  title={
    <Space>
      <RobotOutlined aria-label="Robot icon" />
      <span id="ai-section-title">AI Analytics</span>
    </Space>
  }
  aria-labelledby="ai-section-title"
>
  {/* Card content */}
</Card>

// ============================================
// 16. MOBILE OPTIMIZATION
// ============================================

// Responsive image sizing:
const chartsResponsive = {
  xs: { height: 250 },
  md: { height: 300 },
  lg: { height: 350 },
}

// Use sm prop for table:
<Table
  size="middle"  // or 'small' for mobile
  pagination={{ pageSize: 5 }}  // smaller on mobile
/>

// ============================================
// 17. CACHING STRATEGIES
// ============================================

// Use React Query's built-in caching:
queryClient.setQueryData(['ai-admin-stats'], newData)

// Prefetch data before navigation:
queryClient.prefetchQuery({
  queryKey: ['ai-admin-stats'],
  queryFn: aiAPI.getAdminStats,
})

// ============================================
// CHECKLIST FOR INTEGRATION
// ============================================

// ✅ Routes added to admin router
// ✅ Sidebar menu items added
// ✅ API services configured
// ✅ React Query setup
// ✅ Auth interceptor configured
// ✅ Environment variables set
// ✅ Types defined
// ✅ Error boundary wrapped
// ✅ Responsive tested
// ✅ Performance optimized
// ✅ Accessibility checked
// ✅ Error handling implemented
// ✅ Logging added
// ✅ Mobile tested
// ✅ Cache strategy verified

export {}
