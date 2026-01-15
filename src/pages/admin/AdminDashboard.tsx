import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Tag, Space, Typography, List, Avatar } from 'antd'
import {
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  BellOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'
import subscriptionAPI from '../../services/api/subscriptionAPI'

const { Title, Text } = Typography

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
    initializeMockData()
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

      // Calculate revenue (simulated)
      let totalRevenue = 1500000

      // Fetch real subscription stats
      try {
        const subStats = await subscriptionAPI.getStats()
        if (subStats?.data) {
          totalRevenue = subStats.data.totalRevenue || totalRevenue
          // We can also use subStats.data.activeSubscriptions if available
        }
      } catch (error) {
        console.error('Failed to load subscription stats:', error)
      }

      setStats({
        totalUsers: allUsers.length,
        totalRevenue,
        activeUsers
      })

      // Generate monthly data for charts
      const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
      const monthlyChartData = months.map((month) => ({
        month,
        revenue: Math.floor(Math.random() * 500000) + 200000
      }))
      setMonthlyData(monthlyChartData)

      // Recent activities
      const activities = [
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

      {/* Charts and Quick Notifications */}
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
