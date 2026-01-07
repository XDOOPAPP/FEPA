# Checklist Các Phần Còn Thiếu Trong Webadmin

**Ngày kiểm tra:** 19/12/2025  
**Người phụ trách:** Webadmin Team  
**Lưu ý:** Mỗi API integration là một nhánh riêng (feature branch)

---

## 📋 Tổng Quan

Sau khi đối chiếu với tài liệu dự án và kiểm tra code hiện tại, dưới đây là danh sách các phần còn thiếu trong Webadmin. **Mỗi API integration sẽ được làm trong một nhánh riêng.**

---

## ❌ 1. CÁC TRANG QUẢN LÝ CÒN THIẾU

### 📁 Nhánh: `feature/ocr-management-page`

#### 1.1. OCR Management Page
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Trang quản lý OCR jobs của người dùng

**Tính năng cần có:**
- ✅ Xem danh sách tất cả OCR jobs từ users
- ✅ Lọc theo user, status (queued/completed/failed)
- ✅ Xem chi tiết kết quả OCR (resultJson)
- ✅ Xem hình ảnh hóa đơn đã quét
- ✅ Thống kê: Tổng số jobs, tỷ lệ thành công/thất bại
- ✅ Export báo cáo OCR usage (CSV/Excel)
- ✅ Bulk operations (delete, export)

**File cần tạo:**
- `src/pages/admin/OcrManagement.tsx`
- `src/utils/mockData/ocrMockData.ts` (mock data ban đầu)

**Route cần thêm:**
- `/admin/ocr` trong `App.tsx`
- Menu item trong `AdminSidebar.tsx`

**Lưu ý:** Trang này sẽ dùng mock data trước. API integration sẽ làm trong nhánh `feature/ocr-api` riêng.

---

### 📁 Nhánh: `feature/ai-insights-management-page`

#### 1.2. AI Insights Management Page
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Trang quản lý và xem AI insights của người dùng

**Tính năng cần có:**
- ✅ Xem danh sách AI insights từ users
- ✅ Lọc theo user, inputType, thời gian
- ✅ Xem chi tiết insights (trends, recommendations, predictions)
- ✅ Thống kê: Số lượng insights, loại insights phổ biến
- ✅ Xem lịch sử phân tích AI (AiInsight records)
- ✅ Export báo cáo AI usage (CSV/Excel)
- ✅ Charts visualization cho insights

**File cần tạo:**
- `src/pages/admin/AiInsightsManagement.tsx`
- `src/utils/mockData/aiMockData.ts` (mock data ban đầu)

**Route cần thêm:**
- `/admin/ai-insights` trong `App.tsx`
- Menu item trong `AdminSidebar.tsx`

**Lưu ý:** Trang này sẽ dùng mock data trước. API integration sẽ làm trong nhánh `feature/ai-api` riêng.

---

## ⚠️ 2. TÍCH HỢP API - MỖI API LÀ MỘT NHÁNH RIÊNG

### 📁 Nhánh: `feature/blog-api`

#### 2.1. Blog Management API Integration
**Trạng thái:** ⚠️ ĐANG DÙNG MOCK DATA (localStorage)  
**File hiện tại:** `src/pages/admin/BlogManagement.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/blogAPI.ts`:
   ```typescript
   export const blogAPI = {
     getAll: (params?: { status?: string, page?: number }) => {},
     getBySlug: (slug: string) => {},
     create: (data: BlogPost) => {},
     update: (id: string, data: Partial<BlogPost>) => {},
     delete: (id: string) => {},
   }
   ```

