import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Row, Col, Statistic } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { TextArea } = Input

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featuredImage: string
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [form] = Form.useForm()
  const [content, setContent] = useState('')

  // API: GET /api/blogs
  useEffect(() => {
    const storedPosts = localStorage.getItem('blog_posts')
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    } else {
      const initialPosts: BlogPost[] = [
        {
          id: '1',
          title: '10 Mẹo Tiết Kiệm Chi Tiêu Hàng Ngày',
          slug: '10-meo-tiet-kiem-chi-tieu-hang-ngay',
          excerpt: 'Khám phá những cách đơn giản để giảm chi tiêu mỗi ngày...',
          content: '<h2>Giới thiệu</h2><p>Trong thời đại hiện nay, việc quản lý chi tiêu cá nhân ngày càng trở nên quan trọng...</p>',
          author: 'Admin',
          category: 'Tài chính cá nhân',
          tags: ['tiết kiệm', 'chi tiêu', 'mẹo hay'],
          status: 'published',
          featuredImage: 'https://via.placeholder.com/800x400',
          views: 1250,
          createdAt: dayjs().subtract(5, 'day').toISOString(),
          updatedAt: dayjs().subtract(5, 'day').toISOString(),
          publishedAt: dayjs().subtract(5, 'day').toISOString(),
        },
        {
          id: '2',
          title: 'Cách Lập Kế Hoạch Tài Chính Cho Năm 2025',
          slug: 'cach-lap-ke-hoach-tai-chinh-cho-nam-2025',
          excerpt: 'Hướng dẫn chi tiết cách lập kế hoạch tài chính hiệu quả...',
          content: '<h2>Bước 1: Đánh giá tình hình hiện tại</h2><p>Trước tiên, bạn cần xem xét...</p>',
          author: 'Admin',
          category: 'Kế hoạch tài chính',
          tags: ['kế hoạch', 'tài chính', '2025'],
          status: 'published',
          featuredImage: 'https://via.placeholder.com/800x400',
          views: 850,
          createdAt: dayjs().subtract(3, 'day').toISOString(),
          updatedAt: dayjs().subtract(3, 'day').toISOString(),
          publishedAt: dayjs().subtract(3, 'day').toISOString(),
        },
        {
          id: '3',
          title: 'Hướng Dẫn Sử Dụng Tính Năng OCR',
          slug: 'huong-dan-su-dung-tinh-nang-ocr',
          excerpt: 'Quét hóa đơn tự động với công nghệ OCR...',
          content: '<h2>OCR là gì?</h2><p>OCR (Optical Character Recognition) là công nghệ...</p>',
          author: 'Admin',
          category: 'Hướng dẫn',
          tags: ['OCR', 'hướng dẫn', 'công nghệ'],
          status: 'draft',
          featuredImage: 'https://via.placeholder.com/800x400',
          views: 0,
          createdAt: dayjs().subtract(1, 'day').toISOString(),
          updatedAt: dayjs().subtract(1, 'day').toISOString(),
        },
      ]
      setPosts(initialPosts)
      localStorage.setItem('blog_posts', JSON.stringify(initialPosts))
    }
  }, [])

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts)
    localStorage.setItem('blog_posts', JSON.stringify(newPosts))
  }

  const handleAdd = () => {
    setEditingPost(null)
    form.resetFields()
    setContent('')
    setIsModalVisible(true)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    form.setFieldsValue({
      ...post,
      tags: post.tags.join(', '),
    })
    setContent(post.content)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        // API: DELETE /api/blogs/:id
        const newPosts = posts.filter(p => p.id !== id)
        savePosts(newPosts)
        message.success('Đã xóa bài viết')
      },
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const tags = values.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
      
      if (editingPost) {
        // API: PUT /api/blogs/:id
        const newPosts = posts.map(p =>
          p.id === editingPost.id
            ? {
                ...p,
                ...values,
                content,
                tags,
                updatedAt: dayjs().toISOString(),
                publishedAt: values.status === 'published' && !p.publishedAt ? dayjs().toISOString() : p.publishedAt,
              }
            : p
        )
        savePosts(newPosts)
        message.success('Cập nhật bài viết thành công')
      } else {
        // API: POST /api/blogs
        const newPost: BlogPost = {
          id: Date.now().toString(),
          ...values,
          content,
          tags,
          author: 'Admin',
          views: 0,
          createdAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
          publishedAt: values.status === 'published' ? dayjs().toISOString() : undefined,
        }
        savePosts([...posts, newPost])
        message.success('Thêm bài viết thành công')
      }
      
      setIsModalVisible(false)
      form.resetFields()
      setContent('')
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const columns: ColumnsType<BlogPost> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <strong>{text}</strong>
          <span style={{ fontSize: '12px', color: '#666' }}>{record.slug}</span>
        </Space>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: BlogPost['status']) => {
        const statusMap = {
          draft: { color: 'default', text: 'Nháp' },
          published: { color: 'success', text: 'Đã đăng' },
          archived: { color: 'error', text: 'Lưu trữ' },
        }
        const { color, text } = statusMap[status]
        return <Tag color={color}>{text}</Tag>
      },
      filters: [
        { text: 'Nháp', value: 'draft' },
        { text: 'Đã đăng', value: 'published' },
        { text: 'Lưu trữ', value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng bài viết"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã đăng"
              value={stats.published}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Nháp"
              value={stats.draft}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng lượt xem"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Quản lý Blog"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm bài viết
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
          setContent('')
        }}
        width={900}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="bai-viet-mau" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Mô tả ngắn"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={3} placeholder="Mô tả ngắn gọn về bài viết" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={15} placeholder="Nội dung bài viết (hỗ trợ Markdown)" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
              >
                <Select placeholder="Chọn danh mục">
                  <Select.Option value="Tài chính cá nhân">Tài chính cá nhân</Select.Option>
                  <Select.Option value="Kế hoạch tài chính">Kế hoạch tài chính</Select.Option>
                  <Select.Option value="Hướng dẫn">Hướng dẫn</Select.Option>
                  <Select.Option value="Tin tức">Tin tức</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="draft">Nháp</Select.Option>
                  <Select.Option value="published">Đã đăng</Select.Option>
                  <Select.Option value="archived">Lưu trữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Tags (ngăn cách bằng dấu phẩy)"
          >
            <Input placeholder="tiết kiệm, chi tiêu, mẹo hay" />
          </Form.Item>

          <Form.Item
            name="featuredImage"
            label="URL ảnh đại diện"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BlogManagement
