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
import adminApiService from '../../services/api/adminApiService'
import { AuthDebugPanel } from '../../components/AuthDebugPanel'

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
    loadAnalytics()
  }, [])

  const loadDashboardData = async () => {
    try {
      let totalUsers = 0
      let activeUsers = 0
      let totalRevenue = 0

      // Fetch user stats from auth service
      try {
        const userStatsResponse = await adminApiService.getUserStats()
        const userStats: any = userStatsResponse?.data || userStatsResponse || {}
        totalUsers = userStats.total || userStats.totalUsers || 0
        activeUsers = userStats.active || userStats.activeUsers || 0
      } catch (error) {
        console.error('Failed to load user stats:', error)
      }

      // Fetch revenue stats from subscription service
      try {
        const response = await subscriptionAPI.getRevenueTotals()
        if (response) {
          const statsData: any = response.data || response
          totalRevenue = statsData.totalRevenue || 0
        }
      } catch (error) {
        console.error('Failed to load subscription stats:', error)
      }

      setStats({
        totalUsers,
        totalRevenue,
        activeUsers
      })

      // TODO: Get real monthly revenue data from subscriptionAPI.getRevenueOverTime()
      setMonthlyData([])

      // TODO: Get real recent activities from backend
      setRecentActivities([])
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

      {/* Auth Debug Panel - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginBottom: 24 }}>
          <AuthDebugPanel compact />
        </div>
      )}

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

      {/* Core System Statistics */}
      <Card title="Thống kê hệ thống chính" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Tổng người dùng"
                value={stats.totalUsers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Người dùng hoạt động"
                value={stats.activeUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Tổng doanh thu"
                value={stats.totalRevenue}
                prefix={<DollarOutlined />}
                suffix="đ"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable loading={loadingAnalytics} onClick={() => navigate('/admin/blogs/pending')}>
              <Statistic
                title="Blog chờ duyệt"
                value={blogStats.pending || 0}
                prefix={<BellOutlined />}
                valueStyle={{ color: '#F59E0B' }}
              />
              <Tag color="blue" style={{ marginTop: 8 }}>Tổng: {(blogStats.pending || 0) + (blogStats.published || 0) + (blogStats.rejected || 0) + (blogStats.draft || 0)}</Tag>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Thống kê theo tháng">
            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Doanh thu" />
              </LineChart>
            </ResponsiveContainer>              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <Text type="secondary">Chưa có dữ liệu thống kê</Text>
                </div>
              )}
            </div>          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thông báo nhanh">
            <List
              dataSource={[
                // TODO: Replace with real data from backend
                // { title: 'Người dùng mới', count: newUsersCount, status: 'processing' },
                // { title: 'Yêu cầu hỗ trợ', count: supportRequestsCount, status: 'error' },
                // { title: 'Báo cáo chờ duyệt', count: pendingReportsCount, status: 'default' }
              ]}
              locale={{ emptyText: 'Chưa có thông báo' }}
              renderItem={(item: any) => (
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
            {recentActivities.length > 0 ? (
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
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">Chưa có hoạt động gần đây</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
