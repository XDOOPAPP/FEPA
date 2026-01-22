import React, { useMemo, useState } from 'react'
import { Button, Empty, Input, Pagination, Segmented, Space, Spin, Typography } from 'antd'
import { CheckCircleOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import NotificationItem from '../../../components/notifications/NotificationItem'
import CreateNotificationModal from '../../../components/notifications/CreateNotificationModal'
import { useNotificationActions, useNotificationList } from '../../../hooks/useNotifications'
import { useAuth } from '../../../context/AuthContext'
import type { NotificationItem as NotificationItemType } from '../../../types/notification'
import './NotificationsPage.css'

const { Title, Paragraph } = Typography

const filterOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chưa đọc', value: 'unread' },
  { label: 'Đã đọc', value: 'read' },
]

type FilterOption = typeof filterOptions[number]['value']

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filter, setFilter] = useState<FilterOption>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { markAsRead, markAllAsRead, deleteOne, deleteAll } = useNotificationActions()

  const filters = useMemo(() => {
    const params: { page: number; limit: number; unreadOnly?: boolean; search?: string } = {
      page,
      limit: pageSize,
    }

    if (filter === 'unread') params.unreadOnly = true
    // Note: Backend không hỗ trợ filter 'read only', chỉ có 'all' hoặc 'unread'
    // Nếu filter = 'read' thì không set unreadOnly (sẽ lấy tất cả rồi filter ở client)
    if (search.trim()) params.search = search.trim()

    return params
  }, [filter, page, pageSize, search])

  const { data, isLoading, isFetching, refetch } = useNotificationList(filters)

  console.log('🔔 NotificationsPage - data from hook:', data)
  console.log('🔔 NotificationsPage - isLoading:', isLoading)
  
  // Backend chỉ hỗ trợ filter unread, nên filter 'read' phải làm ở client
  const allNotifications = data?.notifications || []
  const notifications = useMemo(() => {
    if (filter === 'read') {
      return allNotifications.filter(n => n.isRead)
    }
    return allNotifications
  }, [allNotifications, filter])
  
  const pagination = data?.pagination
  
  console.log('🔔 NotificationsPage - notifications array:', notifications)
  console.log('🔔 NotificationsPage - pagination:', pagination)

  const handleNavigate = (notification: NotificationItemType) => {
    // Navigate based on notification type and metadata
    switch (notification.type) {
      case 'PAYMENT_FAILED':
      case 'PAYMENT_SUCCESS':
        // TODO: Navigate to payment details page when available
        // navigate(`/admin/payments/${notification.metadata?.paymentRef}`)
        navigate('/admin/subscription')
        break
      
      case 'SUBSCRIPTION_EXPIRED':
        navigate('/admin/subscription')
        break
      
      case 'SYSTEM_MAINTENANCE':
      case 'SYSTEM_ERROR':
        navigate('/admin/system-health')
        break
      
      case 'INFO':
      case 'ANNOUNCEMENT':
      case 'FEATURE_UPDATE':
      case 'URGENT':
      default:
        // For general notifications, stay on notifications page (don't navigate)
        break
    }
  }

  const handleNotificationCreated = () => {
    refetch()
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>Thông báo</Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Theo dõi các sự kiện hệ thống và nội dung cần xử lý
          </Paragraph>
        </div>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowCreateModal(true)}
            >
              Tạo Thông Báo
            </Button>
          )}
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
          >
            Làm mới
          </Button>
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => markAllAsRead.mutate()}
            loading={markAllAsRead.isPending}
          >
            Đánh dấu tất cả đã đọc
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteAll.mutate()}
            loading={deleteAll.isPending}
          >
            Xóa tất cả
          </Button>
        </Space>
      </div>

      <div className="notifications-page__toolbar">
        <Segmented
          options={filterOptions}
          value={filter}
          onChange={(value) => {
            setFilter(value as FilterOption)
            setPage(1)
          }}
        />
        <Input.Search
          placeholder="Tìm kiếm tiêu đề hoặc nội dung"
          allowClear
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div className="notifications-page__list">
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 48 }}>
            <Empty description="Không có thông báo" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          notifications.map((notification: NotificationItemType) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead.mutate(id)}
              onDelete={(id) => deleteOne.mutate(id)}
              onNavigate={handleNavigate}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={pagination?.total || 0}
          showSizeChanger
          onChange={(nextPage, nextSize) => {
            setPage(nextPage)
            setPageSize(nextSize)
          }}
        />
      </div>

      <CreateNotificationModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleNotificationCreated}
      />
    </div>
  )
}

export default NotificationsPage
