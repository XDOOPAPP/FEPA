import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message, Checkbox, Modal } from 'antd'
import { LockOutlined, MailOutlined, GoogleOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '../../services/api/authAPI'

const { Title, Text } = Typography

interface RegisterFormValues {
  fullName: string  // Backend dùng fullName thay vì firstName/lastName
  email: string
  password: string
  confirmPassword: string
  agree: boolean
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [otpModalVisible, setOtpModalVisible] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const onFinish = async (values: RegisterFormValues) => {
    try {
      setLoading(true)
      
      // Gọi API đăng ký - backend tự gửi OTP qua email
      await authAPI.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      })
      
      setRegisteredEmail(values.email)
      message.success('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.')
      setOtpModalVisible(true)
    } catch (error: any) {
      console.error('Register error:', error)
      message.error(error.message || 'Đăng ký thất bại. Email có thể đã được sử dụng.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      message.error('Vui lòng nhập mã OTP 6 số')
      return
    }

    try {
      setOtpLoading(true)
      
      await authAPI.verifyOtp({
        email: registeredEmail,
        otp: otp,
      })
      
      message.success('Xác thực thành công! Bạn có thể đăng nhập ngay.')
      setOtpModalVisible(false)
      
      // Chuyển về trang login sau 1 giây
      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (error: any) {
      console.error('Verify OTP error:', error)
      message.error(error.message || 'Mã OTP không đúng hoặc đã hết hạn')
    } finally {
      setOtpLoading(false)
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
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>FEPA</Title>
            <Text type="secondary">Tạo Tài Khoản Mới</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên' },
                { min: 3, message: 'Họ tên phải có ít nhất 3 ký tự' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nhập họ và tên đầy đủ" 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập email của bạn"
                size="large"
                type="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản')),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với <a href="#terms">Điều khoản dịch vụ</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Đăng Ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <Text type="secondary">HOẶC</Text>
            </div>

            <Button icon={<GoogleOutlined />} block size="large" style={{ marginBottom: '16px' }}>
              Đăng ký với Google
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Text>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></Text>
            </div>
          </Form>
        </Space>
      </Card>

      {/* Modal xác thực OTP */}
      <Modal
        title="Xác thực Email"
        open={otpModalVisible}
        onOk={handleVerifyOtp}
        onCancel={() => setOtpModalVisible(false)}
        okText="Xác thực"
        cancelText="Hủy"
        confirmLoading={otpLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Text>
            Chúng tôi đã gửi mã OTP 6 số đến email <strong>{registeredEmail}</strong>
          </Text>
          <Text type="secondary">Vui lòng kiểm tra email và nhập mã OTP bên dưới:</Text>
          <Input
            placeholder="Nhập mã OTP 6 số"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            size="large"
          />
        </Space>
      </Modal>
    </div>
  )
}

export default RegisterPage
