import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, List, Avatar, Spin } from 'antd'
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
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import subscriptionAPI from '../../services/api/subscriptionAPI'
import { useGetExpenseAdminStats, useGetBudgetAdminStats, useGetOcrAdminStats, useGetAiAdminStats } from '../../services/queries'
import blogAPI from '../../services/api/blogAPI'
import adminApiService from '../../services/api/adminApiService'
import './AdminDashboard.css'

const { Title, Text } = Typography

const loadingIndicator = <LoadingOutlined style={{ fontSize: 20 }} />

const formatNumber = (value?: number) => Number(value || 0).toLocaleString('vi-VN')

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
  const [revenueByPlan, setRevenueByPlan] = useState<any[]>([])
  const [loadingCharts, setLoadingCharts] = useState(false)

  const { data: expenseStats, isLoading: isLoadingExpenseStats } = useGetExpenseAdminStats()
  const { data: budgetStats, isLoading: isLoadingBudgetStats } = useGetBudgetAdminStats()
  const { data: ocrStats, isLoading: isLoadingOcrStats } = useGetOcrAdminStats()
  const { data: aiStats, isLoading: isLoadingAiStats } = useGetAiAdminStats()

  useEffect(() => {
    loadDashboardData()
    loadAnalytics()
    loadChartData()
  }, [])

  const loadChartData = async () => {
    setLoadingCharts(true)
    try {
      const revenueByPlanData = await subscriptionAPI.getRevenueByPlan()
      const transformedRevenueData = Array.isArray(revenueByPlanData)
        ? revenueByPlanData.map((item: any) => ({
            plan: item._id?.planName || item.plan || 'Unknown',
            revenue: item.totalRevenue || item.revenue || 0,
            count: item.subscriptionCount || item.count || 0
          }))
        : []
      setRevenueByPlan(transformedRevenueData)
    } catch (error) {
      console.error('Error loading chart data:', error)
      setRevenueByPlan([])
    } finally {
      setLoadingCharts(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      let totalUsers = 0
      let activeUsers = 0
      let totalRevenue = 0

      try {
        const userStatsResponse = await adminApiService.getUserStats()
        const userStats: any = userStatsResponse?.data || userStatsResponse || {}
        totalUsers = userStats.total || userStats.totalUsers || 0
        activeUsers = userStats.active || userStats.activeUsers || 0
      } catch (error) {
        console.error('Failed to load user stats:', error)
      }

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
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setStats({
        totalUsers: 0,
        totalRevenue: 0,
        activeUsers: 0
      })
    }
  }

  const loadAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      const [blogResponse, revenueResponse] = await Promise.allSettled([
        blogAPI.getStatusStats(),
        subscriptionAPI.getRevenueTotals()
      ])

      if (blogResponse.status === 'fulfilled' && blogResponse.value) {
        setBlogStats(blogResponse.value || {})
      } else {
        console.error('Failed to fetch blog stats:', blogResponse.status === 'rejected' ? blogResponse.reason : 'Empty response')
        setBlogStats({})
      }

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

  const blogTotal =
    (blogStats.pending || 0) +
    (blogStats.published || 0) +
    (blogStats.rejected || 0) +
    (blogStats.draft || 0)

  const activeRate = stats.totalUsers
    ? Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)
    : 0

  const kpiCards = [
    {
      key: 'users',
      title: 'Tổng người dùng',
      value: formatNumber(stats.totalUsers),
      hint: `${formatNumber(stats.activeUsers)} đang hoạt động (${activeRate}% hoạt động)`,
      icon: <TeamOutlined />,
      tone: 'primary'
    },
    {
      key: 'revenue',
      title: 'Tổng doanh thu',
      value: `${formatNumber(stats.totalRevenue)} đ`,
      hint: `${formatNumber(revenueTotals.activeSubscriptions || 0)} gói đang hoạt động`,
      icon: <DollarOutlined />,
      tone: 'purple'
    },
    {
      key: 'blogs',
      title: 'Blog chờ duyệt',
      value: formatNumber(blogStats.pending || 0),
      hint: `Tổng bài: ${formatNumber(blogTotal)}`,
      icon: <BellOutlined />,
      tone: 'amber',
      onClick: () => navigate('/admin/blogs/pending')
    },
    {
      key: 'ai',
      title: 'Tương tác AI',
      value: formatNumber(aiStats?.totalMessages || 0),
      hint: `${formatNumber(aiStats?.totalUsers || 0)} người dùng AI`,
      icon: <RobotOutlined />,
      tone: 'teal'
    }
  ]

  const systemStats = [
    {
      key: 'expense-users',
      title: 'Số người dùng có chi tiêu',
      value: expenseStats?.totalUsers || 0,
      icon: <TeamOutlined />,
      color: '#1890ff',
      loading: isLoadingExpenseStats
    },
    {
      key: 'budget-users',
      title: 'Số người dùng có ngân sách',
      value: budgetStats?.totalUsers || 0,
      icon: <TeamOutlined />,
      color: '#722ed1',
      loading: isLoadingBudgetStats
    },
    {
      key: 'total-expenses',
      title: 'Tổng số chi tiêu',
      value: expenseStats?.totalExpenses || 0,
      icon: <ShoppingOutlined />,
      color: '#52c41a',
      loading: isLoadingExpenseStats
    },
    {
      key: 'total-budgets',
      title: 'Tổng số ngân sách',
      value: budgetStats?.totalBudgets || 0,
      icon: <PieChartOutlined />,
      color: '#faad14',
      loading: isLoadingBudgetStats
    },
    {
      key: 'ocr-jobs',
      title: 'Tổng số lượt quét OCR',
      value: ocrStats?.totalJobs || 0,
      icon: <ScanOutlined />,
      color: '#13c2c2',
      loading: isLoadingOcrStats
    },
    {
      key: 'ocr-users',
      title: 'Số người dùng dùng OCR',
      value: ocrStats?.totalUsers || 0,
      icon: <CameraOutlined />,
      color: '#eb2f96',
      loading: isLoadingOcrStats
    },
    {
      key: 'ai-messages',
      title: 'Tổng tin nhắn AI',
      value: aiStats?.totalMessages || 0,
      icon: <RobotOutlined />,
      color: '#8B5CF6',
      loading: isLoadingAiStats
    },
    {
      key: 'ai-users',
      title: 'Tổng người dùng AI',
      value: aiStats?.totalUsers || 0,
      icon: <UserOutlined />,
      color: '#6366F1',
      loading: isLoadingAiStats
    }
  ]

  const quickSignals = [
    {
      key: 'activity-rate',
      title: 'Tỷ lệ người dùng hoạt động',
      value: `${activeRate}%`,
      description: `${formatNumber(stats.activeUsers)} / ${formatNumber(stats.totalUsers)} người dùng`,
      icon: <UserOutlined />,
      color: '#0EA5E9'
    },
    {
      key: 'blogs-pending',
      title: 'Blog chờ duyệt',
      value: formatNumber(blogStats.pending || 0),
      description: 'Mở danh sách bài cần kiểm duyệt',
      icon: <BellOutlined />,
      color: '#F59E0B',
      onClick: () => navigate('/admin/blogs/pending')
    },
    {
      key: 'revenue-total',
      title: 'Tổng doanh thu',
      value: `${formatNumber(stats.totalRevenue)} đ`,
      description: `${formatNumber(revenueTotals.activeSubscriptions || 0)} gói đang hoạt động`,
      icon: <DollarOutlined />,
      color: '#722ed1'
    },
    {
      key: 'ai-ocr',
      title: 'OCR & AI đang chạy',
      value: `${formatNumber(ocrStats?.totalJobs || 0)} / ${formatNumber(aiStats?.totalMessages || 0)}`,
      description: `${formatNumber(aiStats?.totalUsers || 0)} người dùng AI`,
      icon: <CheckCircleOutlined />,
      color: '#10B981'
    }
  ]

  const blogDataAvailable = Object.values(blogStats).some(value => Boolean(value))

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Title level={2} className="dashboard-heading">Admin Dashboard</Title>
          <Text type="secondary">Ảnh tổng quan realtime các dịch vụ FEPA.</Text>
        </div>
        <div className="kpi-grid">
          {kpiCards.map(card => (
            <Card
              key={card.key}
              className={`kpi-card kpi-${card.tone}`}
              bordered={false}
              onClick={card.onClick}
              hoverable={Boolean(card.onClick)}
            >
              <div className="kpi-icon">{card.icon}</div>
              <div className="kpi-meta">
                <Text className="kpi-label">{card.title}</Text>
                <div className="kpi-value">{card.value}</div>
                {card.hint && <Text className="kpi-hint">{card.hint}</Text>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title="Thống kê Hệ thống" className="section-card">
            <div className="stat-grid">
              {systemStats.map(item => (
                <Card key={item.key} size="small" className="stat-card" bodyStyle={{ padding: 16 }}>
                  <Spin spinning={item.loading} indicator={loadingIndicator}>
                    <div className="stat-card__top">
                      <Text className="stat-card__title">{item.title}</Text>
                      <div className="stat-card__icon" style={{ color: item.color }}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="stat-card__value" style={{ color: item.color }}>
                      {formatNumber(item.value)}
                    </div>
                    {item.extra && <Text type="secondary">{item.extra}</Text>}
                  </Spin>
                </Card>
              ))}
            </div>
          </Card>

          <div className="chart-grid">
            <Card title="Thống kê Blog theo trạng thái" loading={loadingAnalytics} className="section-card">
              <div className="chart-shell">
                {blogDataAvailable ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Đã duyệt', value: blogStats.published || 0, color: '#52c41a' },
                          { name: 'Chờ duyệt', value: blogStats.pending || 0, color: '#faad14' },
                          { name: 'Nháp', value: blogStats.draft || 0, color: '#1890ff' },
                          { name: 'Từ chối', value: blogStats.rejected || 0, color: '#ff4d4f' }
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={85}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Đã duyệt', value: blogStats.published || 0, color: '#52c41a' },
                          { name: 'Chờ duyệt', value: blogStats.pending || 0, color: '#faad14' },
                          { name: 'Nháp', value: blogStats.draft || 0, color: '#1890ff' },
                          { name: 'Từ chối', value: blogStats.rejected || 0, color: '#ff4d4f' }
                        ]
                          .filter(item => item.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty">
                    <Text type="secondary">Chưa có dữ liệu blog</Text>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Doanh thu theo gói Subscription" loading={loadingCharts} className="section-card">
              <div className="chart-shell">
                {revenueByPlan.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByPlan}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plan" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: string, props: any) => {
                          const key = props?.dataKey
                          if (key === 'revenue') {
                            return [`${Number(value).toLocaleString()}đ`, 'Doanh thu']
                          }
                          return [Number(value).toLocaleString(), name]
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#722ed1" name="Doanh thu" />
                      <Bar dataKey="count" fill="#1890ff" name="Số lượng" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="chart-empty">
                    <Text type="secondary">Chưa có dữ liệu doanh thu</Text>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Col>

        <Col xs={24} xl={8}>
          <Card title="Tín hiệu nhanh" className="section-card quick-card">
            <List
              itemLayout="horizontal"
              dataSource={quickSignals}
              renderItem={item => (
                <List.Item
                  key={item.key}
                  className={item.onClick ? 'clickable' : ''}
                  onClick={item.onClick}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: item.color, color: '#fff' }} icon={item.icon} />}
                    title={<div className="quick-title">{item.title}</div>}
                    description={<Text type="secondary">{item.description}</Text>}
                  />
                  <div className="quick-value">{item.value}</div>
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
