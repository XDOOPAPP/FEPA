import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, Button, Space, message, Modal, Input, Tag } from 'antd'
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '../../../services/api/blogAPI'
import type { Blog } from '../../../types/blog'
import ApproveModal from '../../../components/admin/blogs/ApproveModal'
import RejectModal from '../../../components/admin/blogs/RejectModal'
import './BlogsPage.css'

const PendingBlogs: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

  // Fetch pending blogs
  const { data: blogsResponse, isLoading, refetch } = useQuery({
    queryKey: ['pendingBlogs'],
    queryFn: () => blogAPI.getPendingBlogs(),
  })

  const blogs = blogsResponse?.data || []

  const handleViewDetail = (blog: Blog) => {
    navigate(`/admin/blogs/${blog.id}`)
  }

  const handleApproveClick = (blog: Blog) => {
    setSelectedBlog(blog)
    setApproveModalVisible(true)
  }

  const handleRejectClick = (blog: Blog) => {
    setSelectedBlog(blog)
    setRejectModalVisible(true)
  }

  const handleApproveConfirm = useCallback(async (note?: string) => {
    if (!selectedBlog) return

    setLoading(true)
    try {
      await blogAPI.approveBlog(selectedBlog.id, { note })
      message.success('Bài viết đã được phê duyệt')
      setApproveModalVisible(false)
      setSelectedBlog(null)
      refetch()
    } catch (error) {
      message.error('Lỗi khi phê duyệt bài viết')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [selectedBlog, refetch])

  const handleRejectConfirm = useCallback(async (reason: string) => {
    if (!selectedBlog) return

    setLoading(true)
    try {
      await blogAPI.rejectBlog(selectedBlog.id, { reason })
      message.success('Bài viết đã bị từ chối')
      setRejectModalVisible(false)
      setSelectedBlog(null)
      refetch()
    } catch (error) {
      message.error('Lỗi khi từ chối bài viết')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [selectedBlog, refetch])

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
      render: (text: string) => <span className="blog-title">{text}</span>,
    },
    {
      title: 'Tác giả',
      dataIndex: ['author', 'name'],
      key: 'author',
      width: 150,
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color="orange">{status === 'pending' ? 'Chờ duyệt' : status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 250,
      render: (_: any, record: Blog) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            style={{ backgroundColor: '#52c41a' }}
            onClick={() => handleApproveClick(record)}
          >
            Duyệt
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => handleRejectClick(record)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="blogs-page">
      <div className="page-header">
        <h1>Bài viết chờ duyệt</h1>
        <p className="subtitle">Tổng cộng: {blogs.length} bài viết</p>
      </div>

      <div className="blogs-table-container">
        <Table
          columns={columns}
          dataSource={blogs}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài viết`,
          }}
        />
      </div>

      {selectedBlog && (
        <>
          <ApproveModal
            visible={approveModalVisible}
            blog={selectedBlog}
            loading={loading}
            onConfirm={handleApproveConfirm}
            onCancel={() => {
              setApproveModalVisible(false)
              setSelectedBlog(null)
            }}
          />
          <RejectModal
            visible={rejectModalVisible}
            blog={selectedBlog}
            loading={loading}
            onConfirm={handleRejectConfirm}
            onCancel={() => {
              setRejectModalVisible(false)
              setSelectedBlog(null)
            }}
          />
        </>
      )}
    </div>
  )
}

export default PendingBlogs
