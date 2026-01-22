import React, { useMemo } from 'react'
import { Card, Row, Col, Statistic, Spin, Empty, Tag, Space } from 'antd'
import { CrownOutlined, CheckCircleOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { useGetStats } from '../services/queries'
import type { SubscriptionStatsMap } from '../services/api/subscriptionAPI'

const SubscriptionStats: React.FC = () => {
  const { data: rawStats, isLoading, error } = useGetStats()

  // Chuẩn hóa dữ liệu thống kê: ưu tiên data.map nếu có wrapper
  const statsMap: SubscriptionStatsMap = useMemo(() => {
    if (!rawStats) return {}
    const maybeData = (rawStats as any)?.data
    if (maybeData && typeof maybeData === 'object') return maybeData as SubscriptionStatsMap
    return rawStats as SubscriptionStatsMap
  }, [rawStats])

  const planEntries = Object.entries(statsMap)
  const totalActiveSubscriptions = planEntries.reduce((sum, [, value]) => sum + (value?.count || 0), 0)
  const totalPlans = planEntries.length

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
      <Card title="Thống kê Subscription" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* Tổng subscription active */}
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Subscription đang hoạt động"
                value={totalActiveSubscriptions}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Số gói có thống kê"
                value={totalPlans}
                prefix={<CrownOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Subscriptions by Plan */}
        {planEntries.length > 0 ? (
          <Card
            title="Số lượng subscription theo gói"
            style={{ marginTop: '24px' }}
          >
            <Space wrap>
              {planEntries.map(([planId, info]) => (
                <Tag
                  key={planId}
                  color="blue"
                  style={{ padding: '8px 12px', fontSize: '14px' }}
                >
                  <strong>{info?.name || 'N/A'}:</strong> {info?.count || 0} subscription
                </Tag>
              ))}
            </Space>
          </Card>
        ) : (
          <Card style={{ marginTop: '24px' }}>
            <Empty description="Chưa có dữ liệu subscription" />
          </Card>
        )}
      </Card>
    </Spin>
  )
}

export default SubscriptionStats
