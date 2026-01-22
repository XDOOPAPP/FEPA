# 💰 API Documentation - Expense Service

## 📋 Tổng Quan

Expense Service cung cấp các RESTful API endpoints để quản lý chi tiêu cá nhân, theo dõi giao dịch theo danh mục, tích hợp với OCR để quét hóa đơn tự động.

**Base URL (qua API Gateway):** `http://localhost:3000/api/v1/expenses`

**Service Internal:** NestJS Microservice trên RabbitMQ queue `expense_queue`

---

## 🔐 Authentication

**Required Headers:**

```http
Authorization: Bearer {JWT_TOKEN}
x-user-id: {USER_ID}
```

---

## 📌 HTTP Endpoints

### Danh sách Endpoints

| Method | Endpoint                | Auth     | Description                   |
| ------ | ----------------------- | -------- | ----------------------------- |
| POST   | `/expenses`             | ✅       | Tạo chi tiêu mới              |
| GET    | `/expenses`             | ✅       | Lấy danh sách chi tiêu        |
| GET    | `/expenses/:id`         | ✅       | Lấy chi tiết chi tiêu         |
| GET    | `/expenses/summary`     | ✅       | Tổng hợp chi tiêu theo period |
| PATCH  | `/expenses/:id`         | ✅       | Cập nhật chi tiêu             |
| DELETE | `/expenses/:id`         | ✅       | Xóa chi tiêu                  |
| GET    | `/expenses/categories`  | ❌       | Lấy danh sách categories      |
| GET    | `/expenses/admin/stats` | ✅ Admin | Thống kê chi tiêu toàn bộ     |

---

## 🔹 Endpoints Chi Tiết

### 1. Tạo Chi Tiêu Mới

**Endpoint:**

```http
POST /api/v1/expenses
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
Content-Type: application/json
```

**Request Body:**

```json
{
  "description": "Lunch at restaurant",
  "amount": 250000,
  "category": "food",
  "spentAt": "2026-01-22"
}
```

**Body Parameters:**

| Field         | Type   | Required | Description                               |
| ------------- | ------ | -------- | ----------------------------------------- |
| `description` | string | ✅       | Mô tả chi tiêu (max 500 chars)            |
| `amount`      | number | ✅       | Số tiền chi (min: 0.01)                   |
| `category`    | string | ❌       | Category slug (e.g., "food", "transport") |
| `spentAt`     | string | ✅       | Ngày chi tiêu (ISO 8601: YYYY-MM-DD)      |

**Response - 201 Created:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "description": "Lunch at restaurant",
  "amount": 250000,
  "category": "food",
  "spentAt": "2026-01-22",
  "ocrJobId": null,
  "isFromOcr": false,
  "ocrConfidence": null,
  "createdAt": "2026-01-22T10:30:00.000Z",
  "updatedAt": "2026-01-22T10:30:00.000Z"
}
```

**Error Responses:**

```json
// 400 Bad Request - Validation error
{
  "statusCode": 400,
  "message": "description should not be empty",
  "timestamp": "2026-01-22T10:30:00.000Z"
}

// 400 Bad Request - Invalid category
{
  "statusCode": 400,
  "message": "Category with slug \"invalid\" does not exist",
  "timestamp": "2026-01-22T10:30:00.000Z"
}

// 400 Bad Request - Amount validation
{
  "statusCode": 400,
  "message": "amount must be greater than or equal to 0.01",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Lunch at restaurant",
    "amount": 250000,
    "category": "food",
    "spentAt": "2026-01-22"
  }'
