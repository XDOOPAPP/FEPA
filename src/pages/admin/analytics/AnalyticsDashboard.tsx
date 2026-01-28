import { useQuery } from '@tanstack/react-query'
import { Card, Col, Row, Tabs, TabsProps, Statistic, Space, Tag, Empty, Spin, Typography, Alert } from 'antd'
import {
  RobotOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MessageOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons'
import aiAPI from '../../../services/api/aiAPI'
import ocrAPI from '../../../services/api/ocrAPI'
import { LoadingOverlay } from '../../../components/common/LoadingOverlay'
import AiAnalytics from './AiAnalytics'
import OcrAnalytics from './OcrAnalytics'

export default function AnalyticsDashboard() {
  const { data: aiData, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-admin-stats'],
    queryFn: aiAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })

  const { data: ocrData, isLoading: ocrLoading } = useQuery({
    queryKey: ['ocr-admin-stats'],
    queryFn: ocrAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })

  const aiStats = aiData as any
  const ocrStats = ocrData as any

  const items: TabsProps['items'] = [
    {
      key: 'ai',
      label: (
        <span>
          <RobotOutlined />
          AI Analytics
        </span>
      ),
      children: <AiAnalytics />,
    },
    {
      key: 'ocr',
      label: (
        <span>
          <ScanOutlined />
          OCR Analytics
        </span>
      ),
      children: <OcrAnalytics />,
    },
  ]

  if (aiLoading || ocrLoading) {
    return <LoadingOverlay fullscreen loading tip="Đang tải dữ liệu..." />
  }

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            📈 Dashboard Thống kê Advanced
          </Typography.Title>
          <Typography.Text type="secondary">AI & OCR Service Analytics</Typography.Text>
        </div>
        <Tag color="purple" style={{ fontSize: 13, padding: '6px 12px' }}>
          🔄 Cập nhật real-time
        </Tag>
      </Space>

      {/* Quick Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>AI Conversations</span>}
              value={aiStats?.totalConversations || 0}
              prefix={<MessageOutlined style={{ color: '#8B5CF6', marginRight: 8 }} />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>AI Users</span>}
              value={aiStats?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#10B981', marginRight: 8 }} />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>OCR Jobs</span>}
              value={ocrStats?.totalJobs || 0}
              prefix={<ScanOutlined style={{ color: '#0EA5E9', marginRight: 8 }} />}
              valueStyle={{ color: '#0EA5E9' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderRadius: 8,
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>OCR Success Rate</span>}
              value={`${(ocrStats?.successRate || 0).toFixed(1)}%`}
              prefix={<CheckCircleOutlined style={{ color: '#F59E0B', marginRight: 8 }} />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Tabs items={items} size="large" />
      </Card>
    </div>
  )
}
