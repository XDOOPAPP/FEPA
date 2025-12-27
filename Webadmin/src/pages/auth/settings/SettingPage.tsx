import React, { useState, useEffect } from 'react'
import { Card, Form, Select, Switch, Button, message, Space, Typography, Divider, Row, Col, Popconfirm } from 'antd'
import { DeleteOutlined, ReloadOutlined, SaveOutlined, BellOutlined, GlobalOutlined, DatabaseOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

interface Settings {
  currency: string
  dateFormat: string
  timezone: string
  notificationsEnabled: boolean
  budgetAlertEnabled: boolean
  expenseReminderEnabled: boolean
}

const defaultSettings: Settings = {
  currency: 'VND',
  dateFormat: 'DD/MM/YYYY',
  timezone: 'Asia/Ho_Chi_Minh',
  notificationsEnabled: true,
  budgetAlertEnabled: true,
  expenseReminderEnabled: false,
}

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm()
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      form.setFieldsValue(parsed)
    } else {
      form.setFieldsValue(defaultSettings)
    }
  }, [form])

  const handleSave = () => {
    form.validateFields().then(values => {
      setLoading(true)
      
      // Save to localStorage
      const newSettings = { ...settings, ...values }
      localStorage.setItem('appSettings', JSON.stringify(newSettings))
      setSettings(newSettings)
      
      setTimeout(() => {
        setLoading(false)
        message.success('Lưu cài đặt thành công!')
      }, 500)
    })
  }

  const handleResetToDefault = () => {
    form.setFieldsValue(defaultSettings)
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings))
    setSettings(defaultSettings)
    message.success('Đã reset về cài đặt mặc định!')
  }

  const handleDeleteAllData = () => {
    // Clear all data except user and settings
    const user = localStorage.getItem('user')
    const appSettings = localStorage.getItem('appSettings')
    
    localStorage.clear()
    
    // Restore user and settings
    if (user) localStorage.setItem('user', user)
    if (appSettings) localStorage.setItem('appSettings', appSettings)
    
    message.success('Đã xóa tất cả dữ liệu!')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>⚙️ Cài Đặt</Title>
      <Text type="secondary">Tùy chỉnh ứng dụng theo sở thích của bạn</Text>

      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '24px' }}
        initialValues={settings}
      >
        {/* 1. Currency Settings */}
        <Card 
          title={
            <Space>
              <GlobalOutlined />
              <span>Đơn Vị Tiền Tệ</span>
            </Space>
          }
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="currency"
                label="Đơn vị tiền tệ"
                rules={[{ required: true, message: 'Vui lòng chọn đơn vị tiền tệ' }]}
              >
                <Select size="large">
                  <Option value="VND">🇻🇳 Việt Nam Đồng (VNĐ)</Option>
                  <Option value="USD">🇺🇸 US Dollar ($)</Option>
                  <Option value="EUR">🇪🇺 Euro (€)</Option>
                  <Option value="GBP">🇬🇧 British Pound (£)</Option>
                  <Option value="JPY">🇯🇵 Japanese Yen (¥)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 2. Date & Time Settings */}
        <Card 
          title={
            <Space>
              <GlobalOutlined />
              <span>Định Dạng Ngày Tháng & Múi Giờ</span>
            </Space>
          }
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="dateFormat"
                label="Định dạng ngày tháng"
                rules={[{ required: true, message: 'Vui lòng chọn định dạng' }]}
              >
                <Select size="large">
                  <Option value="DD/MM/YYYY">DD/MM/YYYY (18/12/2024)</Option>
                  <Option value="MM/DD/YYYY">MM/DD/YYYY (12/18/2024)</Option>
                  <Option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-18)</Option>
                  <Option value="DD-MM-YYYY">DD-MM-YYYY (18-12-2024)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="timezone"
                label="Múi giờ"
                rules={[{ required: true, message: 'Vui lòng chọn múi giờ' }]}
              >
                <Select size="large">
                  <Option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</Option>
                  <Option value="America/New_York">New York (GMT-5)</Option>
                  <Option value="Europe/London">London (GMT+0)</Option>
                  <Option value="Asia/Tokyo">Tokyo (GMT+9)</Option>
                  <Option value="Asia/Singapore">Singapore (GMT+8)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 3. Notifications Settings */}
        <Card 
          title={
            <Space>
              <BellOutlined />
              <span>Thông Báo</span>
            </Space>
          }
          style={{ marginBottom: '16px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Bật thông báo</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Nhận tất cả thông báo từ ứng dụng
                </Text>
              </div>
              <Form.Item name="notificationsEnabled" valuePropName="checked" style={{ margin: 0 }}>
                <Switch />
              </Form.Item>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Cảnh báo vượt ngân sách</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Thông báo khi chi tiêu vượt quá ngân sách đã đặt
                </Text>
              </div>
              <Form.Item name="budgetAlertEnabled" valuePropName="checked" style={{ margin: 0 }}>
                <Switch />
              </Form.Item>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Nhắc nhở nhập chi tiêu định kỳ</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Nhắc bạn ghi chép chi tiêu hàng ngày (8:00 PM)
                </Text>
              </div>
              <Form.Item name="expenseReminderEnabled" valuePropName="checked" style={{ margin: 0 }}>
                <Switch />
              </Form.Item>
            </div>
          </Space>
        </Card>

        {/* 4. Data Management */}
        <Card 
          title={
            <Space>
              <DatabaseOutlined />
              <span>Quản Lý Dữ Liệu</span>
            </Space>
          }
          style={{ marginBottom: '16px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>Reset về mặc định</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Khôi phục tất cả cài đặt về giá trị mặc định
              </Text>
            </div>
            <Popconfirm
              title="Reset cài đặt"
              description="Bạn có chắc muốn reset về cài đặt mặc định?"
              onConfirm={handleResetToDefault}
              okText="Reset"
              cancelText="Hủy"
            >
              <Button icon={<ReloadOutlined />} style={{ width: '100%' }}>
                Reset về mặc định
              </Button>
            </Popconfirm>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong type="danger">Xóa tất cả dữ liệu</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Xóa tất cả chi tiêu, ngân sách, danh mục (không thể hoàn tác)
              </Text>
            </div>
            <Popconfirm
              title="Xóa tất cả dữ liệu"
              description="CẢNH BÁO: Hành động này không thể hoàn tác! Tất cả dữ liệu sẽ bị xóa vĩnh viễn."
              onConfirm={handleDeleteAllData}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} style={{ width: '100%' }}>
                Xóa tất cả dữ liệu
              </Button>
            </Popconfirm>
          </Space>
        </Card>

        {/* Save Button */}
        <Card>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={loading}
            size="large"
            block
          >
            Lưu Cài Đặt
          </Button>
        </Card>
      </Form>
    </div>
  )
}

export default SettingsPage
