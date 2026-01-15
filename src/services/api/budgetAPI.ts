import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

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
    const response = await axiosInstance.get(API_CONFIG.BUDGETS.LIST)
    return response.data
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await axiosInstance.get(API_CONFIG.BUDGETS.DETAIL(id))
    return response.data
  },

  create: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await axiosInstance.post(API_CONFIG.BUDGETS.LIST, data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateBudgetRequest>): Promise<Budget> => {
    const response = await axiosInstance.put(API_CONFIG.BUDGETS.DETAIL(id), data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.BUDGETS.DETAIL(id))
  },

  getProgress: async (id: string): Promise<{ spent: number, limit: number, percentage: number }> => {
    const response = await axiosInstance.get(API_CONFIG.BUDGETS.PROGRESS(id))
    return response.data
  },
}

export default budgetAPI
