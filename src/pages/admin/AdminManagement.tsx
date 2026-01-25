/**
 * Admin Management Page
 * Quản lý tài khoản admin: tạo admin mới, xem danh sách admin
 */

import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd'
import {
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAPI, type RegisterAdminRequest, type AdminUser } from '../../services/api/adminAPI'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

export default function AdminManagement() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  // ========== React Query ==========
  
  // Fetch all admins
  const { data: adminsData, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: adminAPI.getAllAdmins,
  })

  // Register admin mutation
  const registerMutation = useMutation({
    mutationFn: adminAPI.registerAdmin,
    onSuccess: () => {
      message.success('Admin đã được tạo thành công!')
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setIsDrawerOpen(false)
      form.resetFields()
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi tạo admin')
    },
  })

  // ========== Handlers ==========
  
  const handleCreateAdmin = async (values: RegisterAdminRequest) => {
    registerMutation.mutate(values)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    form.resetFields()
  }

  // ========== Table Columns ==========
  
  const columns: ColumnsType<AdminUser> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (email: string) => (
        <Space>
          <MailOutlined style={{ color: 'var(--primary)' }} />
          <Text>{email}</Text>
        </Space>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      render: (name: string) => (
        <Space>
          <UserOutlined style={{ color: 'var(--text-secondary)' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role: string) => (
        <Tag
          icon={<SafetyOutlined />}
          color={role === 'SUPER_ADMIN' ? 'gold' : 'blue'}
        >
          {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag
            icon={record.isVerified ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={record.isVerified ? 'success' : 'warning'}
          >
            {record.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
          </Tag>
          <Tag
            color={record.isActive ? 'success' : 'default'}
          >
            {record.isActive ? 'Hoạt động' : 'Tạm khóa'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    },
  ]

  // ========== Stats ==========
  
  const adminsPayload: any = adminsData || {}
  const admins = Array.isArray(adminsPayload.data)
    ? adminsPayload.data
    : Array.isArray(adminsPayload.users)
      ? adminsPayload.users
      : Array.isArray(adminsPayload.items)
        ? adminsPayload.items
        : Array.isArray(adminsPayload)
          ? adminsPayload
          : []
  const totalAdmins = admins.length
  const verifiedAdmins = admins.filter(a => a.isVerified).length
  const activeAdmins = admins.filter(a => a.isActive).length

  // ========== Render ==========
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý Admin
            </Title>
            <Text type="secondary">Quản lý danh sách tài khoản quản trị viên</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsDrawerOpen(true)}
          >
            Tạo Admin Mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card className="shadow-card">
            <Statistic
              title="Tổng số Admin"
              value={totalAdmins}
              prefix={<UserOutlined style={{ color: 'var(--primary)' }} />}
              valueStyle={{ color: 'var(--primary)' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-card">
            <Statistic
              title="Admin đã xác thực"
              value={verifiedAdmins}
              prefix={<CheckCircleOutlined style={{ color: 'var(--success)' }} />}
              valueStyle={{ color: 'var(--success)' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-card">
            <Statistic
              title="Admin đang hoạt động"
              value={activeAdmins}
              prefix={<SafetyOutlined style={{ color: 'var(--info)' }} />}
              valueStyle={{ color: 'var(--info)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Admin Table */}
      <Card className="shadow-card">
        <Table
          columns={columns}
          dataSource={admins}
          loading={isLoading}
          rowKey={(record: any) => record.id || record._id || record.email}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số ${total} admin`,
            showSizeChanger: true,
          }}
        />
      </Card>

      {/* Create Admin Drawer */}
      <Drawer
        title={
          <Space>
            <PlusOutlined />
            <span>Tạo Admin Mới</span>
          </Space>
        }
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        width={480}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={handleCloseDrawer}>
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={registerMutation.isPending}
            >
              Tạo Admin
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAdmin}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="admin@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
            extra="Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
