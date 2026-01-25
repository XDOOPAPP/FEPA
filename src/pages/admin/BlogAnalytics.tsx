import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Select, Space, Button, Empty } from 'antd'
import { PieChartOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { BarChart } from 'recharts/es6/chart/BarChart'
import { Bar } from 'recharts/es6/cartesian/Bar'
import blogAPI, { type BlogStatusStats, type BlogMonthlyStat } from '../../services/api/blogAPI'
import dayjs from 'dayjs'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { exportToCSV } from '../../utils/exportUtils'

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#F43F5E']

export default function BlogAnalytics() {
  const [year, setYear] = useState<number>(dayjs().year())
  const [loading, setLoading] = useState(false)
  const [statusStats, setStatusStats] = useState<BlogStatusStats>({})
  const [monthlyStats, setMonthlyStats] = useState<BlogMonthlyStat[]>([])

  const total = (statusStats.draft || 0) + (statusStats.pending || 0) + (statusStats.published || 0) + (statusStats.rejected || 0)

  const loadData = async () => {
    setLoading(true)
    try {
      const [statusRes, monthlyRes] = await Promise.all([
        blogAPI.getStatusStats(),
        blogAPI.getMonthlyStats(year),
      ])
      setStatusStats(statusRes || {})
      setMonthlyStats(monthlyRes || [])
    } catch (err) {
      console.error('Failed to load blog analytics', err)
      setStatusStats({})
      setMonthlyStats([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  const statusData = [
    { name: 'Nháp', value: statusStats.draft || 0, color: '#94a3b8' },
    { name: 'Chờ duyệt', value: statusStats.pending || 0, color: '#F59E0B' },
    { name: 'Đã xuất bản', value: statusStats.published || 0, color: '#10B981' },
    { name: 'Bị từ chối', value: statusStats.rejected || 0, color: '#F43F5E' },
  ].filter(item => item.value > 0)

  const monthlyData = monthlyStats.length
    ? monthlyStats.map(item => ({ month: `Th${item.month}`, count: item.count }))
    : []

  const hasData = total > 0 || monthlyData.length > 0

  return (
    <LoadingOverlay loading={loading}>
      <div style={{ padding: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}><PieChartOutlined /> Phân tích Blog</h2>
          <Space>
            <Select
              value={year}
              onChange={(v) => setYear(v)}
              options={[2024, 2025, 2026, 2027].map(y => ({ label: y, value: y }))}
            />
            <Button icon={<ReloadOutlined />} onClick={loadData}>Làm mới</Button>
            <Button onClick={() => exportToCSV(
              statusData.map(s => ({ Trạng_thái: s.name, Số_lượng: s.value })),
              { filename: `blog-status-${year}` }
            )}>
              Export CSV
            </Button>
          </Space>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Tổng bài viết"
                value={total}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Chờ duyệt"
                value={statusStats.pending || 0}
                prefix={<ClockCircleOutlined style={{ color: '#F59E0B' }} />}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Đã xuất bản"
                value={statusStats.published || 0}
                prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Bị từ chối"
                value={statusStats.rejected || 0}
                prefix={<CloseCircleOutlined style={{ color: '#F43F5E' }} />}
                valueStyle={{ color: '#F43F5E' }}
              />
            </Card>
          </Col>
        </Row>

        {!hasData ? (
          <Card>
            <Empty description="Chưa có dữ liệu thống kê" />
          </Card>
        ) : (
          <Row gutter={16}>
            <Col span={10}>
              <Card className="shadow-card" title="Tỷ lệ theo trạng thái">
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie dataKey="value" nameKey="name" data={statusData} label>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col span={14}>
              <Card className="shadow-card" title={`Số bài viết theo tháng (${year})`}>
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </LoadingOverlay>
  )
}
