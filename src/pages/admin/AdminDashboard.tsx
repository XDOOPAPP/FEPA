import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Tag, Space, Typography, List, Avatar, Spin } from 'antd'
import {
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
  LoadingOutlined,
  PieChartOutlined,
  CameraOutlined,
  ScanOutlined,
  RobotOutlined
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'
import subscriptionAPI from '../../services/api/subscriptionAPI'
import { useGetExpenseAdminStats, useGetBudgetAdminStats, useGetOcrAdminStats, useGetAiAdminStats } from '../../services/queries'
import blogAPI from '../../services/api/blogAPI'

const { Title, Text } = Typography

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [blogStats, setBlogStats] = useState<{ draft?: number; pending?: number; published?: number; rejected?: number }>({})
  const [revenueTotals, setRevenueTotals] = useState<{ totalRevenue: number; activeSubscriptions?: number; totalSubscriptions?: number; cancelledSubscriptions?: number }>({ totalRevenue: 0 })
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  // Fetch expense stats
  const { data: expenseStats, isLoading: isLoadingExpenseStats } = useGetExpenseAdminStats()
  
  // Fetch budget stats
  const { data: budgetStats, isLoading: isLoadingBudgetStats } = useGetBudgetAdminStats()
  
  // Fetch OCR stats
  const { data: ocrStats, isLoading: isLoadingOcrStats } = useGetOcrAdminStats()
  
  // Fetch AI stats
  const { data: aiStats, isLoading: isLoadingAiStats } = useGetAiAdminStats()

  useEffect(() => {
    loadDashboardData()
    initializeMockData()
    loadAnalytics()
  }, [])

  const initializeMockData = () => {

    // Initialize users data if not exists
    const users = localStorage.getItem('all_users')
    if (!users) {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          fullName: 'Nguyễn Văn A',
          role: 'user',
          status: 'active',
          createdAt: dayjs().subtract(30, 'day').toISOString(),
          lastLogin: dayjs().subtract(1, 'hour').toISOString()
        },
        {
          id: '2',
          email: 'user2@example.com',
          fullName: 'Trần Thị B',
          role: 'user',
          status: 'active',
          createdAt: dayjs().subtract(25, 'day').toISOString(),
          lastLogin: dayjs().subtract(3, 'hour').toISOString()
        },
        {
          id: '3',
          email: 'user3@example.com',
          fullName: 'Lê Văn C',
          role: 'user',
          status: 'locked',
          createdAt: dayjs().subtract(20, 'day').toISOString(),
          lastLogin: dayjs().subtract(5, 'day').toISOString()
        },
        {
          id: '4',
          email: 'admin@example.com',
          fullName: 'Admin User',
          role: 'admin',
          status: 'active',
          createdAt: dayjs().subtract(60, 'day').toISOString(),
          lastLogin: new Date().toISOString()
        }
      ]
      localStorage.setItem('all_users', JSON.stringify(mockUsers))
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load all users (mock for now as no API exists)
      const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]')
      const activeUsers = allUsers.filter((u: any) => u.status === 'active').length

      // Calculate revenue (default fallback value)
      let totalRevenue = 0

      // Fetch real subscription stats from backend
      try {
        const response = await subscriptionAPI.getRevenueTotals()
        if (response) {
          const statsData: any = response.data || response
          totalRevenue = statsData.totalRevenue || 0
        }
      } catch (error) {
        console.error('Failed to load subscription stats:', error)
        // Use localStorage fallback or default value
        const cachedRevenue = localStorage.getItem('admin_dashboard_revenue')
        totalRevenue = cachedRevenue ? JSON.parse(cachedRevenue) : 0
      }

      setStats({
        totalUsers: allUsers.length,
        totalRevenue,
        activeUsers
      })

      // Cache revenue for offline use
      localStorage.setItem('admin_dashboard_revenue', JSON.stringify(totalRevenue))

      // Generate monthly data for charts - using realistic random distribution
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
      const monthlyChartData = months.map((month, index) => ({
        month,
        revenue: Math.max(100000, Math.floor(totalRevenue / 12 + (Math.random() - 0.5) * totalRevenue / 6))
      }))
      setMonthlyData(monthlyChartData)

      // Recent activities with proper typing
      const activities: any[] = [
        {
          id: '1',
          user: 'Nguyễn Văn A',
          action: 'Thêm chi tiêu mới',
          amount: '150,000đ',
          time: dayjs().subtract(5, 'minute').fromNow(),
          type: 'expense'
        },
        {
          id: '2',
          user: 'Trần Thị B',
          action: 'Đăng ký tài khoản',
          time: dayjs().subtract(30, 'minute').fromNow(),
          type: 'register'
        },
        {
          id: '3',
          user: 'Lê Văn C',
          action: 'Vượt ngân sách',
          amount: '2,500,000đ',
          time: dayjs().subtract(2, 'hour').fromNow(),
          type: 'warning'
        },
        {
          id: '4',
          user: 'Phạm Thị D',
          action: 'Thanh toán đăng ký Premium',
          amount: '199,000đ',
          time: dayjs().subtract(5, 'hour').fromNow(),
          type: 'payment'
        }
      ]
      setRecentActivities(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set safe defaults on error
      setStats({
        totalUsers: 0,
        totalRevenue: 0,
        activeUsers: 0
      })
      setRecentActivities([])
    }
  }

  const loadAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      const [blogResponse, revenueResponse] = await Promise.allSettled([
        blogAPI.getStatusStats(),
        subscriptionAPI.getRevenueTotals(),
      ])

      // Handle blog stats with proper error handling
      if (blogResponse.status === 'fulfilled' && blogResponse.value) {
        setBlogStats(blogResponse.value || {})
      } else {
        console.error('Failed to fetch blog stats:', blogResponse.status === 'rejected' ? blogResponse.reason : 'Empty response')
        setBlogStats({})
      }

      // Handle revenue stats with proper error handling
      if (revenueResponse.status === 'fulfilled' && revenueResponse.value) {
        const revenueData: any = revenueResponse.value?.data || revenueResponse.value || { totalRevenue: 0 }
        setRevenueTotals(revenueData)
      } else {
        console.error('Failed to fetch revenue stats:', revenueResponse.status === 'rejected' ? revenueResponse.reason : 'Empty response')
        setRevenueTotals({ totalRevenue: 0 })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      setBlogStats({})
      setRevenueTotals({ totalRevenue: 0 })
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return <DollarOutlined style={{ color: '#1890ff' }} />
      case 'register':
        return <UserOutlined style={{ color: '#52c41a' }} />
      case 'warning':
        return <BellOutlined style={{ color: '#faad14' }} />
      case 'payment':
        return <DollarOutlined style={{ color: '#722ed1' }} />
      default:
        return <CheckCircleOutlined />
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Admin Dashboard</Title>

      {/* User Statistics Cards */}
      <Card title="Thống kê Hệ thống" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingExpenseStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Số người dùng có chi tiêu"
                  value={expenseStats?.totalUsers || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingBudgetStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Số người dùng có ngân sách"
                  value={budgetStats?.totalUsers || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingExpenseStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Tổng số chi tiêu"
                  value={expenseStats?.totalExpenses || 0}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingBudgetStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Tổng số ngân sách"
                  value={budgetStats?.totalBudgets || 0}
                  prefix={<PieChartOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingOcrStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Tổng số lượt quét OCR"
                  value={ocrStats?.totalJobs || 0}
                  prefix={<ScanOutlined />}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingOcrStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Số người dùng dùng OCR"
                  value={ocrStats?.totalUsers || 0}
                  prefix={<CameraOutlined />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingAiStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Tổng yêu cầu AI"
                  value={aiStats?.totalRequests || 0}
                  prefix={<RobotOutlined />}
                  valueStyle={{ color: '#8B5CF6' }}
                />
              </Spin>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Spin spinning={isLoadingAiStats} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Statistic
                  title="Người dùng dùng AI"
                  value={aiStats?.totalUsers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#6366F1' }}
                />
              </Spin>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Analytics Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingAnalytics} onClick={() => navigate('/admin/blog-analytics')} hoverable>
            <Statistic
              title="Blog chờ duyệt"
              value={blogStats.pending || 0}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
            <Tag color="blue" style={{ marginTop: 8 }}>Tổng: {(blogStats.pending || 0) + (blogStats.published || 0) + (blogStats.rejected || 0) + (blogStats.draft || 0)}</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loadingAnalytics} onClick={() => navigate('/admin/revenue')} hoverable>
            <Statistic
              title="Doanh thu (tổng)"
              value={revenueTotals.totalRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: '#10B981' }}
            />
            <Tag color="green" style={{ marginTop: 8 }}>Active: {revenueTotals.activeSubscriptions ?? 0}</Tag>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Thống kê theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Doanh thu" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thông báo nhanh">
            <List
              dataSource={[
                { title: 'Người dùng mới', count: 5, status: 'processing' },
                { title: 'Yêu cầu hỗ trợ', count: 2, status: 'error' },
                { title: 'Báo cáo chờ duyệt', count: 1, status: 'default' }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{item.title}</Text>
                    <Tag color={item.status}>{item.count}</Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Hoạt động gần đây">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={getActivityIcon(item.type)} />}
                    title={
                      <Space>
                        <Text strong>{item.user}</Text>
                        <Text type="secondary">{item.action}</Text>
                        {item.amount && <Text type="success">{item.amount}</Text>}
                      </Space>
                    }
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
