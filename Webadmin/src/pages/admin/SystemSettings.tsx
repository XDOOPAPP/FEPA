import React, { useState, useEffect } from 'react'
import { Card, Tabs, Form, Input, Button, Space, Switch, InputNumber, Divider, Tag, message, Select, Row, Col, Modal, Table } from 'antd'
import { DollarOutlined, SafetyOutlined, ApiOutlined, CheckCircleOutlined, CloseCircleOutlined, BellOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { TabPane } = Tabs

interface APIKey {
  service: string
  key: string
  enabled: boolean
  status: 'connected' | 'error' | 'not-configured'
}

interface FinancialRule {
  id: string
  type: 'income' | 'expense'
  ageGroup: string
  gender: string
  location: string
  minAmount: number
  maxAmount: number
  averageAmount: number
}

interface SecuritySettings {
  rsaEnabled: boolean
  rsaKeySize: number
  oauthEnabled: boolean
  twoFactorEnabled: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  passwordRequireSpecialChar: boolean
}

interface NotificationTemplate {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

const SystemSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [financialRules, setFinancialRules] = useState<FinancialRule[]>([])
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    rsaEnabled: true,
    rsaKeySize: 2048,
    oauthEnabled: true,
    twoFactorEnabled: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
  })
  const [notifications, setNotifications] = useState<NotificationTemplate[]>([])
  const [notificationModalVisible, setNotificationModalVisible] = useState(false)
  const [editingNotification, setEditingNotification] = useState<NotificationTemplate | null>(null)

  const [apiForm] = Form.useForm()
  const [securityForm] = Form.useForm()
  const [notificationForm] = Form.useForm()

  // TODO: Replace with API call - GET /api/system/settings
  useEffect(() => {
    const storedKeys = localStorage.getItem('api_keys')
    if (storedKeys) {
      setApiKeys(JSON.parse(storedKeys))
    } else {
      const initialKeys: APIKey[] = [
        {
          service: 'PayOS',
          key: 'payos_live_xxxxxxxxxxxxxxxxxxxx',
          enabled: true,
          status: 'connected',
        },
        {
          service: 'VNPay',
          key: 'vnpay_sandbox_xxxxxxxxxxxxxxxxxxxx',
          enabled: true,
          status: 'connected',
        },
        {
          service: 'Firebase FCM',
          key: 'firebase_xxxxxxxxxxxxxxxxxxxx',
          enabled: true,
          status: 'connected',
        },
        {
          service: 'Google OAuth',
          key: '',
          enabled: false,
          status: 'not-configured',
        },
        {
          service: 'Facebook OAuth',
          key: '',
          enabled: false,
          status: 'not-configured',
        },
      ]
      setApiKeys(initialKeys)
      localStorage.setItem('api_keys', JSON.stringify(initialKeys))
    }

    const storedRules = localStorage.getItem('financial_rules')
    if (storedRules) {
      setFinancialRules(JSON.parse(storedRules))
    } else {
      const initialRules: FinancialRule[] = [
        {
          id: '1',
          type: 'income',
          ageGroup: '18-25',
          gender: 'all',
          location: 'TP.HCM',
          minAmount: 5000000,
          maxAmount: 15000000,
          averageAmount: 8000000,
        },
        {
          id: '2',
          type: 'expense',
          ageGroup: '18-25',
          gender: 'all',
          location: 'TP.HCM',
          minAmount: 3000000,
          maxAmount: 8000000,
          averageAmount: 5000000,
        },
        {
          id: '3',
          type: 'income',
          ageGroup: '26-35',
          gender: 'all',
          location: 'Hà Nội',
          minAmount: 10000000,
          maxAmount: 30000000,
          averageAmount: 18000000,
        },
      ]
      setFinancialRules(initialRules)
      localStorage.setItem('financial_rules', JSON.stringify(initialRules))
    }

    const storedSecurity = localStorage.getItem('security_settings')
    if (storedSecurity) {
      const settings = JSON.parse(storedSecurity)
      setSecuritySettings(settings)
      securityForm.setFieldsValue(settings)
    } else {
      securityForm.setFieldsValue(securitySettings)
    }

    // Load notifications
    const storedNotifications = localStorage.getItem('notification_templates')
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    }
  }, [])

  const handleSaveAPIKey = async (service: string) => {
    try {
      const values = await apiForm.validateFields([`${service}_key`, `${service}_enabled`])
      const newKeys = apiKeys.map(k =>
        k.service === service
          ? { ...k, key: values[`${service}_key`], enabled: values[`${service}_enabled`], status: (values[`${service}_key`] ? 'connected' : 'not-configured') as APIKey['status'] }
          : k
      )
      setApiKeys(newKeys)
      localStorage.setItem('api_keys', JSON.stringify(newKeys))
      // TODO: Replace with API call - POST /api/system/api-keys
      message.success(`Đã lưu cấu hình ${service}`)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleSaveSecuritySettings = async () => {
    try {
      const values = await securityForm.validateFields()
      setSecuritySettings(values)
      localStorage.setItem('security_settings', JSON.stringify(values))
      // TODO: Replace with API call - POST /api/system/security
      message.success('Đã lưu cấu hình bảo mật')
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const testAPIConnection = (service: string) => {
    // TODO: Implement real API test
    message.info(`Đang kiểm tra kết nối ${service}...`)
    setTimeout(() => {
      message.success(`Kết nối ${service} thành công`)
    }, 1000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const handleCreateNotification = () => {
    setEditingNotification(null)
    notificationForm.resetFields()
    setNotificationModalVisible(true)
  }

  const handleEditNotification = (notification: NotificationTemplate) => {
    setEditingNotification(notification)
    notificationForm.setFieldsValue(notification)
    setNotificationModalVisible(true)
  }

  const handleSaveNotification = async () => {
    try {
      const values = await notificationForm.validateFields()
      const storedNotifications = localStorage.getItem('admin_notifications') || '[]'
      const allNotifications = JSON.parse(storedNotifications)
      
      const newNotification = {
        id: editingNotification?.id || Date.now().toString(),
        title: values.title,
        message: values.message,
        type: values.type,
        priority: values.priority,
        read: false,
        createdAt: editingNotification?.createdAt || new Date().toISOString()
      }

      if (editingNotification) {
        // Update existing notification
        const updatedNotifications = allNotifications.map((n: any) =>
          n.id === editingNotification.id ? newNotification : n
        )
        localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications))
        
        // Update template
        const updatedTemplates = notifications.map(n =>
          n.id === editingNotification.id ? newNotification : n
        )
        setNotifications(updatedTemplates)
        localStorage.setItem('notification_templates', JSON.stringify(updatedTemplates))
        message.success('Đã cập nhật thông báo')
      } else {
        // Create new notification
        allNotifications.push(newNotification)
        localStorage.setItem('admin_notifications', JSON.stringify(allNotifications))
        
        // Add to templates
        const updatedTemplates = [...notifications, newNotification]
        setNotifications(updatedTemplates)
        localStorage.setItem('notification_templates', JSON.stringify(updatedTemplates))
        message.success('Đã tạo thông báo mới')
      }

      setNotificationModalVisible(false)
      notificationForm.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleDeleteNotification = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa thông báo này?',
      onOk: () => {
        const updated = notifications.filter(n => n.id !== id)
        setNotifications(updated)
        localStorage.setItem('notification_templates', JSON.stringify(updated))
        message.success('Đã xóa thông báo')
      }
    })
  }

  const notificationColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          info: 'blue',
          success: 'green',
          warning: 'orange',
          error: 'red'
        }
        const labels: Record<string, string> = {
          info: 'Thông tin',
          success: 'Thành công',
          warning: 'Cảnh báo',
          error: 'Lỗi'
        }
        return <Tag color={colors[type]}>{labels[type]}</Tag>
      }
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors: Record<string, string> = {
          low: 'blue',
          medium: 'orange',
          high: 'red'
        }
        const labels: Record<string, string> = {
          low: 'Thấp',
          medium: 'Trung bình',
          high: 'Cao'
        }
        return <Tag color={colors[priority]}>{labels[priority]}</Tag>
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: NotificationTemplate) => (
        <Space>
          <Button size="small" onClick={() => handleEditNotification(record)}>
            Sửa
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteNotification(record.id)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Cấu hình Hệ thống">
        <Tabs defaultActiveKey="api">
          <TabPane
            tab={
              <span>
                <ApiOutlined />
                API Keys
              </span>
            }
            key="api"
          >
            <Form form={apiForm} layout="vertical">
              {apiKeys.map((apiKey) => (
                <Card key={apiKey.service} size="small" style={{ marginBottom: '16px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <strong>{apiKey.service}</strong>
                        {apiKey.status === 'connected' && (
                          <Tag color="success" icon={<CheckCircleOutlined />}>Đã kết nối</Tag>
                        )}
                        {apiKey.status === 'error' && (
                          <Tag color="error" icon={<CloseCircleOutlined />}>Lỗi</Tag>
                        )}
                        {apiKey.status === 'not-configured' && (
                          <Tag color="default">Chưa cấu hình</Tag>
                        )}
                      </Space>
                      <Form.Item
                        name={`${apiKey.service}_enabled`}
                        valuePropName="checked"
                        initialValue={apiKey.enabled}
                        style={{ margin: 0 }}
                      >
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                      </Form.Item>
                    </Space>

                    <Form.Item
                      name={`${apiKey.service}_key`}
                      initialValue={apiKey.key}
                      style={{ margin: 0 }}
                    >
                      <Input.Password placeholder="Nhập API Key" />
                    </Form.Item>

                    <Space>
                      <Button type="primary" size="small" onClick={() => handleSaveAPIKey(apiKey.service)}>
                        Lưu
                      </Button>
                      <Button size="small" onClick={() => testAPIConnection(apiKey.service)}>
                        Kiểm tra kết nối
                      </Button>
                    </Space>
                  </Space>
                </Card>
              ))}
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <DollarOutlined />
                Quy tắc Tài chính
              </span>
            }
            key="financial"
          >
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                Cấu hình các ngưỡng thu nhập/chi tiêu theo độ tuổi, giới tính, vị trí địa lý.
                Hệ thống sẽ sử dụng để đưa ra khuyến nghị tài chính cho người dùng.
              </p>
            </div>

            {financialRules.map((rule) => (
              <Card key={rule.id} size="small" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <div>
                      <strong>Loại:</strong>
                      <Tag color={rule.type === 'income' ? 'green' : 'red'} style={{ marginLeft: '8px' }}>
                        {rule.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div>
                      <strong>Độ tuổi:</strong> {rule.ageGroup}
                    </div>
                  </Col>
                  <Col span={6}>
                    <div>
                      <strong>Giới tính:</strong> {rule.gender === 'all' ? 'Tất cả' : rule.gender}
                    </div>
                  </Col>
                  <Col span={6}>
                    <div>
                      <strong>Vị trí:</strong> {rule.location}
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Tối thiểu</div>
                    <div>{formatCurrency(rule.minAmount)}</div>
                  </Col>
                  <Col span={8}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Trung bình</div>
                    <div><strong>{formatCurrency(rule.averageAmount)}</strong></div>
                  </Col>
                  <Col span={8}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Tối đa</div>
                    <div>{formatCurrency(rule.maxAmount)}</div>
                  </Col>
                </Row>
              </Card>
            ))}

            <Button type="dashed" block style={{ marginTop: '16px' }}>
              + Thêm quy tắc mới
            </Button>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SafetyOutlined />
                Bảo mật
              </span>
            }
            key="security"
          >
            <Form form={securityForm} layout="vertical" onFinish={handleSaveSecuritySettings}>
              <Card title="Mã hóa & Xác thực" size="small" style={{ marginBottom: '16px' }}>
                <Form.Item
                  label="Kích hoạt RSA Encryption"
                  name="rsaEnabled"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  label="Kích thước khóa RSA"
                  name="rsaKeySize"
                >
                  <Select>
                    <Select.Option value={2048}>2048 bit (Khuyến nghị)</Select.Option>
                    <Select.Option value={4096}>4096 bit (Bảo mật cao)</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Kích hoạt OAuth 2.0"
                  name="oauthEnabled"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>

                <Form.Item
                  label="Kích hoạt xác thực 2 yếu tố (2FA)"
                  name="twoFactorEnabled"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>
              </Card>

              <Card title="Chính sách Phiên & Mật khẩu" size="small" style={{ marginBottom: '16px' }}>
                <Form.Item
                  label="Thời gian hết hạn phiên (phút)"
                  name="sessionTimeout"
                >
                  <InputNumber min={5} max={120} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Số lần đăng nhập sai tối đa"
                  name="maxLoginAttempts"
                >
                  <InputNumber min={3} max={10} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Độ dài mật khẩu tối thiểu"
                  name="passwordMinLength"
                >
                  <InputNumber min={6} max={20} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="Yêu cầu ký tự đặc biệt"
                  name="passwordRequireSpecialChar"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </Card>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Lưu cấu hình bảo mật
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Thông báo
              </span>
            }
            key="notifications"
          >
            <Card
              title="Quản lý Thông báo"
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNotification}>
                  Tạo thông báo mới
                </Button>
              }
            >
              <Table
                columns={notificationColumns}
                dataSource={notifications}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'Chưa có thông báo nào' }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* Notification Modal */}
      <Modal
        title={editingNotification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
        open={notificationModalVisible}
        onOk={handleSaveNotification}
        onCancel={() => {
          setNotificationModalVisible(false)
          notificationForm.resetFields()
          setEditingNotification(null)
        }}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={notificationForm}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung thông báo" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại thông báo"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                initialValue="info"
              >
                <Select>
                  <Select.Option value="info">Thông tin</Select.Option>
                  <Select.Option value="success">Thành công</Select.Option>
                  <Select.Option value="warning">Cảnh báo</Select.Option>
                  <Select.Option value="error">Lỗi</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
                initialValue="medium"
              >
                <Select>
                  <Select.Option value="low">Thấp</Select.Option>
                  <Select.Option value="medium">Trung bình</Select.Option>
                  <Select.Option value="high">Cao</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default SystemSettings
