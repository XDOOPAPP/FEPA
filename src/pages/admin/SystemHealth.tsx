import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Alert, Timeline, Badge } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, SyncOutlined, ApiOutlined, DatabaseOutlined, CloudServerOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface ServiceStatus {
  name: string
  type: 'api' | 'database' | 'external'
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  lastCheck: string
  responseTime: number
  endpoint: string
}

interface SystemAlert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  service: string
  message: string
  timestamp: string
  resolved: boolean
}

interface ErrorLog {
  id: string
  timestamp: string
  service: string
  errorType: string
  message: string
  statusCode?: number
}

const SystemHealth: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // TODO: Replace with API call - GET /api/system/health
  useEffect(() => {
    loadSystemHealth()
  }, [])

  const loadSystemHealth = () => {
    const mockServices: ServiceStatus[] = [
      {
        name: 'Authentication API',
        type: 'api',
        status: 'healthy',
        uptime: 99.98,
        lastCheck: dayjs().toISOString(),
        responseTime: 45,
        endpoint: '/api/auth',
      },
      {
        name: 'User Management API',
        type: 'api',
        status: 'healthy',
        uptime: 99.95,
        lastCheck: dayjs().toISOString(),
        responseTime: 62,
        endpoint: '/api/users',
      },
      {
        name: 'Expense Tracking API',
        type: 'api',
        status: 'healthy',
        uptime: 99.92,
        lastCheck: dayjs().toISOString(),
        responseTime: 78,
        endpoint: '/api/expenses',
      },
      {
        name: 'Budget Management API',
        type: 'api',
        status: 'degraded',
        uptime: 98.5,
        lastCheck: dayjs().toISOString(),
        responseTime: 250,
        endpoint: '/api/budgets',
      },
      {
        name: 'PostgreSQL Database',
        type: 'database',
        status: 'healthy',
        uptime: 99.99,
        lastCheck: dayjs().toISOString(),
        responseTime: 12,
        endpoint: 'postgres://localhost:5432',
      },
      {
        name: 'Redis Cache',
        type: 'database',
        status: 'healthy',
        uptime: 99.97,
        lastCheck: dayjs().toISOString(),
        responseTime: 8,
        endpoint: 'redis://localhost:6379',
      },
      {
        name: 'PayOS Payment Gateway',
        type: 'external',
        status: 'healthy',
        uptime: 99.8,
        lastCheck: dayjs().toISOString(),
        responseTime: 320,
        endpoint: 'https://api.payos.vn',
      },
      {
        name: 'VNPay Payment Gateway',
        type: 'external',
        status: 'healthy',
        uptime: 99.75,
        lastCheck: dayjs().toISOString(),
        responseTime: 280,
        endpoint: 'https://sandbox.vnpayment.vn',
      },
      {
        name: 'Firebase FCM',
        type: 'external',
        status: 'healthy',
        uptime: 99.9,
        lastCheck: dayjs().toISOString(),
        responseTime: 150,
        endpoint: 'https://fcm.googleapis.com',
      },
    ]

    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        severity: 'warning',
        service: 'Budget Management API',
        message: 'Response time cao bất thường (250ms)',
        timestamp: dayjs().subtract(5, 'minute').toISOString(),
        resolved: false,
      },
      {
        id: '2',
        severity: 'info',
        service: 'Redis Cache',
        message: 'Đã tự động dọn dẹp cache cũ',
        timestamp: dayjs().subtract(1, 'hour').toISOString(),
        resolved: true,
      },
      {
        id: '3',
        severity: 'critical',
        service: 'Payment Gateway',
        message: 'Kết nối PayOS tạm thời gián đoạn',
        timestamp: dayjs().subtract(2, 'day').toISOString(),
        resolved: true,
      },
    ]

    const mockErrors: ErrorLog[] = [
      {
        id: '1',
        timestamp: dayjs().subtract(10, 'minute').toISOString(),
        service: 'Budget API',
        errorType: 'TimeoutError',
        message: 'Request timeout after 5000ms',
        statusCode: 504,
      },
      {
        id: '2',
        timestamp: dayjs().subtract(30, 'minute').toISOString(),
        service: 'Auth API',
        errorType: 'ValidationError',
        message: 'Invalid token format',
        statusCode: 401,
      },
      {
        id: '3',
        timestamp: dayjs().subtract(1, 'hour').toISOString(),
        service: 'Database',
        errorType: 'ConnectionError',
        message: 'Connection pool exhausted',
      },
    ]

    setServices(mockServices)
    setAlerts(mockAlerts)
    setErrorLogs(mockErrors)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // TODO: Replace with real API call
    setTimeout(() => {
      loadSystemHealth()
      setRefreshing(false)
    }, 1000)
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
      case 'degraded':
        return <WarningOutlined style={{ color: '#faad14', fontSize: '18px' }} />
      case 'down':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />
    }
  }

  const getStatusTag = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <Tag color="success">Khỏe mạnh</Tag>
      case 'degraded':
        return <Tag color="warning">Giảm hiệu suất</Tag>
      case 'down':
        return <Tag color="error">Không khả dụng</Tag>
    }
  }

  const serviceColumns: ColumnsType<ServiceStatus> = [
    {
      title: 'Dịch vụ',
      key: 'service',
      render: (_, record) => (
        <Space>
          {getStatusIcon(record.status)}
          <div>
            <div><strong>{record.name}</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.endpoint}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: ServiceStatus['type']) => {
        const typeMap = {
          api: { icon: <ApiOutlined />, text: 'API', color: 'blue' },
          database: { icon: <DatabaseOutlined />, text: 'Database', color: 'purple' },
          external: { icon: <CloudServerOutlined />, text: 'External', color: 'cyan' },
        }
        const { icon, text, color } = typeMap[type]
        return <Tag color={color} icon={icon}>{text}</Tag>
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Khỏe mạnh', value: 'healthy' },
        { text: 'Giảm hiệu suất', value: 'degraded' },
        { text: 'Không khả dụng', value: 'down' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Uptime',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime) => `${uptime.toFixed(2)}%`,
      sorter: (a, b) => a.uptime - b.uptime,
    },
    {
      title: 'Response Time',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time) => {
        const color = time < 100 ? '#52c41a' : time < 200 ? '#faad14' : '#ff4d4f'
        return <span style={{ color }}>{time}ms</span>
      },
      sorter: (a, b) => a.responseTime - b.responseTime,
    },
    {
      title: 'Kiểm tra cuối',
      dataIndex: 'lastCheck',
      key: 'lastCheck',
      render: (time) => dayjs(time).format('HH:mm:ss DD/MM/YYYY'),
    },
  ]

  const errorColumns: ColumnsType<ErrorLog> = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => dayjs(time).format('HH:mm DD/MM/YYYY'),
      width: 150,
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      width: 150,
    },
    {
      title: 'Loại lỗi',
      dataIndex: 'errorType',
      key: 'errorType',
      width: 150,
    },
    {
      title: 'Thông báo',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Status',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 80,
      render: (code) => code ? <Tag color="red">{code}</Tag> : '-',
    },
  ]

  const stats = {
    total: services.length,
    healthy: services.filter(s => s.status === 'healthy').length,
    degraded: services.filter(s => s.status === 'degraded').length,
    down: services.filter(s => s.status === 'down').length,
    avgResponseTime: services.reduce((sum, s) => sum + s.responseTime, 0) / services.length,
    activeAlerts: alerts.filter(a => !a.resolved).length,
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Tình trạng Hệ thống"
        extra={
          <Button 
            type="primary" 
            icon={refreshing ? <SyncOutlined spin /> : <SyncOutlined />}
            onClick={handleRefresh}
            loading={refreshing}
          >
            Làm mới
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số dịch vụ"
                value={stats.total}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Dịch vụ khỏe mạnh"
                value={stats.healthy}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Response time TB"
                value={stats.avgResponseTime.toFixed(0)}
                suffix="ms"
                valueStyle={{ color: stats.avgResponseTime < 100 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Cảnh báo đang hoạt động"
                value={stats.activeAlerts}
                valueStyle={{ color: stats.activeAlerts > 0 ? '#ff4d4f' : '#52c41a' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {stats.activeAlerts > 0 && (
          <Alert
            type="warning"
            message={`Có ${stats.activeAlerts} cảnh báo đang hoạt động`}
            description="Vui lòng kiểm tra phần Cảnh báo bên dưới"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Card title="Trạng thái Dịch vụ" size="small" style={{ marginBottom: '24px' }}>
          <Table
            columns={serviceColumns}
            dataSource={services}
            rowKey="name"
            pagination={false}
          />
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Card title={<span><Badge count={stats.activeAlerts} offset={[10, 0]}>Cảnh báo</Badge></span>} size="small">
              <Timeline
                items={alerts.map(alert => ({
                  color: alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'orange' : 'blue',
                  children: (
                    <div>
                      <Space>
                        <strong>{alert.service}</strong>
                        {!alert.resolved && <Tag color="red">Chưa xử lý</Tag>}
                        {alert.resolved && <Tag color="green">Đã xử lý</Tag>}
                      </Space>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {alert.message}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                        {dayjs(alert.timestamp).format('HH:mm DD/MM/YYYY')}
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Nhật ký Lỗi" size="small">
              <Table
                columns={errorColumns}
                dataSource={errorLogs}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default SystemHealth
