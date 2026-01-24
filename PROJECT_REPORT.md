# 📋 BÁO CÁO CHI TIẾT DỰ ÁN FEPA WEB ADMIN

> **FEPA Web Admin Dashboard** - Hệ thống quản trị cho nền tảng quản lý tài chính cá nhân  
> Ngày báo cáo: 24/01/2026  
> Phiên bản: 0.0.0

---

## 📑 MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống)
3. [Stack Công Nghệ](#3-stack-công-nghệ)
4. [Cấu Trúc Thư Mục](#4-cấu-trúc-thư-mục)
5. [Chức Năng & Features](#5-chức-năng--features)
6. [API Integration](#6-api-integration)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Real-time Features](#8-real-time-features)
9. [UI/UX Design](#9-uiux-design)
10. [State Management](#10-state-management)
11. [Routing System](#11-routing-system)
12. [Components Architecture](#12-components-architecture)
13. [Type System](#13-type-system)
14. [Configuration Management](#14-configuration-management)
15. [Best Practices & Patterns](#15-best-practices--patterns)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Giới Thiệu

**FEPA Web Admin** là hệ thống quản trị web-based được xây dựng để quản lý nền tảng tài chính cá nhân FEPA. Ứng dụng cung cấp giao diện trực quan cho admin để theo dõi, quản lý và điều hành toàn bộ hệ thống.

### 1.2 Mục Tiêu

- ✅ Quản lý người dùng và subscriptions
- ✅ Quản lý blog content (duyệt, xuất bản, từ chối)
- ✅ Hệ thống thông báo real-time
- ✅ Dashboard analytics và reporting
- ✅ Quản lý OCR, Budget, và Expense
- ✅ Partner portal và quản lý quảng cáo

### 1.3 Phạm Vi Dự Án

- **Frontend Only**: Dự án này chỉ là phần frontend admin panel
- **Backend APIs**: Kết nối với microservices backend (Auth, Blog, Notification, Subscription, Budget, Expense, OCR)
- **Real-time**: WebSocket connection cho notifications
- **Target Users**: Admin và moderators

---

## 2. KIẾN TRÚC HỆ THỐNG

### 2.1 Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────┐
│                   FEPA WEB ADMIN (SPA)                  │
│                  React + TypeScript                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────┐ ┌──────────────┐
│   REST APIs  │ │Socket│ │ Local Storage│
│  (Axios)     │ │.io   │ │ Session      │
└──────────────┘ └──────┘ └──────────────┘
        │            │
        ▼            ▼
┌──────────────────────────────────────┐
│     Backend Microservices            │
│  - Auth Service (Port 3000)          │
│  - Blog Service                      │
│  - Notification Service              │
│  - Subscription Service              │
│  - Budget Service                    │
│  - Expense Service                   │
│  - OCR Service                       │
│  - Socket Gateway (Port 3102)        │
└──────────────────────────────────────┘
```

### 2.2 Kiến Trúc Frontend

**Architecture Pattern**: Component-Based Architecture với Layered Structure

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│  Components, Pages, Layouts                 │
├─────────────────────────────────────────────┤
│       Business Logic Layer                  │
│  Hooks, Context, Services                   │
├─────────────────────────────────────────────┤
│         Data Layer                          │
│  API Clients, Queries, State Management     │
├─────────────────────────────────────────────┤
│         Infrastructure Layer                │
│  Config, Utils, Types                       │
└─────────────────────────────────────────────┘
```

### 2.3 Data Flow

```
User Action → Component → Hook/Query → API Service
    ↓                                      ↓
React Query Cache ← Response ← Axios ← Backend API
    ↓
State Update → UI Re-render
```

---

## 3. STACK CÔNG NGHỆ

### 3.1 Core Technologies

| Công nghệ      | Phiên bản | Mục đích                |
| -------------- | --------- | ----------------------- |
| **React**      | 18.3.1    | UI Library              |
| **TypeScript** | 5.7.2     | Type Safety             |
| **Vite**       | 6.0.1     | Build Tool & Dev Server |
| **Node.js**    | -         | Runtime Environment     |

### 3.2 UI Framework & Styling

| Package        | Phiên bản | Mục đích          |
| -------------- | --------- | ----------------- |
| **Ant Design** | 5.22.0    | Component Library |
| **CSS**        | -         | Custom Styling    |
| **dayjs**      | 1.11.19   | Date Manipulation |

### 3.3 State Management & Data Fetching

| Package                   | Phiên bản | Mục đích                |
| ------------------------- | --------- | ----------------------- |
| **@tanstack/react-query** | 5.90.12   | Server State Management |
| **React Context**         | Built-in  | Global State (Auth)     |

### 3.4 Routing & Navigation

| Package              | Phiên bản | Mục đích            |
| -------------------- | --------- | ------------------- |
| **react-router-dom** | 6.28.0    | Client-side Routing |

### 3.5 API & Real-time Communication

| Package              | Phiên bản | Mục đích         |
| -------------------- | --------- | ---------------- |
| **axios**            | 1.13.2    | HTTP Client      |
| **socket.io-client** | 4.8.1     | WebSocket Client |

### 3.6 Rich Text & Visualization

| Package         | Phiên bản | Mục đích         |
| --------------- | --------- | ---------------- |
| **react-quill** | 2.0.0     | Rich Text Editor |
| **recharts**    | 3.6.0     | Charts & Graphs  |

### 3.7 Development Tools

| Package                  | Phiên bản | Mục đích               |
| ------------------------ | --------- | ---------------------- |
| **ESLint**               | 9.15.0    | Code Linting           |
| **@typescript-eslint**   | 8.15.0    | TypeScript Linting     |
| **@vitejs/plugin-react** | 4.3.4     | React Support for Vite |

---

## 4. CẤU TRÚC THƯ MỤC

### 4.1 Root Structure

```
FEPA/
├── index.html                    # Entry HTML
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript Config
├── vite.config.ts               # Vite Config
├── Dockerfile                    # Docker Config
└── src/                         # Source Code
    ├── main.tsx                 # Entry Point
    ├── App.tsx                  # Root Component
    ├── App.css                  # Global Styles
    ├── index.css                # Base Styles
    ├── components/              # Reusable Components
    ├── pages/                   # Page Components
    ├── layouts/                 # Layout Components
    ├── services/                # API Services
    ├── hooks/                   # Custom Hooks
    ├── context/                 # React Context
    ├── config/                  # Configuration
    ├── types/                   # TypeScript Types
    └── utils/                   # Utility Functions
```

### 4.2 Components Structure

```
components/
├── admin/                       # Admin-specific Components
│   └── blogs/
│       ├── ApproveModal.tsx
│       └── RejectModal.tsx
├── notifications/               # Notification Components
│   ├── NotificationBell.tsx
│   ├── NotificationDropdown.tsx
│   ├── NotificationItem.tsx
│   └── CreateNotificationModal.tsx
├── AdminRoute.tsx               # Route Protection
├── RootRedirect.tsx            # Root Redirect Logic
├── LoadingSpinner.tsx          # Loading States
├── LoadingOverlay.tsx
├── SkeletonLoader.tsx
├── BulkActionsBar.tsx          # Bulk Operations
├── ExportButton.tsx            # Data Export
├── ImportButton.tsx            # Data Import
├── RichTextEditor.tsx          # WYSIWYG Editor
├── FeatureGate.tsx             # Feature Flags
└── SubscriptionStats.tsx       # Subscription Metrics
```

### 4.3 Pages Structure

```
pages/
├── auth/                        # Authentication Pages
│   ├── LoginPage.tsx
│   ├── ForgotPassword.tsx
│   ├── auth.css
│   └── styles.module.css
├── admin/                       # Admin Pages
│   ├── AdminDashboard.tsx       # Main Dashboard
│   ├── AdminSubscription.tsx    # Subscription Management
│   ├── UserManagement.tsx       # User Management
│   ├── AdsManagement.tsx        # Ads Management
│   ├── PartnerPortal.tsx        # Partner Portal
│   ├── blogs/                   # Blog Management
│   │   ├── PendingBlogs.tsx
│   │   ├── PublishedBlogs.tsx
│   │   ├── RejectedBlogs.tsx
│   │   └── BlogDetail.tsx
│   └── notifications/           # Notification Management
│       └── NotificationsPage.tsx
├── profile/                     # User Profile
│   └── ProfilePage.tsx
├── settings/                    # Settings
│   └── SettingsPage.tsx
└── ClearStorage.tsx            # Utility Page
```

### 4.4 Services Structure

```
services/
├── api/                         # API Clients
│   ├── axiosInstance.ts         # Axios Configuration
│   ├── authAPI.ts               # Auth Service
│   ├── blogAPI.ts               # Blog Service
│   ├── notificationAPI.ts       # Notification Service
│   ├── subscriptionAPI.ts       # Subscription Service
│   ├── budgetAPI.ts             # Budget Service
│   ├── expenseAPI.ts            # Expense Service
│   ├── ocrAPI.ts                # OCR Service
│   ├── userAPI.ts               # User Service
│   └── index.ts                 # Export Barrel
├── socket.ts                    # Socket.io Client
├── queries.ts                   # React Query Queries
├── queryClient.ts               # React Query Config
└── apiClient.ts                 # Generic API Client
```

### 4.5 Configuration Structure

```
config/
├── api.config.ts                # API Endpoints Config
├── README.md
└── index.ts                     # Config Exports
```

### 4.6 Types Structure

```
types/
├── index.ts                     # Main Type Exports
├── blog.ts                      # Blog Types
└── notification.ts              # Notification Types
```

---

## 5. CHỨC NĂNG & FEATURES

### 5.1 Authentication & Authorization

#### 5.1.1 Login System

- ✅ Email/Password authentication
- ✅ JWT-based token authentication
- ✅ Access Token + Refresh Token
- ✅ Remember me (localStorage)
- ✅ Session management (sessionStorage)
- ✅ Auto-logout on token expiration
- ✅ Role-based access (ADMIN/USER)

#### 5.1.2 Password Management

- ✅ Forgot password flow
- ✅ OTP verification
- ✅ Password reset

#### 5.1.3 Protected Routes

- ✅ AdminRoute component cho bảo vệ routes
- ✅ Auto-redirect to login nếu unauthorized
- ✅ RootRedirect cho smart routing

### 5.2 Dashboard & Analytics

#### 5.2.1 Admin Dashboard Features

- 📊 **Overview Statistics**
  - Total Users
  - Total Revenue
  - Active Users
  - Recent Activities

- 📈 **Charts & Graphs**
  - Monthly Revenue Chart (Line Chart)
  - User Growth Metrics
  - Recharts integration

- 💰 **Financial Metrics**
  - Expense Statistics (totalExpenses, totalAmount)
  - Budget Statistics (totalBudgets, averageBudgetAmount)
  - Category Breakdowns
  - Period Breakdowns (MONTHLY, WEEKLY, YEARLY)
  - Status Breakdowns (ON_TRACK, AT_RISK, EXCEEDED)

- 🔍 **OCR Statistics**
  - Total OCR Jobs
  - Success/Failed Scans
  - Success Rate
  - Average Processing Time
  - Type Breakdown (RECEIPT, QR_CODE)

### 5.3 Blog Management System

#### 5.3.1 Blog Status Workflow

```
Draft → Pending → Published
              ↓
           Rejected
```

#### 5.3.2 Blog Management Features

- ✅ **Pending Reviews**
  - View all pending blogs
  - Approve blogs với optional note
  - Reject blogs với reason
  - Filter và search

- ✅ **Published Blogs**
  - View all published blogs
  - Unpublish if needed
  - Edit published blogs

- ✅ **Rejected Blogs**
  - View rejected blogs với rejection reason
  - Re-review option

- ✅ **Blog Detail**
  - Full blog content view
  - Rich text display
  - Image gallery
  - Author information
  - Metadata (dates, status)

#### 5.3.3 Blog Moderation Tools

- ✅ Approve Modal với confirmation
- ✅ Reject Modal với required reason
- ✅ Bulk actions support (planned)

### 5.4 Notification System

#### 5.4.1 Real-time Notifications

- 🔔 **Notification Bell**
  - Unread count badge
  - Real-time updates via WebSocket
  - Dropdown notification list

- 📬 **Notification Features**
  - Create notification (Admin only)
  - Target selection (ALL users / ADMINS only)
  - Mark as read (single/all)
  - Delete notifications
  - Filter by unread
  - Search notifications
  - Pagination support

#### 5.4.2 Notification Types

- System notifications
- Blog review notifications
- Custom admin notifications

### 5.5 Subscription Management

#### 5.5.1 Subscription Plans

- ✅ View all subscription plans
- ✅ Create new plans
- ✅ Update existing plans
- ✅ Delete plans
- ✅ Plan features management (OCR, AI)
- ✅ Pricing tiers (MONTHLY, YEARLY, LIFETIME)

#### 5.5.2 User Subscriptions

- ✅ View user subscriptions
- ✅ Subscription history
- ✅ Status tracking (PENDING, ACTIVE, CANCELLED, EXPIRED)
- ✅ Auto-renewal settings

#### 5.5.3 Subscription Stats

- ✅ Total subscriptions
- ✅ Revenue metrics
- ✅ Plan distribution
- ✅ Churn analysis

### 5.6 User Management (Planned)

- User listing
- User details
- User status (Active/Locked)
- Role assignment
- Last login tracking

### 5.7 Additional Features

#### 5.7.1 Export/Import

- ✅ Export data to CSV/Excel
- ✅ Import data from files

#### 5.7.2 Feature Gating

- ✅ Feature flags system
- ✅ Conditional feature access based on subscription

#### 5.7.3 Ads Management

- Partner portal
- Ad campaign management

---

## 6. API INTEGRATION

### 6.1 API Configuration

**Base URL**: `http://76.13.21.84:3000/api/v1`  
**Socket URL**: `http://76.13.21.84:3102`

### 6.2 API Endpoints Mapping

#### 6.2.1 Auth Service Endpoints

```typescript
AUTH: {
  LOGIN: '/auth/login',                    // POST
  REGISTER: '/auth/register',              // POST
  VERIFY_OTP: '/auth/verify-otp',          // POST
  FORGOT_PASSWORD: '/auth/forgot-password', // POST
  RESET_PASSWORD: '/auth/reset-password',   // POST
  VERIFY: '/auth/verify',                   // GET
  ME: '/auth/me',                          // GET
  REFRESH: '/auth/refresh',                // POST
}
```

#### 6.2.2 Blog Service Endpoints

```typescript
BLOGS: {
  LIST: '/blogs',                          // GET
  DETAIL: (id) => `/blogs/${id}`,          // GET
  APPROVE: (id) => `/blogs/${id}/approve`, // POST
  REJECT: (id) => `/blogs/${id}/reject`,   // POST
}
```

#### 6.2.3 Notification Service Endpoints

```typescript
NOTIFICATIONS: {
  LIST: '/notifications',                   // GET
  CREATE: '/notifications',                 // POST
  READ: (id) => `/notifications/${id}/read`, // POST
  READ_ALL: '/notifications/read-all',      // POST
  DELETE: (id) => `/notifications/${id}`,   // DELETE
  DELETE_ALL: '/notifications',             // DELETE
  UNREAD_COUNT: '/notifications/unread-count', // GET
}
```

#### 6.2.4 Subscription Service Endpoints

```typescript
SUBSCRIPTIONS: {
  PLANS: '/subscriptions/plans',            // GET
  CREATE_PLAN: '/subscriptions/plans',      // POST
  UPDATE_PLAN: (id) => `/subscriptions/plans/${id}`, // PATCH
  DELETE_PLAN: (id) => `/subscriptions/plans/${id}`, // DELETE
  CURRENT: '/subscriptions/current',        // GET
  SUBSCRIBE: '/subscriptions',              // POST
  ADMIN_STATS: '/subscriptions/admin/stats', // GET
}
```

#### 6.2.5 Budget Service Endpoints

```typescript
BUDGETS: {
  LIST: '/budgets',                        // GET
  ADMIN_STATS: '/budgets/admin/stats',     // GET
}
```

#### 6.2.6 Expense Service Endpoints

```typescript
EXPENSES: {
  LIST: '/expenses',                       // GET
  ADMIN_STATS: '/expenses/admin/stats',    // GET
}
```

#### 6.2.7 OCR Service Endpoints

```typescript
OCR: {
  ADMIN_STATS: '/ocr/admin/stats',         // GET
}
```

### 6.3 Axios Configuration

#### 6.3.1 Request Interceptor

```typescript
- Tự động thêm Authorization header
- Bearer token từ localStorage
- Content-Type: application/json
```

#### 6.3.2 Response Interceptor

```typescript
- Handle response normalization
- Error handling
- Token refresh logic
- Auto-logout on 401
```

### 6.4 API Response Formats

#### 6.4.1 Standard Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

#### 6.4.2 Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": { ... }
}
```

---

## 7. AUTHENTICATION & AUTHORIZATION

### 7.1 Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enter credentials
     ▼
┌─────────────────┐
│  Login Page     │
└────┬────────────┘
     │ 2. Submit form
     ▼
┌─────────────────┐
│  authAPI.login()│
└────┬────────────┘
     │ 3. POST /auth/login
     ▼
┌─────────────────┐
│  Backend API    │
└────┬────────────┘
     │ 4. Verify credentials
     ▼
┌─────────────────┐
│  JWT Tokens     │
│  - accessToken  │
│  - refreshToken │
└────┬────────────┘
     │ 5. Return tokens + user
     ▼
┌─────────────────┐
│ AuthContext     │
│ - Save to storage
│ - Update state  │
└────┬────────────┘
     │ 6. Redirect to dashboard
     ▼
┌─────────────────┐
│ Admin Dashboard │
└─────────────────┘
```

### 7.2 Token Management

#### 7.2.1 Storage Strategy

- **Access Token**: `localStorage.accessToken`
  - Used for API authentication
  - Attached to all requests
- **Refresh Token**: `localStorage.refreshToken`
  - Used to renew access token
  - Longer expiration time

- **User Data**: `sessionStorage.user`
  - Cleared when browser closes
  - Parsed on app init

#### 7.2.2 Token Refresh Flow

```typescript
Request → 401 Unauthorized → Refresh Token API
    ↓                              ↓
New Access Token ← Success ← Retry Original Request
    ↓
Update localStorage
```

### 7.3 Authorization System

#### 7.3.1 Role-Based Access Control (RBAC)

```typescript
Role: 'ADMIN' | 'USER'

Admin Permissions:
- Full dashboard access
- Blog moderation (approve/reject)
- Create notifications
- View admin stats
- Manage subscriptions
- User management

User Permissions:
- Limited access (not implemented in admin panel)
```

#### 7.3.2 Route Protection

```typescript
<AdminRoute>
  - Check if user is authenticated
  - Check if user role is ADMIN
  - Redirect to /login if not authorized
</AdminRoute>
```

### 7.4 Session Management

#### 7.4.1 Auto-Login

- Check localStorage for accessToken on app mount
- Verify token with `/auth/me` endpoint
- Restore user state if valid

#### 7.4.2 Auto-Logout

- Clear tokens on manual logout
- Clear tokens on 401 response
- Redirect to login page

---

## 8. REAL-TIME FEATURES

### 8.1 Socket.IO Integration

#### 8.1.1 Socket Configuration

```typescript
URL: http://76.13.21.84:3102
Transport: WebSocket + Polling (fallback)
Auth: JWT token in auth object
Reconnection: Enabled (max 5 attempts)
```

#### 8.1.2 Connection Lifecycle

```
App Mount (if authenticated)
    ↓
initializeSocket(token)
    ↓
Socket Connect
    ↓
Listen to Events
    ↓
User Logout
    ↓
disconnectSocket()
```

### 8.2 Notification Events

#### 8.2.1 Event: `notification:new`

```typescript
Payload: NotificationItem
{
  _id: string
  userId: string
  type: string
  title: string
  message: string
  metadata?: object
  isRead: boolean
  createdAt: string
}

Handler:
- Update notification list
- Increment unread count
- Show toast/alert (optional)
```

#### 8.2.2 Subscription Management

```typescript
subscribeToNotifications(callback)
    → Returns listener ID

unsubscribeFromNotifications(listenerId)
    → Cleanup listener
```

### 8.3 Socket Component

#### 8.3.1 SocketInitializer Component

```typescript
- Mounted in App.tsx
- Auto-connects on user login
- Auto-disconnects on logout
- Re-initializes on user change
```

### 8.4 Real-time UI Updates

#### 8.4.1 Notification Bell

- Live unread count badge
- Auto-updates on new notification
- No polling required

#### 8.4.2 Notification Dropdown

- Real-time notification list
- Auto-prepend new notifications
- Mark as read in real-time

---

## 9. UI/UX DESIGN

### 9.1 Design System

#### 9.1.1 Color Palette

```css
Primary: #1890ff    /* Blue */
Hover: #0050b3      /* Dark Blue */
Success: #52c41a    /* Green */
Warning: #faad14    /* Yellow */
Error: #f5222d      /* Red */
Background: #f5f5f5 /* Light Gray */
Dark: #001529       /* Sidebar Dark */
Text: #000000d9     /* Primary Text */
```

#### 9.1.2 Typography

```css
Font Family:
  -apple-system, BlinkMacSystemFont,
  'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans'

Font Sizes:
  - Heading 1: 24px
  - Heading 2: 20px
  - Body: 14px
  - Small: 12px
```

#### 9.1.3 Spacing

```css
Base Unit: 8px
Padding: 24px (content areas)
Border Radius: 6px (theme), 8px (cards), 4px (inputs)
```

### 9.2 Layout Structure

#### 9.2.1 Admin Layout

```
┌───────────────────────────────────────────┐
│             HEADER (64px)                 │
│  [Toggle] [Logo]        [Bell] [Avatar]  │
├────────┬──────────────────────────────────┤
│        │                                  │
│ SIDE   │  MAIN CONTENT                    │
│ BAR    │  (min-height: calc(100vh-64px))  │
│ 200px  │  padding: 24px                   │
│        │  background: #f5f5f5             │
│ Collapses                                 │
│ to 80px                                   │
│        │                                  │
├────────┴──────────────────────────────────┤
│             FOOTER                        │
└───────────────────────────────────────────┘
```

#### 9.2.2 Responsive Breakpoints

```css
Desktop: > 768px
Tablet: 768px
Mobile: < 576px
```

### 9.3 Component Patterns

#### 9.3.1 Card Pattern

```typescript
<Card>
  <Statistic> // For metrics
  <List>      // For data lists
  <Table>     // For data tables
</Card>
```

#### 9.3.2 Modal Pattern

```typescript
<Modal
  title="..."
  visible={isOpen}
  onOk={handleSubmit}
  onCancel={handleClose}
>
  <Form>...</Form>
</Modal>
```

#### 9.3.3 Loading States

```typescript
// Spinner
<Spin spinning={isLoading}>
  <Content />
</Spin>

// Skeleton
<SkeletonLoader loading={isLoading}>
  <Content />
</SkeletonLoader>

// Overlay
<LoadingOverlay loading={isLoading} />
```

### 9.4 Navigation Design

#### 9.4.1 Sidebar Menu

```
📊 Dashboard
📚 Blog Management
   → Pending Reviews
   → Published Blogs
   → Rejected Blogs
🔔 Notifications (with badge)
👑 Subscription
👤 Profile
⚙️ Account Settings
```

#### 9.4.2 Header Components

```
Left:  [Menu Toggle Button]
Right: [Notification Bell] [User Dropdown]
       (Badge Count)       (Avatar + Name)
```

### 9.5 Ant Design Customization

#### 9.5.1 Theme Config

```typescript
{
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  }
}
```

#### 9.5.2 Component Overrides

```css
.ant-btn-primary {
  background-color: #1890ff;
}

.ant-card {
  border-radius: 8px;
}

.ant-table-thead > tr > th {
  background-color: #fafafa;
  font-weight: 600;
}
```

---

## 10. STATE MANAGEMENT

### 10.1 State Architecture

```
┌─────────────────────────────────────────┐
│        Global State (Context)           │
│  - AuthContext (user, login, logout)    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     Server State (React Query)          │
│  - API data caching                     │
│  - Automatic refetching                 │
│  - Optimistic updates                   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      Local State (useState)             │
│  - Component-level state                │
│  - Form state                           │
│  - UI state (modals, dropdowns)         │
└─────────────────────────────────────────┘
```

### 10.2 React Context

#### 10.2.1 AuthContext

```typescript
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email, password) => Promise<void>
  logout: () => void
  loading: boolean
  updateProfile?: (data) => void
}

Provider: <AuthProvider>
Consumer: useAuth() hook
```

**State Managed:**

- Current user data
- Authentication status
- Loading state

**Operations:**

- Login
- Logout
- Update profile

### 10.3 React Query (TanStack Query)

#### 10.3.1 Query Configuration

```typescript
QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

#### 10.3.2 Query Keys Structure

```typescript
["blogs", "pending"][("blogs", "published")][("blogs", "rejected")][
  ("blogs", id)
]["notifications"][("notifications", "unread-count")][
  ("subscription", "plans")
][("subscription", "stats")][("expense", "admin-stats")][
  ("budget", "admin-stats")
][("ocr", "admin-stats")];
```

#### 10.3.3 Custom Hooks

**useGetExpenseAdminStats()**

```typescript
useQuery(["expense-admin-stats"], expenseAPI.getAdminStats);
```

**useGetBudgetAdminStats()**

```typescript
useQuery(["budget-admin-stats"], budgetAPI.getAdminStats);
```

**useGetOcrAdminStats()**

```typescript
useQuery(["ocr-admin-stats"], ocrAPI.getAdminStats);
```

**useNotificationUnreadCount()**

```typescript
useQuery(["notifications", "unread-count"], notificationAPI.getUnreadCount, {
  refetchInterval: 30000, // Poll every 30s
});
```

### 10.4 Local Storage Strategy

#### 10.4.1 Stored Data

```typescript
localStorage:
  - accessToken: string
  - refreshToken: string
  - all_users: string (JSON array, mock data)

sessionStorage:
  - user: string (JSON object)
```

#### 10.4.2 Storage Utilities

```typescript
// utils/storage.ts
export const storage = {
  getToken: () => localStorage.getItem("accessToken"),
  setToken: (token) => localStorage.setItem("accessToken", token),
  clearAll: () => {
    localStorage.clear();
    sessionStorage.clear();
  },
};
```

---

## 11. ROUTING SYSTEM

### 11.1 Route Structure

```
/ → RootRedirect
    ├─ Authenticated + Admin → /admin/dashboard
    └─ Not authenticated → /login

/login → LoginPage
/forgot-password → ForgotPassword
/clear-storage → ClearStorage

/admin/* → AdminRoute (Protected)
    ├─ /admin/dashboard → AdminDashboard
    ├─ /admin/notifications → NotificationsPage
    ├─ /admin/blogs/pending → PendingBlogs
    ├─ /admin/blogs/published → PublishedBlogs
    ├─ /admin/blogs/rejected → RejectedBlogs
    ├─ /admin/blogs/:id → BlogDetail
    ├─ /admin/subscription → AdminSubscription
    ├─ /admin/profile → ProfilePage
    ├─ /admin/settings → SettingsPage
    ├─ /admin/ads → AdsManagement
    └─ /admin/partners → PartnerPortal
```

### 11.2 Route Guards

#### 11.2.1 AdminRoute Component

```typescript
Function:
  - Check authentication (user exists)
  - Check authorization (role === 'ADMIN')
  - Redirect to /login if not authorized
  - Render children if authorized
```

#### 11.2.2 RootRedirect Component

```typescript
Function:
  - Check authentication
  - Redirect authenticated users to /admin/dashboard
  - Redirect non-authenticated users to /login
```

### 11.3 Navigation Patterns

#### 11.3.1 Programmatic Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to page
navigate("/admin/dashboard");

// Navigate with state
navigate("/admin/blogs/123", { state: { from: "pending" } });

// Go back
navigate(-1);
```

#### 11.3.2 Link Navigation

```typescript
import { Link } from 'react-router-dom'

<Link to="/admin/profile">Profile</Link>
```

#### 11.3.3 Menu Navigation

```typescript
// Ant Design Menu with onClick
{
  key: '/admin/dashboard',
  label: 'Dashboard',
  onClick: () => navigate('/admin/dashboard')
}
```

---

## 12. COMPONENTS ARCHITECTURE

### 12.1 Component Hierarchy

```
App.tsx
├─ AuthProvider
│  └─ Router
│     ├─ LoginPage
│     ├─ ForgotPassword
│     └─ AdminRoute
│        └─ AdminLayout
│           ├─ AdminHeader
│           │  ├─ MenuToggle
│           │  ├─ NotificationBell
│           │  └─ UserDropdown
│           ├─ AdminSidebar
│           │  └─ Menu
│           ├─ Content (Dynamic)
│           │  └─ Page Components
│           └─ Footer
└─ SocketInitializer
```

### 12.2 Component Categories

#### 12.2.1 Layout Components

```
AdminLayout/
  - AdminLayout.tsx (Main layout wrapper)
  - AdminHeader.tsx (Top header bar)
  - AdminSidebar.tsx (Side navigation)
  - Footer.tsx (Footer section)
  - AuthLayout.tsx (Auth pages layout)
```

#### 12.2.2 Page Components

```
pages/
  - Dashboard pages (AdminDashboard, etc.)
  - Auth pages (LoginPage, ForgotPassword)
  - Management pages (Blogs, Notifications, etc.)
  - Settings pages (ProfilePage, SettingsPage)
```

#### 12.2.3 Feature Components

```
components/
  - admin/blogs/ (Blog moderation modals)
  - notifications/ (Notification system)
  - LoadingSpinner, LoadingOverlay (Loading states)
  - BulkActionsBar (Bulk operations)
  - ExportButton, ImportButton (Data operations)
  - RichTextEditor (Content editing)
  - FeatureGate (Feature flags)
```

#### 12.2.4 Guard Components

```
- AdminRoute (Route protection)
- RootRedirect (Smart redirection)
```

### 12.3 Component Patterns

#### 12.3.1 Container/Presenter Pattern

```typescript
// Container (Smart Component)
const BlogsPageContainer = () => {
  const { data, isLoading } = useQuery(...)
  const handleAction = () => {...}

  return <BlogsList data={data} onAction={handleAction} />
}

// Presenter (Dumb Component)
const BlogsList = ({ data, onAction }) => {
  return <Table dataSource={data} ... />
}
```

#### 12.3.2 Compound Component Pattern

```typescript
<NotificationBell>
  <NotificationDropdown>
    <NotificationItem />
    <NotificationItem />
  </NotificationDropdown>
</NotificationBell>
```

#### 12.3.3 Higher-Order Component Pattern

```typescript
<AdminRoute>
  <ProtectedPage />
</AdminRoute>
```

### 12.4 Component Best Practices

✅ **Single Responsibility**: Một component chỉ làm một việc  
✅ **Props Typing**: Strict TypeScript interfaces  
✅ **Default Props**: Sử dụng default values  
✅ **Error Boundaries**: Handle errors gracefully  
✅ **Lazy Loading**: Code splitting cho routes  
✅ **Memoization**: React.memo cho expensive components

---

## 13. TYPE SYSTEM

### 13.1 Core Types

#### 13.1.1 User Types

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "ADMIN" | "USER";
  avatar?: string;
}
```

#### 13.1.2 Auth Types

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile?: (data: Partial<User>) => void;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}
```

### 13.2 Blog Types

```typescript
type BlogStatus = "draft" | "pending" | "published" | "rejected";

interface Blog {
  id: string;
  userId: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  images: string[];
  status: BlogStatus;
  rejectionReason?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    email?: string;
  };
}

interface BlogListResponse {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
}

interface ApproveParams {
  note?: string;
}

interface RejectParams {
  reason: string;
}
```

### 13.3 Notification Types

```typescript
interface NotificationItem {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: {
    blogId?: string;
    authorId?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  createdAt: string;
}

interface NotificationListResponse {
  notifications: NotificationItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

interface NotificationFilters {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  search?: string;
}
```

### 13.4 Subscription Types

```typescript
interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  interval: "MONTHLY" | "YEARLY" | "LIFETIME";
  features: {
    OCR: boolean;
    AI: boolean;
  };
  isFree: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserSubscription {
  _id: string;
  userId: string;
  planId: SubscriptionPlan;
  status: "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 13.5 Stats Types

#### 13.5.1 Expense Stats

```typescript
interface ExpenseAdminStats {
  totalExpenses: number;
  totalAmount: number;
  totalUsers: number;
  byCategory: {
    category: string;
    total: number;
    count: number;
  }[];
  recentExpenses: {
    id: string;
    userId: string;
    description: string;
    amount: number;
    category: string;
    spentAt: string;
    createdAt: string;
  }[];
}
```

#### 13.5.2 Budget Stats

```typescript
interface BudgetAdminStats {
  totalBudgets: number;
  totalAmount: number;
  totalSpent: number;
  totalUsers?: number;
  averageBudgetAmount: number;
  categoriesBreakdown: {
    [key: string]: {
      count: number;
      totalAmount: number;
    };
  };
  periodBreakdown: {
    MONTHLY: number;
    WEEKLY: number;
    YEARLY: number;
  };
  statusBreakdown: {
    ON_TRACK: number;
    AT_RISK: number;
    EXCEEDED: number;
  };
}
```

#### 13.5.3 OCR Stats

```typescript
interface OcrAdminStats {
  totalJobs: number;
  totalUsers: number;
  successfulScans?: number;
  failedScans?: number;
  successRate?: number;
  averageProcessingTime?: number;
  typeBreakdown?: {
    RECEIPT: number;
    QR_CODE: number;
  };
}
```

---

## 14. CONFIGURATION MANAGEMENT

### 14.1 Environment Variables

```bash
# .env file
VITE_API_BASE_URL=http://76.13.21.84:3000/api/v1
VITE_SOCKET_URL=http://76.13.21.84:3102
```

**Access in code:**

```typescript
import.meta.env.VITE_API_BASE_URL;
import.meta.env.VITE_SOCKET_URL;
```

### 14.2 API Configuration

**Centralized Config**: `src/config/api.config.ts`

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ||
                 'http://76.13.21.84:3000/api/v1'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
                   'http://76.13.21.84:3102'

export const API_CONFIG = {
  BASE_URL,
  SOCKET_URL,
  AUTH: { ... },
  BLOGS: { ... },
  NOTIFICATIONS: { ... },
  SUBSCRIPTIONS: { ... },
  BUDGETS: { ... },
  EXPENSES: { ... },
  OCR: { ... }
}
```

**Benefits:**

- ✅ Single source of truth
- ✅ Easy to update endpoints
- ✅ Type-safe endpoint functions
- ✅ Environment-based configuration

### 14.3 TypeScript Configuration

#### 14.3.1 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 14.4 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

---

## 15. BEST PRACTICES & PATTERNS

### 15.1 Code Organization

✅ **Feature-based folder structure**  
✅ **Barrel exports (index.ts) cho clean imports**  
✅ **Separation of concerns (UI, logic, data)**  
✅ **DRY principle (Don't Repeat Yourself)**

### 15.2 TypeScript Best Practices

✅ **Strict type checking enabled**  
✅ **Interface over Type (for objects)**  
✅ **Avoid `any` type**  
✅ **Use generic types where appropriate**  
✅ **Enums for fixed values**

### 15.3 React Best Practices

✅ **Functional components only**  
✅ **Hooks for state and side effects**  
✅ **Custom hooks for reusable logic**  
✅ **PropTypes via TypeScript interfaces**  
✅ **Key prop for lists**  
✅ **Avoid inline functions in render (useCallback)**

### 15.4 Performance Optimization

✅ **Code splitting với React.lazy()**  
✅ **Memoization với React.memo()**  
✅ **useCallback và useMemo cho expensive operations**  
✅ **React Query caching**  
✅ **Debounce/Throttle cho search và scroll**  
✅ **Lazy loading images**

### 15.5 Error Handling

✅ **Try-catch trong async functions**  
✅ **Error boundaries cho UI errors**  
✅ **Toast/Message notifications cho user feedback**  
✅ **Fallback UI cho loading và error states**  
✅ **Axios interceptors cho global error handling**

### 15.6 Security Practices

✅ **JWT token storage best practices**  
✅ **XSS prevention (sanitize user input)**  
✅ **CSRF protection**  
✅ **Secure HTTP headers**  
✅ **Input validation**  
✅ **Role-based access control**

### 15.7 Testing Strategy (Recommended)

📝 **Unit Tests**

- Components với React Testing Library
- Utility functions
- Custom hooks

📝 **Integration Tests**

- API integration
- Auth flow
- User workflows

📝 **E2E Tests**

- Critical user paths
- Cypress/Playwright

### 15.8 Git Workflow (Recommended)

```
main
  ├─ develop
  │   ├─ feature/blog-management
  │   ├─ feature/notifications
  │   ├─ fix/auth-bug
  │   └─ hotfix/critical-issue
```

**Commit Convention:**

```
feat: Add blog approval modal
fix: Fix notification badge count
refactor: Optimize dashboard queries
docs: Update API documentation
style: Format code with prettier
```

---

## 📊 METRICS & ANALYTICS

### Current State

**Lines of Code**: ~5,000+ (estimated)  
**Components**: 45+ React components  
**API Endpoints**: 30+ endpoints integrated  
**Pages**: 15+ admin pages  
**Types/Interfaces**: 50+ TypeScript definitions

### Tech Debt & Improvements

🔧 **Recommended Improvements:**

1. Add comprehensive testing (0% coverage currently)
2. Implement error boundaries
3. Add logging system (Winston/Pino)
4. Performance monitoring (React DevTools Profiler)
5. Accessibility improvements (ARIA labels)
6. Internationalization (i18n)
7. Dark mode support
8. Progressive Web App (PWA) features

---

## 🚀 DEPLOYMENT

### Development

```bash
npm run dev
# Vite dev server on http://localhost:5173
```

### Production Build

```bash
npm run build
# Output: dist/ folder
```

### Docker Support

```dockerfile
# Dockerfile exists
# Build: docker build -t fepa-admin .
# Run: docker run -p 3000:3000 fepa-admin
```

---

## 📝 CHANGELOG & VERSION HISTORY

**Version 0.0.0** (Current)

- Initial development phase
- Core features implemented
- Admin dashboard operational
- Blog management system
- Notification system
- Subscription management

---

## 👥 TEAM & CREDITS

**Project**: FEPA Web Admin  
**Framework**: React + TypeScript + Vite  
**UI Library**: Ant Design  
**State Management**: React Query + Context API

---

## 📞 SUPPORT & DOCUMENTATION

**Additional Documentation:**

- [Budget API Documentation](BUDGET_API_DOCUMENTATION.md)
- [Expense API Documentation](EXPENSE_API_DOCUMENTATION.md)
- [OCR API Documentation](OCR_API_DOCUMENTATION.md)
- [Config README](src/config/README.md)
- [Services README](src/services/README.md)

---

**End of Report**

_Generated on: January 24, 2026_  
_Report Version: 1.0.0_
