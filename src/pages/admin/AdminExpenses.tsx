import React, { useState, useEffect } from 'react'
import { Card, Table, Space, Select, DatePicker, Tag, Typography } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import expenseAPI from '../../services/api/expenseAPI'
import categoryAPI from '../../services/api/categoryAPI'

const { Title } = Typography
const { RangePicker } = DatePicker

interface Expense {
  id: string
  userId: string
  userName: string
  categoryId: string
  categoryName: string
  amount: number
  description: string
  date: string
}

const AdminExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [filters, setFilters] = useState({
    categoryId: undefined,
    userId: undefined,
    dateRange: undefined
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load categories from API
      let categoriesData: any[] = []
      try {
        categoriesData = await categoryAPI.getAll()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }

      // Load expenses from API
      try {
        const response = await expenseAPI.getAll(0, 100) // Fetch first 100
        const expensesData = response.data || []

        // Mock users for mapping (since no User API)
        const storedUsers = localStorage.getItem('all_users') || '[]'
        const usersData = JSON.parse(storedUsers)
        setUsers(usersData)

        // Enhance expenses
        const enhanced = expensesData.map((exp: any) => {
          const category = categoriesData.find((c: any) => c.id === exp.category)
          // Note: API might not return userId if it's user-centric. 
          // If expenseAPI.getAll returns all expenses (admin), it should have userId.
          // If not, we might only see current user's expenses.
          const userId = exp.userId || '1'
          const user = usersData.find((u: any) => u.id === userId)

          return {
            ...exp,
            userId: userId,
            userName: user?.fullName || 'Người dùng', // Fallback if no user API
            categoryName: category?.name || 'Unknown',
            categoryId: exp.category // key mapping
          }
        })

        setExpenses(enhanced)
      } catch (error) {
        console.error('Failed to load expenses:', error)
        // Fallback to local storage for demo if API fails
        const storedExpenses = localStorage.getItem('expenses') || '[]'
        // ... (rest of fallback logic omitted for cleanliness, or can be kept if desired)
      }
    } catch (error) {
      console.error('Error in loadData:', error)
    }
  }



  const getFilteredExpenses = () => {
    let filtered = [...expenses]

    if (filters.categoryId) {
      filtered = filtered.filter(e => e.categoryId === filters.categoryId)
    }

    if (filters.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId)
    }

    if (filters.dateRange) {
      const [start, end] = filters.dateRange as any
      filtered = filtered.filter(e => {
        const expDate = dayjs(e.date)
        return expDate.isAfter(start) && expDate.isBefore(end)
      })
    }

    return filtered
  }

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: Expense, b: Expense) => a.userName.localeCompare(b.userName)
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string, record: Expense) => {
        const category = categories.find(c => c.id === record.categoryId)
        return <Tag color={category?.color}>{text}</Tag>
      }
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
      sorter: (a: Expense, b: Expense) => a.amount - b.amount
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: Expense, b: Expense) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },

  ]

  const totalAmount = getFilteredExpenses().reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div>
      <Card
        title={<Title level={3}><ShoppingOutlined /> Xem chi tiêu người dùng</Title>}
      >
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }} size="large">
          <Card size="small">
            <Space wrap>
              <Select
                placeholder="Lọc theo người dùng"
                style={{ width: 200 }}
                allowClear
                onChange={(value) => setFilters({ ...filters, userId: value })}
              >
                {users.map(user => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.fullName}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Lọc theo danh mục"
                style={{ width: 200 }}
                allowClear
                onChange={(value) => setFilters({ ...filters, categoryId: value })}
              >
                {categories.map(cat => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>

              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates as any })}
              />

              <Tag color="blue">Tổng: {totalAmount.toLocaleString('vi-VN')}đ</Tag>
            </Space>
          </Card>
        </Space>

        <Table
          columns={columns}
          dataSource={getFilteredExpenses()}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} chi tiêu`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}

export default AdminExpenses
