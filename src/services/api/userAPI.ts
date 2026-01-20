import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

export interface UserDTO {
  id: string
  email: string
  fullName: string
  role: string
  status: string
  phone?: string
  createdAt?: string
  lastLogin?: string
}

const userAPI = {
  getAll: async (): Promise<UserDTO[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
  },

  getById: async (id: string): Promise<UserDTO> => {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },

  create: async (data: Partial<UserDTO>): Promise<UserDTO> => {
    const response = await axiosInstance.post('/users', data)
    return response.data
  },

  update: async (id: string, data: Partial<UserDTO>): Promise<UserDTO> => {
    const response = await axiosInstance.put(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`)
  },
}

export default userAPI
