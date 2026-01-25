# ADMIN API DOCUMENTATION

Tài liệu này tổng hợp tất cả các endpoint dành riêng cho **ADMIN** trong hệ thống FEPA.

**VPS Deployment**: `http://76.13.21.84:3000`

## 📋 Mục lục

- [Xác thực Admin](#xác-thực-admin)
- [1. AUTH SERVICE - Quản lý người dùng](#1-auth-service---quản-lý-người-dùng)
- [2. EXPENSE SERVICE - Thống kê chi tiêu](#2-expense-service---thống-kê-chi-tiêu)
- [3. BUDGET SERVICE - Thống kê ngân sách](#3-budget-service---thống-kê-ngân-sách)
- [4. BLOG SERVICE - Kiểm duyệt blog](#4-blog-service---kiểm-duyệt-blog)
- [5. SUBSCRIPTION SERVICE - Quản lý gói dịch vụ](#5-subscription-service---quản-lý-gói-dịch-vụ)
- [6. NOTIFICATION SERVICE - Quản lý thông báo](#6-notification-service---quản-lý-thông-báo)
- [7. OCR SERVICE - Thống kê OCR](#7-ocr-service---thống-kê-ocr)
- [8. AI SERVICE - Thống kê AI](#8-ai-service---thống-kê-ai)

---

## Xác thực Admin

Tất cả endpoint Admin đều yêu cầu:

- **Header**: `Authorization: Bearer {JWT_TOKEN}`
- **Role**: `ADMIN`

### Cách lấy token Admin:

```bash
# 1. Login với tài khoản admin
POST http://76.13.21.84:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "YourAdminPassword"
}

# Response sẽ trả về token
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 1. AUTH SERVICE - Quản lý người dùng

### 1.1 Đăng ký tài khoản Admin

**Endpoint**: `POST /api/v1/auth/register-admin`

**Mô tả**: Tạo tài khoản admin mới (chỉ admin hiện tại mới có quyền)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "newadmin@example.com",
  "password": "SecurePassword@123",
  "fullName": "New Admin Name"
}
```

**Response Success** (200):

```json
{
  "message": "Admin created successfully",
  "data": {
    "id": "admin-id",
    "email": "newadmin@example.com",
    "fullName": "New Admin Name",
    "role": "ADMIN",
    "isVerified": true,
    "createdAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**Response Error** (400):

```json
{
  "error": "Email already exists"
}
```

---

### 1.2 Lấy danh sách tất cả Admin

**Endpoint**: `GET /api/v1/auth/all-admin`

**Mô tả**: Lấy danh sách tất cả tài khoản admin trong hệ thống

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": [
    {
      "id": "admin-1",
      "email": "admin1@example.com",
      "fullName": "Admin One",
      "role": "ADMIN",
      "isVerified": true,
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "admin-2",
      "email": "admin2@example.com",
      "fullName": "Admin Two",
      "role": "ADMIN",
      "isVerified": true,
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

---

### 1.3 Lấy danh sách tất cả User

**Endpoint**: `GET /api/v1/auth/users`

**Mô tả**: Lấy danh sách tất cả người dùng trong hệ thống (cả USER và ADMIN)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": [
    {
      "id": "user-1",
      "email": "user1@example.com",
      "fullName": "User One",
      "role": "USER",
      "isVerified": true,
      "isActive": true,
      "createdAt": "2026-01-15T00:00:00.000Z",
      "avatar": "https://cloudinary.../avatar.jpg"
    },
    {
      "id": "user-2",
      "email": "user2@example.com",
      "fullName": "User Two",
      "role": "USER",
      "isVerified": true,
      "isActive": false,
      "createdAt": "2026-01-20T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

---

### 1.4 Xóa người dùng

**Endpoint**: `DELETE /api/v1/auth/users/{userId}`

**Mô tả**: Xóa vĩnh viễn tài khoản người dùng (không thể khôi phục)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters**:

- `userId`: ID của người dùng cần xóa

**Response Success** (200):

```json
{
  "message": "User deleted successfully",
  "data": {
    "id": "user-id",
    "email": "deleted@example.com"
  }
}
```

**Response Error** (404):

```json
{
  "error": "User not found"
}
```

---

### 1.5 Vô hiệu hóa tài khoản

**Endpoint**: `PATCH /api/v1/auth/users/{userId}/deactivate`

**Mô tả**: Tạm khóa tài khoản người dùng (có thể kích hoạt lại)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters**:

- `userId`: ID của người dùng cần khóa

**Response Success** (200):

```json
{
  "_id": "user-id",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "isVerified": true,
  "isActive": false,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-25T11:00:00.000Z"
}
```

---

### 1.6 Kích hoạt lại tài khoản

**Endpoint**: `PATCH /api/v1/auth/users/{userId}/reactivate`

**Mô tả**: Mở khóa tài khoản đã bị vô hiệu hóa

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters**:

- `userId`: ID của người dùng cần mở khóa

**Response Success** (200):

```json
{
  "_id": "user-id",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "isVerified": true,
  "isActive": true,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-01-25T11:05:00.000Z"
}
```

---

### 1.7 Thống kê người dùng theo thời gian

**Endpoint**: `GET /api/v1/auth/stats/users-over-time`

**Mô tả**: Lấy thống kê số lượng người dùng theo thời gian (dùng cho biểu đồ)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Query Parameters**:

- `period`: Khoảng thời gian (default: `30`)

**Example**:

```
GET /api/v1/auth/stats/users-over-time?period=30
```

**Response Success** (200):

```json
{
  "data": [
    {
      "date": "2026-01-01",
      "totalUsers": 100,
      "newUsers": 5,
      "verifiedUsers": 95
    },
    {
      "date": "2026-01-02",
      "totalUsers": 105,
      "newUsers": 5,
      "verifiedUsers": 100
    }
  ],
  "period": 30,
  "summary": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-30",
    "totalGrowth": 50
  }
}
```

---

### 1.8 Thống kê tổng quan người dùng

**Endpoint**: `GET /api/v1/auth/stats/total`

**Mô tả**: Lấy thống kê tổng số người dùng theo vai trò và trạng thái

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": {
    "total": 1250,
    "verified": 1200,
    "unverified": 50,
    "active": 1180,
    "inactive": 70,
    "byRole": {
      "admin": 10,
      "user": 1240
    },
    "growth": {
      "today": 15,
      "thisWeek": 80,
      "thisMonth": 300
    }
  }
}
```

---

## 2. EXPENSE SERVICE - Thống kê chi tiêu

### 2.1 Thống kê chi tiêu tổng quan (Admin)

**Endpoint**: `GET /api/v1/expenses/admin/stats`

**Mô tả**: Lấy thống kê tổng quan về chi tiêu của tất cả người dùng

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": {
    "totalExpenses": 15234,
    "totalAmount": 125000000,
    "averageExpenseAmount": 8205,
    "topCategories": [
      {
        "category": "food",
        "count": 5234,
        "totalAmount": 45000000,
        "percentage": 36
      },
      {
        "category": "transport",
        "count": 3421,
        "totalAmount": 28000000,
        "percentage": 22.4
      },
      {
        "category": "shopping",
        "count": 2156,
        "totalAmount": 35000000,
        "percentage": 28
      }
    ],
    "topUsers": [
      {
        "userId": "user-1",
        "userName": "John Doe",
        "expenseCount": 234,
        "totalAmount": 5600000
      },
      {
        "userId": "user-2",
        "userName": "Jane Smith",
        "expenseCount": 189,
        "totalAmount": 4800000
      }
    ],
    "monthlyTrend": [
      {
        "month": "2026-01",
        "count": 2456,
        "amount": 18500000
      },
      {
        "month": "2025-12",
        "count": 2234,
        "amount": 16800000
      }
    ]
  }
}
```

**Các metrics bao gồm**:

- `totalExpenses`: Tổng số giao dịch chi tiêu
- `totalAmount`: Tổng số tiền đã chi
- `averageExpenseAmount`: Số tiền trung bình mỗi giao dịch
- `topCategories`: Top danh mục chi tiêu nhiều nhất
- `topUsers`: Top người dùng chi tiêu nhiều nhất
- `monthlyTrend`: Xu hướng chi tiêu theo tháng

---

## 3. BUDGET SERVICE - Thống kê ngân sách

### 3.1 Thống kê ngân sách tổng quan (Admin)

**Endpoint**: `GET /api/v1/budgets/admin/stats`

**Mô tả**: Lấy thống kê tổng quan về ngân sách của tất cả người dùng

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": {
    "totalBudgets": 3456,
    "activeBudgets": 2890,
    "expiredBudgets": 566,
    "totalLimitAmount": 450000000,
    "totalSpentAmount": 285000000,
    "averageUtilization": 63.3,
    "budgetsByCategory": [
      {
        "category": "food",
        "count": 1234,
        "totalLimit": 150000000,
        "totalSpent": 95000000,
        "utilization": 63.3
      },
      {
        "category": "transport",
        "count": 987,
        "totalLimit": 100000000,
        "totalSpent": 68000000,
        "utilization": 68
      }
    ],
    "budgetStatus": {
      "onTrack": 1890,
      "nearLimit": 678,
      "exceeded": 322,
      "percentages": {
        "onTrack": 65.3,
        "nearLimit": 23.4,
        "exceeded": 11.3
      }
    },
    "topUsers": [
      {
        "userId": "user-1",
        "userName": "John Doe",
        "budgetCount": 12,
        "totalLimit": 15000000,
        "totalSpent": 8500000
      }
    ]
  }
}
```

**Các metrics bao gồm**:

- `totalBudgets`: Tổng số ngân sách đã tạo
- `activeBudgets`: Số ngân sách đang hoạt động
- `expiredBudgets`: Số ngân sách đã hết hạn
- `totalLimitAmount`: Tổng hạn mức ngân sách
- `totalSpentAmount`: Tổng số tiền đã chi
- `averageUtilization`: Tỷ lệ sử dụng trung bình (%)
- `budgetsByCategory`: Phân tích theo danh mục
- `budgetStatus`: Trạng thái ngân sách (đúng kế hoạch, gần hết, vượt quá)

---

## 4. BLOG SERVICE - Kiểm duyệt blog

### 4.1 Duyệt blog (Approve)

**Endpoint**: `POST /api/v1/blogs/{id}/approve`

**Mô tả**: Phê duyệt blog từ trạng thái `pending` → `published`

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters**:

- `id`: ID của blog cần duyệt

**Response Success** (200):

```json
{
  "id": "blog-id",
  "userId": "user-id",
  "title": "Getting Started with FEPA",
  "slug": "getting-started-with-fepa",
  "content": "...",
  "tags": ["tutorial", "finance"],
  "status": "published",
  "publishedAt": "2026-01-25T10:30:00.000Z",
  "createdAt": "2026-01-20T08:00:00.000Z",
  "updatedAt": "2026-01-25T10:30:00.000Z"
}
```

**Response Error** (400):

```json
{
  "error": "Blog is not in pending status"
}
```

---

### 4.2 Từ chối blog (Reject)

**Endpoint**: `POST /api/v1/blogs/{id}/reject`

**Mô tả**: Từ chối blog và trả về trạng thái `draft` kèm lý do

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**URL Parameters**:

- `id`: ID của blog cần từ chối

**Request Body**:

```json
{
  "adminId": "admin-user-id",
  "rejectionReason": "Content contains inappropriate language"
}
```

**Response Success** (200):

```json
{
  "id": "blog-id",
  "userId": "user-id",
  "title": "Sample Blog",
  "slug": "sample-blog",
  "content": "...",
  "tags": ["tag1"],
  "status": "rejected",
  "rejectionReason": "Content contains inappropriate language",
  "publishedAt": null,
  "createdAt": "2026-01-20T08:00:00.000Z",
  "updatedAt": "2026-01-25T10:35:00.000Z"
}
```

**Response Error** (400):

```json
{
  "error": "Rejection reason is required"
}
```

---

### 4.3 Thống kê blog theo trạng thái

**Endpoint**: `GET /api/v1/blogs/statistics/status`

**Mô tả**: Lấy thống kê số lượng blog theo từng trạng thái (dùng cho biểu đồ tròn)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": [
    {
      "status": "published",
      "count": 1234,
      "percentage": 45.6
    },
    {
      "status": "pending",
      "count": 456,
      "percentage": 16.8
    },
    {
      "status": "draft",
      "count": 987,
      "percentage": 36.4
    },
    {
      "status": "rejected",
      "count": 34,
      "percentage": 1.2
    }
  ],
  "total": 2711
}
```

---

### 4.4 Thống kê blog theo tháng

**Endpoint**: `GET /api/v1/blogs/statistics/monthly`

**Mô tả**: Lấy thống kê số lượng blog được tạo theo tháng (dùng cho biểu đồ cột)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Query Parameters**:

- `year`: Năm cần thống kê (default: năm hiện tại)

**Example**:

```
GET /api/v1/blogs/statistics/monthly?year=2026
```

**Response Success** (200):

```json
{
  "data": [
    {
      "month": 1,
      "monthName": "January",
      "total": 245,
      "published": 189,
      "pending": 34,
      "draft": 22
    },
    {
      "month": 2,
      "monthName": "February",
      "total": 267,
      "published": 210,
      "pending": 28,
      "draft": 29
    }
  ],
  "year": 2026,
  "summary": {
    "totalBlogs": 512,
    "totalPublished": 399,
    "averagePerMonth": 42.7
  }
}
```

---

## 5. SUBSCRIPTION SERVICE - Quản lý gói dịch vụ

### 5.1 Tạo gói subscription mới

**Endpoint**: `POST /api/v1/subscriptions/plans`

**Mô tả**: Tạo gói subscription mới (chỉ admin)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Premium Plus",
  "price": 99.99,
  "interval": "MONTHLY",
  "features": {
    "OCR": true,
    "AI": true
  },
  "isFree": false,
  "isActive": true
}
```

**Field descriptions**:

- `interval`: Chu kỳ thanh toán - `MONTHLY`, `YEARLY`, hoặc `LIFETIME`
- `features`: Object chứa các tính năng (key: boolean)
- `isFree`: Gói miễn phí (default: false)
- `isActive`: Kích hoạt gói ngay (default: true)

**Response Success** (201):

```json
{
  "_id": "<objectId>",
  "name": "Premium Plus",
  "price": 99.99,
  "interval": "MONTHLY",
  "features": {
    "OCR": true,
    "AI": true
  },
  "isFree": false,
  "isActive": true,
  "createdAt": "2026-01-25T10:00:00.000Z",
  "updatedAt": "2026-01-25T10:00:00.000Z"
}
```

---

### 5.2 Cập nhật gói subscription

**Endpoint**: `PATCH /api/v1/subscriptions/plans/{planId}`

**Mô tả**: Cập nhật thông tin gói subscription

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**URL Parameters**:

- `planId`: ID của gói cần cập nhật (vd: `premium`)

**Request Body** (các field đều optional):

```json
{
  "price": 109.99,
  "interval": "YEARLY",
  "isActive": false
}
```

**Note**: Free plan (`isFree: true`) không thể bị tắt (`isActive: false`) hoặc thay đổi `isFree`.

````

**Response Success** (200):

```json
{
  "_id": "<objectId>",
  "name": "Premium",
  "price": 109.99,
  "interval": "YEARLY",
  "features": {
    "OCR": true,
    "AI": true
  },
  "isFree": false,
  "isActive": true,
  "createdAt": "2026-01-20T10:00:00.000Z",
  "updatedAt": "2026-01-25T11:00:00.000Z"
}
````

---

### 5.3 Xóa gói subscription

**Endpoint**: `DELETE /api/v1/subscriptions/plans/{planId}`

**Mô tả**: Xóa hoặc vô hiệu hóa gói subscription

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**URL Parameters**:

- `planId`: ID của gói cần xóa

**Response Success** (200):

```json
{
  "message": "Plan disabled"
}
```

**Note**: Free plan không thể bị xóa.

```

---

### 5.4 Thống kê subscription tổng quan

**Endpoint**: `GET /api/v1/subscriptions/admin/stats`

**Mô tả**: Thống kê số lượng subscription theo từng plan

**Headers**:

```

Authorization: Bearer {JWT_TOKEN}

````

**Response Success** (200):

```json
{
  "<planId_1>": {
    "name": "Premium",
    "count": 1234
  },
  "<planId_2>": {
    "name": "Basic",
    "count": 1656
  }
}
````

---

### 5.5 Thống kê doanh thu theo thời gian

**Endpoint**: `GET /api/v1/subscriptions/stats/revenue-over-time`

**Mô tả**: Thống kê doanh thu theo thời gian (biểu đồ)

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Query Parameters** (optional):

- `period`: `daily` (default), `weekly`, `monthly`
- `days`: số ngày lấy dữ liệu (default: 30)

**Response Success** (200):

```json
{
  "period": "daily",
  "days": 30,
  "data": [
    {
      "_id": "2026-01-01",
      "totalRevenue": 2500000,
      "subscriptionCount": 45
    },
    {
      "_id": "2026-01-02",
      "totalRevenue": 2800000,
      "subscriptionCount": 52
    }
  ]
}
```

---

### 5.6 Thống kê tổng doanh thu

**Endpoint**: `GET /api/v1/subscriptions/stats/total-revenue`

**Mô tả**: Tổng doanh thu từ subscription

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "totalRevenue": 285000000,
  "activeSubscriptions": 2890,
  "cancelledSubscriptions": 156,
  "totalSubscriptions": 3456
}
```

---

### 5.7 Thống kê doanh thu theo gói

**Endpoint**: `GET /api/v1/subscriptions/stats/revenue-by-plan`

**Mô tả**: Phân tích doanh thu theo từng gói subscription

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "data": [
    {
      "_id": {
        "planId": "<objectId>",
        "planName": "Premium"
      },
      "totalRevenue": 123400000,
      "subscriptionCount": 1234
    },
    {
      "_id": {
        "planId": "<objectId>",
        "planName": "Basic"
      },
      "totalRevenue": 82800000,
      "subscriptionCount": 1656
    }
  ]
}
```

---

## 6. NOTIFICATION SERVICE - Quản lý thông báo

**Lưu ý**: Notification Service chủ yếu tự động hoặc qua RabbitMQ. Admin có thể tạo notification thủ công nếu cần.

### 6.1 Tạo thông báo (Admin)

**Endpoint**: `POST /api/v1/notifications`

**Mô tả**: Tạo thông báo gửi đến user cụ thể hoặc broadcast

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body**:

```json
{
  "target": "ALL",
  "title": "System Maintenance",
  "message": "System will be under maintenance from 2AM to 4AM",
  "type": "SYSTEM_ALERT"
}
```

**Field descriptions**:

- `target`: `ALL` (tất cả users) hoặc `ADMINS` (chỉ admin)
- `type`: Loại thông báo (xem danh sách bên dưới)

**Các loại notification type**:

- `BUDGET_ALERT`: Cảnh báo ngân sách
- `EXPENSE_REMINDER`: Nhắc nhở chi tiêu
- `BLOG_APPROVED`: Blog được duyệt
- `BLOG_REJECTED`: Blog bị từ chối
- `SUBSCRIPTION_EXPIRING`: Subscription sắp hết hạn
- `SYSTEM_ALERT`: Thông báo hệ thống

**Response Success** (201):

```json
{
  "_id": "<objectId>",
  "userId": "all",
  "title": "System Maintenance",
  "message": "System will be under maintenance from 2AM to 4AM",
  "type": "SYSTEM_ALERT",
  "isRead": false,
  "metadata": {},
  "createdAt": "2026-01-25T10:00:00.000Z",
  "updatedAt": "2026-01-25T10:00:00.000Z"
}
```

---

## 7. OCR SERVICE - Thống kê OCR

### 7.1 Thống kê OCR tổng quan

**Endpoint**: `GET /api/v1/ocr/admin/stats`

**Mô tả**: Thống kê tổng quan về việc sử dụng OCR

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "totalJobs": 5678,
  "totalUsers": 1234,
  "successRate": 92.18,
  "byStatus": [
    {
      "status": "completed",
      "count": 5234
    },
    {
      "status": "failed",
      "count": 444
    },
    {
      "status": "processing",
      "count": 123
    }
  ],
  "recentJobs": [
    {
      "id": "job-id-1",
      "userId": "user-1",
      "status": "completed",
      "fileUrl": "https://...",
      "resultJson": {...},
      "createdAt": "2026-01-25T10:00:00.000Z",
      "completedAt": "2026-01-25T10:02:30.000Z"
    }
  ]
}
```

**Các metrics bao gồm**:

- `totalJobs`: Tổng số OCR job
- `totalUsers`: Số user đã sử dụng OCR
- `successRate`: Tỷ lệ thành công (%)
- `byStatus`: Phân loại theo trạng thái (completed, failed, processing)
- `recentJobs`: 10 job gần đây nhất

---

## 8. AI SERVICE - Thống kê AI

### 8.1 Thống kê AI tổng quan

**Endpoint**: `GET /api/v1/ai/admin/stats`

**Mô tả**: Thống kê tổng quan về việc sử dụng AI features

**Headers**:

```
Authorization: Bearer {JWT_TOKEN}
```

**Response Success** (200):

```json
{
  "totalConversations": 890,
  "totalMessages": 3456,
  "totalUsers": 567,
  "avgMessagesPerConversation": "3.88",
  "messagesByRole": [
    {
      "role": "user",
      "count": 1890
    },
    {
      "role": "assistant",
      "count": 1566
    }
  ],
  "recentConversations": [
    {
      "id": "conv-id-1",
      "userId": "user-1",
      "messageCount": 5,
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  ]
}
```

**Các metrics bao gồm**:

- `totalConversations`: Tổng số cuộc hội thoại AI
- `totalMessages`: Tổng số tin nhắn
- `totalUsers`: Số user đã sử dụng AI
- `avgMessagesPerConversation`: Số tin nhắn trung bình mỗi cuộc hội thoại
- `messagesByRole`: Phân loại tin nhắn theo vai trò (user/assistant)
- `recentConversations`: 10 cuộc hội thoại gần đây nhất

---

## 📊 Use Cases Admin

### Use Case 1: Giám sát hệ thống hàng ngày

```bash
# 1. Kiểm tra tổng quan người dùng
GET /api/v1/auth/stats/total

# 2. Kiểm tra thống kê chi tiêu
GET /api/v1/expenses/admin/stats

# 3. Kiểm tra blog cần duyệt
GET /api/v1/blogs?status=pending

# 4. Kiểm tra doanh thu subscription
GET /api/v1/subscriptions/stats/total-revenue
```

### Use Case 2: Kiểm duyệt blog

```bash
# 1. Lấy danh sách blog pending
GET /api/v1/blogs?status=pending

# 2a. Approve blog
POST /api/v1/blogs/{id}/approve

# 2b. Reject blog với lý do
POST /api/v1/blogs/{id}/reject
Body: {"rejectionReason": "Content violation"}
```

### Use Case 3: Quản lý người dùng vi phạm

```bash
# 1. Tìm user có hành vi bất thường
GET /api/v1/ai/admin/stats
# Phân tích anomaliesDetected

# 2. Vô hiệu hóa tài khoản
PATCH /api/v1/auth/users/{userId}/deactivate

# 3. Hoặc xóa vĩnh viễn nếu cần
DELETE /api/v1/auth/users/{userId}
```

### Use Case 4: Tạo gói subscription mới

```bash
# 1. Tạo plan mới
POST /api/v1/subscriptions/plans
Body: {
  "name": "Enterprise",
  "price": 299.99,
  "duration": 30,
  "features": {...}
}

# 2. Kiểm tra thống kê subscription
GET /api/v1/subscriptions/admin/stats
```

---

## 🔐 Quyền hạn và Bảo mật

### Role-Based Access Control (RBAC)

Tất cả endpoint admin đều:

1. Yêu cầu JWT token hợp lệ
2. Kiểm tra role = `ADMIN`
3. Log mọi hành động của admin

### Audit Log

Các hành động admin nên được log:

- Tạo/xóa admin
- Duyệt/từ chối blog
- Xóa/vô hiệu hóa user
- Tạo/sửa/xóa subscription plan

---

## 📝 Notes

1. **Phân quyền**: Một số endpoint có thể yêu cầu SUPER_ADMIN cho các hành động nhạy cảm (xóa admin, thay đổi cấu hình hệ thống)

2. **Rate Limiting**: Cân nhắc áp dụng rate limit cho admin API để tránh abuse

3. **IP Whitelist**: Nên giới hạn admin panel chỉ truy cập từ IP cố định

4. **2FA**: Khuyến nghị bật 2FA cho tài khoản admin

5. **Session Timeout**: Admin token nên có thời gian hết hạn ngắn hơn user thường (vd: 1h thay vì 24h)

---

## 🚀 Quick Start cho Admin

```bash
# 1. Login admin
curl -X POST http://76.13.21.84:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"YourPassword"}'

# 2. Lưu token vào biến môi trường
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Gọi API admin
curl -X GET http://76.13.21.84:3000/api/v1/auth/stats/total \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

**Phiên bản**: 1.0  
**Cập nhật**: 25/01/2026  
**VPS**: 76.13.21.84:3000
