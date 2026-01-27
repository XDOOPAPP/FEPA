# Admin Token Authentication Debugging Guide

## Tổng quan

Hướng dẫn này giúp admin kiểm tra và khắc phục các vấn đề liên quan đến authentication/authorization khi gọi subscription API.

## Các vấn đề thường gặp

### 1. **401 Unauthorized Error**

**Nguyên nhân:**

- Access token không tồn tại trong localStorage
- Access token đã hết hạn
- Token không hợp lệ

**Cách khắc phục:**

1. Mở trang `/admin/debug` để kiểm tra trạng thái token
2. Nếu token expired, logout và login lại
3. Kiểm tra browser console (F12) để xem log chi tiết

### 2. **403 Forbidden Error**

**Nguyên nhân:**

- User không có role `ADMIN`
- Token hợp lệ nhưng không có quyền truy cập

**Cách khắc phục:**

1. Kiểm tra role trong token tại trang `/admin/debug`
2. Đảm bảo đăng nhập với tài khoản admin
3. Liên hệ super admin để được cấp quyền

### 3. **Token không được gửi lên server**

**Nguyên nhân:**

- localStorage không có accessToken
- AxiosInstance không tự động thêm token vào header

**Cách khắc phục:**

1. Kiểm tra localStorage: `localStorage.getItem('accessToken')`
2. Xem network tab trong browser để kiểm tra request header
3. Đảm bảo Authorization header có format: `Bearer {token}`

## Công cụ Debug

### 1. **AuthDebugPanel Component**

Component hiển thị trạng thái authentication trên dashboard.

**Location:** `src/components/AuthDebugPanel.tsx`

**Sử dụng:**

```tsx
import { AuthDebugPanel } from '../components/AuthDebugPanel'

// Hiển thị compact version
<AuthDebugPanel compact />

// Hiển thị full version
<AuthDebugPanel />
```

### 2. **Admin Debug Page**

Trang debug đầy đủ với các công cụ test API.

**URL:** `/admin/debug` (chỉ hiển thị trong development mode)

**Tính năng:**

- Hiển thị chi tiết token (userId, email, role, expiry)
- Test tất cả subscription endpoints
- Copy token to clipboard
- Logout và clear tokens
- Log token info to console

### 3. **Auth Utilities**

Các helper functions để làm việc với tokens.

**Location:** `src/utils/authUtils.ts`

**Functions:**

```typescript
import {
  validateAdminToken, // Kiểm tra token có valid không
  isAdmin, // Kiểm tra user có role ADMIN không
  isTokenExpired, // Kiểm tra token đã hết hạn chưa
  debugToken, // Log token info to console
  getUserFromToken, // Lấy thông tin user từ token
} from "../utils/authUtils";

// Example usage
const validation = validateAdminToken();
if (!validation.valid) {
  console.error("Token invalid:", validation.error);
}

// Debug in console
debugToken();
```

## Subscription API Error Handling

Tất cả subscription API calls hiện đã có error logging chi tiết:

### Console Logs

Khi gọi API thất bại, bạn sẽ thấy logs như:

```
❌ Failed to fetch subscription stats: {error details}
🔐 Unauthorized - Token may be invalid or missing ADMIN role
```

### Admin Endpoints

Các endpoints yêu cầu ADMIN role:

- `POST /api/v1/subscriptions/plans` - Tạo plan mới
- `PATCH /api/v1/subscriptions/plans/:id` - Cập nhật plan
- `DELETE /api/v1/subscriptions/plans/:id` - Xóa plan
- `GET /api/v1/subscriptions/admin/stats` - Thống kê
- `GET /api/v1/subscriptions/stats/revenue-over-time` - Doanh thu theo thời gian
- `GET /api/v1/subscriptions/stats/total-revenue` - Tổng doanh thu
- `GET /api/v1/subscriptions/stats/revenue-by-plan` - Doanh thu theo gói

## Quy trình kiểm tra lỗi

### Bước 1: Kiểm tra Token Status

```bash
# Trong browser console (F12)
localStorage.getItem('accessToken')
```

### Bước 2: Decode Token

```bash
# Truy cập trang debug
https://your-domain.com/admin/debug

# Hoặc sử dụng jwt.io để decode token thủ công
```

### Bước 3: Test API Endpoints

1. Mở trang `/admin/debug`
2. Click "Test All Subscription Endpoints"
3. Xem kết quả test

### Bước 4: Kiểm tra Network Request

1. Mở DevTools (F12) → Network tab
2. Filter: `subscriptions`
3. Click vào request
4. Kiểm tra:
   - Request Headers → Authorization: Bearer {token}
   - Response → Status code và error message

### Bước 5: Kiểm tra Backend Logs

Nếu frontend gửi token đúng nhưng vẫn lỗi, kiểm tra backend logs để xem:

- Token có được nhận không
- JWT verification có thành công không
- Role check có pass không

## Backend Requirements

### JWT Structure

Backend phải trả về JWT token với payload:

```json
{
  "userId": "string",
  "email": "string",
  "role": "ADMIN", // hoặc "admin"
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Response Format

Backend phải trả về 401 với message rõ ràng:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "No token provided" // hoặc "Token expired", "Invalid token"
}
```

## Troubleshooting Checklist

- [ ] Token tồn tại trong localStorage?
- [ ] Token chưa hết hạn? (exp > current time)
- [ ] Token có role = ADMIN?
- [ ] Request header có Authorization: Bearer {token}?
- [ ] Backend API có đang chạy?
- [ ] Backend có yêu cầu CORS configuration?
- [ ] Network request có bị block bởi firewall/antivirus?

## Development Tips

### Enable Debug Mode

```typescript
// Trong development, AuthDebugPanel sẽ tự động hiển thị
process.env.NODE_ENV === "development";
```

### Quick Token Check

```typescript
import { debugToken } from "./utils/authUtils";

// Anywhere in your code
debugToken();
```

### Test Authentication Flow

1. Login với admin account
2. Kiểm tra token tại `/admin/debug`
3. Test một vài API calls
4. Kiểm tra browser console logs
5. Kiểm tra network tab

## Support

Nếu vẫn gặp vấn đề sau khi thử tất cả các bước trên:

1. Export token info từ `/admin/debug`
2. Copy browser console logs
3. Screenshot network tab
4. Liên hệ backend team với thông tin trên

---

**Last Updated:** 2026-01-26  
**Version:** 1.0