```

**Workflow:**

1. Validate input data
2. Create expense record
3. Update budget spent amount (if budget exists for category)
4. Emit `EXPENSE_CREATED` event
5. Return created expense

---

### 2. Lấy Danh Sách Chi Tiêu

**Endpoint:**

```http
GET /api/v1/expenses
```

**Query Parameters:**

| Parameter  | Type   | Required | Default | Description              |
| ---------- | ------ | -------- | ------- | ------------------------ |
| `from`     | string | ❌       | -       | From date (YYYY-MM-DD)   |
| `to`       | string | ❌       | -       | To date (YYYY-MM-DD)     |
| `category` | string | ❌       | -       | Filter by category slug  |
| `page`     | number | ❌       | 1       | Page number              |
| `limit`    | number | ❌       | 10      | Items per page (max 100) |

**Response - 200 OK:**

```json
{
  "data": [
    {
      "id": "uuid-1",
      "userId": "user123",
      "description": "Lunch at restaurant",
      "amount": 250000,
      "category": "food",
      "spentAt": "2026-01-22",
      "isFromOcr": false,
      "createdAt": "2026-01-22T10:30:00.000Z",
      "updatedAt": "2026-01-22T10:30:00.000Z"
    },
    {
      "id": "uuid-2",
      "userId": "user123",
      "description": "Taxi",
      "amount": 50000,
      "category": "transport",
      "spentAt": "2026-01-22",
      "isFromOcr": false,
      "createdAt": "2026-01-22T14:00:00.000Z",
      "updatedAt": "2026-01-22T14:00:00.000Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "timestamp": "2026-01-22T15:00:00.000Z"
  }
}
```

**Example cURL:**

```bash
# Get all expenses
curl -X GET "http://localhost:3000/api/v1/expenses" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Filter by category and date range
curl -X GET "http://localhost:3000/api/v1/expenses?category=food&from=2026-01-01&to=2026-01-31" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Pagination
curl -X GET "http://localhost:3000/api/v1/expenses?page=2&limit=20" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 3. Lấy Chi Tiết Chi Tiêu

**Endpoint:**

```http
GET /api/v1/expenses/:id
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response - 200 OK:**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user123",
    "amount": 250000,
    "category": "FOOD",
    "description": "Siêu thị Coopmart",
    "date": "2026-01-22T10:30:00.000Z",
    "receiptUrl": "https://storage.example.com/receipts/abc123.jpg",
    "paymentMethod": "CREDIT_CARD",
    "location": "Coopmart Q1, TPHCM",
    "createdAt": "2026-01-22T10:30:00.000Z",
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Expense not found",
  "timestamp": "2026-01-22T15:00:00.000Z"
}

// 403 Forbidden - Expense belongs to another user
{
  "statusCode": 403,
  "message": "You don't have permission to access this expense",
  "timestamp": "2026-01-22T15:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X GET http://localhost:3000/api/v1/expenses/{expenseId} \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 4. Tổng Hợp Chi Tiêu

Lấy thống kê tổng hợp chi tiêu theo time period (day, week, month, year).

**Endpoint:**

```http
GET /api/v1/expenses/summary
```

**Query Parameters:**

| Parameter | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| `from`    | string | ❌       | From date (YYYY-MM-DD)                                    |
| `to`      | string | ❌       | To date (YYYY-MM-DD)                                      |
| `groupBy` | string | ❌       | Group by: `day`, `week`, `month`, `year` (default: month) |

**Response - 200 OK:**

```json
{
  "total": 8540000,
  "count": 45,
  "byCategory": [
    {
      "category": "food",
      "total": 3200000,
      "count": 18
    },
    {
      "category": "transport",
      "total": 1500000,
      "count": 12
    },
    {
      "category": "entertainment",
      "total": 2000000,
      "count": 8
    },
    {
      "category": "shopping",
      "total": 1840000,
      "count": 7
    }
  ],
  "byTimePeriod": [
    {
      "period": "2026-01-01",
      "total": 450000,
      "count": 3
    },
    {
      "period": "2026-01-02",
      "total": 320000,
      "count": 2
    }
  ]
}
```

**Example cURL:**

```bash
# Summary by category (default)
curl -X GET "http://localhost:3000/api/v1/expenses/summary?from=2026-01-01&to=2026-01-31" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Summary by day
curl -X GET "http://localhost:3000/api/v1/expenses/summary?from=2026-01-01&to=2026-01-31&groupBy=day" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Summary by month
curl -X GET "http://localhost:3000/api/v1/expenses/summary?groupBy=month" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 5. Cập Nhật Chi Tiêu

**Endpoint:**

```http
PATCH /api/v1/expenses/:id
```

**Request Body:**

```json
{
  "description": "Lunch at fancy restaurant",
  "amount": 280000,
  "category": "food",
  "spentAt": "2026-01-22"
}
```

**Body Parameters (all optional):**

| Field         | Type   | Required | Description            |
| ------------- | ------ | -------- | ---------------------- |
| `description` | string | ❌       | New description        |
| `amount`      | number | ❌       | New amount (min: 0.01) |
| `category`    | string | ❌       | New category slug      |
| `spentAt`     | string | ❌       | New date (YYYY-MM-DD)  |

**Response - 200 OK:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "description": "Lunch at fancy restaurant",
  "amount": 280000,
  "category": "food",
  "spentAt": "2026-01-22",
  "isFromOcr": false,
  "updatedAt": "2026-01-22T16:00:00.000Z"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Expense with ID {id} not found",
  "timestamp": "2026-01-22T16:00:00.000Z"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "You do not have access to this expense",
  "timestamp": "2026-01-22T16:00:00.000Z"
}

// 400 Bad Request - Invalid category
{
  "statusCode": 400,
  "message": "Category with slug \"invalid\" does not exist",
  "timestamp": "2026-01-22T16:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X PATCH http://localhost:3000/api/v1/expenses/{expenseId} \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "amount": 280000
  }'
