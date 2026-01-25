import axiosInstance from './axiosInstance'
import { API_CONFIG } from '../../config/api.config'

export interface PaymentDetail {
  ref: string
  status: string
  amount: number
  currency?: string
  planName?: string
  userEmail?: string
  createdAt?: string
  updatedAt?: string
  gateway?: string
  meta?: Record<string, any>
}

export interface PaymentLookupResponse {
  success?: boolean
  message?: string
  data?: PaymentDetail
}

export interface IpnLog {
  id?: string
  ref?: string
  status?: string
  amount?: number
  createdAt?: string
  raw?: Record<string, any>
}

export interface IpnLogsResponse {
  success?: boolean
  data?: IpnLog[]
}

const paymentAPI = {
  lookup: async (ref: string): Promise<PaymentLookupResponse> => {
    const response = await axiosInstance.get<PaymentLookupResponse>(
      API_CONFIG.PAYMENTS.LOOKUP(ref)
    )
    return response.data || response
  },

  getIpnLogs: async (): Promise<IpnLogsResponse> => {
    const response = await axiosInstance.get<IpnLogsResponse>(
      API_CONFIG.PAYMENTS.IPN_LOGS
    )
    return response.data || response
  },
}

export default paymentAPI
