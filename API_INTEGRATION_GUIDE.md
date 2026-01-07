# Hướng Dẫn Tích Hợp API cho Webadmin

## 📋 Tổng Quan

Webadmin (frontend) hiện đã được tích hợp hoàn chỉnh với auth-service (backend) qua các service layer. Đây là hướng dẫn chi tiết về cách hoạt động và cách sử dụng.

---

## 🏗️ Cấu Trúc Service Layer

### 1. **axiosInstance.ts** - Axios Configuration
📍 Đường dẫn: `src/services/api/axiosInstance.ts`

#### Chức năng:
- Tạo axios instance với base URL: `http://localhost:3000/api/v1`
- Tự động thêm JWT token vào header của mọi request
- Tự động refresh token khi hết hạn (401 error)
- Xử lý lỗi và redirect về login khi cần

#### Cách hoạt động:

```typescript
// Request Interceptor - Thêm token vào mọi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor - Tự động refresh token
axiosInstance.interceptors.response.use(
  (response) => response.data,  // Trả về data luôn cho gọn
  async (error) => {
    if (error.response?.status === 401) {
      // Thử refresh token
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.post('/auth/refresh', { refreshToken })
      
      // Lưu tokens mới
      localStorage.setItem('accessToken', response.data.data.accessToken)
      localStorage.setItem('refreshToken', response.data.data.refreshToken)
      
      // Thử lại request ban đầu
      return axiosInstance(originalRequest)
    }
  }
)
```

#### Ưu điểm:
✅ Không cần thêm token thủ công cho mỗi request
✅ Token tự động được refresh khi hết hạn
✅ Code gọn gàng hơn (chỉ cần gọi authAPI.login() thay vì axiosInstance.post())

---

### 2. **authAPI.ts** - Authentication APIs
📍 Đường dẫn: `src/services/api/authAPI.ts`

#### Các API có sẵn:

| API Function | Endpoint | Method | Payload | Response |
|-------------|----------|--------|---------|----------|
| `login()` | `/auth/login` | POST | `{email, password}` | `{accessToken, refreshToken, user}` |
| `register()` | `/auth/register` | POST | `{email, password, fullName}` | `{message}` |
| `verifyOtp()` | `/auth/verify-otp` | POST | `{email, otp}` | `{success}` |
| `forgotPassword()` | `/auth/forgot-password` | POST | `{email}` | `{message}` |
| `resetPassword()` | `/auth/reset-password` | POST | `{email, otp, newPassword}` | `{success}` |
| `getCurrentUser()` | `/auth/me` | GET | - | `{user}` |
| `refreshToken()` | `/auth/refresh` | POST | `{refreshToken}` | `{accessToken, refreshToken}` |
| `healthCheck()` | `/auth/health` | GET | - | `{status}` |

#### Ví dụ sử dụng trong component:

```typescript
import { authAPI } from '../../services/api/authAPI'

// Trong component
const handleLogin = async () => {
  try {
    const response = await authAPI.login({
      email: 'user@example.com',
      password: '123456'
    })
    
    // Lưu tokens
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    navigate('/dashboard')
  } catch (error) {
    message.error(error.message)
  }
}
```

---

### 3. **storage.ts** - Token Management
📍 Đường dẫn: `src/utils/storage.ts`

#### Các hàm tiện ích:

```typescript
// Lưu tokens
storage.setTokens(accessToken, refreshToken)

// Lấy token
const token = storage.getAccessToken()

// Lưu user info
storage.setUser(user)

// Lấy user info
const user = storage.getUser()

// Xóa tất cả (logout)
storage.clearAll()

// Kiểm tra đã login chưa
if (storage.isAuthenticated()) {
  // User đã login
}
```

---

## 🔐 Flow Đăng Nhập (Login Flow)

### LoginPage.tsx
```
User nhập email & password
        ↓
Gọi authAPI.login({email, password})
        ↓
Backend xác thực user
        ↓
Trả về: {accessToken, refreshToken, user}
        ↓
Lưu vào localStorage:
  - accessToken
  - refreshToken  
  - user (JSON)
        ↓
Navigate to /dashboard
```

### Code thực tế:
```typescript
const onFinish = async (values) => {
  try {
    setLoading(true)
    
    const response = await authAPI.login({
      email: values.email,
      password: values.password,
    })
    
    // Lưu vào localStorage
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    message.success('Đăng nhập thành công!')
    navigate('/dashboard')
  } catch (error) {
    message.error(error.message || 'Email hoặc mật khẩu không đúng')
  } finally {
    setLoading(false)
  }
}
```

---

## 📝 Flow Đăng Ký (Register Flow)

### RegisterPage.tsx - 2 bước
```
Bước 1: Đăng ký
User nhập fullName, email, password
        ↓
Gọi authAPI.register({fullName, email, password})
        ↓
Backend tạo account và gửi OTP qua email
        ↓
Hiện Modal nhập OTP
        ↓
Bước 2: Xác thực OTP
User nhập mã OTP 6 số
        ↓
Gọi authAPI.verifyOtp({email, otp})
        ↓
Backend kích hoạt tài khoản
        ↓
Navigate to /login
```

### Code thực tế:
```typescript
// Bước 1: Đăng ký
const onFinish = async (values) => {
  try {
    await authAPI.register({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
    })
    
    setRegisteredEmail(values.email)
    message.success('Vui lòng kiểm tra email để lấy mã OTP')
    setOtpModalVisible(true)  // Hiện modal OTP
  } catch (error) {
    message.error(error.message)
  }
}

// Bước 2: Xác thực OTP
const handleVerifyOtp = async () => {
  try {
    await authAPI.verifyOtp({
      email: registeredEmail,
      otp: otp,
    })
    
    message.success('Xác thực thành công!')
    navigate('/login')
  } catch (error) {
    message.error('Mã OTP không đúng')
  }
}
```

