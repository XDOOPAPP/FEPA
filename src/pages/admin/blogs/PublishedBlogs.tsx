import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, Button, Space, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '../../../services/api/blogAPI'
import type { Blog } from '../../../types/blog'
import './BlogsPage.css'

const PublishedBlogs: React.FC = () => {
  const navigate = useNavigate()

  // Fetch published blogs
  const { data: blogsResponse, isLoading } = useQuery({
    queryKey: ['publishedBlogs'],
    queryFn: () => blogAPI.getPublishedBlogs(),
  })

  const blogs = blogsResponse?.data || []

  const handleViewDetail = (blog: Blog) => {
    navigate(`/admin/blogs/${blog.id}`)
  }

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
      title: 'Ngày xuất bản',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color="green">{status === 'published' ? 'Đã xuất bản' : status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_: any, record: Blog) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ]

  return (
    <div className="blogs-page">
      <div className="page-header">
        <h1>Bài viết đã xuất bản</h1>
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
    </div>
  )
}

export default PublishedBlogs
