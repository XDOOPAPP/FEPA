# API Configuration Guide

## 📍 Nơi tập trung quản lý URLs & Endpoints

Tất cả các URLs và Endpoints của hệ thống được định nghĩa tại một nơi duy nhất: **`src/config/api.config.ts`**

---

## 🎯 Cách Sử Dụng

### 1. **Import config trong API files:**

```typescript
import { API_CONFIG } from "../../config/api.config";
```

### 2. **Sử dụng endpoints từ config:**

```typescript
// Thay vì:
const response = await axiosInstance.get("/auth/login");

// Dùng:
const response = await axiosInstance.get(API_CONFIG.AUTH.LOGIN);
```

---

## 📋 Cấu Trúc Config

Config được chia thành các nhóm chính:

### **Base URLs**

- `API_CONFIG.BASE_URL` - URL API server
- `API_CONFIG.SOCKET_URL` - URL Socket.IO

### **Endpoints Groups**

- `API_CONFIG.AUTH` - Endpoints liên quan đến authentication
- `API_CONFIG.SUBSCRIPTIONS` - Endpoints liên quan đến subscriptions
- `API_CONFIG.BUDGETS` - Endpoints liên quan đến budgets
- `API_CONFIG.CATEGORIES` - Endpoints liên quan đến categories
- `API_CONFIG.EXPENSES` - Endpoints liên quan đến expenses
- `API_CONFIG.BLOGS` - Endpoints liên quan đến blogs
- `API_CONFIG.NOTIFICATIONS` - Endpoints liên quan đến notifications
- `API_CONFIG.SYSTEM` - Endpoints hệ thống

---

## 🔄 Nếu Muốn Thay Đổi URL

**Chỉ cần thay đổi tại 1 nơi**: File `.env` hoặc `.env.local`

```env
# Thay đổi base URL
VITE_API_BASE_URL=http://new-api-server:3000/api/v1

# Thay đổi Socket URL
VITE_SOCKET_URL=http://new-socket-server:3000
```

**Không cần sửa ở các file API khác!**

---

## 📌 Ví Dụ Sử Dụng

### Gọi API Subscription

```typescript
import { API_CONFIG } from "../../config/api.config";

// Lấy danh sách plans
const getPlans = async () => {
  const response = await axiosInstance.get(API_CONFIG.SUBSCRIPTIONS.PLANS);
  return response.data;
};

// Lấy chi tiết plan
const getPlanDetail = async (id: string) => {
  const response = await axiosInstance.get(
    API_CONFIG.SUBSCRIPTIONS.PLAN_DETAIL(id)
  );
  return response.data;
};
```

### Gọi API Auth

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};
```

### Gọi API Expense

```typescript
// Get expenses by date range
const getByDateRange = async (startDate: string, endDate: string) => {
  const response = await axiosInstance.get(API_CONFIG.EXPENSES.BY_DATE_RANGE, {
    params: { startDate, endDate },
  });
  return response.data;
};
```

---

## ✅ Lợi Ích Của Cách Làm Này

1. ✅ **Một nơi quản lý** - Tất cả URLs ở một file duy nhất
2. ✅ **Dễ bảo trì** - Không cần sửa ở nhiều nơi
3. ✅ **Type-safe** - Có IDE autocomplete
4. ✅ **Dễ mở rộng** - Thêm endpoint mới rất dễ
5. ✅ **Nhất quán** - Không có URL bị hardcode rải rác
6. ✅ **Dễ test** - Có thể mock config dễ dàng

---

## 📝 Thêm Endpoint Mới

Nếu backend thêm endpoint mới, chỉ cần:

1. Thêm vào `src/config/api.config.ts`:

```typescript
// Ví dụ: Thêm endpoint mới cho Reports
REPORTS: {
  LIST: '/reports',
  DETAIL: (id: string) => `/reports/${id}`,
  EXPORT: '/reports/export',
}
```

2. Sử dụng trong API file:

```typescript
const getReports = async () => {
  const response = await axiosInstance.get(API_CONFIG.REPORTS.LIST);
  return response.data;
};
```

---

## 🔗 Files Được Update

- `src/config/api.config.ts` _(NEW)_ - Config tập trung
- `src/config/index.ts` _(NEW)_ - Export config
- `src/services/api/axiosInstance.ts` - Sử dụng config
- `src/services/api/authAPI.ts` - Sử dụng config
- `src/services/api/subscriptionAPI.ts` - Sử dụng config
- `src/services/api/budgetAPI.ts` - Sử dụng config
- `src/services/api/categoryAPI.ts` - Sử dụng config
- `src/services/api/expenseAPI.ts` - Sử dụng config
- `src/services/apiClient.ts` - Sử dụng config
- `src/services/socket.ts` - Sử dụng config
- `.env.example` - Cập nhật comment

---

## ❓ FAQ

**Q: Endpoint này dùng ở đâu?**  
A: Tìm trong config file, sẽ thấy URL + comment mô tả

**Q: Muốn thêm endpoint mới?**  
A: Thêm vào `src/config/api.config.ts` rồi sử dụng bình thường

**Q: Hardcode URL trong component được không?**  
A: Không, phải import config và sử dụng từ config