2. ✅ Cập nhật `BlogManagement.tsx`:
   - Thay `localStorage.getItem('blog_posts')` bằng `blogAPI.getAll()`
   - Thay `localStorage.setItem()` bằng `blogAPI.create/update/delete()`
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/blogs` - Lấy danh sách bài viết
- `POST /api/v1/blogs` - Tạo bài viết mới
- `PUT /api/v1/blogs/:id` - Cập nhật bài viết
- `DELETE /api/v1/blogs/:id` - Xóa bài viết
- `GET /api/v1/blogs/:slug` - Chi tiết bài viết

**Files sẽ thay đổi:**
- `src/services/api/blogAPI.ts` (tạo mới)
- `src/pages/admin/BlogManagement.tsx` (cập nhật)

---

### 📁 Nhánh: `feature/subscription-api`

#### 2.2. Subscription Management API Integration
**Trạng thái:** ⚠️ ĐANG DÙNG MOCK DATA (localStorage)  
**File hiện tại:** `src/pages/admin/AdminSubscription.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/subscriptionAPI.ts`:
   ```typescript
   export const subscriptionAPI = {
     getPlans: () => {},
     createPlan: (data: Plan) => {},
     updatePlan: (id: string, data: Partial<Plan>) => {},
     getAllSubscriptions: (params?: { userId?: string, status?: string }) => {},
     getStats: () => {},
   }
   ```

2. ✅ Cập nhật `AdminSubscription.tsx`:
   - Thay `localStorage.getItem('subscription_plans')` bằng `subscriptionAPI.getPlans()`
   - Thay localStorage operations bằng API calls
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/subscriptions/plans` - Lấy danh sách gói
- `POST /api/v1/subscriptions/plans` - Tạo gói mới (nếu có)
- `PUT /api/v1/subscriptions/plans/:id` - Cập nhật gói (nếu có)
- `GET /api/v1/subscriptions` - Lấy danh sách subscriptions của users
- `GET /api/v1/subscriptions/stats` - Thống kê subscriptions (nếu có)

**Files sẽ thay đổi:**
- `src/services/api/subscriptionAPI.ts` (tạo mới)
- `src/pages/admin/AdminSubscription.tsx` (cập nhật)

---

### 📁 Nhánh: `feature/notification-api`

#### 2.3. Notification Management API Integration
**Trạng thái:** ⚠️ ĐANG DÙNG MOCK DATA (localStorage)  
**File hiện tại:** `src/pages/admin/AdminNotifications.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/notificationAPI.ts`:
   ```typescript
   export const notificationAPI = {
     getAll: (params?: { userId?: string, unreadOnly?: boolean }) => {},
     markAsRead: (id: string) => {},
     markAllAsRead: () => {},
     delete: (id: string) => {},
   }
   ```

2. ✅ Cập nhật `AdminNotifications.tsx`:
   - Thay `localStorage.getItem('admin_notifications')` bằng `notificationAPI.getAll()`
   - Thay localStorage operations bằng API calls
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/notifications` - Lấy danh sách thông báo (admin có thể xem tất cả)
- `POST /api/v1/notifications/:id/read` - Đánh dấu đã đọc
- `POST /api/v1/notifications/read-all` - Đánh dấu tất cả đã đọc
- `DELETE /api/v1/notifications/:id` - Xóa thông báo (nếu có)

**Files sẽ thay đổi:**
- `src/services/api/notificationAPI.ts` (tạo mới)
- `src/pages/admin/AdminNotifications.tsx` (cập nhật)

---

### 📁 Nhánh: `feature/system-api`

#### 2.4. System Settings API Integration
**Trạng thái:** ⚠️ CÓ TODO COMMENTS, CHƯA TÍCH HỢP  
**File hiện tại:** `src/pages/admin/SystemSettings.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/systemAPI.ts`:
   ```typescript
   export const systemAPI = {
     getSettings: () => {},
     updateSettings: (data: any) => {},
     getApiKeys: () => {},
     updateApiKeys: (data: any) => {},
     getSecuritySettings: () => {},
     updateSecuritySettings: (data: any) => {},
   }
   ```

2. ✅ Cập nhật `SystemSettings.tsx`:
   - Thay `localStorage.getItem('api_keys')` bằng `systemAPI.getApiKeys()`
   - Thay localStorage operations bằng API calls
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/system/settings` - Lấy cấu hình hệ thống
- `PUT /api/v1/system/settings` - Cập nhật cấu hình
- `GET /api/v1/system/api-keys` - Lấy API keys
- `PUT /api/v1/system/api-keys` - Cập nhật API keys
- `GET /api/v1/system/security` - Lấy cấu hình bảo mật
- `PUT /api/v1/system/security` - Cập nhật cấu hình bảo mật

