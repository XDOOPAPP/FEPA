# 🔌 Backend Integration Guide

Hướng dẫn tích hợp backend sau khi các services đã hoàn thành.

---

## 📦 Thư Viện Đã Cài

### 1. **@tanstack/react-query** (v5.90.12)
- **Chức năng**: Data fetching, caching, synchronization
- **Tại sao cần**: 
  - Tự động cache data, giảm số lần gọi API
  - Tự động refetch khi cần (window focus, reconnect)
  - Quản lý loading/error states
  - Optimistic updates

### 2. **socket.io-client** (v4.8.1)
- **Chức năng**: Real-time communication với backend
- **Tại sao cần**:
  - Real-time notifications cho admin
  - Live system alerts
  - User activity tracking
  - System health monitoring updates

---

## 🚀 Setup & Configuration

### 1. Environment Variables

File `.env.local` đã được tạo:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_ENV=development
VITE_ENABLE_SOCKET=true
VITE_ENABLE_MOCK_DATA=false
```

**Lưu ý**: 
- File `.env.local` không được commit lên Git (đã có trong .gitignore)
- Thay đổi URLs theo môi trường của bạn (dev/staging/production)

### 2. React Query Setup

File `services/queryClient.ts` đã được cấu hình:
- ✅ Stale time: 5 phút
- ✅ Cache time: 10 phút
- ✅ Auto refetch on window focus
- ✅ Auto refetch on reconnect
- ✅ Retry logic

### 3. Socket.IO Setup

File `services/socket.ts` đã được tạo với các functions:
- `initializeSocket(token)` - Khởi tạo kết nối
- `getSocket()` - Lấy socket instance
- `disconnectSocket()` - Ngắt kết nối
- `subscribeToNotifications(callback)` - Subscribe notifications
- `subscribeToSystemAlerts(callback)` - Subscribe alerts
- `subscribeToUserActivities(callback)` - Subscribe activities

---

## 📝 Cách Sử Dụng

### A. React Query - Data Fetching

#### 1. Tạo Query Hook

File: `services/queries.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import axiosInstance from './api/axiosInstance'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users')
      return response.data
    },
  })
}
```

#### 2. Sử Dụng Trong Component

```typescript
import { useUsers } from '@/services/queries'

const UserManagement = () => {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) return <Spin />
  if (error) return <Alert message="Error loading users" />

  return (
    <Table dataSource={users} />
  )
}
```

#### 3. Mutation (Create/Update/Delete)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData) => {
      return await axiosInstance.post('/users', userData)
    },
    onSuccess: () => {
      // Refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('User created!')
    },
  })
}

// Trong component:
const createUser = useCreateUser()

const handleSubmit = async (values) => {
  await createUser.mutateAsync(values)
}
```

### B. Socket.IO - Real-time Updates

#### 1. Initialize Socket (khi login)

File: `context/AuthContext.tsx`

```typescript
import { initializeSocket, disconnectSocket } from '@/services/socket'

const login = async (email, password) => {
  const response = await authService.login(email, password)
  const { accessToken } = response.data
  
  // Save token
  localStorage.setItem('accessToken', accessToken)
  
  // Initialize socket với token
  initializeSocket(accessToken)
  
  setUser(response.data.user)
}

const logout = () => {
  disconnectSocket()
  localStorage.clear()
  setUser(null)
}
```

#### 2. Subscribe to Events

File: `pages/admin/AdminDashboard.tsx`

```typescript
import { useEffect } from 'react'
import { subscribeToNotifications, subscribeToSystemAlerts } from '@/services/socket'

const AdminDashboard = () => {
  useEffect(() => {
    // Subscribe to notifications
    const unsubscribeNotifications = subscribeToNotifications((notification) => {
      message.info(notification.message)
      // Update notification list
    })

    // Subscribe to system alerts
    const unsubscribeAlerts = subscribeToSystemAlerts((alert) => {
      if (alert.severity === 'critical') {
        notification.error({
          message: 'Critical Alert',
          description: alert.message,
        })
      }
    })

    // Cleanup
    return () => {
      unsubscribeNotifications?.()
      unsubscribeAlerts?.()
    }
  }, [])

  return <div>Dashboard content</div>
}
```

---

## 🔄 Migration từ localStorage sang API

### Before (Mock data với localStorage):
```typescript
const users = JSON.parse(localStorage.getItem('users') || '[]')
setUsers(users)
```

### After (API với React Query):
```typescript
const { data: users, isLoading } = useUsers()
```

### Các bước migrate từng page:

1. **Tìm localStorage calls**:
   - Search: `localStorage.getItem`
   - Search: `localStorage.setItem`

2. **Thay bằng React Query hooks**:
   - `useUsers()` - cho fetch
   - `useCreateUser()` - cho create
   - `useUpdateUser()` - cho update
   - `useDeleteUser()` - cho delete

3. **Remove localStorage code**

4. **Test API integration**

---

## 📋 Checklist Tích Hợp Backend

### Phase 1: Auth Service ✅
- [x] Login API
- [x] Register API
- [x] Refresh token
- [ ] Forgot password API
- [ ] Logout API

### Phase 2: User Management
- [ ] GET /api/users
- [ ] POST /api/users
- [ ] PUT /api/users/:id
- [ ] DELETE /api/users/:id
- [ ] PATCH /api/users/:id/lock
- [ ] POST /api/users/:id/reset-password

### Phase 3: Core Data
- [ ] GET /api/expenses
- [ ] GET /api/budgets
- [ ] GET /api/categories

### Phase 4: Subscription
- [ ] GET /api/subscription-plans
- [ ] POST /api/subscription-plans
- [ ] GET /api/user-subscriptions
- [ ] PUT /api/user-subscriptions/:id

### Phase 5: Content Management
- [ ] GET /api/blogs
- [ ] POST /api/blogs
- [ ] PUT /api/blogs/:id
- [ ] DELETE /api/blogs/:id
- [ ] GET /api/advertisements
- [ ] POST /api/advertisements

### Phase 6: System
- [ ] GET /api/system/settings
- [ ] PUT /api/system/settings
- [ ] GET /api/system/health
- [ ] GET /api/reports/analytics

### Phase 7: Real-time (Socket.IO)
- [ ] Connect to Socket.IO server
- [ ] Subscribe to 'admin:notification'
- [ ] Subscribe to 'system:alert'
- [ ] Subscribe to 'user:activity'

---

## 🧪 Testing

### Test React Query
```bash
npm run dev
# Open DevTools > React Query tab
# Xem cache, queries, mutations
```

### Test Socket.IO
```bash
# Trong browser console:
window.__SOCKET_INSTANCE__ = getSocket()
window.__SOCKET_INSTANCE__.emit('test', { data: 'hello' })
```

---

## 📚 Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Prepared by**: FEPA Team  
**Date**: December 19, 2025
