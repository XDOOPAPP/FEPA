import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  description?: string
}

export interface CreateCategoryRequest {
  name: string
  icon?: string
  color?: string
  description?: string
}

const categoryAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get(API_CONFIG.CATEGORIES.LIST)
    return response.data
  },

  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(API_CONFIG.CATEGORIES.DETAIL(id))
    return response.data
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post(API_CONFIG.CATEGORIES.LIST, data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateCategoryRequest>): Promise<Category> => {
    const response = await axiosInstance.put(API_CONFIG.CATEGORIES.DETAIL(id), data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.CATEGORIES.DETAIL(id))
  },
}

export default categoryAPI
