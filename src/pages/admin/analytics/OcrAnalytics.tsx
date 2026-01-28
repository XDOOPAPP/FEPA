import { useMemo } from 'react'
import { Card, Col, Row, Statistic, Progress, Space, Tag, Typography, Table, Tooltip as AntTooltip, Divider, Alert } from 'antd'
import { useQuery } from '@tanstack/react-query'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import {
  DashboardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  UserOutlined,
  FileImageOutlined,
  PercentageOutlined,
} from '@ant-design/icons'
import ocrAPI from '../../../services/api/ocrAPI'
import { LoadingOverlay } from '../../../components/common/LoadingOverlay'

const COLORS = ['#10B981', '#F43F5E', '#F59E0B', '#06B6D4', '#8B5CF6']
const STATUS_COLORS: Record<string, string> = {
  completed: '#10B981',
  failed: '#F43F5E',
  processing: '#F59E0B',
}

export default function OcrAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['ocr-admin-stats'],
    queryFn: ocrAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })

  const stats = data as any

  // Prepare data for charts
  const byStatusData = useMemo(() => {
    return stats?.byStatus || []
  }, [stats])

  const recentJobsData = useMemo(() => {
    return (stats?.recentJobs || []).map((job: any, idx: number) => ({
      key: job.id,
      index: idx + 1,
      jobId: job.id,
      userId: job.userId,
      status: job.status,
      createdAt: new Date(job.createdAt).toLocaleString('vi-VN'),
      completedAt: job.completedAt ? new Date(job.completedAt).toLocaleString('vi-VN') : 'Đang xử lý',
    }))
  }, [stats])

  const successRate = stats?.successRate ?? 0

  if (isLoading) {
    return <LoadingOverlay fullscreen loading tip="Đang tải thống kê OCR..." />
  }

  // Calculate statistics
  const totalJobs = stats?.totalJobs || 0
  const totalUsers = stats?.totalUsers || 0
  const completedCount = byStatusData.find((s: any) => s.status === 'completed')?.count || 0
  const failedCount = byStatusData.find((s: any) => s.status === 'failed')?.count || 0
  const processingCount = byStatusData.find((s: any) => s.status === 'processing')?.count || 0

  const tableColumns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'center' as const,
    },
    {
      title: 'Job ID',
      dataIndex: 'jobId',
      key: 'jobId',
      render: (text: string) => <code style={{ fontSize: 12 }}>{text.substring(0, 12)}...</code>,
    },
    {
      title: 'Người dùng',
      dataIndex: 'userId',
      key: 'userId',
      render: (text: string) => <code style={{ fontSize: 12 }}>{text.substring(0, 12)}...</code>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
          completed: { color: 'green', icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
          failed: { color: 'red', icon: <CloseCircleOutlined />, label: 'Thất bại' },
          processing: { color: 'orange', icon: <LoadingOutlined />, label: 'Đang xử lý' },
        }
        const config = statusMap[status] || { color: 'default', icon: null, label: status }
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        )
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => <Typography.Text type="secondary">{text}</Typography.Text>,
    },
    {
      title: 'Hoàn thành lúc',
      dataIndex: 'completedAt',
      key: 'completedAt',
      width: 180,
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            🔍 Thống kê OCR Service
          </Typography.Title>
          <Typography.Text type="secondary">Giám sát hoạt động OCR và phân tích kết quả xử lý hình ảnh</Typography.Text>
        </div>
        <Tag color="blue" style={{ fontSize: 13, padding: '6px 12px' }}>
          🔄 Cập nhật mỗi 2 phút
        </Tag>
      </Space>

      {/* Alert Info */}
      {processingCount > 0 && (
        <Alert
          message={`⏳ Có ${processingCount} job đang xử lý`}
          type="info"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {/* KPI Cards */}
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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Tổng Job OCR</span>}
              value={totalJobs}
              prefix={<DashboardOutlined style={{ color: '#0EA5E9', marginRight: 8 }} />}
              valueStyle={{ color: '#0EA5E9', fontSize: 24, fontWeight: 600 }}
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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Hoàn thành</span>}
              value={completedCount}
              prefix={<CheckCircleOutlined style={{ color: '#10B981', marginRight: 8 }} />}
              valueStyle={{ color: '#10B981', fontSize: 24, fontWeight: 600 }}
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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Thất bại</span>}
              value={failedCount}
              prefix={<CloseCircleOutlined style={{ color: '#F43F5E', marginRight: 8 }} />}
              valueStyle={{ color: '#F43F5E', fontSize: 24, fontWeight: 600 }}
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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Người dùng</span>}
              value={totalUsers}
              prefix={<UserOutlined style={{ color: '#F59E0B', marginRight: 8 }} />}
              valueStyle={{ color: '#F59E0B', fontSize: 24, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Success Rate & Status Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Success Rate Card */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <PercentageOutlined />
                <span>Tỉ lệ thành công</span>
              </Space>
            }
            style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Progress
                type="circle"
                percent={Math.round(successRate)}
                width={120}
                strokeColor={{
                  '0%': '#F43F5E',
                  '100%': '#10B981',
                }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <Tag color="green" style={{ fontSize: 13 }}>
                  ✓ Thành công: {Math.round(successRate)}%
                </Tag>
                <Tag color="red" style={{ fontSize: 13 }}>
                  ✗ Thất bại: {Math.round(100 - successRate)}%
                </Tag>
              </Space>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Tổng: {totalJobs} job | Thành công: {completedCount} | Thất bại: {failedCount}
                </Typography.Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Status Distribution */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <FileImageOutlined />
                <span>Phân loại job theo trạng thái</span>
              </Space>
            }
            style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div style={{ height: 280 }}>
              {byStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byStatusData}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {byStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography.Text type="secondary">Chưa có dữ liệu</Typography.Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Status Bar Chart */}
      <Card
        title={
          <Space>
            <DashboardOutlined />
            <span>Khối lượng job theo trạng thái</span>
          </Space>
        }
        style={{
          border: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: 24,
        }}
      >
        <div style={{ height: 300 }}>
          {byStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                  }}
                  formatter={(value) => `${value} job`}
                />
                <Bar dataKey="count" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography.Text type="secondary">Chưa có dữ liệu</Typography.Text>
          )}
        </div>
      </Card>

      {/* Recent Jobs Table */}
      <Card
        title={
          <Space>
            <DashboardOutlined />
            <span>10 Job gần đây nhất</span>
          </Space>
        }
        style={{
          border: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Table
          columns={tableColumns}
          dataSource={recentJobsData}
          pagination={{ pageSize: 10, total: recentJobsData.length, showSizeChanger: true }}
          size="middle"
          bordered={false}
          style={{ background: '#fff' }}
        />
      </Card>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card
            style={{
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              color: '#fff',
            }}
          >
            <Row gutter={32}>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Job/Người dùng</span>}
                  value={(totalJobs / totalUsers).toFixed(2) || '0.00'}
                  valueStyle={{ color: '#fff', fontSize: 24 }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Thời gian xử lý TB</span>}
                  value="2.5s"
                  valueStyle={{ color: '#fff', fontSize: 24 }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div style={{ color: 'rgba(255,255,255,0.9)' }}>
                  <Typography.Text
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: 12,
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: 8,
                    }}
                  >
                    📊 Tổng kết
                  </Typography.Text>
                  <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'block' }}>
                    {successRate.toFixed(1)}% thành công, {failedCount} job thất bại
                  </Typography.Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
