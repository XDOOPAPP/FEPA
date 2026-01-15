import React, { useState } from 'react'
import { Card, List, Space, Button, Tag, Typography, Empty, Tabs, Modal, message, Form, Input, Select, Spin } from 'antd'
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '../../services/queries'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Title, Text } = Typography
const { TextArea } = Input

interface Notification {
  _id?: string
  id?: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  priority?: 'low' | 'medium' | 'high'
}

const AdminNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  // API Hooks
  const { data: notifications = [], isLoading } = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  const handleMarkAsRead = (id: string) => {
    markReadMutation.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate()
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa thông báo này?',
      onOk: () => {
        deleteMutation.mutate(id)
      }
    })
  }


  // TODO: Add Create Notification API if needed
  const handleCreateNotification = async () => {
    try {
      message.info('Chức năng tạo thông báo đang được phát triển')
      setIsCreateModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
      case 'error':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'blue'
      default:
        return 'default'
    }
  }

  const getFilteredNotifications = () => {
    // Handle both id and _id from backend
    const list = notifications.map((n: Notification) => ({
      ...n,
      id: n.id || n._id || ''
    }))

    switch (activeTab) {
      case 'unread':
        return list.filter((n: Notification) => !n.read)
      case 'read':
        return list.filter((n: Notification) => n.read)
      default:
        return list
    }
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter((n: Notification) => !n.read).length

  const tabItems = [
    {
      key: 'all',
      label: `Tất cả (${notifications.length})`,
      children: null
    },
    {
      key: 'unread',
      label: `Chưa đọc (${unreadCount})`,
      children: null
    },
    {
      key: 'read',
      label: `Đã đọc (${notifications.length - unreadCount})`,
      children: null
    }
  ]

  return (
    <div>
      <Card
        title={<Title level={3}><BellOutlined /> Thông báo quản trị</Title>}
        extra={
          <Space>
            {/* 
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Tạo thông báo
            </Button>
            */}
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả là đã đọc
              </Button>
            )}
            {/*
            {notifications.length > 0 && (
              <Button danger onClick={handleDeleteAll}>
                Xóa tất cả
              </Button>
            )}
            */}
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={tabItems}
        />

        {filteredNotifications.length === 0 ? (
          <Empty description="Không có thông báo" style={{ padding: '40px 0' }} />
        ) : (
          <List
            dataSource={filteredNotifications}
            renderItem={(item) => (
              <List.Item
                style={{
                  backgroundColor: item.read ? '#fff' : '#f0f5ff',
                  padding: '16px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}
                actions={[
                  !item.read && (
                    <Button
                      type="link"
                      onClick={() => item.id && handleMarkAsRead(item.id)}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  ),
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => item.id && handleDelete(item.id)}
                  >
                    Xóa
                  </Button>
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(item.type)}
                  title={
                    <Space>
                      <Text strong style={{ fontSize: 16 }}>
                        {item.title}
                      </Text>
                      {item.priority && (
                        <Tag color={getPriorityColor(item.priority)}>
                          {item.priority === 'high' && 'Quan trọng'}
                          {item.priority === 'medium' && 'Trung bình'}
                          {item.priority === 'low' && 'Thấp'}
                        </Tag>
                      )}
                      {!item.read && <Tag color="blue">Mới</Tag>}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text>{item.message}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.createdAt).fromNow()} - {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Create Notification Modal - Hidden for now */}
      <Modal
        title="Tạo Thông Báo Mới"
        open={isCreateModalOpen}
        onOk={handleCreateNotification}
        onCancel={() => {
          setIsCreateModalOpen(false)
          form.resetFields()
        }}
        okText="Tạo"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề thông báo" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung thông báo"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại thông báo"
            rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
            initialValue="info"
          >
            <Select>
              <Select.Option value="info">
                <Space><InfoCircleOutlined style={{ color: '#1890ff' }} /> Thông tin</Space>
              </Select.Option>
              <Select.Option value="success">
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> Thành công</Space>
              </Select.Option>
              <Select.Option value="warning">
                <Space><WarningOutlined style={{ color: '#faad14' }} /> Cảnh báo</Space>
              </Select.Option>
              <Select.Option value="error">
                <Space><CloseCircleOutlined style={{ color: '#ff4d4f' }} /> Lỗi</Space>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            initialValue="medium"
          >
            <Select>
              <Select.Option value="low">Thấp</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="high">Cao</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminNotifications
