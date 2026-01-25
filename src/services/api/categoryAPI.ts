import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

export interface ExpenseCategory {
  id: string
  name: string
  description?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CategoryListResponse {
  success?: boolean
  data?: ExpenseCategory[]
  message?: string
}

export interface CategoryCreateRequest {
  name: string
  description?: string
  isActive?: boolean
}

export interface CategoryUpdateRequest {
  name?: string
  description?: string
  isActive?: boolean
}

export interface CategoryResponse {
  success?: boolean
  data?: ExpenseCategory
  message?: string
}

const categoryAPI = {
  getCategories: async (search?: string): Promise<ExpenseCategory[]> => {
    const response = await axiosInstance.get<CategoryListResponse>(API_CONFIG.CATEGORIES.LIST, {
      params: search ? { search } : undefined,
    })
    const payload: any = response.data || response
    if (Array.isArray(payload)) return payload
    if (payload?.data && Array.isArray(payload.data)) return payload.data
    return []
  },

  createCategory: async (data: CategoryCreateRequest): Promise<ExpenseCategory> => {
    const response = await axiosInstance.post<CategoryResponse>(API_CONFIG.CATEGORIES.CREATE, data)
    const payload: any = response.data || response
    return payload?.data || payload
  },

  updateCategory: async (id: string, data: CategoryUpdateRequest): Promise<ExpenseCategory> => {
    const response = await axiosInstance.patch<CategoryResponse>(API_CONFIG.CATEGORIES.UPDATE(id), data)
    const payload: any = response.data || response
    return payload?.data || payload
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.CATEGORIES.DELETE(id))
  },
}

export default categoryAPI
