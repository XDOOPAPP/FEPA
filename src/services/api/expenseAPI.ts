import axiosInstance from './axiosInstance'

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  image?: string
  status: 'pending' | 'completed' | 'cancelled'
}

export interface CreateExpenseRequest {
  description: string
  amount: number
  category: string
  date: string
  image?: string
}

const expenseAPI = {
  getAll: async (skip = 0, take = 10): Promise<{ data: Expense[], total: number }> => {
    const response = await axiosInstance.get('/expenses', {
      params: { skip, take },
    })
    return response.data
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await axiosInstance.get(`/expenses/${id}`)
    return response.data
  },

  create: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response = await axiosInstance.post('/expenses', data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateExpenseRequest>): Promise<Expense> => {
    const response = await axiosInstance.put(`/expenses/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/expenses/${id}`)
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await axiosInstance.get('/expenses/by-date-range', {
      params: { startDate, endDate },
    })
    return response.data
  },

  getByCategory: async (category: string): Promise<Expense[]> => {
    const response = await axiosInstance.get(`/expenses/by-category/${category}`)
    return response.data
  },
}

export default expenseAPI
