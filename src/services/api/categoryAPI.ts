import axiosInstance from './axiosInstance'

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
    const response = await axiosInstance.get('/categories')
    return response.data
  },

  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${id}`)
    return response.data
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post('/categories', data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateCategoryRequest>): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`)
  },
}

export default categoryAPI
