import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Typography, Checkbox } from 'antd'
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, KeyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useBulkActions } from '../../hooks/useBulkActions'
import { BulkActionsBar, commonBulkActions } from '../../components/BulkActionsBar'
import { exportToCSV } from '../../utils/exportUtils'
import { SkeletonTable } from '../../components/SkeletonLoader'

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
  const [loading, setLoading] = useState(true)

  // Bulk actions
  const {
    selectedIds,
    selectedItems,
    isAllSelected,
    isSomeSelected,
    toggleItem,
    toggleAll,
    deselectAll,
    isSelected,
  } = useBulkActions({
    items: users,
    getItemId: (user) => user.id,
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const usersData = await import('../../services/api/userAPI').then(m => m.default.getAll())
      setUsers(usersData || [])
    } catch (err) {
      console.error('Failed to load users from API:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const saveUsers = async (updatedUsers: User[]) => {
    // Prefer refetch from API after operations; fallback to state update
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
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa người dùng này?',
      onOk: async () => {
        try {
          const userAPI = (await import('../../services/api/userAPI')).default
          await userAPI.delete(id)
          await loadUsers()
          message.success('Xóa người dùng thành công')
        } catch (err) {
          console.error('Failed to delete user:', err)
          message.error('Xóa user thất bại')
        }
      }
    })
  }

  const handleToggleStatus = (record: User) => {
    ;(async () => {
      try {
        const userAPI = (await import('../../services/api/userAPI')).default
        const newStatus = record.status === 'active' ? 'locked' : 'active'
        await userAPI.update(record.id, { ...record, status: newStatus })
        await loadUsers()
        message.success(`${record.status === 'active' ? 'Khóa' : 'Mở'} tài khoản thành công`)
      } catch (err) {
        console.error('Failed to toggle status:', err)
        message.error('Thao tác thất bại')
      }
    })()
  }

  const handleResetPassword = (record: User) => {
    Modal.confirm({
      title: 'Xác nhận reset mật khẩu',
      content: `Bạn có chắc muốn reset mật khẩu cho ${record.fullName}?`,
      onOk: () => {
        // Call backend reset endpoint if available
        ;(async () => {
          try {
            const userAPI = (await import('../../services/api/userAPI')).default
            await userAPI.update(record.id, { }) // backend should trigger reset based on route; adapt if specific endpoint exists
            message.success('Yêu cầu reset mật khẩu đã gửi')
          } catch (err) {
            console.error('Reset password failed:', err)
            message.error('Reset mật khẩu thất bại')
          }
        })()
      }
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const userAPI = (await import('../../services/api/userAPI')).default

      if (editingUser) {
        await userAPI.update(editingUser.id, values as any)
        message.success('Cập nhật người dùng thành công')
      } else {
        await userAPI.create(values as any)
        message.success('Thêm người dùng thành công')
      }

      setIsModalOpen(false)
      form.resetFields()
      await loadUsers()
    } catch (error) {
      console.error('Validation failed or API error:', error)
      message.error('Thao tác thất bại')
    }
  }

  // demo-clear removed; Webadmin operates on real APIs

  // Bulk actions handlers
  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa nhiều',
      content: `Bạn có chắc muốn xóa ${selectedIds.size} người dùng đã chọn?`,
      onOk: async () => {
        try {
          const userAPI = (await import('../../services/api/userAPI')).default
          const ids = Array.from(selectedIds)
          await Promise.all(ids.map(id => userAPI.delete(id)))
          deselectAll()
          await loadUsers()
          message.success(`Đã xóa ${ids.length} người dùng`)
        } catch (err) {
          console.error('Bulk delete failed:', err)
          message.error('Xóa nhiều thất bại')
        }
      }
    })
  }

  const handleBulkExport = () => {
    const dataToExport = selectedItems.map(user => ({
      Email: user.email,
      'Họ tên': user.fullName,
      'Số điện thoại': user.phone || '',
      'Vai trò': user.role === 'ADMIN' ? 'Admin' : 'User',
      'Trạng thái': user.status === 'active' ? 'Hoạt động' : 'Đã khóa',
      'Ngày tạo': dayjs(user.createdAt).format('DD/MM/YYYY HH:mm'),
      'Đăng nhập cuối': dayjs(user.lastLogin).format('DD/MM/YYYY HH:mm'),
    }))
    exportToCSV(dataToExport, { filename: 'users-export' })
    message.success(`Đã export ${selectedIds.size} người dùng`)
  }

  const columns = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isSomeSelected}
          onChange={toggleAll}
        />
      ),
      key: 'checkbox',
      width: 50,
      render: (_: any, record: User) => (
        <Checkbox
          checked={isSelected(record.id)}
          onChange={() => toggleItem(record.id)}
        />
      ),
    },
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
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? 'Admin' : 'User'}
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
            {/* demo clear button removed - webadmin now uses real API */}
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <SkeletonTable rows={5} loading={loading}>
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
        </SkeletonTable>
      </Card>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.size}
        onClearSelection={deselectAll}
        actions={[
          commonBulkActions.delete(handleBulkDelete),
          commonBulkActions.export(handleBulkExport),
        ]}
      />

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
