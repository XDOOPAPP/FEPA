import { useState } from 'react'
import { Card, Input, Space, Button, Descriptions, Badge, Empty, Table, Tag, Select } from 'antd'
import { SearchOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import paymentAPI, { type PaymentDetail, type IpnLog } from '../../services/api/paymentAPI'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { exportToCSV } from '../../utils/exportUtils'

const statusColorMap: Record<string, { status: any; text: string; color?: string; icon?: JSX.Element }> = {
  PENDING: { status: 'processing', text: 'Đang xử lý', icon: <ClockCircleOutlined /> },
  SUCCESS: { status: 'success', text: 'Thành công', icon: <CheckCircleOutlined /> },
  FAILED: { status: 'error', text: 'Thất bại', icon: <CloseCircleOutlined /> },
  CANCELLED: { status: 'default', text: 'Đã hủy' },
}

export default function PaymentManagement() {
  const [ref, setRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState<PaymentDetail | null>(null)
  const [ipnLogs, setIpnLogs] = useState<IpnLog[]>([])
  const [statusFilter, setStatusFilter] = useState<string | 'ALL'>('ALL')

  const handleSearch = async (value?: string) => {
    const target = value ?? ref
    if (!target) return
    setLoading(true)
    try {
      const [detailRes, ipnRes] = await Promise.all([
        paymentAPI.lookup(target),
        paymentAPI.getIpnLogs().catch(() => ({ data: [] as IpnLog[] })),
      ])
      setPayment((detailRes as any)?.data || detailRes?.data || null)
      setIpnLogs((ipnRes as any)?.data || [])
    } catch (err) {
      console.error('Payment lookup failed', err)
      setPayment(null)
      setIpnLogs([])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'Ref', dataIndex: 'ref', key: 'ref' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColorMap[s]?.color || 'default'}>{s}</Tag> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a: number) => a?.toLocaleString('vi-VN') },
    { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY HH:mm') : '-' },
  ]

  const filteredLogs = statusFilter === 'ALL' ? ipnLogs : ipnLogs.filter(l => l.status === statusFilter)

  const handleExport = () => {
    exportToCSV(filteredLogs.map(l => ({
      Ref: l.ref,
      Trang_thai: l.status,
      So_tien: l.amount,
      Thoi_gian: l.createdAt ? dayjs(l.createdAt).format('DD/MM/YYYY HH:mm') : '',
    })), { filename: 'ipn-logs' })
  }

  return (
    <LoadingOverlay loading={loading}>
      <div style={{ padding: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Tra cứu thanh toán</h2>
          <Space>
            <Input
              placeholder="Nhập mã thanh toán (ref)"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              onPressEnter={() => handleSearch()}
              style={{ width: 280 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch()}>Tra cứu</Button>
            <Button icon={<ReloadOutlined />} onClick={() => { setPayment(null); setIpnLogs([]); setRef('') }}>Làm mới</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>Export CSV</Button>
          </Space>
        </Space>

        <Card title="Chi tiết thanh toán" style={{ marginBottom: 16 }}>
          {!payment ? (
            <Empty description="Nhập mã thanh toán để tra cứu" />
          ) : (
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Mã thanh toán">{payment.ref}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={statusColorMap[payment.status]?.status || 'default'}
                  text={statusColorMap[payment.status]?.text || payment.status}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">{payment.amount?.toLocaleString('vi-VN')} {payment.currency || 'VND'}</Descriptions.Item>
              <Descriptions.Item label="Gói">
                {payment.planName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="User">{payment.userEmail || '-'}</Descriptions.Item>
              <Descriptions.Item label="Cổng">{payment.gateway || '-'}</Descriptions.Item>
              <Descriptions.Item label="Tạo lúc">{payment.createdAt ? dayjs(payment.createdAt).format('DD/MM/YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Cập nhật">{payment.updatedAt ? dayjs(payment.updatedAt).format('DD/MM/YYYY HH:mm') : '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>

        <Card title="IPN Logs (VNPay)">
          {!ipnLogs.length ? (
            <Empty description="Chưa có log" />
          ) : (
            <Table
              dataSource={filteredLogs}
              columns={columns}
              rowKey={(r) => r.id || `${r.ref}-${r.createdAt}`}
              pagination={{ pageSize: 5 }}
              title={() => (
                <Space>
                  <span>Lọc theo trạng thái:</span>
                  <Select
                    size="small"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: 160 }}
                    options={[
                      { label: 'Tất cả', value: 'ALL' },
                      { label: 'PENDING', value: 'PENDING' },
                      { label: 'SUCCESS', value: 'SUCCESS' },
                      { label: 'FAILED', value: 'FAILED' },
                      { label: 'CANCELLED', value: 'CANCELLED' },
                    ]}
                  />
                </Space>
              )}
            />
          )}
        </Card>
      </div>
    </LoadingOverlay>
  )
}
