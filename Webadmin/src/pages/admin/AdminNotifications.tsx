import React, { useState, useEffect } from 'react'
import { Card, List, Space, Button, Tag, Typography, Empty, Tabs, Modal, message } from 'antd'
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(relativeTime)
dayjs.locale('vi')

const { Title, Text } = Typography

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  priority?: 'low' | 'medium' | 'high'
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const stored = localStorage.getItem('admin_notifications')
    if (stored) {
      const allNotifications = JSON.parse(stored)
      // Filter out budget warning notifications
      const filteredNotifications = allNotifications.filter(
        (n: Notification) => !n.title.includes('Cảnh báo ngân sách') && !n.title.includes('vượt ngân sách')
      )
      // Update localStorage if notifications were filtered
      if (filteredNotifications.length !== allNotifications.length) {
        localStorage.setItem('admin_notifications', JSON.stringify(filteredNotifications))
      }
      setNotifications(filteredNotifications)
    }
  }

  const saveNotifications = (updated: Notification[]) => {
    localStorage.setItem('admin_notifications', JSON.stringify(updated))
    setNotifications(updated)
  }

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
    saveNotifications(updated)
    message.success('Đã đánh dấu là đã đọc')
  }

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    saveNotifications(updated)
    message.success('Đã đánh dấu tất cả là đã đọc')
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa thông báo này?',
      onOk: () => {
        const updated = notifications.filter(n => n.id !== id)
        saveNotifications(updated)
        message.success('Đã xóa thông báo')
      }
    })
  }

  const handleDeleteAll = () => {
    Modal.confirm({
      title: 'Xác nhận xóa tất cả',
      content: 'Bạn có chắc muốn xóa tất cả thông báo?',
      onOk: () => {
        saveNotifications([])
        message.success('Đã xóa tất cả thông báo')
      }
    })
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
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read)
      case 'read':
        return notifications.filter(n => n.read)
      default:
        return notifications
    }
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

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
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả là đã đọc
              </Button>
            )}
            {notifications.length > 0 && (
              <Button danger onClick={handleDeleteAll}>
                Xóa tất cả
              </Button>
            )}
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
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  ),
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item.id)}
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
    </div>
  )
}

export default AdminNotifications
