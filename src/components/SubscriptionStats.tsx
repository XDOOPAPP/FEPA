import React from 'react'
import { Card, Row, Col, Statistic, Spin, Empty, Tag, Space } from 'antd'
import { CrownOutlined, CheckCircleOutlined, DollarOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { useGetStats } from '../services/queries'

interface StatsData {
  totalPlans: number
  activeSubscriptions: number
  totalRevenue: number
  subscriptionsByPlan: Record<string, number>
}

const SubscriptionStats: React.FC = () => {
  const { data: statsData, isLoading, error } = useGetStats()

  const stats: StatsData = statsData || {
    totalPlans: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    subscriptionsByPlan: {},
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  if (error) {
    return (
      <Card style={{ marginBottom: '24px' }}>
        <Empty
          description={
            <Space direction="vertical">
              <WarningOutlined style={{ fontSize: '32px', color: '#ff7a45' }} />
              <span>Không thể tải thống kê</span>
            </Space>
          }
        />
      </Card>
    )
  }

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 48 }} />}>
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* Total Plans */}
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Tổng gói subscription"
                value={stats.totalPlans}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          {/* Active Subscriptions */}
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Subscription đang hoạt động"
                value={stats.activeSubscriptions}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          {/* Total Revenue */}
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Tổng doanh thu"
                value={stats.totalRevenue}
                prefix={<DollarOutlined />}
                formatter={() => formatCurrency(stats.totalRevenue)}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>

          {/* Average Revenue Per Subscription */}
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Doanh thu trung bình/subscription"
                value={
                  stats.activeSubscriptions > 0
                    ? stats.totalRevenue / stats.activeSubscriptions
                    : 0
                }
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(value as number)}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Subscriptions by Plan */}
        {Object.keys(stats.subscriptionsByPlan).length > 0 && (
          <Card
            title="Số lượng subscription theo gói"
            style={{ marginTop: '24px' }}
          >
            <Space wrap>
              {Object.entries(stats.subscriptionsByPlan).map(([planName, count]) => (
                <Tag
                  key={planName}
                  color="blue"
                  style={{ padding: '8px 12px', fontSize: '14px' }}
                >
                  <strong>{planName}:</strong> {count} subscription
                </Tag>
              ))}
            </Space>
          </Card>
        )}

        {/* Empty State */}
        {stats.totalPlans === 0 && (
          <Card style={{ marginTop: '24px' }}>
            <Empty description="Chưa có dữ liệu subscription" />
          </Card>
        )}
      </div>
    </Spin>
  )
}

export default SubscriptionStats
