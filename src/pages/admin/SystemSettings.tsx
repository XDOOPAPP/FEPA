import React, { useState, useEffect } from 'react'
import { Card, Tabs, Form, Input, Button, Space, Switch, InputNumber, Divider, Tag, message, Select, Row, Col } from 'antd'
import { DollarOutlined, SafetyOutlined, ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

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

  const [apiForm] = Form.useForm()
  const [securityForm] = Form.useForm()

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
        </Tabs>
      </Card>
    </div>
  )
}

export default SystemSettings
