/**
 * Example API Service using React Query
 * Ví dụ cách sử dụng React Query để fetch data từ backend
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import axiosInstance from './api/axiosInstance' // Uncomment khi cần dùng
import { message } from 'antd'

// ==================== USER SERVICE ====================

/**
 * Hook để fetch danh sách users
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // TODO: Thay localStorage bằng API call
      // const response = await axiosInstance.get('/users')
      // return response.data
      
      const users = localStorage.getItem('users')
      return users ? JSON.parse(users) : []
    },
  })
}

/**
 * Hook để fetch single user
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // TODO: Replace with API call
      // return await axiosInstance.get(`/users/${userId}`)
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      return users.find((u: any) => u.id === userId)
    },
    enabled: !!userId, // Only run if userId exists
  })
}

/**
 * Hook để create/update user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: any) => {
      // TODO: Replace with API call
      // return await axiosInstance.post('/users', userData)
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const newUser = { ...userData, id: Date.now().toString() }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      return newUser
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('Thêm người dùng thành công')
    },
    onError: (error: any) => {
      message.error(error.message || 'Có lỗi xảy ra')
    },
  })
}

/**
 * Hook để update user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // TODO: Replace with API call
      // return await axiosInstance.put(`/users/${id}`, data)
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const index = users.findIndex((u: any) => u.id === id)
      if (index !== -1) {
        users[index] = { ...users[index], ...data }
        localStorage.setItem('users', JSON.stringify(users))
      }
      return users[index]
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      message.success('Cập nhật thành công')
    },
    onError: (error: any) => {
      message.error(error.message || 'Có lỗi xảy ra')
    },
  })
}

/**
 * Hook để delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      // TODO: Replace with API call
      // return await axiosInstance.delete(`/users/${userId}`)
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const filtered = users.filter((u: any) => u.id !== userId)
      localStorage.setItem('users', JSON.stringify(filtered))
      return userId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('Xóa người dùng thành công')
    },
    onError: (error: any) => {
      message.error(error.message || 'Có lỗi xảy ra')
    },
  })
}

// ==================== EXAMPLE: Expenses Service ====================

export const useExpenses = (filters?: { userId?: string; categoryId?: string }) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      // TODO: Replace with API call
      // return await axiosInstance.get('/expenses', { params: filters })
      
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
      return expenses
    },
  })
}

// ==================== EXAMPLE: Reports Service ====================

export const useReports = (params: { type: string; startDate: string; endDate: string }) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      // TODO: Replace with API call
      // return await axiosInstance.get('/reports', { params })
      
      return {
        totalRevenue: 50000000,
        totalUsers: 1250,
        premiumUsers: 150,
      }
    },
  })
}

/**
 * HOW TO USE:
 * 
 * 1. Trong component:
 * 
 * import { useUsers, useCreateUser } from '@/services/queries'
 * 
 * const MyComponent = () => {
 *   const { data: users, isLoading, error } = useUsers()
 *   const createUser = useCreateUser()
 * 
 *   const handleCreate = async (userData) => {
 *     await createUser.mutateAsync(userData)
 *   }
 * 
 *   if (isLoading) return <Spin />
 *   if (error) return <Alert message="Error" />
 * 
 *   return <div>{users.map(...)}</div>
 * }
 */
