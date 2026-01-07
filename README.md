# FEPA Webadmin - Financial Expense Planning Application

> Admin Dashboard for managing FEPA application - A comprehensive financial management system

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.22.0-blue.svg)](https://ant.design/)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple.svg)](https://vitejs.dev/)

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

#### Blog Management
- CRUD bài viết blog
- Quản lý danh mục và tags
- Draft/Published/Archived status
- Xem số lượt view và engagement

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
│   │   │   ├── BlogManagement.tsx
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
const users = JSON.parse(localStorage.getItem('users') || '[]')

// After (API integration)
import { userService } from '@/services/api/userService'
const users = await userService.getAllUsers()
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

GET    /api/v1/blogs              - Get blog posts
POST   /api/v1/blogs              - Create blog post

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
*Overview với thống kê tổng quan, biểu đồ và hoạt động gần đây*

### User Management
![User Management](./docs/screenshots/users.png)
*Quản lý người dùng với CRUD operations*

### Reports & Analytics
![Reports](./docs/screenshots/reports.png)
*Báo cáo tài chính với charts và rankings*

### System Settings
![Settings](./docs/screenshots/settings.png)
*Cấu hình API keys và bảo mật*

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
- [x] Blog Management
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

*Last Updated: December 19, 2025*
