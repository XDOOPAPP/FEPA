import axiosInstance from './axiosInstance'

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'yearly'
  startDate: string
  endDate: string
}

export interface CreateBudgetRequest {
  category: string
  limit: number
  period: 'monthly' | 'yearly'
  startDate: string
  endDate: string
}

const budgetAPI = {
  getAll: async (): Promise<Budget[]> => {
    const response = await axiosInstance.get('/budgets')
    return response.data
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await axiosInstance.get(`/budgets/${id}`)
    return response.data
  },

  create: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await axiosInstance.post('/budgets', data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateBudgetRequest>): Promise<Budget> => {
    const response = await axiosInstance.put(`/budgets/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/budgets/${id}`)
  },

  getProgress: async (id: string): Promise<{ spent: number, limit: number, percentage: number }> => {
    const response = await axiosInstance.get(`/budgets/${id}/progress`)
    return response.data
  },
}

export default budgetAPI
