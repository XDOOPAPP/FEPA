import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Select, DatePicker, Space, Typography, Table, Tag } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const AdminReports: React.FC = () => {
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly')
  const [dateRange, setDateRange] = useState<any>([dayjs().startOf('month'), dayjs().endOf('month')])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [userExpenseData, setUserExpenseData] = useState<any[]>([])
  const [comparisonData, setComparisonData] = useState<any>({})

  useEffect(() => {
    loadReportData()
  }, [reportType, dateRange])

  const loadReportData = () => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]')
    const categories = JSON.parse(localStorage.getItem('categories') || '[]')
    const users = JSON.parse(localStorage.getItem('all_users') || '[]')

    // Monthly/Yearly trend data
    if (reportType === 'monthly') {
      const months = Array.from({ length: 12 }, (_, i) => {
        const month = dayjs().month(i)
        return {
          month: month.format('MMM'),
          expenses: Math.floor(Math.random() * 5000000) + 2000000,
          budgets: Math.floor(Math.random() * 6000000) + 3000000,
          users: Math.floor(Math.random() * 50) + 20
        }
      })
      setMonthlyData(months)
    } else {
      const years = Array.from({ length: 5 }, (_, i) => {
        const year = dayjs().subtract(4 - i, 'year')
        return {
          year: year.format('YYYY'),
          expenses: Math.floor(Math.random() * 50000000) + 30000000,
          budgets: Math.floor(Math.random() * 60000000) + 40000000,
          users: Math.floor(Math.random() * 500) + 200
        }
      })
      setMonthlyData(years)
    }

    // Category breakdown
    const categoryBreakdown = categories.map((cat: any) => {
      const categoryExpenses = expenses.filter((exp: any) => exp.categoryId === cat.id)
      const total = categoryExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
      return {
        name: cat.name,
        value: total,
        count: categoryExpenses.length
      }
    }).filter((cat: any) => cat.value > 0)
    setCategoryData(categoryBreakdown)

    // User expense ranking
    const userRanking = users.map((user: any) => {
      const userExpenses = expenses.filter((exp: any) => exp.userId === user.id)
      const total = userExpenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
      const userBudgets = budgets.filter((b: any) => b.userId === user.id)
      const totalBudget = userBudgets.reduce((sum: number, b: any) => sum + b.amount, 0)
      
      return {
        userId: user.id,
        userName: user.fullName,
        totalExpenses: total,
        totalBudget: totalBudget,
        expenseCount: userExpenses.length,
        overBudget: total > totalBudget
      }
    }).sort((a: any, b: any) => b.totalExpenses - a.totalExpenses)
    setUserExpenseData(userRanking)

    // Comparison data
    const currentMonth = expenses.filter((exp: any) => 
      dayjs(exp.date).isSame(dayjs(), 'month')
    ).reduce((sum: number, exp: any) => sum + exp.amount, 0)

    const lastMonth = expenses.filter((exp: any) => 
      dayjs(exp.date).isSame(dayjs().subtract(1, 'month'), 'month')
    ).reduce((sum: number, exp: any) => sum + exp.amount, 0)

    const changePercent = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth * 100).toFixed(1) : 0

    setComparisonData({
      currentMonth,
      lastMonth,
      changePercent,
      isIncrease: currentMonth > lastMonth
    })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c']

  const userColumns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60
    },
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalExpenses',
      key: 'totalExpenses',
      render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
      sorter: (a: any, b: any) => a.totalExpenses - b.totalExpenses
    },
    {
      title: 'Ngân sách',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      render: (value: number) => `${value.toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Số lần chi',
      dataIndex: 'expenseCount',
      key: 'expenseCount',
      render: (value: number) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'overBudget',
      key: 'overBudget',
      render: (overBudget: boolean) => (
        <Tag color={overBudget ? 'red' : 'green'}>
          {overBudget ? 'Vượt NS' : 'Trong NS'}
        </Tag>
      )
    }
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space>
            <Title level={3} style={{ margin: 0 }}>
              <FileTextOutlined /> Báo cáo thống kê
            </Title>
          </Space>
          
          <Space wrap>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 150 }}
            >
              <Select.Option value="monthly">Theo tháng</Select.Option>
              <Select.Option value="yearly">Theo năm</Select.Option>
            </Select>
            
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
            />
          </Space>
        </Space>
      </Card>

      {/* Comparison Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">Tháng này</Text>
              <Title level={3} style={{ margin: 0 }}>
                {comparisonData.currentMonth?.toLocaleString('vi-VN')}đ
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">Tháng trước</Text>
              <Title level={3} style={{ margin: 0 }}>
                {comparisonData.lastMonth?.toLocaleString('vi-VN')}đ
              </Title>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary">So sánh</Text>
              <Title 
                level={3} 
                style={{ 
                  margin: 0,
                  color: comparisonData.isIncrease ? '#cf1322' : '#52c41a'
                }}
              >
                {comparisonData.isIncrease ? '+' : ''}{comparisonData.changePercent}%
              </Title>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card title={`Biểu đồ xu hướng ${reportType === 'monthly' ? 'tháng' : 'năm'}`}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={reportType === 'monthly' ? 'month' : 'year'} />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')}đ`} />
                <Legend />
                <Line type="monotone" dataKey="expenses" stroke="#8884d8" name="Chi tiêu" strokeWidth={2} />
                <Line type="monotone" dataKey="budgets" stroke="#82ca9d" name="Ngân sách" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Chi tiêu theo danh mục">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / categoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')}đ`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Category Bar Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24}>
          <Card title="So sánh chi tiêu theo danh mục">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value.toLocaleString('vi-VN')}đ`} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Tổng chi tiêu" />
                <Bar dataKey="count" fill="#82ca9d" name="Số lần chi" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* User Ranking Table */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Bảng xếp hạng người dùng">
            <Table
              columns={userColumns}
              dataSource={userExpenseData}
              rowKey="userId"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} người dùng`
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminReports
