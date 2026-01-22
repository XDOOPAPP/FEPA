# Hướng dẫn Chi tiết Sử dụng Endpoint Subscription Service

## 📋 Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Xác thực](#xác-thực)
3. [Các Plans (Gói)](#các-plans-gói)
4. [Quản lý Subscription (Đăng ký)](#quản-lý-subscription-đăng-ký)
5. [Thống kê (Admin)](#thống-kê-admin)
6. [Trạng thái Subscription](#trạng-thái-subscription)
7. [Ví dụ thực tế](#ví-dụ-thực-tế)
8. [Mã lỗi](#mã-lỗi)

---

## 🚀 Giới thiệu

Subscription Service cung cấp các endpoint để quản lý các gói dịch vụ (Plans) và đăng ký của người dùng. Service này được xây dựng bằng Node.js/Express và sử dụng MongoDB để lưu trữ dữ liệu.

### Base URL

```
http://localhost:PORT/api/v1/subscriptions
```

### Các tính năng chính:

- ✅ Xem các gói dịch vụ available
- ✅ Đăng ký subscription
- ✅ Hủy subscription
- ✅ Xem lịch sử subscription
- ✅ Quản lý plans (tạo, cập nhật, vô hiệu hóa)
- ✅ Kiểm tra các features có sẵn cho user
- ✅ Xem thống kê (Admin)

---

## 🔐 Xác thực

### Yêu cầu Header

Hầu hết các endpoint yêu cầu JWT token trong header:

```http
Authorization: Bearer {token}
```

### Token Payload

Token JWT phải chứa thông tin user:

```json
{
  "userId": "user_id_123",
  "email": "user@example.com"
}
```

### Endpoint không cần xác thực:

- `GET /api/v1/subscriptions/health` - Kiểm tra sức khỏe service
- `GET /api/v1/subscriptions/plans` - Xem danh sách plans
- `GET /api/v1/subscriptions/plans/:id` - Xem chi tiết plan
- `GET /api/v1/subscriptions/internal/user-features/:userId` - Kiểm tra features (internal)

---

## 📦 Các Plans (Gói)

### 1. Xem danh sách tất cả Plans

```http
GET /api/v1/subscriptions/plans
```

**Yêu cầu xác thực:** ❌ Không

**Response (200):**

```json
[
  {
    "_id": "6789abcdef123456",
    "name": "Free Plan",
    "price": 0,
    "interval": "MONTHLY",
    "features": {
      "OCR": false,
      "AI": false
    },
    "isFree": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "7890bcdef123456a",
    "name": "Pro Plan",
    "price": 99,
    "interval": "MONTHLY",
    "features": {
      "OCR": true,
      "AI": false
    },
    "isFree": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "8901cdef123456ab",
    "name": "Premium Plan",
    "price": 299,
    "interval": "YEARLY",
    "features": {
      "OCR": true,
      "AI": true
    },
    "isFree": false,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. Xem chi tiết một Plan

```http
GET /api/v1/subscriptions/plans/:id
```

**Yêu cầu xác thực:** ❌ Không

**Tham số:**

- `id` (string, required) - ID của plan

**Example:**

```http
GET /api/v1/subscriptions/plans/6789abcdef123456
```

**Response (200):**

```json
{
  "_id": "6789abcdef123456",
  "name": "Free Plan",
  "price": 0,
  "interval": "MONTHLY",
  "features": {
    "OCR": false,
    "AI": false
  },
  "isFree": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 3. Tạo Plan (Admin)

```http
POST /api/v1/subscriptions/plans
```

**Yêu cầu xác thực:** ✅ Có

**Request Body:**

```json
{
  "name": "Starter Plan",
  "price": 49,
  "interval": "MONTHLY",
  "features": {
    "OCR": true,
    "AI": false
  },
  "isFree": false,
  "isActive": true
}
```

**Các trường:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|---------|-------|
| `name` | String | ✅ | Tên của plan |
| `price` | Number | ✅ | Giá (VND) |
| `interval` | String | ✅ | Chu kỳ: `MONTHLY`, `YEARLY`, `LIFETIME` |
| `features.OCR` | Boolean | ✅ | Có sử dụng tính năng OCR không |
| `features.AI` | Boolean | ✅ | Có sử dụng tính năng AI không |
| `isFree` | Boolean | ✅ | Là plan miễn phí không |
| `isActive` | Boolean | ✅ | Plan có hoạt động không |

**Response (201):**

```json
{
  "_id": "9012def123456abc",
  "name": "Starter Plan",
  "price": 49,
  "interval": "MONTHLY",
  "features": {
    "OCR": true,
    "AI": false
  },
  "isFree": false,
  "isActive": true,
  "createdAt": "2024-01-22T14:25:00Z",
  "updatedAt": "2024-01-22T14:25:00Z"
}
```

**Lỗi:**

- `400` - Nếu tạo Free Plan nhưng đã tồn tại Free Plan
- `400` - Nếu thiếu trường bắt buộc

---

### 4. Cập nhật Plan (Admin)

```http
PATCH /api/v1/subscriptions/plans/:id
```

**Yêu cầu xác thực:** ✅ Có

**Tham số:**

- `id` (string, required) - ID của plan

**Request Body (tất cả trường tùy chọn):**

```json
{
  "name": "Pro Plan Updated",
  "price": 119,
  "interval": "YEARLY",
  "features": {
    "OCR": true,
    "AI": true
  },
  "isActive": true
}
```

**Response (200):**

```json
{
  "_id": "7890bcdef123456a",
  "name": "Pro Plan Updated",
  "price": 119,
  "interval": "YEARLY",
  "features": {
    "OCR": true,
    "AI": true
  },
  "isFree": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-22T14:30:00Z"
}
```

**Lỗi:**

- `400` - Không thể sửa hoặc vô hiệu hóa Free Plan
- `404` - Plan không tìm thấy

---

### 5. Vô hiệu hóa Plan (Admin)

```http
DELETE /api/v1/subscriptions/plans/:id
```

**Yêu cầu xác thực:** ✅ Có

**Tham số:**

- `id` (string, required) - ID của plan

**Example:**

```http
DELETE /api/v1/subscriptions/plans/7890bcdef123456a
```

**Response (200):**

```json
{
  "message": "Plan disabled"
}
```

**Lỗi:**

- `400` - Không thể vô hiệu hóa Free Plan
- `404` - Plan không tìm thấy

---

## 📱 Quản lý Subscription (Đăng ký)

### 1. Xem Subscription hiện tại

```http
GET /api/v1/subscriptions/current
```

**Yêu cầu xác thực:** ✅ Có

**Response (200):**

```json
{
  "_id": "123abc456def",
  "userId": "user_123",
  "planId": {
    "_id": "7890bcdef123456a",
    "name": "Pro Plan",
    "price": 99,
    "interval": "MONTHLY",
    "features": {
      "OCR": true,
      "AI": false
    },
    "isFree": false,
    "isActive": true
  },
  "status": "ACTIVE",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-02-01T00:00:00Z",
  "cancelledAt": null,
  "paymentRef": "PAY_123456",
  "createdAt": "2024-01-01T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

**Nếu không có subscription active:**

```json
null
```

---

### 2. Đăng ký (Subscribe)

```http
POST /api/v1/subscriptions
```

**Yêu cầu xác thực:** ✅ Có

**Request Body:**

```json
{
  "planId": "7890bcdef123456a"
}
```

**Các trường:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|---------|-------|
| `planId` | String | ✅ | ID của plan cần đăng ký |

**Response (201):**

```json
{
  "_id": "234bcd567efg",
  "userId": "user_123",
  "planId": "7890bcdef123456a",
  "status": "PENDING",
  "startDate": "2024-01-22T14:35:00Z",
  "endDate": "2024-02-22T14:35:00Z",
  "cancelledAt": null,
  "paymentRef": null,
  "createdAt": "2024-01-22T14:35:00Z",
  "updatedAt": "2024-01-22T14:35:00Z"
}
```

**Lỗi:**

- `400` - Thiếu `planId`
- `404` - Plan không tìm thấy hoặc không hoạt động
- `409` - User đã có subscription active

**Ghi chú:**

- Subscription mới có trạng thái `PENDING`
- Sẽ chuyển sang `ACTIVE` sau khi thanh toán thành công
- `endDate` được tính dựa vào `interval` của plan

---

### 3. Hủy Subscription

```http
POST /api/v1/subscriptions/cancel
```

**Yêu cầu xác thực:** ✅ Có

**Request Body:** (không cần)

```json
{}
```

**Response (200):**

```json
{
  "message": "Subscription cancelled"
}
```

**Lỗi:**

- `404` - Không có subscription active để hủy

**Ghi chú:**

- Chỉ có thể hủy subscription `ACTIVE`
- Trạng thái sẽ chuyển sang `CANCELLED`

---

### 4. Xem lịch sử Subscription

```http
GET /api/v1/subscriptions/history
```

**Yêu cầu xác thực:** ✅ Có

**Query Parameters:** (không có)

**Response (200):**

```json
[
  {
    "_id": "234bcd567efg",
    "userId": "user_123",
    "planId": {
      "_id": "7890bcdef123456a",
      "name": "Pro Plan",
      "price": 99,
      "interval": "MONTHLY",
      "features": {
        "OCR": true,
        "AI": false
      },
      "isFree": false,
      "isActive": true
    },
    "status": "CANCELLED",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-02-01T00:00:00Z",
    "cancelledAt": "2024-01-15T10:30:00Z",
    "paymentRef": "PAY_123456",
    "createdAt": "2024-01-01T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "345cde678fgh",
    "userId": "user_123",
    "planId": {
      "_id": "6789abcdef123456",
      "name": "Free Plan",
      "price": 0,
      "interval": "MONTHLY",
      "features": {
        "OCR": false,
        "AI": false
      },
      "isFree": true,
      "isActive": true
    },
    "status": "ACTIVE",
    "startDate": "2024-01-15T10:30:00Z",
    "endDate": "2024-02-15T10:30:00Z",
    "cancelledAt": null,
    "paymentRef": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### 5. Kiểm tra Features của User

```http
GET /api/v1/subscriptions/internal/user-features/:userId
```

**Yêu cầu xác thực:** ❌ Không (Internal endpoint)

**Tham số:**

- `userId` (string, required) - ID của user

**Example:**

```http
GET /api/v1/subscriptions/internal/user-features/user_123
```

**Response (200):**

```json
{
  "OCR": true,
  "AI": false
}
```

**Ghi chú:**

- Endpoint này dùng để các service khác kiểm tra features của user
- Nếu user không có subscription active, trả về features của Free Plan
- Nếu không tồn tại Free Plan, trả về `{ OCR: false, AI: false }`

---

## 📊 Thống kê (Admin)

### 1. Xem thống kê

```http
GET /api/v1/subscriptions/admin/stats
```

**Yêu cầu xác thực:** ✅ Có

**Response (200):**

```json
{
  "6789abcdef123456": {
    "name": "Free Plan",
    "count": 150
  },
  "7890bcdef123456a": {
    "name": "Pro Plan",
    "count": 45
  },
  "8901cdef123456ab": {
    "name": "Premium Plan",
    "count": 12
  }
}
```

**Ghi chú:**

- Chỉ đếm subscription `ACTIVE`
- Áp dụng cho admin để theo dõi tình hình sử dụng các plans

---

## 🔄 Trạng thái Subscription

Subscription có thể ở một trong các trạng thái sau:

| Trạng thái  | Mô tả                                 |
| ----------- | ------------------------------------- |
| `PENDING`   | Đơn đăng ký mới, chờ thanh toán       |
| `ACTIVE`    | Subscription đang hoạt động và hợp lệ |
| `CANCELLED` | Subscription đã bị hủy bởi user       |
| `EXPIRED`   | Subscription đã hết hạn (tự động)     |

### Quy trình chuyển trạng thái:

```
┌─────────┐
│ PENDING │  (Ngay sau khi user đăng ký)
└────┬────┘
     │ (Thanh toán thành công - sự kiện PAYMENT_SUCCESS)
     ▼
┌────────┐
│ ACTIVE │  (Subscription đang hoạt động)
└────┬────┘
     │
     ├─→ CANCELLED  (User hủy đăng ký)
     │
     └─→ EXPIRED    (Hết hạn - tự động mỗi 5 phút)
```

---

## 💡 Ví dụ thực tế

### Ví dụ 1: User mới đăng ký Free Plan

#### Bước 1: Xem danh sách plans

```bash
curl -X GET http://localhost:3004/api/v1/subscriptions/plans
```

#### Bước 2: Đăng ký Free Plan

```bash
curl -X POST http://localhost:3004/api/v1/subscriptions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "6789abcdef123456"
  }'
```

#### Bước 3: Kiểm tra subscription hiện tại

```bash
curl -X GET http://localhost:3004/api/v1/subscriptions/current \
  -H "Authorization: Bearer {token}"
```

---

### Ví dụ 2: User nâng cấp từ Free sang Pro

#### Bước 1: Hủy Free Plan

```bash
curl -X POST http://localhost:3004/api/v1/subscriptions/cancel \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Bước 2: Đăng ký Pro Plan

```bash
curl -X POST http://localhost:3004/api/v1/subscriptions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "7890bcdef123456a"
  }'
```

#### Bước 3: Thực hiện thanh toán (qua Payment Service)

- Service nhận sự kiện `PAYMENT_SUCCESS`
- Subscription tự động chuyển sang `ACTIVE`

---

### Ví dụ 3: Admin tạo plan mới

```bash
curl -X POST http://localhost:3004/api/v1/subscriptions/plans \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Business Plan",
    "price": 499,
    "interval": "YEARLY",
    "features": {
      "OCR": true,
      "AI": true
    },
    "isFree": false,
    "isActive": true
  }'
```

---

### Ví dụ 4: Kiểm tra features của user (từ service khác)

```bash
# Từ API Gateway hoặc service khác
curl -X GET http://localhost:3004/api/v1/subscriptions/internal/user-features/user_123
```

Response:

```json
{
  "OCR": true,
  "AI": true
}
```

---

## ❌ Mã lỗi

### 400 Bad Request

**Nguyên nhân:**

- Thiếu trường bắt buộc
- Giá trị không hợp lệ
- Logic kinh doanh bị vi phạm (ví dụ: user đã có subscription active)

**Ví dụ:**

```json
{
  "message": "planId is required"
}
```

### 401 Unauthorized

**Nguyên nhân:**

- Thiếu JWT token
- Token không hợp lệ
- Token đã hết hạn

**Ví dụ:**

```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found

**Nguyên nhân:**

- Plan/Subscription không tìm thấy
- Resource đã bị xóa

**Ví dụ:**

```json
{
  "message": "Plan not found"
}
```

### 409 Conflict

**Nguyên nhân:**

- User đã có subscription active
- Tạo Free Plan nhưng đã tồn tại Free Plan

**Ví dụ:**

```json
{
  "message": "User already has an active subscription"
}
```

### 500 Internal Server Error

**Nguyên nhân:**

- Lỗi database
- Lỗi trong xử lý service

**Ví dụ:**

```json
{
  "message": "Internal server error"
}
```

---

## 🔗 Integration với Services khác

### Event Bus (RabbitMQ)

**Subscription Service đăng ký các sự kiện:**

1. **USER_CREATED** - Khi user mới được tạo
   - Tự động tạo Free subscription nếu tồn tại Free Plan
2. **PAYMENT_SUCCESS** - Khi thanh toán thành công
   - Cập nhật subscription từ `PENDING` → `ACTIVE`

**Subscription Service phát hành các sự kiện:**

1. **PLAN_CREATED** - Khi plan mới được tạo

   ```json
   {
     "planId": "...",
     "name": "...",
     "price": 0,
     "interval": "MONTHLY",
     "isActive": true,
     "isFree": true
   }
   ```

2. **PLAN_UPDATED** - Khi plan được cập nhật
3. **SUBSCRIPTION_EXPIRED** - Khi subscription hết hạn (tự động mỗi 5 phút)
   ```json
   {
     "userId": "...",
     "planId": "...",
     "planName": "...",
     "endDate": "..."
   }
   ```

---

## 📝 Ghi chú quan trọng

1. **Automatic Expiration Check**
   - Service chạy kiểm tra subscription hết hạn mỗi 5 phút
   - Nếu `endDate` < hiện tại, status chuyển sang `EXPIRED`
   - Phát hành event `SUBSCRIPTION_EXPIRED`

2. **Free Plan**
   - Chỉ có 1 Free Plan duy nhất trong hệ thống
   - Không thể sửa hoặc vô hiệu hóa Free Plan
   - User mới tự động nhận Free subscription

3. **Plan Intervals**
   - `MONTHLY` - 1 tháng
   - `YEARLY` - 1 năm
   - `LIFETIME` - Vĩnh viễn (endDate = null)

4. **Features**
   - Mỗi plan có các features: OCR, AI
   - Endpoint `/internal/user-features/:userId` giúp các service khác kiểm tra

---

## 🧪 Health Check

```http
GET /api/v1/subscriptions/health
```

**Response (200):**

```json
{
  "status": "ok",
  "service": "subscription-service"
}
```

---

## 📞 Support

Nếu có bất kỳ câu hỏi hoặc vấn đề, vui lòng liên hệ với team phát triển.
