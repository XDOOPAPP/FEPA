import React, { useState } from 'react'
import { Card, Form, Input, Button, Avatar, Space, Typography, message, Row, Col } from 'antd'
import { UserOutlined, MailOutlined, SaveOutlined, PhoneOutlined } from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'

const { Title, Text } = Typography

interface ProfileFormValues {
  fullName: string
  email: string
  phone?: string
}


const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [profileForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Fixed default avatar
  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'

  // Set initial values
  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      })
    }
  }, [user, profileForm])

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      
      // Update profile in context
      if (updateProfile) {
        updateProfile({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        })
      }
      
      message.success('Cập nhật thông tin thành công!')
    } catch (error) {
      message.error('Cập nhật thông tin thất bại!')
    } finally {
      setLoading(false)
    }
  }

  // change-password removed for admin users

  if (!user) return null

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Hồ Sơ Cá Nhân</Title>
      <Text type="secondary">Quản lý thông tin tài khoản của bạn</Text>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Profile Info Card */}
        <Col xs={24} lg={8}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={defaultAvatar}
                style={{ backgroundColor: 'var(--primary)' }}
              />
              <div>
                <Title level={4} style={{ marginBottom: '4px' }}>{user.fullName}</Title>
                <Text type="secondary">{user.email}</Text>
                {user.phone && <div><Text type="secondary">📱 {user.phone}</Text></div>}
              </div>
              <div style={{ 
                padding: '12px', 
                background: 'var(--bg-base)', 
                borderRadius: '8px',
                width: '100%'
              }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text><strong>Vai trò:</strong> {user.role || 'User'}</Text>
                  <Text><strong>ID:</strong> {user.id}</Text>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Edit Profile Form */}
        <Col xs={24} lg={16}>
          <Card title="Thông Tin Cá Nhân" extra={<UserOutlined />}>
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="fullName"
                label="Họ và Tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên' },
                  { min: 2, message: 'Họ tên tối thiểu 2 ký tự' },
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Nhập họ và tên"
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
                  placeholder="Nhập email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số Điện Thoại"
                rules={[
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)' },
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Nhập số điện thoại"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  Lưu Thay Đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Change password removed for admin users */}
        </Col>
      </Row>
    </div>
  )
}

export default ProfilePage
