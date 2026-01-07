# 🚀 Quick Start - Test API Integration

## ✅ Status Hiện Tại

**TẤT CẢ SERVICES ĐANG CHẠY:**

1. ✅ **MongoDB**: Port 27017 (Docker container: auth-mongodb)
2. ✅ **Auth Service**: http://localhost:3000
3. ✅ **Webadmin**: http://localhost:5174

---

## 🧪 Hướng Dẫn Test

### Bước 1: Mở Webadmin
Truy cập: **http://localhost:5174**

### Bước 2: Test Đăng Ký (Register)

1. Click **"Đăng ký tại đây"** hoặc vào: http://localhost:5174/register

2. Điền form:
   ```
   Họ và tên: Nguyen Van A
   Email: test@example.com
   Mật khẩu: 123456
   Xác nhận mật khẩu: 123456
   ☑️ Đồng ý với điều khoản
   ```

3. Click **"Đăng Ký"**

4. **Kiểm tra email** để lấy mã OTP (6 số)
   - Email gửi từ: tienphanminh93@gmail.com
   - Tiêu đề: "Email Verification"

5. Nhập mã OTP vào Modal popup

6. Click **"Xác thực"**

7. ✅ Thành công → Chuyển về trang Login

---

### Bước 3: Test Đăng Nhập (Login)

1. Vào: http://localhost:5174/login

2. Điền form:
   ```
   Email: test@example.com
   Password: 123456
   ```

3. Click **"Đăng Nhập"**

4. ✅ Thành công → Chuyển đến Dashboard

---

### Bước 4: Kiểm tra Browser Console

Mở **Developer Tools** (F12) → Tab **Console**

Nếu thấy lỗi CORS như:
```
Access to XMLHttpRequest at 'http://localhost:3000/api/v1/auth/login' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```

➡️ **GIẢI PHÁP:** Backend cần thêm CORS config (xem bên dưới)

---

## 🔧 Nếu Gặp Lỗi CORS

### Backend cần cấu hình CORS:

**File:** `D:\DoAn_FEPA\auth-service\src\app.js`

Thêm vào đầu file (sau các import):

```javascript
const cors = require('cors');

// Thêm sau dòng: const app = express();
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
```

Sau đó restart auth-service:
- Vào terminal auth-service
- Nhấn `Ctrl+C` để stop
- Chạy lại: `npm run dev`

---

## 📊 Kiểm Tra Services

### MongoDB
```powershell
docker ps --filter "name=auth-mongodb"
```

### Auth Service
```powershell
curl http://localhost:3000/api/v1/auth/health
```
Response:
```json
{
  "status": "healthy",
  "service": "Auth Service",
  "timestamp": "2025-12-18T...",
  "uptime": "..."
}
```

### Webadmin
Mở browser: http://localhost:5174

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch" hoặc "Network Error"
- ✅ Kiểm tra auth-service đang chạy: `curl http://localhost:3000/api/v1/auth/health`
- ✅ Kiểm tra CORS đã config chưa (xem bên trên)

### Lỗi: "Email hoặc mật khẩu không đúng"
- ✅ Đảm bảo đã đăng ký và xác thực OTP trước
- ✅ Password phải đúng

### Không nhận được OTP qua email
- ✅ Kiểm tra SMTP config trong `auth-service/.env`:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=tienphanminh93@gmail.com
  SMTP_PASS=cuxybupnberblbnj
  ```
- ✅ Kiểm tra email spam/junk folder

### Webadmin không hiển gì (blank page)
- ✅ Mở Developer Tools (F12) → Console → xem lỗi
- ✅ Restart Vite: Terminal → Nhấn `r + Enter`

---

## 📝 Terminals Đang Chạy

Có 2 terminals background đang chạy:

1. **Auth Service** (Terminal ID: 4fd1f8e1-ecdd-4235-81a9-921dda882242)
   - Command: `npm run dev` trong `auth-service/`
   - Để xem logs: Vào terminal và scroll lên

2. **Webadmin** (Terminal ID: 06ea8b3a-b432-46b8-8b00-b9c7185b71ba)
   - Command: `npm run dev` trong `Webadmin/`
   - Shortcuts:
     - `r + Enter` → Restart server
     - `o + Enter` → Open in browser
     - `c + Enter` → Clear console
     - `q + Enter` → Quit

---

## 🎯 Test Flow Hoàn Chỉnh

```
1. Vào http://localhost:5174/register
2. Đăng ký tài khoản mới
3. Nhập OTP từ email
4. Xác thực thành công
5. Vào http://localhost:5174/login
6. Đăng nhập với tài khoản vừa tạo
7. Chuyển đến Dashboard
8. ✅ Hoàn thành!
```

---

## 📚 Tài Liệu Chi Tiết

Xem file: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

---

**Chúc bạn test thành công! 🎉**
