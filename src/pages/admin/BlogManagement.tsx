import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Tag, message, Row, Col, Statistic, Checkbox } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useBulkActions } from '../../hooks/useBulkActions'
import { BulkActionsBar, commonBulkActions } from '../../components/BulkActionsBar'
import { exportToCSV } from '../../utils/exportUtils'
import { RichTextEditor } from '../../components/RichTextEditor'
import { blogService, type Blog } from '../../services/blogService'

const { TextArea } = Input

const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<Blog[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPost, setEditingPost] = useState<Blog | null>(null)
  const [form] = Form.useForm()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

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
    items: posts,
    getItemId: (post) => post.id,
  })

  // API: GET /api/blogs
  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const data = await blogService.getAll()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load blogs:', error)
      // Fallback to localStorage if API fails
      const storedPosts = localStorage.getItem('blog_posts')
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingPost(null)
    form.resetFields()
    setContent('')
    setIsModalVisible(true)
  }

  const handleEdit = (post: Blog) => {
    setEditingPost(post)
    form.setFieldsValue({
      ...post,
      tags: post.tags?.join(', ') || '',
    })
    setContent(post.content)
    setIsModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // API: DELETE /api/blogs/:id
          await blogService.delete(id)
          message.success('Đã xóa bài viết')
          loadBlogs() // Reload list
        } catch (error) {
          console.error('Failed to delete blog:', error)
        }
      },
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const tags = values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : []
      
      setLoading(true)
      if (editingPost) {
        // API: PATCH /api/blogs/:id
        await blogService.update(editingPost.id, {
          ...values,
          content,
          tags,
        })
        message.success('Cập nhật bài viết thành công')
      } else {
        // API: POST /api/blogs
        await blogService.create({
          ...values,
          content,
          tags,
        })
        message.success('Thêm bài viết thành công')
      }
      
      setIsModalVisible(false)
      form.resetFields()
      setContent('')
      loadBlogs() // Reload list
    } catch (error) {
      console.error('Failed to save blog:', error)
    } finally {
      setLoading(false)
    }
  }

  // Bulk actions handlers
  const handleBulkDelete = async () => {
    try {
      setLoading(true)
      await blogService.bulkDelete(Array.from(selectedIds).map(String))
      deselectAll()
      message.success(`Đã xóa ${selectedIds.size} bài viết`)
      loadBlogs() // Reload list
    } catch (error) {
      console.error('Failed to bulk delete:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkExport = () => {
    const dataToExport = selectedItems.map(post => ({
      'Tiêu đề': post.title,
      'Slug': post.slug,
      'Tags': post.tags?.join(', ') || '',
      'Trạng thái': post.status === 'published' ? 'Đã đăng' : post.status === 'draft' ? 'Nháp' : 'Lưu trữ',
      'Lượt xem': post.viewCount || 0,
      'Ngày tạo': dayjs(post.createdAt).format('DD/MM/YYYY HH:mm'),
    }))
    exportToCSV(dataToExport, { filename: 'blog-posts-export' })
    message.success(`Đã export ${selectedIds.size} bài viết`)
  }

  const columns: ColumnsType<Blog> = [
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
      render: (_: any, record: Blog) => (
        <Checkbox
          checked={isSelected(record.id)}
          onChange={() => toggleItem(record.id)}
        />
      ),
    },
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
      render: (status: Blog['status']) => {
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
      dataIndex: 'viewCount',
      key: 'viewCount',
      sorter: (a, b) => (a.viewCount || 0) - (b.viewCount || 0),
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
    totalViews: posts.reduce((sum, p) => sum + (p.viewCount || 0), 0),
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
          loading={loading}
        />
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
            label="Nội dung"
            required
          >
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Nhập nội dung bài viết..."
              height={400}
            />
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
