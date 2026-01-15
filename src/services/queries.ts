/**
 * Example API Service using React Query
 * Ví dụ cách sử dụng React Query để fetch data từ backend
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import subscriptionAPI from './api/subscriptionAPI'
import notificationAPI from './api/notificationAPI'
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

// ==================== SUBSCRIPTION SERVICE ====================

/**
 * Lấy danh sách tất cả gói subscription
 * GET /api/v1/subscriptions/plans
 */
export const useGetPlans = () => {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: async () => {
      const response = await subscriptionAPI.getPlans()
      return response.data || response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

/**
 * Lấy chi tiết một gói subscription
 * GET /api/v1/subscriptions/plans/:id
 */
export const useGetPlanDetail = (planId: string) => {
  return useQuery({
    queryKey: ['subscriptions', 'plan', planId],
    queryFn: async () => await subscriptionAPI.getPlanDetail(planId),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

/**
 * Tạo gói subscription mới (Admin)
 * POST /api/v1/subscriptions/plans
 */
export const useCreatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => await subscriptionAPI.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'plans'] })
      message.success('Thêm gói subscription thành công')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lỗi khi thêm gói')
    },
  })
}

/**
 * Cập nhật gói subscription (Admin)
 * PATCH /api/v1/subscriptions/plans/:id
 */
export const useUpdatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ planId, data }: { planId: string; data: any }) =>
      await subscriptionAPI.updatePlan(planId, data),
    onSuccess: (updatedPlan, variables) => {
      // Manually update cache to keep the plan visible even if backend filters inactive ones
      queryClient.setQueryData(['subscriptions', 'plans'], (oldData: any) => {
        const plans = Array.isArray(oldData) ? oldData : (oldData?.data || [])
        return plans.map((p: any) =>
          p._id === variables.planId || p.id === variables.planId
            ? { ...p, ...variables.data, ...updatedPlan } // Merge optimistic/real data
            : p
        )
      })

      // Also update detail cache if exists
      queryClient.setQueryData(['subscriptions', 'plan', variables.planId], updatedPlan)

      message.success('Cập nhật gói subscription thành công')
    },
    onError: (error: any) => {
      // Invalidate on error to revert to server state
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'plans'] })
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật gói')
    },
  })
}

/**
 * Vô hiệu hóa gói subscription (Admin)
 * DELETE /api/v1/subscriptions/plans/:id
 */
export const useDeletePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (planId: string) => await subscriptionAPI.disablePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'plans'] })
      message.success('Đã vô hiệu hóa gói subscription')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lỗi khi xóa gói')
    },
  })
}

/**
 * Lấy thống kê subscription (Admin)
 * GET /api/v1/subscriptions/admin/stats
 */
export const useGetStats = () => {
  return useQuery({
    queryKey: ['subscriptions', 'stats'],
    queryFn: async () => {
      const response = await subscriptionAPI.getStats()
      return response.data || response
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 3,
  })
}

/**
 * Kiểm tra trạng thái service subscription
 * GET /api/v1/subscriptions/health
 */
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['subscriptions', 'health'],
    queryFn: async () => await subscriptionAPI.checkHealth(),
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  })
}

/**
 * Lấy subscription hiện tại của user
 * GET /api/v1/subscriptions/current
 */
export const useGetCurrent = () => {
  return useQuery({
    queryKey: ['subscriptions', 'current'],
    queryFn: async () => {
      const response = await subscriptionAPI.getCurrent()
      return response.data || response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

/**
 * Lấy lịch sử subscription
 * GET /api/v1/subscriptions/history
 */
export const useGetHistory = () => {
  return useQuery({
    queryKey: ['subscriptions', 'history'],
    queryFn: async () => await subscriptionAPI.getHistory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })
}

/**
 * Lấy danh sách tính năng được phép dùng
 * GET /api/v1/subscriptions/features
 */
export const useGetUserFeatures = () => {
  return useQuery({
    queryKey: ['subscriptions', 'features'],
    queryFn: async () => await subscriptionAPI.getUserFeatures(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  })
}

/**
 * Kiểm tra quyền truy cập một tính năng cụ thể
 * GET /api/v1/subscriptions/check?feature=NAME
 */
export const useCheckFeature = (feature: string) => {
  return useQuery({
    queryKey: ['subscriptions', 'feature', feature],
    queryFn: async () => await subscriptionAPI.checkFeature(feature),
    enabled: !!feature,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

/**
 * Đăng ký gói subscription
 * POST /api/v1/subscriptions
 */
export const useSubscribe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (planId: string) => await subscriptionAPI.subscribe(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'history'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'features'] })
      message.success('Đăng ký gói thành công')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lỗi khi đăng ký')
    },
  })
}

/**
 * Hủy subscription hiện tại
 * POST /api/v1/subscriptions/cancel
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => await subscriptionAPI.cancel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'current'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'history'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'features'] })
      message.success('Hủy subscription thành công')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lỗi khi hủy subscription')
    },
  })
}

/**
 * HOW TO USE:
 * 
 * 1. Trong component:
 * 
 * import { useGetPlans, useCreatePlan } from '@/services/queries'
 * 
 * const MyComponent = () => {
 *   const { data: plans, isLoading, error } = useGetPlans()
 *   const createPlan = useCreatePlan()
 * 
 *   const handleCreate = async (data) => {
 *     await createPlan.mutateAsync(data)
 *   }
 * 
 *   if (isLoading) return <Spin />
 *   if (error) return <Alert message="Error" />
 * 
 *   return <div>{plans?.map(...)}</div>
 * }
 */

// ==================== NOTIFICATION SERVICE ====================

/**
 * Lấy danh sách thông báo
 * GET /api/v1/notifications
 */
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationAPI.getAll();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

/**
 * Đánh dấu thông báo đã đọc
 * PATCH /api/v1/notifications/:id/read
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await notificationAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lỗi khi đánh dấu đã đọc');
    },
  });
};

/**
 * Đánh dấu tất cả thông báo đã đọc
 * PATCH /api/v1/notifications/read-all
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await notificationAPI.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      message.success('Đã đánh dấu tất cả là đã đọc');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    },
  });
};

/**
 * Xóa thông báo
 * DELETE /api/v1/notifications/:id
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await notificationAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      message.success('Đã xóa thông báo');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lỗi khi xóa thông báo');
    },
  });
};
