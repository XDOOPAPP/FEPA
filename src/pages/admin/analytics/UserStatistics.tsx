import { useState } from 'react'
import { Card, Row, Col, Statistic, Select, Space, Button } from 'antd'
import { UserOutlined, CheckCircleOutlined, SafetyOutlined, TeamOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import adminApiService from '../../../services/api/adminApiService'
import { type Period } from '../../../services/api/userStatsAPI'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

export default function UserStatistics() {
  const [period, setPeriod] = useState<Period>('daily')
  const [days, setDays] = useState<number>(30)

  const totalQuery = useQuery({
    queryKey: ['user-total-stats'],
    queryFn: () => adminApiService.getUserStats(),
  })

  const growthQuery = useQuery({
    queryKey: ['user-growth', period, days],
    queryFn: () => adminApiService.getUsersOverTime(period, days),
  })



  const statsPayload: any = totalQuery.data || {}
  const stats = statsPayload.data ?? statsPayload

  const growthPayload: any = growthQuery.data || []
  const rawGrowth = growthPayload.data ?? growthPayload ?? []
  const growthData = Array.isArray(rawGrowth)
    ? rawGrowth.map((item: any) => ({
        date: item.period || item.date,
        count: item.count ?? item.value ?? 0,
      }))
    : []

  const adminCount =
    stats?.admin ??
    stats?.admins ??
    stats?.adminCount ??
    stats?.adminsCount ??
    stats?.totalAdmin ??
    stats?.totalAdmins ??
    stats?.adminUsers ??
    0

  const totalUsers = stats?.total ?? stats?.totalUsers ?? stats?.users ?? 0
  const verifiedUsers = stats?.verified ?? stats?.verifiedUsers ?? stats?.verifiedCount ?? 0
  const normalUsers = stats?.user ?? stats?.users ?? stats?.userCount ?? stats?.normalUsers ?? 0

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Thống kê người dùng</h2>
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
          <Button icon={<ReloadOutlined />} onClick={() => { totalQuery.refetch(); growthQuery.refetch() }}>Làm mới</Button>
        </Space>
      </Space>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="shadow-card">
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<UserOutlined style={{ color: 'var(--primary)' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-card">
            <Statistic
              title="Đã xác thực"
              value={verifiedUsers}
              prefix={<CheckCircleOutlined style={{ color: 'var(--success)' }} />}
              valueStyle={{ color: 'var(--success)' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-card">
            <Statistic
              title="Admins"
              value={adminCount}
              prefix={<SafetyOutlined style={{ color: 'var(--info)' }} />}
              valueStyle={{ color: 'var(--info)' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-card">
            <Statistic
              title="Users"
              value={normalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-card" title="Tăng trưởng người dùng">
        <div style={{ height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [value, 'Người dùng']} labelFormatter={(label) => `Ngày ${label}`} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0EA5E9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
