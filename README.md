# FEPA Webadmin - Financial Expense Planning Application

> Admin Dashboard for managing FEPA application - A comprehensive financial management system

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.22.0-blue.svg)](https://ant.design/)
[![Vite](https://img.shields.io/badge/Vite-6.4.1-purple.svg)](https://vitejs.dev/)

## 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd FEPA

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

**Access**: http://localhost:5174

## 📚 Documentation

- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Architecture, API integration, state management
- **[User Guide](USER_GUIDE.md)** - Complete admin user manual
- **[Testing Guide](TESTING_GUIDE.md)** - Testing checklist and procedures
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step deployment instructions
- **[Production Checklist](PRODUCTION_CHECKLIST.md)** - Pre-deployment verification
- **[Project Completion Plan](PROJECT_COMPLETION_PLAN.md)** - Development roadmap

---

## 🎨 Phân Tích Kiến Trúc & Thiết Kế

### 1. Tổng Quan Kiến Trúc

FEPA Webadmin được thiết kế theo mô hình **Single Page Application (SPA)** hiện đại, sử dụng kiến trúc **Component-Based Architecture** với các nguyên tắc thiết kế:

#### 🏗️ Kiến Trúc Phân Tầng (Layered Architecture)

```
┌─────────────────────────────────────────────────────┐
│              Presentation Layer (UI)                 │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐ │
│  │   Pages    │  │  Layouts   │  │  Components   │ │
│  └────────────┘  └────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────┘
                       ⬇️
┌─────────────────────────────────────────────────────┐
│           Business Logic Layer (Logic)              │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐ │
│  │   Context  │  │   Hooks    │  │     Utils     │ │
│  └────────────┘  └────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────┘
                       ⬇️
┌─────────────────────────────────────────────────────┐
│        Data Access Layer (API Integration)          │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐ │
│  │  Services  │  │ API Client │  │  Query Client │ │
│  └────────────┘  └────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────┘
                       ⬇️
            [Backend Microservices APIs]
```

### 2. Các Pattern Thiết Kế Được Áp Dụng

#### ✅ **Container/Presentational Pattern**

- **Pages** (Container Components): Xử lý logic, state, API calls
- **Components** (Presentational): Chỉ nhận props và render UI
- Ví dụ: [AdminDashboard.tsx](src/pages/admin/AdminDashboard.tsx) (container) sử dụng [SubscriptionStats.tsx](src/components/SubscriptionStats.tsx) (presentational)

#### ✅ **Context API Pattern**

- Quản lý global state (Authentication, User Info)
- File: [AuthContext.tsx](src/context/AuthContext.tsx)
- Tránh props drilling, shared state across components

#### ✅ **Custom Hooks Pattern**

- Tái sử dụng logic: `useAuth`, `useFetch`, `useForm`, `useBulkActions`
- Ví dụ: [useAuth.ts](src/hooks/useAuth.ts) - xử lý login/logout logic

#### ✅ **Higher Order Component (HOC) Pattern**

- [AdminRoute.tsx](src/components/AdminRoute.tsx) - Route protection
- [FeatureGate.tsx](src/components/FeatureGate.tsx) - Feature gating

#### ✅ **Factory Pattern**

- API Services ([authAPI.ts](src/services/api/authAPI.ts), [userAPI.ts](src/services/api/userAPI.ts))
- Centralized API configuration

#### ✅ **Singleton Pattern**

- [queryClient.ts](src/services/queryClient.ts) - React Query client
- [apiClient.ts](src/services/apiClient.ts) - Axios instance

### 3. Cấu Trúc Dự Án (Folder Structure)

Dự án tuân theo nguyên tắc **Separation of Concerns** và **Feature-Based Organization**:

```
src/
├── pages/              # Tầng Presentation - Màn hình chính
│   ├── admin/         # Admin features (Dashboard, Users, Reports...)
│   ├── auth/          # Authentication screens
│   └── profile/       # User profile
│
├── layouts/           # Layout templates (AdminLayout, AuthLayout)
│   └── components/    # Layout-specific components
│
├── components/        # Shared/Reusable components
│   ├── AdminRoute.tsx        # Route guard
│   ├── FeatureGate.tsx       # Feature toggle
│   ├── BulkActionsBar.tsx    # Batch operations
│   └── LoadingSpinner.tsx    # UI feedback
│
├── services/          # Tầng Data Access - API Integration
│   ├── api/          # API service modules (authAPI, userAPI)
│   ├── apiClient.ts  # Axios instance + interceptors
│   ├── queryClient.ts # React Query configuration
│   └── socket.ts     # WebSocket connection
│
├── context/          # Global State Management
│   └── AuthContext.tsx
│
├── hooks/            # Custom React Hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useBulkActions.ts
│
├── types/            # TypeScript type definitions
│   └── index.ts      # Shared types
│
├── utils/            # Helper functions
│   ├── storage.ts    # LocalStorage/SessionStorage helpers
│   ├── exportUtils.ts # Export to Excel/PDF
│   └── importUtils.ts # Import from Excel
│
└── config/           # Configuration files
    └── api.config.ts # API endpoints & settings
```

### 4. Ưu Điểm Của Thiết Kế

#### 🚀 **Hiệu Suất Cao**

- **Vite**: Build nhanh với HMR (Hot Module Replacement)
- **Code Splitting**: Lazy loading các route/component
- **React Query**: Cache, dedupe requests, background refetch
- **Memoization**: useMemo, useCallback để tránh re-render không cần thiết

#### 🔒 **Bảo Mật**

- **JWT Authentication**: Access token + Refresh token
- **Route Guards**: AdminRoute component bảo vệ private routes
- **Axios Interceptors**: Auto attach token, handle 401 errors
- **SessionStorage**: Tự động xóa khi đóng tab (tránh lưu lâu dài)

#### 🎯 **Dễ Bảo Trì (Maintainability)**

- **TypeScript**: Type safety, giảm bugs
- **Separation of Concerns**: Tách biệt UI, Logic, Data
- **Consistent Naming**: Conventions rõ ràng cho files/folders
- **Component Reusability**: DRY principle

#### 📱 **Responsive Design**

- **Ant Design Grid System**: Tự động responsive
- **Mobile-friendly**: Sidebar collapse, responsive tables
- **CSS Modules**: Scoped styling, tránh conflict

#### 🧪 **Khả Năng Mở Rộng (Scalability)**

- **Modular Structure**: Dễ thêm feature mới
- **API Service Layer**: Dễ thay đổi backend
- **Feature Gating**: Bật/tắt tính năng theo môi trường
- **Config Centralization**: Dễ chuyển đổi môi trường (dev/staging/prod)

### 5. Tech Stack & Lý Do Lựa Chọn

#### **Frontend Core**

- **React 18.3.1**:
  - Virtual DOM, hiệu năng cao
  - Concurrent features (Suspense, Transitions)
  - Hệ sinh thái lớn, cộng đồng mạnh
- **TypeScript 5.7.2**:
  - Type safety, giảm lỗi runtime
  - Better IDE support (IntelliSense)
  - Self-documenting code

- **Vite 6.0.1**:
  - Build cực nhanh (sử dụng esbuild)
  - Hot Module Replacement instant
  - Modern ES modules

#### **UI Framework**

- **Ant Design 5.22.0**:
  - Enterprise-grade component library
  - Design system nhất quán
  - Accessibility built-in (ARIA)
  - 50+ components sẵn có
  - Theme customization dễ dàng

#### **State Management**

- **React Context API**: Global state (Auth, User)
- **React Query (@tanstack/react-query)**:
  - Server state management
  - Auto caching, refetching
  - Optimistic updates
  - Request deduplication

#### **Routing**

- **React Router 6.28.0**:
  - Nested routes
  - Protected routes (AdminRoute wrapper)
  - Code splitting support

#### **Data Visualization**

- **Recharts 3.6.0**:
  - React-based charts
  - Responsive, composable
  - Line/Bar/Pie charts với animation

#### **HTTP Client**

- **Axios 1.13.2**:
  - Interceptors (auto token injection)
  - Request/Response transformation
  - Error handling centralized
  - Cancel requests support

### 6. API Integration Architecture

#### **Centralized API Configuration**

```typescript
// config/api.config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 30000,
  ENDPOINTS: { auth: '/auth', users: '/users', ... }
}
```

#### **Axios Instance với Interceptors**

```typescript
// services/apiClient.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout + redirect to login
    }
    return Promise.reject(error);
  },
);
```

#### **Service Layer Pattern**

- Mỗi domain có một service file riêng
- Ví dụ: `authAPI.ts`, `userAPI.ts`
- Tách biệt API logic khỏi UI components

### 7. Các Điểm Nổi Bật Trong Thiết Kế UI/UX

#### 🎨 **Ant Design Theme Customization**

```typescript
const themeConfig = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 6,
  },
};
```

#### 📊 **Dashboard Design**

- Card-based layout
- Real-time statistics với số lớn (Typography.Title)
- Charts với Recharts (Line, Pie, Bar)
- Color-coded badges cho status

#### 📝 **Form Design**

- Ant Design Form với validation rules
- Loading states khi submit
- Error messages rõ ràng
- Success notifications

#### 🔔 **Notification System**

- Toast notifications (message.success/error/warning)
- Notification panel với badge count
- Mark as read functionality
- Priority levels (High/Medium/Low)

#### 📱 **Responsive Sidebar**

- Collapsible menu
- Icons + Text labels
- Active route highlighting
- Mobile hamburger menu

### 8. Security Best Practices

✅ **Authentication Flow**

1. User login → Backend trả về accessToken + refreshToken
2. Store tokens: localStorage (accessToken), httpOnly cookie (refreshToken - ideal)
3. Every API call → Interceptor tự động attach token
4. 401 Error → Auto logout + redirect login
5. SessionStorage lưu user info (xóa khi đóng tab)

✅ **Route Protection**

```tsx
<Route
  path="/admin/*"
  element={
    <AdminRoute>
      {" "}
      {/* Check auth before render */}
      <AdminLayout>...</AdminLayout>
    </AdminRoute>
  }
/>
```

✅ **XSS Prevention**

- React tự động escape output
- DOMPurify cho Rich Text Editor (react-quill)

✅ **CORS Handling**

- Backend config CORS với whitelist domains

### 9. Performance Optimizations

#### ⚡ **Code Splitting**

```tsx
// Lazy load heavy components
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
```

#### ⚡ **React Query Caching**

```typescript
queryClient.setDefaultOptions({
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
});
```

#### ⚡ **Debounce Search Inputs**

```typescript
const debouncedSearch = useMemo(
  () => debounce((value) => fetchData(value), 500),
  [],
);
```

#### ⚡ **Virtualization cho Lists**

- Sử dụng Ant Design Table pagination
- Load more pattern thay vì load all

### 10. Development Workflow

#### 🔧 **Environment Setup**

```bash
npm install          # Install dependencies
npm run dev         # Start dev server (port 5174)
npm run build       # Production build
npm run preview     # Preview production build
```

#### 🔧 **Code Quality Tools**

- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Prettier**: Code formatting (recommended)

#### 🔧 **Git Workflow**

```bash
git checkout -b feature/new-feature
# Make changes...
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create Pull Request
```

---

---

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Cài Đặt](#cài-đặt)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Build & Deployment](#build--deployment)
- [API Integration](#api-integration)
- [Screenshots](#screenshots)
- [Đóng Góp](#đóng-góp)

---

## 🎯 Giới Thiệu

**FEPA Webadmin** là ứng dụng quản trị web dành cho hệ thống FEPA (Financial Expense Planning Application). Được xây dựng trên kiến trúc **Microservices**, Webadmin đóng vai trò là giao diện quản lý cho Admin, cung cấp các công cụ để giám sát, quản lý người dùng, nội dung, quảng cáo, và cấu hình hệ thống.

### Vai Trò Trong Hệ Thống

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │────▶│   API Gateway   │────▶│  Auth Service   │
│   (Users)       │     │  (Backend APIs) │     │  User Service   │
└─────────────────┘     └─────────────────┘     │  Budget Service │
                               ▲                 │  Expense Service│
                               │                 └─────────────────┘
                        ┌──────┴────────┐
                        │  Webadmin     │
                        │  (Management) │
                        └───────────────┘
```

---

## ✨ Tính Năng

### 🏠 Dashboard & Overview

- **Dashboard tổng quan** với thống kê real-time
- Biểu đồ phân tích người dùng, doanh thu, gói Premium
- Thông báo và hoạt động gần đây

### 👥 User Management

- ✅ CRUD người dùng (Create, Read, Update, Delete)
- ✅ Lock/Unlock tài khoản
- ✅ Reset mật khẩu
- ✅ Lọc theo role và trạng thái
- ✅ Xem lịch sử đăng nhập

### 💰 Core Data Management

- **Expenses**: Giám sát chi tiêu của người dùng (view-only)
- **Budgets**: Theo dõi ngân sách và tiến độ (view-only)
- **Categories**: Quản lý danh mục thu chi (view-only)

### 📊 Reports & Analytics

- Báo cáo tài chính theo tháng/năm
- Biểu đồ Line chart, Pie chart, Bar chart
- Xếp hạng người dùng theo chi tiêu
- So sánh dữ liệu theo khoảng thời gian

### 👑 Subscription Management

- Quản lý các gói Premium (Free, Basic, Premium)
- Theo dõi người dùng đăng ký
- Thống kê doanh thu từ subscription
- Cấu hình tính năng và giới hạn cho từng gói

### 📝 Content Management

#### Advertising Management

- Quản lý banner quảng cáo
- Theo dõi hiệu suất (Impressions, Clicks, CTR)
- Quản lý đối tác quảng cáo
- Ngân sách và theo dõi chi phí

#### Partner Portal

- Dashboard riêng cho partners
- Xem hiệu suất quảng cáo của họ
- Biểu đồ phân tích theo thời gian
- Xuất báo cáo

### ⚙️ System Configuration

#### System Settings

- **API Keys**: Cấu hình PayOS, VNPay, Firebase FCM, OAuth
- **Financial Rules**: Quy tắc thu nhập/chi tiêu theo độ tuổi, giới tính, vị trí
- **Security**: RSA 2048, OAuth, 2FA, session timeout, password policy

#### System Health Monitoring

- Giám sát trạng thái các service (API, Database, External)
- Uptime percentage và response time
- Cảnh báo và nhật ký lỗi
- Timeline alerts

### 🔔 Notifications

- Hệ thống thông báo riêng cho Admin
- Phân loại theo mức độ ưu tiên (High/Medium/Low)
- Mark as read/unread
- Lọc theo trạng thái

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend Framework

- **React 18.3.1** - UI Library
- **TypeScript 5.7.2** - Type safety
- **Vite** - Build tool & Dev server

### UI & Styling

- **Ant Design 5.22.0** - Component library
- **Ant Design Icons** - Icon set
- **CSS Modules** - Component styling

### State Management & Routing

- **React Context API** - Global state
- **React Router 6.28.0** - Client-side routing
- **localStorage** - Mock data storage (temporary)

### Data Visualization

- **recharts 3.6.0** - Charts library (Line, Bar, Pie)

### HTTP Client

- **axios 1.13.2** - API calls with interceptors

### Utilities

- **dayjs 1.11.19** - Date/time handling

---

## 📁 Cấu Trúc Thư Mục

```
Webadmin/
├── public/                      # Static assets
├── src/
│   ├── components/              # Shared components
│   │   ├── AdminRoute.tsx       # Protected route guard
│   │   └── RootRedirect.tsx     # Root redirect logic
│   │
│   ├── context/                 # React Context
│   │   └── AuthContext.tsx      # Authentication state
│   │
│   ├── layouts/                 # Layout components
│   │   ├── AdminLayout/         # Admin layout wrapper
│   │   ├── AdminHeader.tsx      # Top navigation bar
│   │   ├── AdminSidebar.tsx     # Side navigation menu
│   │   ├── Footer.tsx           # Footer component
│   │   └── AuthLayout.tsx       # Auth pages layout
│   │
│   ├── pages/                   # Page components
│   │   ├── admin/               # Admin pages (13 files)
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── AdminExpenses.tsx
│   │   │   ├── AdminBudgets.tsx
│   │   │   ├── AdminCategories.tsx
│   │   │   ├── AdminReports.tsx
│   │   │   ├── AdminSubscription.tsx
│   │   │   ├── AdminNotifications.tsx
│   │   │   ├── AdsManagement.tsx
│   │   │   ├── PartnerPortal.tsx
│   │   │   ├── SystemSettings.tsx
│   │   │   └── SystemHealth.tsx
│   │   │
│   │   ├── auth/                # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPassword.tsx
│   │   │
│   │   ├── profile/             # Profile page
│   │   └── settings/            # Settings page
│   │
│   ├── services/                # Services & utilities
│   │   ├── api/                 # API integration
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils/               # Helper functions
│   │
│   ├── styles/                  # Global styles
│   ├── types/                   # TypeScript types
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
│
├── .dockerignore                # Docker ignore rules
├── Dockerfile                   # Docker configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── QUICK_START.md               # Quick start guide
├── API_INTEGRATION_GUIDE.md     # API integration docs
└── README.md                    # This file
```

---

## 🚀 Cài Đặt

### Yêu Cầu Hệ Thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x hoặc **yarn**: >= 1.22.x
- **Git**: Latest version

### Các Bước Cài Đặt

1. **Clone repository**

```bash
git clone https://github.com/XDOOPAPP/FEPA.git
cd FEPA/Webadmin
```

2. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
```

3. **Cấu hình environment (optional)**

```bash
# Tạo file .env.local nếu cần
cp .env.example .env.local
```

---

## 💻 Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5174**

### Production Build

```bash
# Build project
npm run build

# Preview production build
npm run preview
```

### Lint & Type Check

```bash
# Run ESLint
npm run lint

# TypeScript check
npx tsc --noEmit
```

---

## 🐳 Build & Deployment

### Docker

#### Build Docker Image

```bash
docker build -t fepa-webadmin:latest .
```

#### Run Container

```bash
docker run -d \
  -p 80:80 \
  --name fepa-webadmin \
  fepa-webadmin:latest
```

#### Docker Compose (với backend services)

```bash
# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f webadmin

# Dừng services
docker-compose down
```

### Production Deployment

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.fepa.com;

    root /var/www/fepa-webadmin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔌 API Integration

### Current State: Mock Data

Hiện tại, ứng dụng sử dụng **localStorage** để lưu trữ mock data. Tất cả các trang đều có comments `// TODO: Replace with API call` để chỉ ra nơi cần tích hợp API.

### Integration Steps

1. **Đọc tài liệu**: Xem [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

2. **Cấu hình axios instance**: File `src/services/api/axiosInstance.ts`

3. **Replace localStorage calls** với API calls:

```typescript
// Before (Mock data)
const users = JSON.parse(localStorage.getItem("users") || "[]");

// After (API integration)
import { userService } from "@/services/api/userService";
const users = await userService.getAllUsers();
```

4. **Test với backend**: Xem [QUICK_START.md](./QUICK_START.md) để test với auth-service

### API Endpoints Expected

```
GET    /api/v1/users              - Get all users
POST   /api/v1/users              - Create user
PUT    /api/v1/users/:id          - Update user
DELETE /api/v1/users/:id          - Delete user

GET    /api/v1/expenses           - Get expenses
GET    /api/v1/budgets            - Get budgets
GET    /api/v1/categories         - Get categories

GET    /api/v1/subscriptions      - Get subscription plans
GET    /api/v1/user-subscriptions - Get user subscriptions

GET    /api/v1/advertisements     - Get ads
GET    /api/v1/reports/analytics  - Get analytics data

GET    /api/v1/system/settings    - Get system settings
PUT    /api/v1/system/settings    - Update settings

GET    /api/v1/system/health      - Get system health status
```

---

## 📸 Screenshots

### Dashboard

![Dashboard](./docs/screenshots/dashboard.png)
_Overview với thống kê tổng quan, biểu đồ và hoạt động gần đây_

### User Management

![User Management](./docs/screenshots/users.png)
_Quản lý người dùng với CRUD operations_

### Reports & Analytics

![Reports](./docs/screenshots/reports.png)
_Báo cáo tài chính với charts và rankings_

### System Settings

![Settings](./docs/screenshots/settings.png)
_Cấu hình API keys và bảo mật_

---

## 🧪 Testing

### Manual Testing

```bash
# Login credentials (mock)
Email: admin@fepa.com
Password: admin123
```

### Future: Automated Tests

```bash
# Unit tests (planned)
npm run test

# E2E tests (planned)
npm run test:e2e
```

---

## 📝 Development Guidelines

### Code Style

- Follow **TypeScript** best practices
- Use **Ant Design** components consistently
- Keep components **small and focused**
- Write **clear comments** for complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit with meaningful messages
git commit -m "feat: add user export functionality"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

```
feat: New feature
fix: Bug fix
docs: Documentation update
style: Code style change
refactor: Code refactoring
test: Test updates
chore: Build/config updates
```

---

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

### Contributors

- **Team Lead**: [Your Name]
- **Frontend Dev**: Webadmin UI/UX
- **Backend Dev**: API Services
- **Mobile Dev**: React Native App

---

## 📄 License

This project is part of FEPA (Financial Expense Planning Application) - All rights reserved.

---

## 📞 Support & Contact

- **GitHub**: [XDOOPAPP/FEPA](https://github.com/XDOOPAPP/FEPA)
- **Email**: support@fepa.com
- **Documentation**: [Wiki](https://github.com/XDOOPAPP/FEPA/wiki)

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅ (COMPLETED)

- [x] Dashboard & Overview
- [x] User Management
- [x] Core Data Management
- [x] Reports & Analytics
- [x] Subscription Management

### Phase 2: Content & Ads ✅ (COMPLETED)

- [x] Advertisement Management
- [x] Partner Portal

### Phase 3: System Management ✅ (COMPLETED)

- [x] System Settings
- [x] System Health Monitoring

### Phase 4: API Integration 🔄 (IN PROGRESS)

- [x] Auth Service integration
- [ ] User Service integration
- [ ] Budget/Expense Service integration
- [ ] Notification Service integration

### Phase 5: Production Ready 🔜 (PLANNED)

- [ ] Unit & Integration tests
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment
- [ ] Monitoring & Logging

---

**Made with ❤️ by FEPA Team**

_Last Updated: December 19, 2025_
