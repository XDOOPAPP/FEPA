import { useEffect, useMemo, useState } from 'react'
import { Card, Table, Input, Space, Tag, Button, Drawer, Form, Switch, message, Popconfirm } from 'antd'
import { AppstoreAddOutlined, ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import categoryAPI, { type ExpenseCategory } from '../../services/api/categoryAPI'
import { LoadingOverlay } from '../../components/LoadingOverlay'
import { exportToCSV } from '../../utils/exportUtils'

export default function ExpenseCategories() {
  const [data, setData] = useState<ExpenseCategory[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const res = await categoryAPI.getCategories(search || undefined)
      setData(res)
    } catch (err) {
      console.error('Failed to load categories', err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!search) return data
    const term = search.toLowerCase()
    return data.filter(c => c.name?.toLowerCase().includes(term) || c.description?.toLowerCase().includes(term))
  }, [data, search])

  const handleCreate = () => {
    setEditingCategory(null)
    form.resetFields()
    form.setFieldsValue({ isActive: true })
    setDrawerOpen(true)
  }

  const handleEdit = (record: ExpenseCategory) => {
    setEditingCategory(record)
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      isActive: record.isActive ?? true,
    })
    setDrawerOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await categoryAPI.deleteCategory(id)
      message.success('Xóa danh mục thành công')
      load()
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Xóa danh mục thất bại')
    }
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      if (editingCategory) {
        await categoryAPI.updateCategory(editingCategory.id, values)
        message.success('Cập nhật danh mục thành công')
      } else {
        await categoryAPI.createCategory(values)
        message.success('Tạo danh mục thành công')
      }
      setDrawerOpen(false)
      load()
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: (v: boolean) => v ? <Tag color="green">Đang dùng</Tag> : <Tag color="default">Tắt</Tag> },
    { title: 'Tạo lúc', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    { title: 'Cập nhật', dataIndex: 'updatedAt', key: 'updatedAt', render: (d: string) => d ? dayjs(d).format('DD/MM/YYYY') : '-' },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: any, record: ExpenseCategory) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <LoadingOverlay loading={loading}>
      <div style={{ padding: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}><AppstoreAddOutlined /> Danh mục chi tiêu</h2>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Thêm mới
            </Button>
            <Input
              placeholder="Tìm theo tên/mô tả"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={load}
              style={{ width: 260 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={load}>Tìm</Button>
            <Button icon={<ReloadOutlined />} onClick={() => { setSearch(''); load() }}>Làm mới</Button>
            <Button onClick={() => exportToCSV(filtered.map(c => ({
              Ten: c.name,
              Mo_ta: c.description || '',
              Trang_thai: c.isActive ? 'Đang dùng' : 'Tắt',
              Tao_luc: c.createdAt ? dayjs(c.createdAt).format('DD/MM/YYYY') : '',
              Cap_nhat: c.updatedAt ? dayjs(c.updatedAt).format('DD/MM/YYYY') : '',
            })), { filename: 'expense-categories' })}>
              Export CSV
            </Button>
          </Space>
        </Space>

        <Card>
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey={(r) => r.id || r.name}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Drawer
          title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={480}
          footer={
            <Space style={{ float: 'right' }}>
              <Button onClick={() => setDrawerOpen(false)}>Hủy</Button>
              <Button type="primary" onClick={() => form.submit()} loading={submitting}>
                {editingCategory ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
            >
              <Input placeholder="Ví dụ: Ăn uống, Di chuyển" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input.TextArea rows={3} placeholder="Mô tả chi tiết về danh mục (tùy chọn)" />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch checkedChildren="Đang dùng" unCheckedChildren="Tắt" />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </LoadingOverlay>
  )
}
