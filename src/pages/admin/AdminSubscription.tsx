import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, Tag, Switch, Row, Col, Statistic, Spin, message, Select } from 'antd'
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
  const [isAddingFreePlan, setIsAddingFreePlan] = useState(false)
  const [form] = Form.useForm()
  const [initialFormValues, setInitialFormValues] = useState<any>(null)
  const [messageApi, contextHolder] = message.useMessage()
  const isFreeField = Form.useWatch('isFree', form)

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
    setIsAddingFreePlan(false)
    setInitialFormValues({
      isActive: true,
      interval: 'MONTHLY',
      isFree: false,
      features: { OCR: false, AI: false }
    })
    setIsModalVisible(true)
  }

  const handleAddFreePlan = () => {
    if (plans.some(p => p.isFree)) {
      messageApi.warning('Chỉ được phép có 1 gói miễn phí!')
      return
    }
    setEditingPlan(null)
    setIsAddingFreePlan(true)
    setInitialFormValues({
      name: 'Free',
      price: 0,
      isActive: true,
      interval: 'LIFETIME',
      features: { OCR: false, AI: false },
      isFree: true
    })
    setIsModalVisible(true)
  }

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setIsAddingFreePlan(false)
    setIsModalVisible(true)
  }

  useEffect(() => {
    if (!isModalVisible) return

    if (editingPlan) {
      form.setFieldsValue({
        ...editingPlan,
        isFree: editingPlan.isFree,
        'features.OCR': editingPlan.features?.OCR || false,
        'features.AI': editingPlan.features?.AI || false,
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ isActive: true, interval: 'MONTHLY' })
      if (initialFormValues) {
        form.setFieldsValue({
          ...initialFormValues,
          isFree: initialFormValues.isFree || false,
          'features.OCR': initialFormValues.features?.OCR || false,
          'features.AI': initialFormValues.features?.AI || false,
        })
        setInitialFormValues(null)
      }
    }
  }, [isModalVisible, editingPlan, form, initialFormValues])

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
      const features = {
        OCR: values['features.OCR'] || false,
        AI: values['features.AI'] || false,
      }

      // Validate Singleton Free Plan
      const isFree = form.getFieldValue('isFree') || values.price === 0

      if (isFree) {
        const hasFree = plans.some(p => p.isFree && p.id !== editingPlan?.id)
        if (hasFree) {
          messageApi.error('Đã tồn tại gói miễn phí! Không thể tạo thêm.')
          return
        }
      }

      const { 'features.OCR': _, 'features.AI': __, ...cleanValues } = values
      const planData: any = {
        ...cleanValues,
        features,
      }

      // If it's a free plan (either existing or new), force price 0 and interval LIFETIME
      if (isFree) {
        planData.price = 0
        planData.interval = 'LIFETIME'
      }

      if (editingPlan) {
        // Update plan
        // Backend restricts updating isFree and isActive for existing free plans
        // So we remove them from the payload if it's an update
        if (editingPlan.isFree) {
          delete planData.isFree
          delete planData.isActive
        } else {
          // For non-free plans, ensure isFree is false if not specified
          planData.isFree = planData.isFree || false
        }

        await updatePlanMutation.mutateAsync({
          planId: editingPlan.id,
          data: planData,
        })
      } else {
        // Create new plan
        planData.isFree = isFree || false
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
      title: 'Tính năng',
      key: 'features',
      render: (_, record) => (
        <Space>
          {record.features?.OCR && <Tag color="green">OCR</Tag>}
          {record.features?.AI && <Tag color="purple">AI</Tag>}
          {!record.features?.OCR && !record.features?.AI && <span style={{ color: '#ccc' }}>Không có</span>}
        </Space>
      ),
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
        {contextHolder}
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
          title={editingPlan ? 'Sửa gói Premium' : isAddingFreePlan ? 'Thêm gói miễn phí mới' : 'Thêm gói Premium mới'}
          open={isModalVisible}
          onOk={handleSavePlan}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          width={600}
          destroyOnHidden={true}
          forceRender={true}
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

            <Form.Item name="isFree" hidden initialValue={false}>
              <Input type="hidden" />
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
                    disabled={isFreeField === true} // Lock if it's a Free Plan
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
                  <Select style={{ width: '100%' }} disabled={isFreeField === true}>
                    <Select.Option value="MONTHLY">Hàng tháng</Select.Option>
                    <Select.Option value="YEARLY">Hàng năm</Select.Option>
                    <Select.Option value="LIFETIME">Trọn đời</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Tính năng">
              <Row>
                <Col span={12}>
                  <Form.Item name="features.OCR" valuePropName="checked" noStyle>
                    <Switch checkedChildren="OCR" unCheckedChildren="OCR" />
                  </Form.Item>
                  <span style={{ marginLeft: 8 }}>Nhận diện văn bản (OCR)</span>
                </Col>
                <Col span={12}>
                  <Form.Item name="features.AI" valuePropName="checked" noStyle>
                    <Switch checkedChildren="AI" unCheckedChildren="AI" />
                  </Form.Item>
                  <span style={{ marginLeft: 8 }}>Phân tích AI</span>
                </Col>
              </Row>
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
