/**
 * Example API Service using React Query
 * Ví dụ cách sử dụng React Query để fetch data từ backend
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import subscriptionAPI from './api/subscriptionAPI'
import type { SubscriptionStatsMap } from './api/subscriptionAPI'
import expenseAPI from './api/expenseAPI'
import type { ExpenseAdminStats } from './api/expenseAPI'
import budgetAPI from './api/budgetAPI'
import type { BudgetAdminStats } from './api/budgetAPI'
import ocrAPI from './api/ocrAPI'
import type { OcrAdminStats } from './api/ocrAPI'
import aiAPI from './api/aiAPI'
import type { AiAdminStats } from './api/aiAPI'
import adminApiService from './api/adminApiService'
import { message } from 'antd'

// ==================== USER SERVICE ====================

export const useUsers = (filters?: Parameters<typeof adminApiService.getUsers>[0]) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const response = await adminApiService.getUsers(filters)
      return response?.data ?? response ?? []
    },
    keepPreviousData: true,
  })
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await adminApiService.getUsers({ search: userId, pageSize: 1 })
      const payload = response?.data ?? response
      const list = Array.isArray((payload as any)?.data)
        ? (payload as any).data
        : (payload as any)?.users ?? (payload as any)?.items ?? payload

      if (Array.isArray(list)) {
        return list.find((u: any) => u.id === userId || u._id === userId) ?? null
      }

      return payload ?? null
    },
    enabled: !!userId,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: { email: string; fullName: string; password: string }) =>
      adminApiService.registerAdmin(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('Tạo admin thành công')
    },
    onError: (error: any) => {
      message.error(error?.message || error?.response?.data?.message || 'Có lỗi xảy ra')
    },
  })
}

export const useDeactivateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => adminApiService.deactivateUser(userId),
    onSuccess: (_res, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      message.success('Đã vô hiệu hóa người dùng')
    },
    onError: (error: any) => {
      message.error(error?.message || error?.response?.data?.message || 'Có lỗi xảy ra')
    },
  })
}

export const useReactivateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => adminApiService.reactivateUser(userId),
    onSuccess: (_res, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      message.success('Đã kích hoạt lại người dùng')
    },
    onError: (error: any) => {
      message.error(error?.message || error?.response?.data?.message || 'Có lỗi xảy ra')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => adminApiService.deleteUser(userId),
    onSuccess: (_res, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      message.success('Xóa người dùng thành công')
    },
    onError: (error: any) => {
      message.error(error?.message || error?.response?.data?.message || 'Có lỗi xảy ra')
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
      // subscriptionAPI đã normalize trả về map hoặc payload.data
      return response as SubscriptionStatsMap
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

// ==================== EXPENSE SERVICE ====================

/**
 * Lấy thống kê expense toàn hệ thống (Admin)
 * GET /api/v1/expenses/admin/stats
 */
export const useGetExpenseAdminStats = () => {
  return useQuery({
    queryKey: ['expenses', 'admin', 'stats'],
    queryFn: async () => {
      const response = await expenseAPI.getAdminStats()
      return response as ExpenseAdminStats
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  })
}

// ==================== BUDGET SERVICE ====================

/**
 * Lấy thống kê budget toàn hệ thống (Admin)
 * GET /api/v1/budgets/admin/stats
 */
export const useGetBudgetAdminStats = () => {
  return useQuery({
    queryKey: ['budgets', 'admin', 'stats'],
    queryFn: async () => {
      const response = await budgetAPI.getAdminStats()
      return response as BudgetAdminStats
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  })
}

// ==================== OCR SERVICE ====================

/**
 * Lấy thống kê OCR toàn hệ thống (Admin)
 * GET /api/v1/ocr/admin/stats
 */
export const useGetOcrAdminStats = () => {
  return useQuery({
    queryKey: ['ocr', 'admin', 'stats'],
    queryFn: async () => {
      const response = await ocrAPI.getAdminStats()
      return response as OcrAdminStats
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  })
}

// ==================== AI SERVICE ====================

/**
 * Lấy thống kê AI toàn hệ thống (Admin)
 * GET /api/v1/ai/admin/stats
 */
export const useGetAiAdminStats = () => {
  return useQuery({
    queryKey: ['ai', 'admin', 'stats'],
    queryFn: async () => {
      const response = await aiAPI.getAdminStats()
      return response as AiAdminStats
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
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
