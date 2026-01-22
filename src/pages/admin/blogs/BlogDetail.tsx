import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Tag, Spin, message, Empty } from 'antd'
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { blogAPI } from '../../../services/api/blogAPI'
import type { Blog } from '../../../types/blog'
import ApproveModal from '../../../components/admin/blogs/ApproveModal'
import RejectModal from '../../../components/admin/blogs/RejectModal'
import './BlogsPage.css'

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)

  // Fetch blog detail
  const { data: blog, isLoading, refetch } = useQuery({
    queryKey: ['blogDetail', id],
    queryFn: () => id ? blogAPI.getBlogDetail(id) : Promise.reject('No ID'),
    enabled: !!id,
  })

  console.log('📝 BlogDetail - ID:', id);
  console.log('📝 BlogDetail - Loading:', isLoading);
  console.log('📝 BlogDetail - Blog data:', blog);

  if (!id) {
    return <Empty description="Không tìm thấy bài viết" />
  }

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />
  }

  if (!blog) {
    return <Empty description="Bài viết không tồn tại" />
  }

  const handleApproveConfirm = async (note?: string) => {
    setLoading(true)
    try {
      await blogAPI.approveBlog(blog.id, { note })
      message.success('Bài viết đã được phê duyệt')
      setApproveModalVisible(false)
      refetch()
    } catch (error) {
      message.error('Lỗi khi phê duyệt bài viết')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectConfirm = async (reason: string) => {
    setLoading(true)
    try {
      await blogAPI.rejectBlog(blog.id, { reason })
      message.success('Bài viết đã bị từ chối')
      setRejectModalVisible(false)
      refetch()
    } catch (error) {
      message.error('Lỗi khi từ chối bài viết')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      draft: { color: 'default', label: 'Nháp' },
      pending: { color: 'orange', label: 'Chờ duyệt' },
      published: { color: 'green', label: 'Đã xuất bản' },
      rejected: { color: 'red', label: 'Bị từ chối' },
    }
    const config = statusMap[status] || { color: 'default', label: status }
    return <Tag color={config.color}>{config.label}</Tag>
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        <div className="blog-detail-title-section">
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span>Tác giả: {blog.author?.name || 'N/A'}</span>
            <span>Trạng thái: {getStatusTag(blog.status)}</span>
            <span>Ngày tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
            {blog.publishedAt && (
              <span>Ngày xuất bản: {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="blog-detail-content">
        {blog.thumbnailUrl && (
          <div className="blog-thumbnail">
            <img src={blog.thumbnailUrl} alt={blog.title} />
          </div>
        )}

        <div className="blog-body">
          {blog.content ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>Không có nội dung</p>
          )}
        </div>

        {blog.images && blog.images.length > 0 && (
          <div className="blog-images">
            <h3>Hình ảnh</h3>
            <div className="images-grid">
              {blog.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Hình ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {blog.status === 'pending' && (
        <div className="blog-detail-actions">
          <h3>Hành động</h3>
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="large"
              style={{ backgroundColor: '#52c41a' }}
              onClick={() => setApproveModalVisible(true)}
            >
              Phê duyệt bài viết
            </Button>
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              size="large"
              onClick={() => setRejectModalVisible(true)}
            >
              Từ chối bài viết
            </Button>
          </Space>
        </div>
      )}

      {blog.status === 'rejected' && blog.rejectionReason && (
        <div className="blog-rejection-info">
          <h3>Lý do từ chối</h3>
          <p>{blog.rejectionReason}</p>
        </div>
      )}

      <ApproveModal
        visible={approveModalVisible}
        blog={blog}
        loading={loading}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalVisible(false)}
      />
      <RejectModal
        visible={rejectModalVisible}
        blog={blog}
        loading={loading}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
      />
    </div>
  )
}

export default BlogDetail
