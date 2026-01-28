import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Select, Space, Button, Empty } from 'antd'
import { DollarCircleOutlined, RiseOutlined, ReloadOutlined, ShoppingOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { BarChart } from 'recharts/es6/chart/BarChart'
import { Bar } from 'recharts/es6/cartesian/Bar'
import subscriptionAPI, { type RevenuePoint, type RevenueByPlanItem } from '../../services/api/subscriptionAPI'
import { LoadingOverlay } from '../../components/common/LoadingOverlay'
import { exportToCSV } from '../../utils/exportUtils'

export default function RevenueDashboard() {
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [days, setDays] = useState<number>(30)
  const [totals, setTotals] = useState<{ totalRevenue: number; activeSubscriptions?: number; cancelledSubscriptions?: number; totalSubscriptions?: number }>({ totalRevenue: 0 })
  const [revenueOverTime, setRevenueOverTime] = useState<RevenuePoint[]>([])
  const [revenueByPlan, setRevenueByPlan] = useState<RevenueByPlanItem[]>([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [totalsRes, overTimeRes, byPlanRes] = await Promise.all([
        subscriptionAPI.getRevenueTotals(),
        subscriptionAPI.getRevenueOverTime({ period, days }),
        subscriptionAPI.getRevenueByPlan(),
      ])
      
      // Transform totals
      setTotals((totalsRes as any)?.data || totalsRes || { totalRevenue: 0 })
      
      // Transform revenue over time - map _id to date field
      const overTimeData = (overTimeRes as any)?.data || overTimeRes || []
      const transformedOverTime = Array.isArray(overTimeData) 
        ? overTimeData.map((item: any) => ({
            date: item._id || item.date,
            revenue: item.totalRevenue || item.revenue || 0
          }))
        : []
      setRevenueOverTime(transformedOverTime)
      
      // Transform revenue by plan - flatten nested structure
      const byPlanData = byPlanRes || []
      const transformedByPlan = Array.isArray(byPlanData)
        ? byPlanData.map((item: any) => ({
            plan: item._id?.planName || item.plan || 'Unknown',
            revenue: item.totalRevenue || item.revenue || 0,
            count: item.subscriptionCount || item.count || 0
          }))
        : []
      setRevenueByPlan(transformedByPlan)
    } catch (err) {
      console.error('Failed to load revenue analytics', err)
      setTotals({ totalRevenue: 0 })
      setRevenueOverTime([])
      setRevenueByPlan([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, days])

  const hasData = (revenueOverTime?.length || 0) > 0 || (revenueByPlan?.length || 0) > 0

  return (
    <LoadingOverlay loading={loading}>
      <div style={{ padding: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}><DollarCircleOutlined /> Doanh thu & Subscriptions</h2>
          <Space>
            <Select
              value={period}
              onChange={(v) => setPeriod(v)}
              options={[
                { label: 'Theo ngày', value: 'daily' },
                { label: 'Theo tuần', value: 'weekly' },
                { label: 'Theo tháng', value: 'monthly' },
              ]}
            />
            <Select
              value={days}
              onChange={(v) => setDays(v)}
              options={[
                { label: '7 ngày', value: 7 },
                { label: '30 ngày', value: 30 },
                { label: '90 ngày', value: 90 },
                { label: '1 năm', value: 365 },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={loadData}>Làm mới</Button>
            <Button onClick={() => exportToCSV(
              revenueOverTime.map(p => ({ Ngày: p.date, Doanh_thu: p.revenue })),
              { filename: `revenue-${period}-${days}` }
            )}>
              Export CSV
            </Button>
          </Space>
        </Space>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Tổng doanh thu"
                value={totals.totalRevenue || 0}
                prefix={<DollarCircleOutlined style={{ color: '#10B981' }} />}
                precision={0}
                suffix="đ"
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Subscription đang hoạt động"
                value={totals.activeSubscriptions || 0}
                prefix={<RiseOutlined style={{ color: '#0EA5E9' }} />}
                valueStyle={{ color: '#0EA5E9' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Đã hủy"
                value={totals.cancelledSubscriptions || 0}
                prefix={<ReloadOutlined style={{ color: '#F59E0B' }} />}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="shadow-card">
              <Statistic
                title="Tổng số subscription"
                value={totals.totalSubscriptions || 0}
                prefix={<ShoppingOutlined style={{ color: '#64748B' }} />}
                valueStyle={{ color: '#64748B' }}
              />
            </Card>
          </Col>
        </Row>

        {!hasData ? (
          <Card>
            <Empty description="Chưa có dữ liệu doanh thu" />
          </Card>
        ) : (
          <Row gutter={16}>
            <Col span={14}>
              <Card className="shadow-card" title="Doanh thu theo thời gian">
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()}đ`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col span={10}>
              <Card className="shadow-card" title="Doanh thu theo gói">
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByPlan}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="plan" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => Number(value).toLocaleString()} />
                      <Legend />
                      <Bar dataKey="revenue" name="Doanh thu (đ)" fill="#0EA5E9" radius={[6,6,0,0]} />
                      <Bar dataKey="count" name="Số lượng" fill="#10B981" radius={[6,6,0,0]} />
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
