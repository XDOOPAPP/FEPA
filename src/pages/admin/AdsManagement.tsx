import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, DatePicker, InputNumber, Select, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface Advertisement {
  id: string
  title: string
  partnerId: string
  partnerName: string
  bannerUrl: string
  targetUrl: string
  position: 'home' | 'blog' | 'reports' | 'sidebar'
  type: 'banner' | 'popup' | 'native'
  status: 'active' | 'paused' | 'ended'
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  ctr: number
  budget: number
  spent: number
  createdAt: string
}

const AdsManagement: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // TODO: Replace with API call - GET /api/advertisements
  useEffect(() => {
    const storedAds = localStorage.getItem('advertisements')
    if (storedAds) {
      setAds(JSON.parse(storedAds))
    } else {
      const initialAds: Advertisement[] = [
        {
          id: '1',
          title: 'Banner Ngân hàng ABC - Thẻ tín dụng',
          partnerId: 'p1',
          partnerName: 'Ngân hàng ABC',
          bannerUrl: 'https://placehold.co/728x90/4CAF50/FFF?text=Ngan+hang+ABC',
          targetUrl: 'https://bank-abc.com/credit-card',
          position: 'home',
          type: 'banner',
          status: 'active',
          startDate: dayjs().subtract(10, 'day').toISOString(),
          endDate: dayjs().add(20, 'day').toISOString(),
          impressions: 125000,
          clicks: 3750,
          ctr: 3.0,
          budget: 50000000,
          spent: 15000000,
          createdAt: dayjs().subtract(10, 'day').toISOString(),
        },
        {
          id: '2',
          title: 'Banner Bảo hiểm XYZ',
          partnerId: 'p2',
          partnerName: 'Bảo hiểm XYZ',
          bannerUrl: 'https://placehold.co/300x250/2196F3/FFF?text=Bao+hiem+XYZ',
          targetUrl: 'https://insurance-xyz.com',
          position: 'sidebar',
          type: 'banner',
          status: 'active',
          startDate: dayjs().subtract(5, 'day').toISOString(),
          endDate: dayjs().add(25, 'day').toISOString(),
          impressions: 85000,
          clicks: 2125,
          ctr: 2.5,
          budget: 30000000,
          spent: 8000000,
          createdAt: dayjs().subtract(5, 'day').toISOString(),
        },
        {
          id: '3',
          title: 'Native Ad - App Đầu tư DEF',
          partnerId: 'p3',
          partnerName: 'Công ty Đầu tư DEF',
          bannerUrl: 'https://placehold.co/400x400/FF9800/FFF?text=Dau+tu+DEF',
          targetUrl: 'https://invest-def.com/app',
          position: 'blog',
          type: 'native',
          status: 'paused',
          startDate: dayjs().subtract(15, 'day').toISOString(),
          endDate: dayjs().subtract(1, 'day').toISOString(),
          impressions: 45000,
          clicks: 1350,
          ctr: 3.0,
          budget: 20000000,
          spent: 20000000,
          createdAt: dayjs().subtract(15, 'day').toISOString(),
        },
      ]
      setAds(initialAds)
      localStorage.setItem('advertisements', JSON.stringify(initialAds))
    }
  }, [])

  const saveAds = (newAds: Advertisement[]) => {
    setAds(newAds)
    localStorage.setItem('advertisements', JSON.stringify(newAds))
    // TODO: Replace with API call - POST/PUT /api/advertisements
  }

  const handleAdd = () => {
    setEditingAd(null)
    form.resetFields()
    form.setFieldsValue({ 
      status: 'active',
      type: 'banner',
      position: 'home',
    })
    setIsModalVisible(true)
  }

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad)
    form.setFieldsValue({
      ...ad,
      dateRange: [dayjs(ad.startDate), dayjs(ad.endDate)],
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa quảng cáo này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        const newAds = ads.filter(a => a.id !== id)
        saveAds(newAds)
        message.success('Đã xóa quảng cáo')
      },
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const [startDate, endDate] = values.dateRange
      
      if (editingAd) {
        const newAds = ads.map(a =>
          a.id === editingAd.id
            ? {
                ...a,
                ...values,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              }
            : a
        )
        saveAds(newAds)
        message.success('Cập nhật quảng cáo thành công')
      } else {
        const newAd: Advertisement = {
          id: Date.now().toString(),
          ...values,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          impressions: 0,
          clicks: 0,
          ctr: 0,
          spent: 0,
          createdAt: dayjs().toISOString(),
        }
        saveAds([...ads, newAd])
        message.success('Thêm quảng cáo thành công')
      }
      
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const columns: ColumnsType<Advertisement> = [
    {
      title: 'Banner',
      dataIndex: 'bannerUrl',
      key: 'bannerUrl',
      width: 120,
      render: (url) => (
        <div style={{ 
          width: '100px', 
          height: '60px', 
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <img 
            src={url} 
            alt="banner" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span style="color: #999; font-size: 12px;">Banner</span>';
            }}
          />
        </div>
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <strong>{record.title}</strong>
          <span style={{ fontSize: '12px', color: '#666' }}>Đối tác: {record.partnerName}</span>
          <Space size={4}>
            <Tag>{record.type === 'banner' ? 'Banner' : record.type === 'popup' ? 'Popup' : 'Native'}</Tag>
            <Tag color="blue">{
              record.position === 'home' ? 'Trang chủ' :
              record.position === 'blog' ? 'Blog' :
              record.position === 'reports' ? 'Báo cáo' : 'Sidebar'
            }</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      key: 'duration',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>Bắt đầu: {dayjs(record.startDate).format('DD/MM/YYYY')}</span>
          <span style={{ fontSize: '12px' }}>Kết thúc: {dayjs(record.endDate).format('DD/MM/YYYY')}</span>
        </Space>
      ),
    },
    {
      title: 'Hiệu suất',
      key: 'performance',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>Hiển thị: {(record.impressions || 0).toLocaleString()}</span>
          <span style={{ fontSize: '12px' }}>Click: {(record.clicks || 0).toLocaleString()}</span>
          <span style={{ fontSize: '12px', color: (record.ctr || 0) >= 3 ? '#52c41a' : '#faad14' }}>
            CTR: {(record.ctr || 0).toFixed(2)}%
          </span>
        </Space>
      ),
    },
    {
      title: 'Ngân sách',
      key: 'budget',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontSize: '12px' }}>Tổng: {formatCurrency(record.budget)}</span>
          <span style={{ fontSize: '12px' }}>Đã dùng: {formatCurrency(record.spent)}</span>
          <span style={{ fontSize: '12px', color: record.spent >= record.budget ? '#ff4d4f' : '#52c41a' }}>
            Còn: {formatCurrency(record.budget - record.spent)}
          </span>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Advertisement['status']) => {
        const statusMap = {
          active: { color: 'success', text: 'Đang chạy' },
          paused: { color: 'warning', text: 'Tạm dừng' },
          ended: { color: 'default', text: 'Đã kết thúc' },
        }
        const { color, text } = statusMap[status]
        return <Tag color={color}>{text}</Tag>
      },
      filters: [
        { text: 'Đang chạy', value: 'active' },
        { text: 'Tạm dừng', value: 'paused' },
        { text: 'Đã kết thúc', value: 'ended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} size="small">
            Xem
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
    totalBudget: ads.reduce((sum, a) => sum + a.budget, 0),
    totalSpent: ads.reduce((sum, a) => sum + a.spent, 0),
    totalImpressions: ads.reduce((sum, a) => sum + a.impressions, 0),
    totalClicks: ads.reduce((sum, a) => sum + a.clicks, 0),
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <Space>
            <PictureOutlined />
            <span>Quản lý Quảng cáo & Banner</span>
          </Space>
        }
        extra={
          <Space direction="vertical" size={4} align="end">
            <Space>
              <span>Đang chạy: {stats.active}/{stats.total}</span>
              <span>| Hiển thị: {stats.totalImpressions.toLocaleString()}</span>
              <span>| Click: {stats.totalClicks.toLocaleString()}</span>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm quảng cáo
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={ads}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingAd ? 'Sửa quảng cáo' : 'Thêm quảng cáo mới'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={700}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề quảng cáo"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề quảng cáo" />
          </Form.Item>

          <Form.Item
            name="partnerName"
            label="Tên đối tác"
            rules={[{ required: true, message: 'Vui lòng nhập tên đối tác' }]}
          >
            <Input placeholder="Tên công ty/đối tác" />
          </Form.Item>

          <Form.Item
            name="bannerUrl"
            label="URL Banner/Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập URL banner' }]}
          >
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>

          <Form.Item
            name="targetUrl"
            label="URL đích (khi click)"
            rules={[{ required: true, message: 'Vui lòng nhập URL đích' }]}
          >
            <Input placeholder="https://partner-website.com" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="type"
              label="Loại quảng cáo"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value="banner">Banner</Select.Option>
                <Select.Option value="popup">Popup</Select.Option>
                <Select.Option value="native">Native Ad</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="position"
              label="Vị trí hiển thị"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value="home">Trang chủ</Select.Option>
                <Select.Option value="blog">Blog</Select.Option>
                <Select.Option value="reports">Báo cáo</Select.Option>
                <Select.Option value="sidebar">Sidebar</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            name="dateRange"
            label="Thời gian chạy"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="budget"
              label="Ngân sách (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập ngân sách' }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                placeholder="10000000"
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select>
                <Select.Option value="active">Đang chạy</Select.Option>
                <Select.Option value="paused">Tạm dừng</Select.Option>
                <Select.Option value="ended">Đã kết thúc</Select.Option>
              </Select>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}

export default AdsManagement