```

---

### 6. Xóa Chi Tiêu

**Endpoint:**

```http
DELETE /api/v1/expenses/:id
```

**Response - 200 OK:**

```json
{
  "message": "Expense deleted successfully"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Expense with ID {id} not found",
  "timestamp": "2026-01-22T16:00:00.000Z"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "You do not have access to this expense",
  "timestamp": "2026-01-22T16:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/expenses/{expenseId} \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 7. Lấy Danh Sách Categories

Lấy danh sách tất cả categories available (public endpoint).

**Endpoint:**

```http
GET /api/v1/expenses/categories
```

**Response - 200 OK:**

```json
[
  { "slug": "food", "name": "Food & Dining" },
  { "slug": "transport", "name": "Transportation" },
  { "slug": "shopping", "name": "Shopping" },
  { "slug": "entertainment", "name": "Entertainment" },
  { "slug": "utilities", "name": "Utilities" },
  { "slug": "healthcare", "name": "Healthcare" },
  { "slug": "education", "name": "Education" },
  { "slug": "travel", "name": "Travel" },
  { "slug": "housing", "name": "Housing" },
  { "slug": "insurance", "name": "Insurance" },
  { "slug": "personal", "name": "Personal Care" },
  { "slug": "gifts", "name": "Gifts & Donations" },
  { "slug": "investments", "name": "Investments" },
  { "slug": "other", "name": "Other" }
]
```

**Example cURL:**

```bash
curl -X GET http://localhost:3000/api/v1/expenses/categories
```

---

### 8. Thống Kê Admin

Admin endpoint để xem thống kê chi tiêu toàn bộ users.

**Endpoint:**

```http
GET /api/v1/expenses/admin/stats
```

**Headers:**

```http
Authorization: Bearer {admin_token}
x-user-id: {admin_userId}
```

**Response - 200 OK:**

```json
{
  "totalExpenses": 5420,
  "totalAmount": 2850000000,
  "totalUsers": 1850,
  "byCategory": [
    {
      "category": "food",
      "total": 950000000,
      "count": 1850
    },
    {
      "category": "transport",
      "total": 580000000,
      "count": 920
    },
    {
      "category": "shopping",
      "total": 650000000,
      "count": 1100
    }
  ],
  "recentExpenses": [
    {
      "id": "uuid-1",
      "userId": "user456",
      "description": "Recent expense",
      "amount": 150000,
      "category": "food",
      "spentAt": "2026-01-22",
      "createdAt": "2026-01-22T15:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

```json
// 403 Forbidden - Not admin
{
  "statusCode": 403,
  "message": "Only administrators can access this endpoint",
  "timestamp": "2026-01-22T15:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X GET "http://localhost:3000/api/v1/expenses/admin/stats" \
  -H "Authorization: Bearer {admin_token}" \
  -H "x-user-id: admin123"
```

---

## 💡 Use Cases & Examples

### Use Case 1: Thêm Chi Tiêu Nhanh

```javascript
const addQuickExpense = async (amount, category, description) => {
  const response = await fetch('http://localhost:3000/api/v1/expenses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      category,
      description,
      spentAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    }),
  });

  if (response.ok) {
    const result = await response.json();
    showSuccess(`Expense added: ${result.description}`);
    refreshExpenseList();
  } else {
    showError('Failed to add expense');
  }
};
```

### Use Case 2: Hiển Thị Biểu Đồ Chi Tiêu

```javascript
const displayExpenseChart = async () => {
  // Get current month range
  const now = new Date();
  const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const response = await fetch(
    `http://localhost:3000/api/v1/expenses/summary?from=${from}&to=${to}&groupBy=month`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
    },
  );

  const summary = await response.json();

  // Render pie chart
  const chartData = summary.byCategory.map((item) => ({
    label: item.category,
    value: item.total,
    count: item.count,
  }));

  renderPieChart(chartData);
};
```

### Use Case 3: Lấy Chi Tiết Một Chi Tiêu

```javascript
const getExpenseDetail = async (expenseId) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/expenses/${expenseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
    },
  );

  if (response.ok) {
    const expense = await response.json();
    displayExpenseModal({
      description: expense.description,
      amount: expense.amount.toLocaleString('vi-VN'),
      category: expense.category,
      date: new Date(expense.spentAt).toLocaleDateString('vi-VN'),
      isFromOcr: expense.isFromOcr,
      confidence: expense.ocrConfidence,
    });
  }
};
```

---

## 🧪 Testing Examples

```
POST http://localhost:3000/api/v1/expenses
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
Body:
{
  "amount": 250000,
  "category": "FOOD",
  "description": "Test expense",
  "date": "2026-01-22T10:00:00.000Z"
}
```

---

## 📞 Support & Contact

- **Service Name:** Expense Service
- **Default Port:** 3006 (microservice), 3000 (via Gateway)
- **RabbitMQ Queue:** `expense_queue`
- **Database:** PostgreSQL (Prisma)

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
