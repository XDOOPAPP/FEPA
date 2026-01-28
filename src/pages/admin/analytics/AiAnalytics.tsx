import { useMemo } from 'react'
import { Card, Col, Row, Statistic, Progress, Space, Tag, Typography, Table, Tooltip as AntTooltip, Divider } from 'antd'
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
  LineChart,
  Line,
} from 'recharts'
import {
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
  BgColorsOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import aiAPI from '../../../services/api/aiAPI'
import { LoadingOverlay } from '../../../components/common/LoadingOverlay'

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#EC4899']

export default function AiAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-admin-stats'],
    queryFn: aiAPI.getAdminStats,
    staleTime: 2 * 60 * 1000,
  })

  const stats = data as any

  // Prepare data for charts
  const messagesByRoleData = useMemo(() => {
    return stats?.messagesByRole || []
  }, [stats])

  const recentConversationsData = useMemo(() => {
    return (stats?.recentConversations || []).map((conv: any, idx: number) => ({
      key: conv.id,
      index: idx + 1,
      conversationId: conv.id,
      userId: conv.userId,
      messageCount: conv.messageCount,
      createdAt: new Date(conv.createdAt).toLocaleString('vi-VN'),
    }))
  }, [stats])

  const avgMessagesPerConv = parseFloat(stats?.avgMessagesPerConversation || '0')

  if (isLoading) {
    return <LoadingOverlay fullscreen loading tip="Đang tải thống kê AI..." />
  }

  const tableColumns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'ID Cuộc hội thoại',
      dataIndex: 'conversationId',
      key: 'conversationId',
      render: (text: string) => <code style={{ fontSize: 12 }}>{text.substring(0, 12)}...</code>,
    },
    {
      title: 'ID Người dùng',
      dataIndex: 'userId',
      key: 'userId',
      render: (text: string) => <code style={{ fontSize: 12 }}>{text.substring(0, 12)}...</code>,
    },
    {
      title: 'Số tin nhắn',
      dataIndex: 'messageCount',
      key: 'messageCount',
      align: 'center' as const,
      render: (count: number) => <Tag color="cyan">{count}</Tag>,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            📊 Thống kê AI Service
          </Typography.Title>
          <Typography.Text type="secondary">Giám sát toàn bộ hoạt động AI trong hệ thống</Typography.Text>
        </div>
        <Tag color="purple" style={{ fontSize: 13, padding: '6px 12px' }}>
          🔄 Cập nhật mỗi 2 phút
        </Tag>
      </Space>

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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Tổng cuộc hội thoại</span>}
              value={stats?.totalConversations || 0}
              prefix={<MessageOutlined style={{ color: '#8B5CF6', marginRight: 8 }} />}
              valueStyle={{ color: '#8B5CF6', fontSize: 24, fontWeight: 600 }}
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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Tổng tin nhắn</span>}
              value={stats?.totalMessages || 0}
              prefix={<FileTextOutlined style={{ color: '#06B6D4', marginRight: 8 }} />}
              valueStyle={{ color: '#06B6D4', fontSize: 24, fontWeight: 600 }}
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
              title={<span style={{ fontSize: 12, fontWeight: 500 }}>Người dùng sử dụng</span>}
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#10B981', marginRight: 8 }} />}
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
            <AntTooltip title="Số tin nhắn trung bình mỗi cuộc hội thoại">
              <Statistic
                title={<span style={{ fontSize: 12, fontWeight: 500 }}>Tin nhắn/cuộc</span>}
                value={avgMessagesPerConv.toFixed(2)}
                prefix={<ClockCircleOutlined style={{ color: '#F59E0B', marginRight: 8 }} />}
                valueStyle={{ color: '#F59E0B', fontSize: 24, fontWeight: 600 }}
              />
            </AntTooltip>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Messages by Role */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <BgColorsOutlined />
                <span>Phân loại tin nhắn theo vai trò</span>
              </Space>
            }
            style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div style={{ height: 300 }}>
              {messagesByRoleData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={messagesByRoleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography.Text type="secondary">Chưa có dữ liệu</Typography.Text>
              )}
            </div>
          </Card>
        </Col>

        {/* Messages Distribution Pie */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <RobotOutlined />
                <span>Tỉ lệ phân phối tin nhắn</span>
              </Space>
            }
            style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div style={{ height: 300 }}>
              {messagesByRoleData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messagesByRoleData}
                      dataKey="count"
                      nameKey="role"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {messagesByRoleData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #e5e7eb',
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

      {/* Recent Conversations Table */}
      <Card
        title={
          <Space>
            <MessageOutlined />
            <span>10 cuộc hội thoại gần đây nhất</span>
          </Space>
        }
        style={{
          border: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Table
          columns={tableColumns}
          dataSource={recentConversationsData}
          pagination={{ pageSize: 10, total: recentConversationsData.length, showSizeChanger: true }}
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
            }}
          >
            <Row gutter={32}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Cuộc hội thoại/Người dùng</span>}
                  value={(stats?.totalConversations / stats?.totalUsers).toFixed(2) || '0.00'}
                  valueStyle={{ color: '#fff', fontSize: 24 }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Tin nhắn/Người dùng</span>}
                  value={(stats?.totalMessages / stats?.totalUsers).toFixed(2) || '0.00'}
                  valueStyle={{ color: '#fff', fontSize: 24 }}
                />
              </Col>
              <Col xs={24} sm={12} md={12}>
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
                    📈 Thống kê chi tiết
                  </Typography.Text>
                  <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'block' }}>
                    Tổng cộng {stats?.totalConversations || 0} cuộc hội thoại với {stats?.totalMessages || 0} tin
                    nhắn từ {stats?.totalUsers || 0} người dùng
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
