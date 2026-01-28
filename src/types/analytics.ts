/**
 * Analytics Type Definitions
 */

// Budget Analytics
export interface BudgetAdminStats {
  totalBudgets: number
  totalBudgeted: number
  totalSpent: number
  averageBudget: number
  activeBudgets: number
  expiredBudgets: number
  budgetsByCategory: Array<{
    category: string
    count: number
    totalBudgeted: number
    totalSpent: number
  }>
  budgetUtilization: Array<{
    month: string
    budgeted: number
    spent: number
    utilization: number
  }>
}

export interface BudgetStatsResponse {
  success: boolean
  data: BudgetAdminStats
}

// Expense Analytics
export interface ExpenseAdminStats {
  totalExpenses: number
  totalAmount: number
  averageExpense: number
  highestExpense: number
  expensesByCategory: Array<{
    category: string
    count: number
    amount: number
  }>
  expensesByMonth: Array<{
    month: string
    count: number
    amount: number
  }>
  recentExpenses: Array<{
    _id: string
    amount: number
    description: string
    category: string
    createdAt: string
  }>
}

export interface ExpenseStatsResponse {
  success: boolean
  data: ExpenseAdminStats
}

// OCR Analytics
export interface OcrAdminStats {
  totalScans: number
  successfulScans: number
  failedScans: number
  averageConfidence: number
  scansByDay: Array<{
    date: string
    count: number
  }>
  scansByUser: Array<{
    userId: string
    count: number
  }>
}

export interface OcrStatsResponse {
  success: boolean
  data: OcrAdminStats
}

// AI Analytics
export interface AiAdminStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  requestsByDay: Array<{
    date: string
    count: number
  }>
  requestsByFeature: Array<{
    feature: string
    count: number
  }>
}

export interface AiStatsResponse {
  success: boolean
  data: AiAdminStats
}

// Revenue Analytics
export interface RevenueOverTimeParams {
  period?: 'daily' | 'weekly' | 'monthly'
  days?: number
}

export interface RevenuePoint {
  date: string
  revenue: number
}

// ============================================
// AI ANALYTICS TYPES (v2.0)
// ============================================

/**
 * Message by role breakdown
 * Tin nhắn được phân loại theo người gửi
 */
export interface MessageByRole {
  role: 'user' | 'assistant'
  count: number
}

/**
 * Individual conversation record
 * Thông tin chi tiết một cuộc hội thoại
 */
export interface Conversation {
  id: string
  userId: string
  messageCount: number
  createdAt: string
}

/**
 * AI Service statistics
 * Dữ liệu thống kê toàn bộ AI Service
 */
export interface AIStats {
  totalConversations: number
  totalMessages: number
  totalUsers: number
  avgMessagesPerConversation: string | number
  messagesByRole: MessageByRole[]
  recentConversations: Conversation[]
}

/**
 * Transformed conversation table row
 */
export interface ConversationTableRow {
  key: string
  index: number
  conversationId: string
  userId: string
  messageCount: number
  createdAt: string
}

// ============================================
// OCR ANALYTICS TYPES (v2.0)
// ============================================

/**
 * OCR job status enum
 */
export enum OCRJobStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
  PROCESSING = 'processing',
}

/**
 * Job by status breakdown
 */
export interface JobByStatus {
  status: OCRJobStatus | string
  count: number
}

/**
 * Individual OCR job record
 */
export interface OCRJob {
  id: string
  userId: string
  status: OCRJobStatus | string
  fileUrl?: string
  resultJson?: Record<string, any>
  createdAt: string
  completedAt?: string
}

/**
 * OCR Service statistics
 */
export interface OCRStats {
  totalJobs: number
  totalUsers: number
  successRate: number
  byStatus: JobByStatus[]
  recentJobs: OCRJob[]
}

/**
 * Transformed OCR job table row
 */
export interface OCRJobTableRow {
  key: string
  index: number
  jobId: string
  userId: string
  status: string
  createdAt: string
  completedAt: string
}

// ============================================
// UNIFIED ANALYTICS TYPES
// ============================================

/**
 * Generic chart data format
 */
export interface ChartDataPoint {
  [key: string]: string | number
}

/**
 * Color palette configuration
 */
export const ANALYTICS_COLORS = {
  ai: '#8B5CF6',
  ocr: '#0EA5E9',
  success: '#10B981',
  failed: '#F43F5E',
  processing: '#F59E0B',
  assistant: '#06B6D4',
} as const

/**
 * Chart color palette
 */
export const CHART_COLORS = [
  '#8B5CF6',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#EC4899',
] as const

/**
 * Status color mapping
 */
export const STATUS_COLOR_MAP: Record<string, string> = {
  completed: ANALYTICS_COLORS.success,
  failed: ANALYTICS_COLORS.failed,
  processing: ANALYTICS_COLORS.processing,
  user: ANALYTICS_COLORS.ai,
  assistant: ANALYTICS_COLORS.assistant,
}
