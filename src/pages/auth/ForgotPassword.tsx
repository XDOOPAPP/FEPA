import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0) // 0: email, 1: code, 2: password
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleEmail = async () => {
    const values = await form.validateFields(['email'])
    try {
      setLoading(true)
      setEmail(values.email)
      message.success('Mã xác nhận đã được gửi!')
      setStep(1)
      form.resetFields()
    } catch (error) {
      message.error('Gửi email thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleCode = async () => {
    const values = await form.validateFields(['code'])
    try {
      setLoading(true)
      message.success('Xác nhận thành công!')
      setStep(2)
      form.resetFields()
    } catch (error) {
      message.error('Mã xác nhận sai')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    const values = await form.validateFields(['newPassword', 'confirmPassword'])
    try {
      setLoading(true)
      if (values.newPassword !== values.confirmPassword) {
        message.error('Mật khẩu không khớp')
        return
      }
      message.success('Mật khẩu đã được đặt lại!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      message.error('Đặt lại mật khẩu thất bại')
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
      <Card style={{ width: '100%', maxWidth: '450px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Link to="/login" style={{ color: '#667eea', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ArrowLeftOutlined />
            Quay lại đăng nhập
          </Link>

          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>FEPA</Title>
            <Text type="secondary">Đặt Lại Mật Khẩu</Text>
          </div>

          <Form form={form} layout="vertical" autoComplete="off">
            {step === 0 && (
              <>
                <Form.Item>
                  <Text type="secondary">Nhập email để nhận mã xác nhận</Text>
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    size="large"
                    type="email"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loading}
                  onClick={handleEmail}
                >
                  Gửi Mã Xác Nhận
                </Button>
              </>
            )}

            {step === 1 && (
              <>
                <Form.Item>
                  <Text type="secondary">Nhập mã xác nhận gửi tới {email}</Text>
                </Form.Item>
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
                >
                  <Input
                    placeholder="000000"
                    size="large"
                    maxLength={6}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loading}
                  onClick={handleCode}
                >
                  Tiếp Tục
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Item>
                  <Text type="secondary">Nhập mật khẩu mới</Text>
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Tối thiểu 6 ký tự' },
                  ]}
                >
                  <Input.Password placeholder="Mật khẩu mới" size="large" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu" size="large" />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loading}
                  onClick={handleReset}
                >
                  Đặt Lại Mật Khẩu
                </Button>
              </>
            )}
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default ForgotPassword
