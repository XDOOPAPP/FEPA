import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { MailOutlined, ArrowLeftOutlined, NumberOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '../../services/api/authAPI'

const { Title, Text } = Typography

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0) // 0: email, 1: code, 2: password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const handleEmail = async () => {
    try {
      const values = await form.validateFields(['email'])
      setLoading(true)
      
      // Call API to send OTP
      await authAPI.forgotPassword({ email: values.email })
      
      setEmail(values.email)
      message.success('Mã xác nhận đã được gửi vào email của bạn!')
      setStep(1)
      
      // Clear code field for next step
      form.setFieldValue('code', '')
    } catch (error: any) {
      console.error('Forgot password error:', error)
      message.error(error.message || 'Không thể gửi email xác nhận. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleCode = async () => {
    try {
      const values = await form.validateFields(['code'])
      // Since there is no verify-otp endpoint for password reset specifically,
      // we just store the OTP and move to the next step to reset password.
      // The verification will happen when we call resetPassword.
      setOtp(values.code)
      setStep(2)
      
      // Clear password fields for next step
      form.setFieldValue('newPassword', '')
      form.setFieldValue('confirmPassword', '')
    } catch (error) {
      // Form validation error
    }
  }

  const handleReset = async () => {
    try {
      const values = await form.validateFields(['newPassword', 'confirmPassword'])
      
      if (values.newPassword !== values.confirmPassword) {
        message.error('Mật khẩu nhập lại không khớp')
        return
      }

      setLoading(true)
      
      await authAPI.resetPassword({
        email,
        otp,
        newPassword: values.newPassword
      })

      message.success('Mật khẩu đã được đặt lại thành công!')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error: any) {
      console.error('Reset password error:', error)
      message.error(error.message || 'Đặt lại mật khẩu thất bại. Mã xác nhận có thể đã hết hạn.')
      
      // If error suggests OTP is wrong/expired, maybe go back to step 1
      if (error.status === 400 || (error.message && error.message.toLowerCase().includes('otp'))) {
         setStep(1)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 0) handleEmail()
      else if (step === 1) handleCode()
      else handleReset()
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
      <Card style={{ width: '100%', maxWidth: '450px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Link to="/login" style={{ color: '#667eea', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ArrowLeftOutlined />
            Quay lại đăng nhập
          </Link>

          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>FEPA</Title>
            <Text type="secondary">
              {step === 0 && 'Quên Mật Khẩu'}
              {step === 1 && 'Nhập Mã Xác Nhận'}
              {step === 2 && 'Đặt Lại Mật Khẩu'}
            </Text>
          </div>

          <Form 
            form={form} 
            layout="vertical" 
            autoComplete="off"
            onKeyDown={handleKeyDown}
          >
            {step === 0 && (
              <>
                <Form.Item>
                  <Text type="secondary">Nhập email đã đăng ký để nhận mã xác nhận</Text>
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
                  <Text type="secondary">
                    Mã xác nhận đã được gửi tới <strong>{email}</strong>. 
                    Vui lòng kiểm tra email (cả mục spam).
                  </Text>
                </Form.Item>
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mã xác nhận' },
                    { len: 6, message: 'Mã xác nhận phải có 6 ký tự' }
                  ]}
                >
                  <Input
                    prefix={<NumberOutlined />}
                    placeholder="Nhập mã 6 số"
                    size="large"
                    maxLength={6}
                    style={{ letterSpacing: '2px', textAlign: 'center' }}
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
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button type="link" onClick={() => setStep(0)}>
                    Gửi lại mã?
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Form.Item>
                  <Text type="secondary">Nhập mật khẩu mới cho tài khoản của bạn</Text>
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Tối thiểu 6 ký tự' },
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu mới" 
                    size="large" 
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu" 
                    size="large" 
                  />
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
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button type="link" onClick={() => setStep(1)}>
                    Quay lại nhập mã?
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default ForgotPassword
