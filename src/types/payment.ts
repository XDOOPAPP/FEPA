/**
 * Payment Type Definitions
 */

export interface PaymentDetail {
  orderId: string
  amount: number
  orderInfo: string
  orderType: string
  transId?: string
  payDate?: string
  bankCode?: string
  cardType?: string
  responseCode: string
  message?: string
}

export interface PaymentLookupResponse {
  success: boolean
  payment?: PaymentDetail
  message?: string
}

export interface IpnLog {
  _id: string
  orderId: string
  amount: number
  responseCode: string
  message: string
  transactionStatus: string
  createdAt: string
}