---

## 🔄 Auto Token Refresh

### Cách hoạt động:
1. User gọi API bất kỳ (ví dụ: `authAPI.getCurrentUser()`)
2. Backend trả về 401 (token hết hạn)
3. axios interceptor tự động:
   - Lấy `refreshToken` từ localStorage
   - Gọi `/auth/refresh` để lấy token mới
   - Lưu tokens mới vào localStorage
   - **Tự động thử lại** request ban đầu với token mới
4. User không cần làm gì cả! ✨

### Điều kiện logout tự động:
- Không có refreshToken
- RefreshToken cũng hết hạn
- Server trả về lỗi khi refresh

---

## 🚨 Xử Lý Lỗi

### Các loại lỗi thường gặp:

```typescript
try {
  await authAPI.login(data)
} catch (error) {
  // error.message: Thông báo lỗi từ backend
  // error.status: HTTP status code (401, 400, 500, etc.)
  
  if (error.status === 401) {
    message.error('Email hoặc mật khẩu không đúng')
  } else if (error.status === 400) {
    message.error('Dữ liệu không hợp lệ')
  } else {
    message.error('Đã xảy ra lỗi, vui lòng thử lại')
  }
}
```

---

## ⚠️ CORS Configuration

### Backend cần cấu hình CORS:

**File:** `auth-service/src/app.js`

```javascript
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:5174',  // URL của Webadmin
  credentials: true
}))
```

### ❗ Lưu ý:
- Nếu không cấu hình CORS, frontend sẽ gặp lỗi khi gọi API
- **Liên hệ với teammate phụ trách backend** để thêm config này
- Khi deploy production, thay `http://localhost:5174` bằng domain thật

---

## 🧪 Test API Integration

### 1. Test Health Check:
```typescript
const testConnection = async () => {
  try {
    const response = await authAPI.healthCheck()
    console.log('Backend status:', response)
  } catch (error) {
    console.error('Backend không hoạt động:', error)
  }
}
```

### 2. Test Login:
```typescript
// Sử dụng email test từ backend
const testLogin = async () => {
  try {
    const response = await authAPI.login({
      email: 'test@example.com',
      password: '123456'
    })
    console.log('Login success:', response)
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
```

---

## 📊 Workflow Diagram

```
┌─────────────┐
│  LoginPage  │
└──────┬──────┘
       │ authAPI.login()
       ↓
┌──────────────┐         ┌─────────────────┐
│ axiosInstance│────────→│  Backend API    │
└──────┬───────┘         │ localhost:3000  │
       │                 └─────────────────┘
       │ Response: {accessToken, refreshToken, user}
       ↓
┌──────────────┐
│ localStorage │
│ - accessToken│
│ - refreshToken│
│ - user       │
└──────────────┘
       │
       ↓
┌──────────────┐
│  Dashboard   │
└──────────────┘
```

---

## 🔧 Environment Variables

### Tạo file `.env` trong Webadmin:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Sử dụng trong code:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL
```

---

## ✅ Checklist Trước Khi Test

- [ ] Auth-service đang chạy ở port 3000
- [ ] MongoDB đang chạy (Docker)
- [ ] SMTP đã cấu hình (để gửi OTP qua email)
- [ ] Webadmin đang chạy ở port 5174
- [ ] Backend đã cấu hình CORS cho `http://localhost:5174`
- [ ] File `.env` đã tạo trong Webadmin (nếu cần)

---

## 🎯 Các Trang Đã Tích Hợp

✅ **LoginPage** - Hoàn chỉnh, gọi API login thật
✅ **RegisterPage** - Hoàn chỉnh với 2 bước (register + verify OTP)
⏳ **ForgotPassword** - Cần cập nhật tương tự RegisterPage

---

## 🚀 Next Steps

### 1. Cập nhật ForgotPassword.tsx
Tương tự RegisterPage, cần gọi:
- `authAPI.forgotPassword({email})` - Gửi OTP
- `authAPI.resetPassword({email, otp, newPassword})` - Reset password

### 2. Tạo Protected Routes
```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Sử dụng trong App.tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### 3. Implement Logout
```typescript
const handleLogout = () => {
  localStorage.clear()
  navigate('/login')
}
```

---

## 📞 Phối Hợp Với Backend Team

### Cần gì từ backend:
1. ✅ CORS configuration cho `http://localhost:5174`
2. ✅ Đảm bảo tất cả endpoints hoạt động đúng
3. ⏳ Test email delivery (SMTP) để OTP gửi được
4. ⏳ Cung cấp test accounts nếu có

### Thông tin cần chia sẻ với backend:
- Frontend URL: `http://localhost:5174`
- Các fields frontend gửi lên (xem interface trong authAPI.ts)
- Format error response frontend mong đợi

---

## 🐛 Troubleshooting

### Lỗi CORS:
```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/auth/login' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```
**Giải pháp:** Backend cần thêm CORS config (xem phần CORS Configuration)

### Lỗi 401 Unauthorized:
- Kiểm tra token đã lưu chưa: `localStorage.getItem('accessToken')`
- Kiểm tra token còn hạn không (xem trong jwt.io)
- Refresh token có hoạt động không

### API không response:
- Kiểm tra backend đang chạy: `http://localhost:3000/api/v1/auth/health`
- Kiểm tra MongoDB đang chạy
- Xem logs trong terminal của backend

---

## 📚 Tài Liệu Tham Khảo

- [Axios Documentation](https://axios-http.com/docs/interceptors)
- [JWT Best Practices](https://jwt.io/introduction)
- [Ant Design Form](https://ant.design/components/form)

---

**Tác giả:** GitHub Copilot
**Ngày cập nhật:** December 18, 2025
