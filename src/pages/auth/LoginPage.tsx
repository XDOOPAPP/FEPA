import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Space, message, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const { Title, Text } = Typography

interface LoginFormValues {
  email: string
  password: string
  remember?: boolean
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const { user } = useAuth()
  const [messageApi, contextHolder] = message.useMessage()

  // Load saved credentials if "remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      form.setFieldsValue({ email: savedEmail, remember: true })
    }
  }, [form])

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true)

      // Login as admin
      const userData = await login(values.email, values.password)

      // Check if user is admin
      if (!userData || (userData.role !== 'ADMIN')) {
        messageApi.error('Bạn không có quyền truy cập trang quản trị')
        setLoading(false)
        return
      }

      // Handle "Remember me" checkbox
      if (values.remember) {
        localStorage.setItem('rememberedEmail', values.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      messageApi.success('Đăng nhập thành công!')
      navigate('/admin/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      messageApi.error(error.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #5490c1ff 0%, #4d91efff 100%)',
      padding: '20px'
    }}>
      {contextHolder}
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>FEPA Admin</Title>
            <Text type="secondary">Hệ Thống Quản Lý</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
