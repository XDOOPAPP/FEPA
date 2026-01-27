# 📊 Admin Dashboard Redesign Plan

## ✅ Hoàn thành (Completed)

### 1. Xóa Hard-coded Data

- ✅ Xóa `initializeMockData()` function
- ✅ Xóa localStorage fake users data
- ✅ Xóa fake monthly revenue random data
- ✅ Xóa hard-coded recent activities array
- ✅ Xóa hard-coded notification counts

### 2. API Integration

- ✅ User stats: `adminApiService.getUserStats()` → totalUsers, activeUsers
- ✅ Revenue: `subscriptionAPI.getRevenueTotals()` → totalRevenue
- ✅ Blog stats: `blogAPI.getStatusStats()` → pending, published, rejected, draft
- ✅ Service stats: Already using React Query hooks
  - `useGetExpenseAdminStats()` → expense stats
  - `useGetBudgetAdminStats()` → budget stats
  - `useGetOcrAdminStats()` → OCR stats
  - `useGetAiAdminStats()` → AI stats

### 3. Layout Restructure

- ✅ **Thống kê Hệ thống** (Service Analytics - 8 cards)
  - Expense users, Budget users, Total expenses, Total budgets
  - OCR scans, OCR users, AI requests, AI users
- ✅ **Thống kê Hệ thống Chính** (Core System - 4 cards)
  - Total users, Active users, Total revenue, Pending blogs

- ✅ **Charts & Notifications**
  - Monthly stats chart (left 70%)
  - Quick alerts list (right 30%)

- ✅ **Recent Activities**
  - Shows empty state when no data

### 4. Bug Fixes

- ✅ Fixed ResponsiveContainer width=-1 error
- ✅ Added proper empty states for all sections
- ✅ Removed duplicate statistics cards

---

## 🚧 Cần Backend Support (Need Backend APIs)

### 1. Monthly Revenue Chart Data

**Endpoint cần:** `GET /subscription/revenue/monthly?year=2026`

**Response format:**

```json
{
  "data": [
    { "month": 1, "revenue": 1250000, "subscriptions": 5 },
    { "month": 2, "revenue": 2100000, "subscriptions": 8 },
    ...
  ]
}
```

**Frontend update:**

```typescript
// In loadDashboardData()
const monthlyResponse = await subscriptionAPI.getRevenueMonthly(2026);
const monthlyChartData = monthlyResponse.map((item) => ({
  month: `T${item.month}`,
  revenue: item.revenue,
}));
setMonthlyData(monthlyChartData);
```

---

### 2. Recent Activities Feed

**Endpoint cần:** `GET /admin/recent-activities?limit=10`

**Response format:**

```json
{
  "data": [
    {
      "id": "act_123",
      "userId": "user_456",
      "userName": "Nguyễn Văn A",
      "action": "registered",
      "details": "Đăng ký tài khoản",
      "timestamp": "2026-01-26T10:30:00Z",
      "type": "register"
    },
    {
      "id": "act_124",
      "userId": "user_789",
      "userName": "Trần Thị B",
      "action": "subscription_created",
      "details": "Thanh toán Premium",
      "amount": 199000,
      "timestamp": "2026-01-26T09:15:00Z",
      "type": "payment"
    },
    {
      "id": "act_125",
      "userId": "user_101",
      "userName": "Lê Văn C",
      "action": "blog_created",
      "details": "Tạo bài viết mới",
      "timestamp": "2026-01-26T08:45:00Z",
      "type": "blog"
    },
    {
      "id": "act_126",
      "userId": "user_202",
      "userName": "Phạm Thị D",
      "action": "expense_created",
      "details": "Thêm chi tiêu",
      "amount": 150000,
      "timestamp": "2026-01-26T08:00:00Z",
      "type": "expense"
    }
  ]
}
```

**Activity types:**

- `register` - User registration
- `payment` - Subscription payment
- `blog` - Blog post created
- `expense` - Expense added
- `budget` - Budget created/exceeded
- `ocr` - OCR scan completed
- `ai` - AI request completed

**Frontend update:**

```typescript
// In loadDashboardData()
const activitiesResponse = await adminApiService.getRecentActivities(10);
const activities = activitiesResponse.data.map((item) => ({
  id: item.id,
  user: item.userName,
  action: getActionText(item.action, item.details),
  amount: item.amount ? formatCurrency(item.amount) : undefined,
  time: dayjs(item.timestamp).fromNow(),
  type: item.type,
}));
setRecentActivities(activities);
```

---

### 3. Quick Notifications/Alerts

**Endpoint cần:** `GET /admin/dashboard/alerts`

**Response format:**

```json
{
  "data": {
    "newUsers": 5,
    "supportRequests": 2,
    "pendingReports": 1,
    "systemAlerts": 0
  }
}
```

**Frontend update:**

```typescript
// In loadDashboardData()
const alertsResponse = await adminApiService.getDashboardAlerts();
const alerts = alertsResponse.data;
// Update notification list with real counts
```

---

## 📝 Implementation Steps (Backend Team)

### Step 1: Monthly Revenue Endpoint

File: `backend/subscription-service/src/controllers/subscription.controller.ts`

```typescript
async getMonthlyRevenue(req, res) {
  const { year } = req.query
  const currentYear = year || new Date().getFullYear()

  const monthlyData = await Subscription.aggregate([
    {
      $match: {
        status: 'active',
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])

  res.json({ data: monthlyData })
}
```

### Step 2: Recent Activities Endpoint

File: `backend/api-gateway/src/admin/admin.controller.ts`

```typescript
async getRecentActivities(req, res) {
  const { limit = 10 } = req.query

  // Aggregate activities from multiple services
  const [users, subscriptions, blogs, expenses] = await Promise.all([
    UserService.getRecent(limit),
    SubscriptionService.getRecent(limit),
    BlogService.getRecent(limit),
    ExpenseService.getRecent(limit)
  ])

  // Merge and sort by timestamp
  const activities = [...users, ...subscriptions, ...blogs, ...expenses]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)

  res.json({ data: activities })
}
```

### Step 3: Dashboard Alerts Endpoint

File: `backend/api-gateway/src/admin/admin.controller.ts`

```typescript
async getDashboardAlerts(req, res) {
  const [newUsers, supportRequests, pendingReports] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: dayjs().subtract(7, 'day') } }),
    SupportTicket.countDocuments({ status: 'open' }),
    Report.countDocuments({ status: 'pending' })
  ])

  res.json({
    data: {
      newUsers,
      supportRequests,
      pendingReports
    }
  })
}
```

---

## 🎯 Benefits

### Before (Hard-coded)

- ❌ Fake localStorage data
- ❌ Random numbers không chính xác
- ❌ Không real-time
- ❌ Không có empty states
- ❌ Layout lộn xộn với duplicate cards

### After (API-driven)

- ✅ Real data from backend
- ✅ Accurate statistics
- ✅ Auto-refresh với React Query
- ✅ Proper empty states
- ✅ Clean, organized layout
- ✅ Better UX with loading indicators

---

## 📌 Notes

- Frontend code đã sẵn sàng, chỉ cần backend implement 3 endpoints
- Tất cả hard-code đã được xóa
- Layout đã được tổ chức lại theo logic
- Empty states đã được thêm vào
- Chart rendering bug đã fix
