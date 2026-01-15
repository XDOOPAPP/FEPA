import React, { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, Tag, Switch, Row, Col, Statistic, Spin } from 'antd'
import { CrownOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useGetPlans, useCreatePlan, useUpdatePlan, useDeletePlan, useHealthCheck } from '../../services/queries'
import type { SubscriptionPlan as APIPlan } from '../../services/api/subscriptionAPI'

interface SubscriptionPlan extends APIPlan {
  id: string // Alias cho _id
}

const AdminSubscription: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [form] = Form.useForm()

  // React Query hooks
  const { data: plansData, isLoading: isLoadingPlans } = useGetPlans()
  const { data: healthData } = useHealthCheck()
  const createPlanMutation = useCreatePlan()
  const updatePlanMutation = useUpdatePlan()
  const deletePlanMutation = useDeletePlan()

  const plans = (plansData || []).map((plan: APIPlan) => ({
    ...plan,
    id: plan._id,
  })) as SubscriptionPlan[]

  const handleAddPlan = () => {
    setEditingPlan(null)
    form.resetFields()
    form.setFieldsValue({ isActive: true, interval: 'MONTHLY' })
    setIsModalVisible(true)
  }

  const handleAddFreePlan = () => {
    if (plans.some(p => p.isFree)) {
      message.warning('Chỉ được phép có 1 gói miễn phí!')
      return
    }
    setEditingPlan(null)
    form.resetFields()
    form.setFieldsValue({
      name: 'Free',
      price: 0,
      isActive: true,
      interval: 'LIFETIME',
      features: 'Cơ bản',
      isFree: true
    })
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
          await deletePlanMutation.mutateAsync(planId)
        } catch (error) {
          console.error('Failed to delete plan:', error)
        }
      },
    })
  }

  const handleSavePlan = async () => {
    try {
      const values = await form.validateFields()
      const features = values.features.split('\n').filter((f: string) => f.trim())

      // Validate Singleton Free Plan
      const isFree = form.getFieldValue('isFree') || values.price === 0

      if (isFree) {
        const hasFree = plans.some(p => p.isFree && p.id !== editingPlan?.id)
        if (hasFree) {
          message.error('Đã tồn tại gói miễn phí! Không thể tạo thêm.')
          return
        }
      }

      const planData = {
        ...values,
        features,
        isFree: isFree || false // Ensure backend gets this field
      }

      if (editingPlan) {
        // Update plan
        await updatePlanMutation.mutateAsync({
          planId: editingPlan.id,
          data: planData,
        })
      } else {
        // Create new plan
        await createPlanMutation.mutateAsync(planData)
      }

      setIsModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Error saving plan:', error)
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
      render: (text, record) => (
        <Space>
          <strong>{text}</strong>
          {record.isFree && <Tag color="blue">Free</Tag>}
        </Space>
      ),
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
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Hoạt động"
          unCheckedChildren="Ngừng"
          loading={updatePlanMutation.isPending && editingPlan?.id === record.id} // Optimistic update ideally
          onChange={(checked) => {
            updatePlanMutation.mutate({
              planId: record.id,
              data: { isActive: checked }
            })
          }}
        />
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPlan(record)} disabled={deletePlanMutation.isPending || createPlanMutation.isPending || updatePlanMutation.isPending}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeletePlan(record.id)} disabled={deletePlanMutation.isPending || createPlanMutation.isPending || updatePlanMutation.isPending}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  // Stats calculation
  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.isActive).length,
  }

  const isServiceHealthy = healthData?.success ?? null
  const isSaving = createPlanMutation.isPending || updatePlanMutation.isPending || deletePlanMutation.isPending

  return (
    <Spin spinning={isLoadingPlans} indicator={<LoadingOutlined style={{ fontSize: 48 }} />}>
      <div style={{ padding: '24px' }}>
        {/* Health Check Badge */}
        <div style={{ marginBottom: '16px' }}>
          <Tag
            color={isServiceHealthy ? 'success' : isServiceHealthy === null ? 'processing' : 'error'}
            icon={isServiceHealthy ? <CheckCircleOutlined /> : isServiceHealthy === null ? <LoadingOutlined /> : <CloseCircleOutlined />}
          >
            Subscription Service: {isServiceHealthy ? 'Online' : isServiceHealthy === null ? 'Checking...' : 'Offline'}
          </Tag>
        </div>

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
        </Row>

        <Card
          title="Quản lý gói Premium"
          extra={
            <Space>
              <Button
                onClick={handleAddFreePlan}
                disabled={isSaving || plans.some(p => p.isFree)}
              >
                Thêm gói miễn phí
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan} disabled={isSaving}>
                Thêm gói mới
              </Button>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Table
            columns={planColumns}
            dataSource={plans.map(p => ({ ...p, key: p.id }))}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={isLoadingPlans}
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
                    disabled={form.getFieldValue('isFree') === true && !editingPlan} // Lock if creating Free Plan
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
              <Input.TextArea rows={5} placeholder="Không giới hạn danh mục&#10;Không giới hạn giao dịch&#10;OCR không giới hạn" />
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

export default AdminSubscription
