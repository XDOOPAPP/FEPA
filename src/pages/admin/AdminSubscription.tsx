import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, Tag, Switch, message, Row, Col, Statistic } from 'antd'
import { CrownOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { TextArea } = Input

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration: number
  features: string[]
  isActive: boolean
  maxExpenses: number
  maxCategories: number
  ocrScans: number
}

interface UserSubscription {
  id: string
  userId: string
  userName: string
  userEmail: string
  planId: string
  planName: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled'
  autoRenew: boolean
}

const AdminSubscription: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    // Load plans
    const storedPlans = localStorage.getItem('subscription_plans')
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans))
    } else {
      const initialPlans: SubscriptionPlan[] = [
        {
          id: '1',
          name: 'Free',
          price: 0,
          duration: 365,
          features: ['5 danh mục', '50 giao dịch/tháng', 'Báo cáo cơ bản'],
          isActive: true,
          maxExpenses: 50,
          maxCategories: 5,
          ocrScans: 10,
        },
        {
          id: '2',
          name: 'Basic',
          price: 99000,
          duration: 30,
          features: ['20 danh mục', '500 giao dịch/tháng', 'OCR 50 lần/tháng', 'Báo cáo chi tiết'],
          isActive: true,
          maxExpenses: 500,
          maxCategories: 20,
          ocrScans: 50,
        },
        {
          id: '3',
          name: 'Premium',
          price: 199000,
          duration: 30,
          features: ['Không giới hạn danh mục', 'Không giới hạn giao dịch', 'OCR không giới hạn', 'Báo cáo nâng cao', 'Hỗ trợ ưu tiên'],
          isActive: true,
          maxExpenses: -1,
          maxCategories: -1,
          ocrScans: -1,
        },
      ]
      setPlans(initialPlans)
      localStorage.setItem('subscription_plans', JSON.stringify(initialPlans))
    }

    // Load subscriptions
    const storedSubscriptions = localStorage.getItem('user_subscriptions')
    if (storedSubscriptions) {
      setSubscriptions(JSON.parse(storedSubscriptions))
    } else {
      const initialSubscriptions: UserSubscription[] = [
        {
          id: '1',
          userId: 'u1',
          userName: 'Nguyễn Văn A',
          userEmail: 'nguyenvana@email.com',
          planId: '2',
          planName: 'Basic',
          startDate: dayjs().subtract(15, 'day').toISOString(),
          endDate: dayjs().add(15, 'day').toISOString(),
          status: 'active',
          autoRenew: true,
        },
        {
          id: '2',
          userId: 'u2',
          userName: 'Trần Thị B',
          userEmail: 'tranthib@email.com',
          planId: '3',
          planName: 'Premium',
          startDate: dayjs().subtract(10, 'day').toISOString(),
          endDate: dayjs().add(20, 'day').toISOString(),
          status: 'active',
          autoRenew: true,
        },
        {
          id: '3',
          userId: 'u3',
          userName: 'Lê Văn C',
          userEmail: 'levanc@email.com',
          planId: '2',
          planName: 'Basic',
          startDate: dayjs().subtract(60, 'day').toISOString(),
          endDate: dayjs().subtract(30, 'day').toISOString(),
          status: 'expired',
          autoRenew: false,
        },
      ]
      setSubscriptions(initialSubscriptions)
      localStorage.setItem('user_subscriptions', JSON.stringify(initialSubscriptions))
    }
  }, [])

  const savePlans = (newPlans: SubscriptionPlan[]) => {
    setPlans(newPlans)
    localStorage.setItem('subscription_plans', JSON.stringify(newPlans))
  }

  const handleAddPlan = () => {
    setEditingPlan(null)
    form.resetFields()
    form.setFieldsValue({ isActive: true, duration: 30 })
    setIsModalVisible(true)
  }

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    form.setFieldsValue({
      ...plan,
      features: plan.features.join('\n'),
    })
    setIsModalVisible(true)
  }

  const handleDeletePlan = (planId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa gói này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        const newPlans = plans.filter(p => p.id !== planId)
        savePlans(newPlans)
        message.success('Đã xóa gói dịch vụ')
      },
    })
  }

  const handleSavePlan = async () => {
    try {
      const values = await form.validateFields()
      const features = values.features.split('\n').filter((f: string) => f.trim())
      
      if (editingPlan) {
        const newPlans = plans.map(p =>
          p.id === editingPlan.id
            ? { ...p, ...values, features }
            : p
        )
        savePlans(newPlans)
        message.success('Cập nhật gói thành công')
      } else {
        const newPlan: SubscriptionPlan = {
          id: Date.now().toString(),
          ...values,
          features,
        }
        savePlans([...plans, newPlan])
        message.success('Thêm gói thành công')
      }
      
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const planColumns: ColumnsType<SubscriptionPlan> = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Thời hạn',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} ngày`,
    },
    {
      title: 'Giới hạn',
      key: 'limits',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>Giao dịch: {record.maxExpenses === -1 ? 'Không giới hạn' : record.maxExpenses}</Text>
          <Text>Danh mục: {record.maxCategories === -1 ? 'Không giới hạn' : record.maxCategories}</Text>
          <Text>OCR: {record.ocrScans === -1 ? 'Không giới hạn' : record.ocrScans}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'default'} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isActive ? 'Hoạt động' : 'Ngừng'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Ngừng', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPlan(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeletePlan(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  const subscriptionColumns: ColumnsType<UserSubscription> = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <strong>{record.userName}</strong>
          <span style={{ fontSize: '12px', color: '#666' }}>{record.userEmail}</span>
        </Space>
      ),
    },
    {
      title: 'Gói',
      dataIndex: 'planName',
      key: 'planName',
      render: (text) => <Tag color="blue" icon={<CrownOutlined />}>{text}</Tag>,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserSubscription['status']) => {
        const statusMap = {
          active: { color: 'success', text: 'Đang hoạt động', icon: <CheckCircleOutlined /> },
          expired: { color: 'default', text: 'Hết hạn', icon: <CloseCircleOutlined /> },
          cancelled: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
        }
        const { color, text, icon } = statusMap[status]
        return <Tag color={color} icon={icon}>{text}</Tag>
      },
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Hết hạn', value: 'expired' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Tự động gia hạn',
      dataIndex: 'autoRenew',
      key: 'autoRenew',
      render: (autoRenew) => (
        <Tag color={autoRenew ? 'success' : 'default'}>
          {autoRenew ? 'Có' : 'Không'}
        </Tag>
      ),
    },
  ]

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.isActive).length,
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    revenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const plan = plans.find(p => p.id === s.planId)
        return sum + (plan?.price || 0)
      }, 0),
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <Statistic
              title="Tổng gói"
              value={stats.totalPlans}
              prefix={<CrownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <Statistic
              title="Gói hoạt động"
              value={stats.activePlans}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card>
            <Statistic
              title="Người dùng Premium"
              value={stats.activeSubscriptions}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={stats.revenue}
              prefix="₫"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Quản lý gói Premium"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan}>
            Thêm gói mới
          </Button>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table
          columns={planColumns}
          dataSource={plans}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card title="Danh sách người dùng Premium">
        <Table
          columns={subscriptionColumns}
          dataSource={subscriptions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingPlan ? 'Sửa gói Premium' : 'Thêm gói Premium mới'}
        open={isModalVisible}
        onOk={handleSavePlan}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={600}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên gói"
            rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}
          >
            <Input placeholder="Ví dụ: Premium, Basic..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="99000"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Thời hạn (ngày)"
                rules={[{ required: true, message: 'Vui lòng nhập thời hạn' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="30" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="maxExpenses"
                label="Giới hạn giao dịch"
                rules={[{ required: true, message: 'Vui lòng nhập số' }]}
                tooltip="-1 nghĩa là không giới hạn"
              >
                <InputNumber style={{ width: '100%' }} placeholder="-1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxCategories"
                label="Giới hạn danh mục"
                rules={[{ required: true, message: 'Vui lòng nhập số' }]}
                tooltip="-1 nghĩa là không giới hạn"
              >
                <InputNumber style={{ width: '100%' }} placeholder="-1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ocrScans"
                label="Giới hạn OCR"
                rules={[{ required: true, message: 'Vui lòng nhập số' }]}
                tooltip="-1 nghĩa là không giới hạn"
              >
                <InputNumber style={{ width: '100%' }} placeholder="-1" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="features"
            label="Tính năng (mỗi dòng 1 tính năng)"
            rules={[{ required: true, message: 'Vui lòng nhập tính năng' }]}
          >
            <TextArea rows={5} placeholder="Không giới hạn danh mục&#10;Không giới hạn giao dịch&#10;OCR không giới hạn" />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => <span>{children}</span>

export default AdminSubscription
