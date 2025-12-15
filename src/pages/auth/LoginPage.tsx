import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

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

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true)
      console.log('Login values:', values)
      message.success('Đăng nhập thành công!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      message.error('Đăng nhập thất bại')
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>FEPA</Title>
            <Text type="secondary">Hệ Thống Quản Lý Chi Phí</Text>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <label>
                  <input type="checkbox" /> Ghi nhớ tôi
                </label>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Đăng Nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <Text type="secondary">HOẶC</Text>
            </div>

            <Button icon={<GoogleOutlined />} block size="large" style={{ marginBottom: '16px' }}>
              Đăng nhập với Google
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Text>Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link></Text>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage
