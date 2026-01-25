import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Popconfirm, Typography, Checkbox, Dropdown } from 'antd'
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, KeyOutlined, MoreOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useBulkActions } from '../../hooks/useBulkActions'
import { BulkActionsBar, commonBulkActions } from '../../components/BulkActionsBar'
import { exportToCSV } from '../../utils/exportUtils'
import { SkeletonTable } from '../../components/SkeletonLoader'
import userAPI from '../../services/api/userAPI'

const { Title } = Typography

interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'user'
  status: 'active' | 'locked'
  createdAt: string
  lastLogin: string
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{ search?: string; status: 'ALL' | 'ACTIVE' | 'INACTIVE'; role: 'ALL' | 'ADMIN' | 'USER'; verified: 'ALL' | 'VERIFIED' | 'UNVERIFIED'; page: number; pageSize: number }>({ status: 'ALL', role: 'ALL', verified: 'ALL', page: 1, pageSize: 10 })
  const [total, setTotal] = useState(0)

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
      const res = await userAPI.getUsers(filters)
      const payload = (res as any) || {}
      const list = Array.isArray(payload.data) ? payload.data : payload.users || payload.items || []

      const mapped = list.map((u: any) => {
        const roleRaw = u.role || 'USER'
        const roleNorm = roleRaw.toUpperCase()
        return {
          id: u.id || u._id,
          email: u.email,
          fullName: u.fullName || u.name,
          role: roleNorm,
          status: u.isActive ? 'active' : 'locked',
          createdAt: u.createdAt,
          lastLogin: u.lastLogin || u.createdAt,
        }
      })

      setUsers(mapped)
      setTotal(payload.total || mapped.length)
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

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
    loadUsers()
  }

  const handleFilterChange = (changed: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...changed, page: 1 }))
    loadUsers()
  }

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    setFilters(prev => ({ ...prev, page: current, pageSize }))
    loadUsers()
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa người dùng này?',
      onOk: async () => {
        try {
          await userAPI.deleteUser(id)
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
        const newStatus = record.status === 'active' ? 'locked' : 'active'
        if (newStatus === 'locked') {
          await userAPI.deactivateUser(record.id)
        } else {
          await userAPI.reactivateUser(record.id)
        }
        await loadUsers()
        message.success(newStatus === 'locked' ? 'Đã khóa người dùng' : 'Đã mở khóa người dùng')
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
        message.info('Tính năng reset mật khẩu sẽ được bổ sung sau')
      }
    })
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      message.info('Tính năng tạo/cập nhật người dùng sẽ được bổ sung sau')
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
          const ids = Array.from(selectedIds)
          await Promise.all(ids.map(id => userAPI.deleteUser(id)))
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const isSuper = role === 'SUPER_ADMIN'
        const isAdmin = role === 'ADMIN'
        return (
          <Tag color={isSuper ? 'gold' : isAdmin ? 'red' : 'blue'}>
            {isSuper ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}
          </Tag>
        )
      },
      filters: [
        { text: 'Super Admin', value: 'SUPER_ADMIN' },
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' },
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
      width: 180,
      render: (_: any, record: User) => {
        const menuItems = [
          {
            key: 'edit',
            label: 'Sửa',
            icon: <EditOutlined />,
            onClick: () => handleEdit(record),
          },
          {
            key: 'toggle',
            label: record.status === 'active' ? 'Khóa' : 'Mở',
            icon: record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />,
            onClick: () => handleToggleStatus(record),
          },
          {
            key: 'reset',
            label: 'Reset MK',
            icon: <KeyOutlined />,
            onClick: () => handleResetPassword(record),
          },
          {
            key: 'delete',
            label: 'Xóa',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ]

        return (
          <Dropdown
            menu={{
              items: menuItems.map((item) => ({
                key: item.key,
                label: (
                  <Space size="small" onClick={item.onClick}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Space>
                ),
                danger: item.danger,
              })),
            }}
            trigger={[ 'click' ]}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />}>
              Thao tác
            </Button>
          </Dropdown>
        )
      }
    }
  ]

  return (
    <div>
      <Card
        title={<Title level={3}><UserOutlined /> Quản lý người dùng</Title>}
        extra={
          <Space wrap>
            <Input.Search
              allowClear
              placeholder="Tìm theo email/họ tên"
              onSearch={handleSearch}
              style={{ width: 260 }}
            />
            <Select
              value={filters.status}
              onChange={(v) => handleFilterChange({ status: v as any })}
              style={{ width: 140 }}
              options={[
                { label: 'Tất cả', value: 'ALL' },
                { label: 'Hoạt động', value: 'ACTIVE' },
                { label: 'Đã khóa', value: 'INACTIVE' },
              ]}
            />
            <Select
              value={filters.role}
              onChange={(v) => handleFilterChange({ role: v as any })}
              style={{ width: 140 }}
              options={[
                { label: 'Tất cả', value: 'ALL' },
                { label: 'User', value: 'USER' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
            />
            <Select
              value={filters.verified}
              onChange={(v) => handleFilterChange({ verified: v as any })}
              style={{ width: 160 }}
              options={[
                { label: 'Tất cả', value: 'ALL' },
                { label: 'Đã xác thực', value: 'VERIFIED' },
                { label: 'Chưa xác thực', value: 'UNVERIFIED' },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm
            </Button>
          </Space>
        }
      >
        <SkeletonTable rows={5} loading={loading}>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{
              current: filters.page,
              pageSize: filters.pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (t) => `Tổng ${t} người dùng`,
            }}
            onChange={handleTableChange}
            style={{ width: '100%' }}
            tableLayout="auto"
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
