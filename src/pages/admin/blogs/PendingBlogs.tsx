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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending'>('pending')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all blogs for admin review
  const { data: blogsResponse, isLoading, refetch } = useQuery({
    queryKey: ['allBlogsForAdminReview'],
    queryFn: () => blogAPI.getAllBlogsForAdminReview(),
  })

  const blogs = blogsResponse?.data || []

  // Filter blogs based on statusFilter and searchTerm
  const filteredBlogs = blogs.filter(blog => {
    const matchesStatus = statusFilter === 'ALL' || blog.status === statusFilter
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.userId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

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
      await blogAPI.rejectBlog(selectedBlog.id, { rejectionReason: reason })
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
      dataIndex: 'author',
      key: 'author',
      width: 150,
      render: (author: string | null | undefined, record: Blog) => author || record.userId || 'N/A',
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
      render: (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          'pending': { label: 'Chờ duyệt', color: 'orange' },
          'draft': { label: 'Nháp', color: 'default' },
          'published': { label: 'Đã xuất bản', color: 'green' },
          'rejected': { label: 'Bị từ chối', color: 'red' },
        };
        const { label, color } = statusMap[status] || { label: status, color: 'default' };
        return <Tag color={color}>{label}</Tag>;
      },
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
            disabled={record.status === 'draft' || record.status === 'published' || record.status === 'rejected'}
            title={record.status === 'draft' ? 'Không thể duyệt bài viết nháp' : record.status === 'published' ? 'Bài viết đã duyệt' : record.status === 'rejected' ? 'Bài viết đã bị từ chối' : 'Duyệt bài viết'}
          >
            Duyệt
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => handleRejectClick(record)}
            disabled={record.status === 'draft' || record.status === 'published' || record.status === 'rejected'}
            title={record.status === 'draft' ? 'Không thể từ chối bài viết nháp' : record.status === 'published' ? 'Bài viết đã duyệt' : record.status === 'rejected' ? 'Bài viết đã bị từ chối' : 'Từ chối bài viết'}
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
        <h1>Quản lý Bài viết</h1>
        <p className="subtitle">Tổng cộng: {filteredBlogs.length} bài viết</p>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm theo tiêu đề, tác giả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
          allowClear
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'pending')}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <option value="pending">Cần duyệt</option>
          <option value="ALL">Tất cả</option>
        </select>
      </div>

      <div className="blogs-table-container">
        <Table
          columns={columns}
          dataSource={filteredBlogs}
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
