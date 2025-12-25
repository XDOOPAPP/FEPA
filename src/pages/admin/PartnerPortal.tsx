import React, { useState } from 'react'
import { Card, Row, Col, Statistic, Table, DatePicker, Select, Space, Button } from 'antd'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { EyeOutlined, DollarOutlined, PercentageOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface PartnerStats {
  partnerId: string
  partnerName: string
  totalImpressions: number
  totalClicks: number
  ctr: number
  revenue: number
  activeAds: number
}

interface AdPerformance {
  id: string
  title: string
  impressions: number
  clicks: number
  ctr: number
  revenue: number
  status: 'active' | 'paused' | 'ended'
}

const PartnerPortal: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<string>('all')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ])

  // Mock data for partners
  const partners: PartnerStats[] = [
    {
      partnerId: 'p1',
      partnerName: 'Ngân hàng ABC',
      totalImpressions: 125000,
      totalClicks: 3750,
      ctr: 3.0,
      revenue: 15000000,
      activeAds: 1,
    },
    {
      partnerId: 'p2',
      partnerName: 'Bảo hiểm XYZ',
      totalImpressions: 85000,
      totalClicks: 2125,
      ctr: 2.5,
      revenue: 8000000,
      activeAds: 1,
    },
    {
      partnerId: 'p3',
      partnerName: 'Công ty Đầu tư DEF',
      totalImpressions: 45000,
      totalClicks: 1350,
      ctr: 3.0,
      revenue: 20000000,
      activeAds: 0,
    },
  ]

  // Mock performance data
  const performanceData = [
    { date: '01/01', impressions: 4500, clicks: 135, revenue: 500000 },
    { date: '05/01', impressions: 5200, clicks: 156, revenue: 600000 },
    { date: '10/01', impressions: 6100, clicks: 183, revenue: 750000 },
    { date: '15/01', impressions: 5800, clicks: 174, revenue: 700000 },
    { date: '20/01', impressions: 6500, clicks: 195, revenue: 800000 },
    { date: '25/01', impressions: 7200, clicks: 216, revenue: 900000 },
    { date: '30/01', impressions: 6800, clicks: 204, revenue: 850000 },
  ]

  // Mock ad performance
  const adPerformanceData: AdPerformance[] = [
    {
      id: '1',
      title: 'Banner Ngân hàng ABC - Thẻ tín dụng',
      impressions: 125000,
      clicks: 3750,
      ctr: 3.0,
      revenue: 15000000,
      status: 'active',
    },
    {
      id: '2',
      title: 'Banner Bảo hiểm XYZ',
      impressions: 85000,
      clicks: 2125,
      ctr: 2.5,
      revenue: 8000000,
      status: 'active',
    },
    {
      id: '3',
      title: 'Native Ad - App Đầu tư DEF',
      impressions: 45000,
      clicks: 1350,
      ctr: 3.0,
      revenue: 20000000,
      status: 'paused',
    },
  ]

  const currentPartner = selectedPartner === 'all' 
    ? null 
    : partners.find(p => p.partnerId === selectedPartner)

  const stats = currentPartner ? {
    impressions: currentPartner.totalImpressions,
    clicks: currentPartner.totalClicks,
    ctr: currentPartner.ctr,
    revenue: currentPartner.revenue,
  } : {
    impressions: partners.reduce((sum, p) => sum + p.totalImpressions, 0),
    clicks: partners.reduce((sum, p) => sum + p.totalClicks, 0),
    ctr: partners.reduce((sum, p) => sum + p.ctr, 0) / partners.length,
    revenue: partners.reduce((sum, p) => sum + p.revenue, 0),
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const columns: ColumnsType<AdPerformance> = [
    {
      title: 'Quảng cáo',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Hiển thị',
      dataIndex: 'impressions',
      key: 'impressions',
      render: (val) => val.toLocaleString(),
      sorter: (a, b) => a.impressions - b.impressions,
    },
    {
      title: 'Click',
      dataIndex: 'clicks',
      key: 'clicks',
      render: (val) => val.toLocaleString(),
      sorter: (a, b) => a.clicks - b.clicks,
    },
    {
      title: 'CTR (%)',
      dataIndex: 'ctr',
      key: 'ctr',
      render: (val) => `${val.toFixed(2)}%`,
      sorter: (a, b) => a.ctr - b.ctr,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val) => formatCurrency(val),
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdPerformance['status']) => {
        const statusMap = {
          active: { color: '#52c41a', text: 'Đang chạy' },
          paused: { color: '#faad14', text: 'Tạm dừng' },
          ended: { color: '#d9d9d9', text: 'Đã kết thúc' },
        }
        const { color, text } = statusMap[status]
        return <span style={{ color }}>{text}</span>
      },
    },
  ]

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export report for:', selectedPartner, dateRange)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space style={{ marginBottom: '24px', width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Select
              value={selectedPartner}
              onChange={setSelectedPartner}
              style={{ width: 250 }}
            >
              <Select.Option value="all">Tất cả đối tác</Select.Option>
              {partners.map(p => (
                <Select.Option key={p.partnerId} value={p.partnerId}>
                  {p.partnerName}
                </Select.Option>
              ))}
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              format="DD/MM/YYYY"
            />
          </Space>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            Xuất báo cáo
          </Button>
        </Space>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng hiển thị"
                value={stats.impressions}
                prefix={<EyeOutlined />}
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng click"
                value={stats.clicks}
                prefix={<EyeOutlined />}
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="CTR trung bình"
                value={stats.ctr}
                prefix={<PercentageOutlined />}
                suffix="%"
                precision={2}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats.revenue}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={12}>
            <Card title="Hiển thị & Click theo thời gian">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="impressions" 
                    stroke="#1890ff" 
                    name="Hiển thị"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#52c41a" 
                    name="Click"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Doanh thu theo thời gian">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#faad14" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Card title="Hiệu suất từng quảng cáo">
          <Table
            columns={columns}
            dataSource={selectedPartner === 'all' ? adPerformanceData : adPerformanceData.filter(ad => {
              const partnerAds = {
                'p1': ['1'],
                'p2': ['2'],
                'p3': ['3'],
              }
              return partnerAds[selectedPartner as keyof typeof partnerAds]?.includes(ad.id)
            })}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Card>
    </div>
  )
}

export default PartnerPortal