**Files sẽ thay đổi:**
- `src/services/api/systemAPI.ts` (tạo mới)
- `src/pages/admin/SystemSettings.tsx` (cập nhật)

---

### 📁 Nhánh: `feature/dashboard-api`

#### 2.5. Dashboard API Integration
**Trạng thái:** ⚠️ ĐANG DÙNG MOCK DATA (localStorage)  
**File hiện tại:** `src/pages/admin/AdminDashboard.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/adminAPI.ts` hoặc `dashboardAPI.ts`:
   ```typescript
   export const adminAPI = {
     getDashboardStats: () => {},
     getRecentActivities: () => {},
   }
   ```

2. ✅ Cập nhật `AdminDashboard.tsx`:
   - Thay `initializeMockData()` bằng `adminAPI.getDashboardStats()`
   - Thay localStorage operations bằng API calls
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/admin/dashboard/stats` - Thống kê tổng quan (nếu có)
- `GET /api/v1/admin/dashboard/recent-activities` - Hoạt động gần đây (nếu có)
- Hoặc tích hợp từ các API riêng lẻ:
  - `GET /api/v1/users` - Đếm users
  - `GET /api/v1/expenses` - Tổng hợp expenses
  - `GET /api/v1/subscriptions` - Thống kê subscriptions

**Files sẽ thay đổi:**
- `src/services/api/adminAPI.ts` hoặc `dashboardAPI.ts` (tạo mới)
- `src/pages/admin/AdminDashboard.tsx` (cập nhật)

---

### 📁 Nhánh: `feature/ocr-api`

#### 2.6. OCR Management API Integration
**Trạng thái:** ⚠️ CHƯA CÓ TRANG (cần tạo trang trước)  
**File sẽ tạo:** `src/pages/admin/OcrManagement.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/ocrAPI.ts`:
   ```typescript
   export const ocrAPI = {
     getAllJobs: (params?: { userId?: string, status?: string }) => {},
     getJobById: (jobId: string) => {},
     getStats: () => {},
   }
   ```

2. ✅ Cập nhật `OcrManagement.tsx`:
   - Thay mock data bằng `ocrAPI.getAllJobs()`
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/ocr/jobs` - Lấy danh sách jobs (admin có thể xem tất cả)
- `GET /api/v1/ocr/jobs/:jobId` - Chi tiết job
- `GET /api/v1/ocr/stats` - Thống kê OCR (nếu có)

**Files sẽ thay đổi:**
- `src/services/api/ocrAPI.ts` (tạo mới)
- `src/pages/admin/OcrManagement.tsx` (cập nhật - nếu đã có từ nhánh `feature/ocr-management-page`)

---

### 📁 Nhánh: `feature/ai-api`

#### 2.7. AI Insights Management API Integration
**Trạng thái:** ⚠️ CHƯA CÓ TRANG (cần tạo trang trước)  
**File sẽ tạo:** `src/pages/admin/AiInsightsManagement.tsx`

**Công việc trong nhánh này:**
1. ✅ Tạo `src/services/api/aiAPI.ts`:
   ```typescript
   export const aiAPI = {
     getInsights: (params?: { userId?: string, period?: string }) => {},
     getInsightsHistory: (params?: { userId?: string }) => {},
     getStats: () => {},
   }
   ```

2. ✅ Cập nhật `AiInsightsManagement.tsx`:
   - Thay mock data bằng `aiAPI.getInsights()`
   - Thêm loading states
   - Thêm error handling

**API Endpoints cần tích hợp:**
- `GET /api/v1/ai/insights` - Lấy insights (admin có thể xem tất cả)
- `GET /api/v1/ai/insights/history` - Lịch sử insights (nếu có)
- `GET /api/v1/ai/stats` - Thống kê AI (nếu có)

**Files sẽ thay đổi:**
- `src/services/api/aiAPI.ts` (tạo mới)
- `src/pages/admin/AiInsightsManagement.tsx` (cập nhật - nếu đã có từ nhánh `feature/ai-insights-management-page`)

---

## 📊 3. TỔNG KẾT THEO ĐỘ ƯU TIÊN

