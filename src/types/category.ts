/**
 * Category Type Definitions
 */

export interface ExpenseCategory {
  _id: string
  name: string
  icon?: string
  color?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryResponse {
  success: boolean
  data: ExpenseCategory[]
}
