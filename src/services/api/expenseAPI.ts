import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

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
    const response = await axiosInstance.get(API_CONFIG.EXPENSES.LIST, {
      params: { skip, take },
    })
    return response.data
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await axiosInstance.get(API_CONFIG.EXPENSES.DETAIL(id))
    return response.data
  },

  create: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response = await axiosInstance.post(API_CONFIG.EXPENSES.LIST, data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateExpenseRequest>): Promise<Expense> => {
    const response = await axiosInstance.put(API_CONFIG.EXPENSES.DETAIL(id), data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.EXPENSES.DETAIL(id))
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await axiosInstance.get(API_CONFIG.EXPENSES.BY_DATE_RANGE, {
      params: { startDate, endDate },
    })
    return response.data
  },

  getByCategory: async (category: string): Promise<Expense[]> => {
    const response = await axiosInstance.get(API_CONFIG.EXPENSES.BY_CATEGORY(category))
    return response.data
  },
}

export default expenseAPI
