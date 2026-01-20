import React, { useState, useEffect } from 'react'
import { Card, Table, Progress, Tag, Typography, Statistic, Row, Col, Space, Button, Modal } from 'antd'
import { DollarOutlined, WarningOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import budgetAPI from '../../services/api/budgetAPI'
import categoryAPI from '../../services/api/categoryAPI'

const { Title, Text } = Typography

interface Budget {
  id: string
  userId: string
  userName: string
  categoryId: string
  categoryName: string
  amount?: number
  limit?: number
  spent: number
  startDate?: string
  endDate?: string
  month?: string
  alertThreshold?: number
  createdAt?: string
}

const AdminBudgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  // Removed demo refresh - Budgets loaded from API

  const loadData = async () => {
    try {
      // Load categories
      let categoriesData: any[] = []
      try {
        categoriesData = await categoryAPI.getAll()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }

      // Load users (mock)
      try {
        const userAPI = (await import('../../services/api/userAPI')).default
        const usersData = await userAPI.getAll()
        setUsers(usersData || [])
      } catch (err) {
        console.error('Failed to load users from API:', err)
        setUsers([])
      }

      // Load budgets
      try {
        const budgetsData = await budgetAPI.getAll()

        // Enhance budgets
        const enhanced = budgetsData.map((budget: any) => {
          const category = categoriesData.find((c: any) => c.id === budget.category) // budgetAPI uses 'category'
          // Note: budgetAPI.getAll might not return userId if user-centric
          const userId = '1' // Default to 1 (or current user)
          const user = usersData.find((u: any) => u.id === userId)

          return {
            ...budget,
            userId: userId,
            userName: user?.fullName || 'Người dùng',
            categoryName: category?.name || 'Unknown',
            amount: budget.amount || budget.limit || 0,
            categoryId: budget.category,
            startDate: budget.startDate || dayjs().startOf('month').format('YYYY-MM-DD'),
            endDate: budget.endDate || dayjs().endOf('month').format('YYYY-MM-DD')
          }
        })
        setBudgets(enhanced)
      } catch (error) {
        console.error('Failed to load budgets:', error)
      }
    } catch (error) {
      console.error('Error in loadData:', error)
    }
  }



  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: Budget, b: Budget) => a.userName.localeCompare(b.userName)
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text: string, record: Budget) => {
        const category = categories.find(c => c.id === record.categoryId)
        return <Tag color={category?.color}>{text}</Tag>
      }
    },
    {
      title: 'Ngân sách',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${(amount || 0).toLocaleString('vi-VN')}đ`,
      sorter: (a: Budget, b: Budget) => (a.amount || 0) - (b.amount || 0)
    },
    {
      title: 'Đã chi',
      dataIndex: 'spent',
      key: 'spent',
      render: (spent: number) => `${spent.toLocaleString('vi-VN')}đ`,
      sorter: (a: Budget, b: Budget) => a.spent - b.spent
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_: any, record: Budget) => {
        const amount = record.amount || 0
        const percentage = amount > 0 ? (record.spent / amount) * 100 : 0
        const threshold = record.alertThreshold || 80
        let status: 'success' | 'normal' | 'exception' = 'normal'

        if (percentage >= 100) {
          status = 'exception'
        } else if (percentage >= threshold) {
          status = 'exception'
        } else if (percentage >= 50) {
          status = 'normal'
        } else {
          status = 'success'
        }

        return (
          <Progress
            percent={Math.min(percentage, 100)}
            status={status}
            format={(percent) => `${percent?.toFixed(1)}%`}
          />
        )
      }
    },
    {
      title: 'Thời gian',
      key: 'period',
      render: (_: any, record: Budget) => (
        <div>
          <div>{record.startDate ? dayjs(record.startDate).format('DD/MM/YYYY') : '-'}</div>
          <div>{record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : '-'}</div>
        </div>
      )
    },
    {
      title: 'Cảnh báo',
      dataIndex: 'alertThreshold',
      key: 'alertThreshold',
      render: (threshold?: number) => `${threshold || 80}%`
    },

  ]

  const filteredBudgets = selectedUserId
    ? budgets.filter(b => b.userId === selectedUserId)
    : []

  const stats = {
    total: filteredBudgets.reduce((sum, b) => sum + b.amount, 0),
    spent: filteredBudgets.reduce((sum, b) => sum + b.spent, 0),
    overBudget: filteredBudgets.filter(b => b.spent > b.amount).length
  }

  const selectedUser = users.find(u => u.id === selectedUserId)

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            title={<Title level={4}>Danh sách người dùng</Title>}
            extra={null}
          >
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {users.map(user => {
                const userBudgets = budgets.filter(b => b.userId === user.id)
                const totalBudget = userBudgets.reduce((sum, b) => sum + b.amount, 0)
                const totalSpent = userBudgets.reduce((sum, b) => sum + b.spent, 0)
                const isOverBudget = userBudgets.some(b => b.spent > b.amount)

                return (
                  <Card
                    key={user.id}
                    size="small"
                    style={{
                      marginBottom: 12,
                      cursor: 'pointer',
                      border: selectedUserId === user.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      backgroundColor: selectedUserId === user.id ? '#e6f7ff' : '#fff'
                    }}
                    onClick={() => setSelectedUserId(user.id)}
                    hoverable
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Text strong>{user.fullName}</Text>
                        {isOverBudget && <Tag color="red">Vượt NS</Tag>}
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>{user.email}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Số ngân sách: <Text strong>{userBudgets.length}</Text>
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>Tổng: </Text>
                        <Text strong style={{ fontSize: 12 }}>{totalBudget.toLocaleString('vi-VN')}đ</Text>
                      </div>
                      <Progress
                        percent={totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}
                        size="small"
                        status={totalSpent > totalBudget ? 'exception' : 'normal'}
                      />
                    </Space>
                  </Card>
                )
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          {selectedUserId ? (
            <>
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Tổng ngân sách"
                      value={stats.total}
                      suffix="đ"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Đã chi tiêu"
                      value={stats.spent}
                      suffix="đ"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Vượt ngân sách"
                      value={stats.overBudget}
                      prefix={<WarningOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Card
                title={<Title level={4}>Ngân sách của {selectedUser?.fullName}</Title>}
              >
                <Table
                  columns={columns.filter(col => col.key !== 'userName')}
                  dataSource={filteredBudgets}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} ngân sách`
                  }}
                  scroll={{ x: 1000 }}
                />
              </Card>
            </>
          ) : (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <DollarOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4} type="secondary">Chọn người dùng để xem ngân sách</Title>
                <Text type="secondary">Nhấp vào một người dùng bên trái để xem chi tiết ngân sách</Text>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default AdminBudgets