### 🔴 Ưu Tiên Cao (Critical)
1. ✅ **Nhánh:** `feature/blog-api` - Content management cần hoạt động thật
2. ✅ **Nhánh:** `feature/subscription-api` - Quản lý gói dịch vụ cần dữ liệu thật
3. ✅ **Nhánh:** `feature/ocr-api` - Tính năng quan trọng, users đang sử dụng
4. ✅ **Nhánh:** `feature/ai-api` - Tính năng quan trọng, users đang sử dụng

### 🟡 Ưu Tiên Trung Bình (Important)
5. ✅ **Nhánh:** `feature/notification-api` - Cần dữ liệu thật
6. ✅ **Nhánh:** `feature/system-api` - Cấu hình hệ thống quan trọng
7. ✅ **Nhánh:** `feature/dashboard-api` - Thống kê cần dữ liệu thật

---

## 📝 4. CHECKLIST THỰC HIỆN

### Phase 1: Tạo Trang Mới (UI Only)
- [ ] **Nhánh:** `feature/ocr-management-page`
  - [ ] Tạo `OcrManagement.tsx` với mock data
  - [ ] Thêm route và menu

- [ ] **Nhánh:** `feature/ai-insights-management-page`
  - [ ] Tạo `AiInsightsManagement.tsx` với mock data
  - [ ] Thêm route và menu

### Phase 2: API Integration (Mỗi API một nhánh)
- [ ] **Nhánh:** `feature/blog-api`
  - [ ] Tạo `blogAPI.ts`
  - [ ] Cập nhật `BlogManagement.tsx`

- [ ] **Nhánh:** `feature/subscription-api`
  - [ ] Tạo `subscriptionAPI.ts`
  - [ ] Cập nhật `AdminSubscription.tsx`

- [ ] **Nhánh:** `feature/notification-api`
  - [ ] Tạo `notificationAPI.ts`
  - [ ] Cập nhật `AdminNotifications.tsx`

- [ ] **Nhánh:** `feature/system-api`
  - [ ] Tạo `systemAPI.ts`
  - [ ] Cập nhật `SystemSettings.tsx`

- [ ] **Nhánh:** `feature/dashboard-api`
  - [ ] Tạo `adminAPI.ts` hoặc `dashboardAPI.ts`
  - [ ] Cập nhật `AdminDashboard.tsx`

- [ ] **Nhánh:** `feature/ocr-api`
  - [ ] Tạo `ocrAPI.ts`
  - [ ] Cập nhật `OcrManagement.tsx` (nếu đã có)

- [ ] **Nhánh:** `feature/ai-api`
  - [ ] Tạo `aiAPI.ts`
  - [ ] Cập nhật `AiInsightsManagement.tsx` (nếu đã có)

---

## 🔗 5. TÀI LIỆU THAM KHẢO

- **API Endpoints:** Xem `deployment/PROJECT_DOCUMENTATION.md` section 6
- **Use Cases:** Xem `deployment/USE_CASES.md`
- **API Integration Guide:** Xem `Webadmin/API_INTEGRATION_GUIDE.md`
- **Axios Instance:** Xem `src/services/api/axiosInstance.ts` (đã có sẵn)

---

## 📞 6. GHI CHÚ QUAN TRỌNG

### ⚠️ Quy Tắc Làm Việc

1. **Mỗi API là một nhánh riêng**
   - Dễ quản lý và code review
   - Có thể làm song song nhiều nhánh
   - Dễ rollback nếu có vấn đề

2. **Workflow:**
   - Tạo nhánh: `git checkout -b feature/blog-api`
   - Tạo API service file
   - Cập nhật page tương ứng
   - Test với backend
   - Merge vào main

3. **Cấu trúc API Service:**
   - Sử dụng `axiosInstance` đã có sẵn
   - Xử lý errors đúng cách
   - TypeScript types đầy đủ

4. **Testing:**
   - Test với backend thật
   - Test error scenarios
   - Test loading states

---

**Tác giả:** Auto-generated  
**Ngày tạo:** 19/12/2025  
**Version:** 3.0.0 (Mỗi API là một nhánh riêng)
