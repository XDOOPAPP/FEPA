import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, Tag, Switch, message, Row, Col, Statistic, Spin } from 'antd'
import { CrownOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import subscriptionAPI from '../../services/api/subscriptionAPI'
import type { SubscriptionPlan as APIPlan, UserSubscription as APISubscription } from '../../services/api/subscriptionAPI'

const { TextArea } = Input

interface SubscriptionPlan extends APIPlan {
  id: string // Alias cho _id
}

interface UserSubscription {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  planId: string
  planName: string
  startDate: string
  endDate: string
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  autoRenew: boolean
}

const AdminSubscription: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      // Load plans từ API
      const plansData = await subscriptionAPI.getPlans()
      const mappedPlans = plansData.map((plan: APIPlan) => ({
        ...plan,
        id: plan._id,
      }))
      setPlans(mappedPlans)

      // Không có endpoint để lấy tất cả subscriptions, nên để trống
      setSubscriptions([])
    } catch (error) {
      console.error('Failed to load data:', error)
      message.error('Không thể tải dữ liệu từ server')
    } finally {
      setIsLoading(false)
    }
  }

  const savePlans = async (newPlans: SubscriptionPlan[]) => {
    setPlans(newPlans)
  }

  const handleAddPlan = () => {
    setEditingPlan(null)
    form.resetFields()
    form.setFieldsValue({ isActive: true, interval: 'MONTHLY' })
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
      onOk: async () => {
        try {
          setIsSaving(true)
          await subscriptionAPI.disablePlan(planId)
          const newPlans = plans.filter(p => p.id !== planId)
          savePlans(newPlans)
          message.success('Đã xóa gói dịch vụ')
        } catch (error) {
          console.error('Failed to delete plan:', error)
          message.error('Không thể xóa gói dịch vụ')
        } finally {
          setIsSaving(false)
        }
      },
    })
  }

  const handleSavePlan = async () => {
    try {
      const values = await form.validateFields()
      const features = values.features.split('\n').filter((f: string) => f.trim())
      
      setIsSaving(true)
      
      if (editingPlan) {
        // Update plan
        await subscriptionAPI.updatePlan(editingPlan.id, {
          ...values,
          features,
        })
        const newPlans = plans.map(p =>
          p.id === editingPlan.id
            ? { ...p, ...values, features }
            : p
        )
        savePlans(newPlans)
        message.success('Cập nhật gói thành công')
      } else {
        // Create new plan
        const result = await subscriptionAPI.createPlan({
          ...values,
          features,
        })
        const newPlan: SubscriptionPlan = {
          ...result,
          id: result._id,
        }
        savePlans([...plans, newPlan])
        message.success('Thêm gói thành công')
      }
      
      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Error saving plan:', error)
      message.error('Không thể lưu gói dịch vụ')
    } finally {
      setIsSaving(false)
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
      title: 'Chu kỳ',
      dataIndex: 'interval',
      key: 'interval',
      render: (interval) => {
        const intervalMap = {
          MONTHLY: 'Hàng tháng',
          YEARLY: 'Hàng năm',
          LIFETIME: 'Trọn đời',
        }
        return intervalMap[interval as keyof typeof intervalMap]
      },
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPlan(record)} disabled={isSaving}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeletePlan(record.id)} disabled={isSaving}>
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
          <strong>{record.userId}</strong>
          {record.userEmail && <span style={{ fontSize: '12px', color: '#666' }}>{record.userEmail}</span>}
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
          ACTIVE: { color: 'success', text: 'Đang hoạt động', icon: <CheckCircleOutlined /> },
          PENDING: { color: 'processing', text: 'Chờ xử lý', icon: <LoadingOutlined /> },
          EXPIRED: { color: 'default', text: 'Hết hạn', icon: <CloseCircleOutlined /> },
          CANCELLED: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
        }
        const config = statusMap[status]
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
      },
      filters: [
        { text: 'Đang hoạt động', value: 'ACTIVE' },
        { text: 'Hết hạn', value: 'EXPIRED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
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
    activeSubscriptions: subscriptions.filter(s => s.status === 'ACTIVE').length,
    revenue: subscriptions
      .filter(s => s.status === 'ACTIVE')
      .reduce((sum, s) => {
        const plan = plans.find(p => p.id === s.planId)
        return sum + (plan?.price || 0)
      }, 0),
  }

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 48 }} />}>
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan} disabled={isSaving}>
              Thêm gói mới
            </Button>
          }
          style={{ marginBottom: '24px' }}
        >
          <Table
            columns={planColumns}
            dataSource={plans.map(p => ({ ...p, key: p.id }))}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={isLoading}
          />
        </Card>

        <Card title="Danh sách người dùng Premium">
          <Table
            columns={subscriptionColumns}
            dataSource={subscriptions.map(s => ({ ...s, key: s.id }))}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={isLoading}
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
          confirmLoading={isSaving}
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
                  name="interval"
                  label="Chu kỳ"
                  rules={[{ required: true, message: 'Vui lòng chọn chu kỳ' }]}
                  initialValue="MONTHLY"
                >
                  <select style={{ width: '100%', padding: '8px', borderRadius: '2px', border: '1px solid #d9d9d9' }}>
                    <option value="MONTHLY">Hàng tháng</option>
                    <option value="YEARLY">Hàng năm</option>
                    <option value="LIFETIME">Trọn đời</option>
                  </select>
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

            <Form.Item name="isActive" label="Trạng thái" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  )
}

const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => <span>{children}</span>

export default AdminSubscription
