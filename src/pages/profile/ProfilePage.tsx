import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Space, 
  Typography, 
  message, 
  Row, 
  Col, 
  Tag
} from 'antd'
import { 
  UserOutlined, 
  MailOutlined, 
  SaveOutlined,
  CrownOutlined
} from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'

const { Title, Text } = Typography

interface ProfileFormValues {
  fullName: string
  email: string
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [profileForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'

  // Set initial values
  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
      })
    }
  }, [user, profileForm])

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (updateProfile) {
        updateProfile({
          fullName: values.fullName,
          email: values.email,
        })
      }
      
      message.success('Cập nhật thông tin thành công!')
    } catch (error) {
      message.error('Cập nhật thông tin thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      admin: { color: 'gold', icon: <CrownOutlined /> },
      user: { color: 'blue', icon: <UserOutlined /> },
      premium: { color: 'purple', icon: <CrownOutlined /> },
    }
    const config = roleConfig[role?.toLowerCase()] || roleConfig.user
    return (
      <Tag color={config.color} icon={config.icon} style={{ fontSize: '14px', padding: '4px 12px' }}>
        {role?.toUpperCase() || 'USER'}
      </Tag>
    )
  }

  if (!user) return null

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '8px' }}>Hồ Sơ Cá Nhân</Title>
      <Text type="secondary">Quản lý thông tin tài khoản của bạn</Text>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Profile Info Card */}
        <Col xs={24} lg={8}>
          <Card bordered={false}>
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={defaultAvatar}
                style={{ backgroundColor: '#1890ff' }}
              />
              
              <div>
                <Title level={4} style={{ marginBottom: '8px' }}>
                  {user.fullName}
                </Title>
                <Space direction="vertical" size="small">
                  <Text type="secondary">
                    <MailOutlined /> {user.email}
                  </Text>
                </Space>
              </div>

              <div style={{ width: '100%' }}>
                {getRoleBadge(user.role || 'user')}
              </div>

              <div style={{ 
                width: '100%',
                padding: '16px',
                background: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">ID Tài Khoản</Text>
                    <Text strong style={{ fontSize: '13px' }}>{user.id}</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Edit Profile Form */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>Thông Tin Cá Nhân</span>
              </Space>
            }
            bordered={false}
          >
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

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={loading}
                    size="large"
                  >
                    Lưu Thay Đổi
                  </Button>
                  <Button size="large" onClick={() => profileForm.resetFields()}>
                    Hủy Bỏ
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProfilePage
