import { useMemo } from 'react'
import { Card, Col, Row, Statistic, Progress, Space, Tag, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts'
import { CheckCircleOutlined, CloseCircleOutlined, FieldTimeOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import aiAPI from '../../services/api/aiAPI'
import { LoadingOverlay } from '../../components/LoadingOverlay'

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6']

export default function AiAnalytics() {
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['ai-admin-stats'],
    queryFn: aiAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })

  const data = rawData as any

  const requestsByType = useMemo(() => {
    const types = data?.requestsByType || {}
    return Object.entries(types).map(([name, value]) => ({ name, value }))
  }, [data])

  const successRate = data?.successRate ?? 0
  const failedRate = Math.max(0, 100 - successRate)

  const avgTime = data?.averageProcessingTime ?? 0

  if (isLoading) {
    return <LoadingOverlay fullscreen loading tip="Đang tải thống kê AI..." />
  }

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Thống kê AI Service</Typography.Title>
        <Tag color="purple">Realtime cập nhật</Tag>
      </Space>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-card">
            <Statistic
              title="Tổng yêu cầu"
              value={data?.totalRequests || 0}
              prefix={<RobotOutlined style={{ color: '#8B5CF6' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-card">
            <Statistic
              title="Thành công"
              value={data?.successfulRequests || 0}
              prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-card">
            <Statistic
              title="Thất bại"
              value={data?.failedRequests || 0}
              prefix={<CloseCircleOutlined style={{ color: '#F43F5E' }} />}
              valueStyle={{ color: '#F43F5E' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-card">
            <Statistic
              title="Người dùng"
              value={data?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#F59E0B' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card className="shadow-card" title="Tỉ lệ thành công">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Progress percent={Math.round(successRate)} status="active" strokeColor="#10B981" />
              <Space>
                <Tag color="green">Thành công: {Math.round(successRate)}%</Tag>
                <Tag color="red">Thất bại: {Math.round(failedRate)}%</Tag>
              </Space>
              <Space align="center">
                <FieldTimeOutlined />
                <Typography.Text>Thời gian xử lý trung bình: {avgTime ? `${avgTime.toFixed(2)}s` : 'N/A'}</Typography.Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="shadow-card" title="Phân loại yêu cầu">
            <div style={{ height: 280 }}>
              {requestsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={requestsByType}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {requestsByType.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography.Text>Chưa có dữ liệu phân loại.</Typography.Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-card" title="Khối lượng xử lý theo loại">
        <div style={{ height: 320 }}>
          {requestsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography.Text>Chưa có dữ liệu khối lượng.</Typography.Text>
          )}
        </div>
      </Card>
    </div>
  )
}
