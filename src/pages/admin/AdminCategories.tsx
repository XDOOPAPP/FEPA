import React, { useState, useEffect } from 'react'
import { Card, Table, Space, Tag, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

const { Title } = Typography

interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  usageCount?: number
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])


  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    const stored = localStorage.getItem('categories')
    if (stored) {
      const cats = JSON.parse(stored)
      
      // Calculate usage count from expenses
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
      const categoriesWithUsage = cats.map((cat: Category) => ({
        ...cat,
        usageCount: expenses.filter((exp: any) => exp.categoryId === cat.id).length
      }))
      
      setCategories(categoriesWithUsage)
    }
  }



  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <Space>
          <Tag color={record.color}>{text}</Tag>
        </Space>
      ),
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name)
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div
          style={{
            width: 24,
            height: 24,
            backgroundColor: color,
            border: '1px solid #d9d9d9',
            borderRadius: 4
          }}
        />
      )
    },
    {
      title: 'Số lượng chi tiêu',
      dataIndex: 'usageCount',
      key: 'usageCount',
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count || 0}</Tag>
      ),
      sorter: (a: Category, b: Category) => (a.usageCount || 0) - (b.usageCount || 0)
    },

  ]

  const totalUsage = categories.reduce((sum, cat) => sum + (cat.usageCount || 0), 0)

  return (
    <div>
      <Card
        title={<Title level={3}><HomeOutlined /> Xem danh mục chi tiêu</Title>}
        extra={<Tag color="blue">Tổng chi tiêu: {totalUsage}</Tag>}
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} danh mục`
          }}
        />
      </Card>
    </div>
  )
}

export default AdminCategories
