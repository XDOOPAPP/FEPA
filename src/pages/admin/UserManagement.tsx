import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Typography } from 'antd'
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, KeyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title } = Typography

interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'user'
  status: 'active' | 'locked'
  phone?: string
  createdAt: string
  lastLogin: string
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    // Load users from localStorage (created by initDemoData)
    const stored = localStorage.getItem('all_users')
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed)
          return
        }
      } catch (error) {
        console.error('Error loading users:', error)
      }
    }
    
    // If no users found, set empty array (initDemoData will create them on next reload)
    setUsers([])
  }

  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('all_users', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: User) => {
    setEditingUser(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const updated = users.filter(u => u.id !== id)
    saveUsers(updated)
    message.success('Xóa người dùng thành công')
  }

  const handleToggleStatus = (record: User) => {
    const updated = users.map(u => 
      u.id === record.id 
        ? { ...u, status: u.status === 'active' ? 'locked' as const : 'active' as const }
        : u
    )
    saveUsers(updated)
    message.success(`${record.status === 'active' ? 'Khóa' : 'Mở khóa'} tài khoản thành công`)
  }

  const handleResetPassword = (record: User) => {
    Modal.confirm({
      title: 'Xác nhận reset mật khẩu',
      content: `Bạn có chắc muốn reset mật khẩu cho ${record.fullName}?`,
      onOk: () => {
        // In real app, send reset password email
        message.success('Đã gửi email reset mật khẩu')
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingUser) {
        // Update existing user
        const updated = users.map(u => 
          u.id === editingUser.id ? { ...u, ...values } : u
        )
        saveUsers(updated)
        message.success('Cập nhật người dùng thành công')
      } else {
        // Add new user
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
        saveUsers([...users, newUser])
        message.success('Thêm người dùng thành công')
      }
      
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleClearDemoData = () => {
    Modal.confirm({
      title: 'Làm mới toàn bộ dữ liệu demo',
      content: 'Thao tác này sẽ xóa TẤT CẢ dữ liệu demo (users, expenses, budgets, categories, v.v.) và tạo lại từ đầu. Bạn có chắc chắn?',
      okText: 'Làm mới toàn bộ',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        // Clear ALL demo data to force full resync
        localStorage.removeItem('all_users')
        localStorage.removeItem('expenses')
        localStorage.removeItem('budgets')
        localStorage.removeItem('categories')
        localStorage.removeItem('subscription_plans')
        localStorage.removeItem('user_subscriptions')
        localStorage.removeItem('blog_posts')
        localStorage.removeItem('advertisements')
        message.success('Đã xóa toàn bộ dữ liệu. Đang reload...')
        setTimeout(() => window.location.reload(), 800)
      }
    })
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email)
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: User, b: User) => a.fullName.localeCompare(b.fullName)
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' }
      ],
      onFilter: (value: any, record: User) => record.role === value
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Đã khóa'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Đã khóa', value: 'locked' }
      ],
      onFilter: (value: any, record: User) => record.status === value
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: User, b: User) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: User, b: User) => dayjs(a.lastLogin).unix() - dayjs(b.lastLogin).unix()
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right' as const,
      width: 280,
      render: (_: any, record: User) => (
        <Space size="small" wrap style={{ 
          padding: '4px', 
          border: '1px solid #f0f0f0', 
          borderRadius: '6px',
          background: '#fafafa',
          display: 'inline-flex',
          gap: '4px'
        }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            style={{ color: '#1890ff' }}
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
            size="small"
            style={{ color: '#faad14' }}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở'}
          </Button>
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record)}
            size="small"
            style={{ color: '#52c41a' }}
          >
            Reset MK
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title={<Title level={3}><UserOutlined /> Quản lý người dùng</Title>}
        extra={
          <Space>
            <Button 
              danger 
              onClick={handleClearDemoData}
              style={{ display: users.length > 0 ? 'inline-block' : 'none' }}
            >
              Xóa dữ liệu demo
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={600}
        okText={editingUser ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
