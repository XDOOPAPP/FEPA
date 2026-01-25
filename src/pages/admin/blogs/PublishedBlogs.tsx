import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Table, Button, Space, Tag, Input } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '../../../services/api/blogAPI'
import type { Blog } from '../../../types/blog'
import './BlogsPage.css'

const PublishedBlogs: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch published blogs
  const { data: blogsResponse, isLoading } = useQuery({
    queryKey: ['publishedBlogs'],
    queryFn: () => blogAPI.getPublishedBlogs(),
  })

  const blogs = blogsResponse?.data || []

  // Filter blogs based on searchTerm
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.userId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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
      dataIndex: 'author',
      key: 'author',
      width: 150,
      render: (author: string | null | undefined, record: Blog) => author || record.userId || 'N/A',
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
    </div>
  )
}

export default PublishedBlogs
