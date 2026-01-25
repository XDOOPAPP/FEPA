/**
 * User Statistics API
 * Tổng hợp số liệu người dùng
 */

import axiosInstance from './axiosInstance'

export interface TotalStatsResponse {
  success: boolean
  data: {
    total: number
    verified: number
    admin: number
    user: number
  }
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface UsersOverTimeResponse {
  success: boolean
  data: Array<{ date: string; count: number }>
  period: Period
}

export const getTotalStats = async (): Promise<TotalStatsResponse> => {
  return await axiosInstance.get<TotalStatsResponse>('/auth/stats/total')
}

export const getUsersOverTime = async (period: Period, days: number): Promise<UsersOverTimeResponse> => {
  return await axiosInstance.get<UsersOverTimeResponse>(
    '/auth/stats/users-over-time',
    { params: { period, days } }
  )
}

export const userStatsAPI = {
  getTotalStats,
  getUsersOverTime,
}

export default userStatsAPI
