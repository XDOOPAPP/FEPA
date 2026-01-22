# Hướng Dẫn Tích Hợp - Blog Management Feature

Hướng dẫn chi tiết để thêm phần quản lý blog vào web admin hiện có.

**Backend API**: `http://76.13.21.84:3000/api/v1`

**Lưu ý**: Backend là microservice giao tiếp qua RabbitMQ. API Gateway đã được cấu hình để xử lý REST endpoints.

---

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Navigation & Menu Structure](#navigation--menu-structure)
3. [Các Trang Blog Management](#các-trang-blog-management)
4. [UI Design - Pages](#ui-design---pages)
5. [Components Cần Thêm](#components-cần-thêm)
6. [Cấu Trúc Folder Integration](#cấu-trúc-folder-integration)
7. [API Endpoints](#api-endpoints)
8. [Code Examples](#code-examples)
9. [Implementation Checklist](#implementation-checklist)

---

---

## 🎯 Tổng Quan

Feature quản lý blog cần thêm vào web admin hiện có:

### Chức Năng Chính

- 📋 Xem danh sách bài viết chờ duyệt (Pending)
- 📋 Xem danh sách bài viết đã xuất bản (Published)
- 📋 Xem danh sách bài viết bị từ chối (Rejected)
- 👁️ Xem chi tiết bài viết
- ✅ Phê duyệt bài viết
- ❌ Từ chối bài viết
- 🔍 Tìm kiếm bài viết
- 📊 Lọc theo trạng thái, tác giả, ngày tạo

### Người Dùng Sử Dụng

- Admin/Moderator: Có quyền duyệt bài và quản lý nội dung

---

## 🗂️ Navigation & Menu Structure

### Thêm Menu Item vào Sidebar

```
Admin Panel
├── Dashboard
├── 📚 Blog Management (MENU MỚI)
│   ├── Pending Reviews (badge: số lượng)
│   ├── Published Blogs
│   └── Rejected Blogs
├── Users
├── Analytics
└── Settings
```

### Cấu Trúc Routing

```
/admin/dashboard
/admin/blogs/pending
/admin/blogs/published
/admin/blogs/rejected
/admin/blogs/:id (detail view)
```

## 📄 Các Trang Blog Management

### 1. **Pending Reviews** (Bài Chờ Duyệt)

**Route**: `/admin/blogs/pending`

**Thành Phần Chính:**

- Danh sách các bài viết chờ phê duyệt
- Filter: Tác giả, ngày gửi, tiêu đề
- Pagination: 10, 20, 50 items/trang
- Actions: View, Approve, Reject

**Badge**: Hiển thị số lượng pending trên menu

---

### 2. **Published Blogs** (Bài Đã Xuất Bản)

**Route**: `/admin/blogs/published`

**Thành Phần Chính:**

- Danh sách bài viết đã public
- Filter: Tác giả, ngày xuất bản
- Pagination
- Actions: View

---

### 3. **Rejected Blogs** (Bài Bị Từ Chối)

**Route**: `/admin/blogs/rejected`

**Thành Phần Chính:**

- Danh sách bài bị từ chối
- Hiển thị lý do từ chối
- Filter: Tác giả, ngày từ chối
- Pagination
- Actions: View

---

### 4. **Blog Detail** (Chi Tiết Bài Viết)

**Route**: `/admin/blogs/:id`

**Thành Phần Chính:**

- Hiển thị toàn bộ nội dung bài viết
- Thumbnail, images
- Thông tin tác giả
- Trạng thái, timestamps
- Action buttons: Approve/Reject (nếu pending)

---

## 🎨 UI Design - Pages

### Layout Pending Reviews

```
┌─ Pending Reviews ──────────────────────────────────────┐
│                                                        │
│ Filters: [Author ▼] [Date ▼] [Search ____]           │
│                                                        │
│ ┌─ Blog Item ────────────────────────────────────┐    │
│ │ [Thumb] Amazing React Tips                    │    │
│ │         By: John Doe | Submitted: 2h ago      │    │
│ │         [View] [Approve] [Reject]             │    │
│ └────────────────────────────────────────────────┘    │
│                                                        │
│ ┌─ Blog Item ────────────────────────────────────┐    │
│ │ [Thumb] Web Design Guide                      │    │
│ │         By: Jane Smith | Submitted: 5h ago    │    │
│ │         [View] [Approve] [Reject]             │    │
│ └────────────────────────────────────────────────┘    │
│                                                        │
│ Showing 1-10 of 25  [← Prev] [1] [2] [3] [Next →]   │
└────────────────────────────────────────────────────────┘
```

### Layout Blog Detail

```
┌─ Blog Detail ─────────────────────────────────┐
│ Status: [PENDING]  Author: John Doe           │
│ Created: Jan 20, 2026 | Updated: 2h ago       │
│                                               │
│ ┌─ Content ─────────────────────────────────┐ │
│ │ Title: Amazing React Tips                 │ │
│ │                                           │ │
│ │ [Thumbnail Image]                         │ │
│ │                                           │ │
│ │ Content text...                           │ │
│ │ Lorem ipsum dolor sit amet...             │ │
│ │                                           │ │
│ │ [Image 1] [Image 2] [Image 3]            │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ ┌─ Actions ─────────────────────────────────┐ │
│ │ [← Back]                                  │ │
│ │ [✓ Approve]  [✕ Reject]                   │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

### Approve Modal

```
┌─ Approve Blog ────────────────────────────┐
│                                           │
│ Title: "Amazing React Tips"              │
│ Author: John Doe                         │
│                                           │
│ ✅ Bài viết sẽ được xuất bản             │
│                                           │
│ [Ghi chú (tùy chọn)]                     │
│ ┌──────────────────────────────────────┐ │
│ │ Nhập ghi chú...                      │ │
│ └──────────────────────────────────────┘ │
│                                           │
│      [Hủy]  [Phê Duyệt]                 │
│                                           │
└───────────────────────────────────────────┘
```

### Reject Modal

```
┌─ Reject Blog ─────────────────────────────┐
│                                           │
│ Title: "Amazing React Tips"              │
│ Author: John Doe                         │
│                                           │
│ ⚠️ Bài viết sẽ bị từ chối                │
│                                           │
│ [Lý do từ chối] *                        │
│ ┌──────────────────────────────────────┐ │
│ │ Nội dung không tuân thủ chính sách... │ │
│ └──────────────────────────────────────┘ │
│                                           │
│       [Hủy]  [Từ Chối]                  │
│                                           │
└───────────────────────────────────────────┘
```

### 1. **BlogList Component**

```typescript
interface BlogListProps {
  status: 'pending' | 'published' | 'rejected';
  onViewDetail: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

// Features:
// - Render blog items in a grid/table
// - Filter & search
// - Pagination
// - Loading states
```

### 2. **BlogItem Component**

```typescript
interface BlogItemProps {
  blog: Blog;
  status: BlogStatus;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

// Hiển thị:
// - Thumbnail
// - Title, author
// - Submitted date
// - Action buttons
```

### 3. **BlogDetail Component**

```typescript
interface BlogDetailProps {
  blogId: string;
  onBack: () => void;
}

// Hiển thị:
// - Full content
// - All images
// - Metadata
// - Action buttons
```

### 4. **ApproveModal Component**

```typescript
interface ApproveModalProps {
  blog: Blog;
  visible: boolean;
  onConfirm: (note?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}
```

### 5. **RejectModal Component**

```typescript
interface RejectModalProps {
  blog: Blog;
  visible: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading?: boolean;
}
```

### 6. **FilterBar Component**

```typescript
interface FilterBarProps {
  onFilterChange: (filters: BlogFilters) => void;
  onSearch: (query: string) => void;
}

interface BlogFilters {
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
```

### 7. **BlogPagination Component**

```typescript
interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

---

## � Cấu Trúc Folder Integration

Thêm vào project hiện có:

```
src/
├── pages/
│   ├── admin/
│   │   ├── blogs/
│   │   │   ├── PendingBlogs.tsx
│   │   │   ├── PublishedBlogs.tsx
│   │   │   ├── RejectedBlogs.tsx
│   │   │   ├── BlogDetail.tsx
│   │   │   └── index.ts
│   │   └── [existing pages...]
│   └── [existing pages...]
│
├── components/
│   ├── admin/
│   │   ├── blogs/
│   │   │   ├── BlogList.tsx
│   │   │   ├── BlogItem.tsx
│   │   │   ├── BlogDetail.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── ApproveModal.tsx
│   │   │   ├── RejectModal.tsx
│   │   │   ├── BlogPagination.tsx
│   │   │   └── styles.css
│   │   └── [existing components...]
│   └── [existing components...]
│
├── services/
│   ├── blogService.ts (NEW)
│   └── [existing services...]
│
├── types/
│   ├── blog.ts (NEW)
│   └── [existing types...]
│
└── [existing folders...]
```

---

## � API Endpoints

### Danh Sách Đầy Đủ Các Endpoint

#### GET - Lấy Danh Sách Bài Viết

```http
GET /api/v1/blogs?status=pending
GET /api/v1/blogs?status=published
GET /api/v1/blogs?status=rejected
GET /api/v1/blogs?status=draft

Query Parameters:
- status: draft | pending | published | rejected (required)
- userId: lọc theo user (optional)

Lưu ý: Backend tự động xử lý pagination và trả về tất cả kết quả
```

#### GET - Lấy Chi Tiết Bài Viết

```http
GET /api/v1/blogs/:id                  # Chi tiết bài viết theo ID
GET /api/v1/blogs/slug/:slug           # Chi tiết bài viết theo slug
```

#### POST - Hành Động Admin (Moderation)

```http
POST /api/v1/blogs/:id/approve
Content-Type: application/json
Body: { "note": "Optional ghi chú" }

POST /api/v1/blogs/:id/reject
Content-Type: application/json
Body: { "reason": "Lý do từ chối" }  # REQUIRED
```

#### Các Endpoint Không Dùng Cho Admin

Các endpoint sau là dành cho users, không cần implement trong admin:

```http
POST   /api/v1/blogs                   # Tạo bài viết mới (user)
POST   /api/v1/blogs/upload/single     # Upload ảnh (user)
POST   /api/v1/blogs/:id/submit        # Gửi bài để duyệt (user)
GET    /api/v1/blogs/my-blogs          # Danh sách bài của tôi (user)
PATCH  /api/v1/blogs/:id               # Cập nhật bài (user, draft only)
DELETE /api/v1/blogs/:id               # Xóa bài (user)
```

```
admin-dashboard/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── index.tsx              # Entry point
│   ├── App.tsx                # App component
│   ├── main.css               # Global styles
│   │
│   ├── pages/                 # Page components
│   │   ├── Dashboard.tsx
│   │   ├── PendingBlogs.tsx
│   │   ├── BlogDetail.tsx
│   │   ├── PublishedBlogs.tsx
│   │   ├── RejectedBlogs.tsx
│   │   ├── LoginPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/            # Reusable components
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.css
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Sidebar.css
│   │   ├── BlogCard/
│   │   │   ├── BlogCard.tsx
│   │   │   └── BlogCard.css
│   │   ├── BlogDetail/
│   │   │   ├── BlogDetail.tsx
│   │   │   └── BlogDetail.css
│   │   ├── ApprovalModal/
│   │   │   ├── ApprovalModal.tsx
│   │   │   └── ApprovalModal.css
│   │   ├── Filter/
│   │   │   ├── FilterBar.tsx
│   │   │   └── FilterBar.css
│   │   ├── Pagination/
│   │   │   ├── Pagination.tsx
│   │   │   └── Pagination.css
│   │   ├── StatsCard/
│   │   │   ├── StatsCard.tsx
│   │   │   └── StatsCard.css
│   │   └── ActivityFeed/
│   │       ├── ActivityFeed.tsx
│   │       └── ActivityFeed.css
│   │
│   ├── services/              # API services
│   │   ├── blogService.ts
│   │   ├── authService.ts
│   │   └── apiClient.ts
│   │
│   ├── store/                 # Redux store
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── blogSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── hooks.ts
│   │
│   ├── types/                 # TypeScript types
│   │   ├── blog.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useFetchBlogs.ts
│   │   ├── useAuth.ts
│   │   └── useNotification.ts
│   │
│   └── layouts/               # Layout components
│       ├── AdminLayout.tsx
│       └── AuthLayout.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts (or webpack.config.js)
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quy Trình Xây Dựng

### Phân Chia Công Việc

#### Week 1: Setup & Core UI

- **Day 1-2**: Project setup, configuration, authentication
- **Day 3-5**: Header, Sidebar, Layout, Home dashboard

#### Week 2: List Views & Moderation

- **Day 1-2**: Pending blogs list, Filter, Search, Pagination
- **Day 3-4**: Blog detail page, Approval modals
- **Day 5**: Testing, bug fixes

#### Week 3: Additional Features & Polish

- **Day 1-2**: Published/Rejected blogs lists
- **Day 3-4**: Error handling, notifications, Loading states
- **Day 5**: Responsive design, Performance optimization

#### Week 4: Testing & Deployment

- **Day 1-2**: Unit tests, Integration tests
- **Day 3-4**: E2E testing, User testing
- **Day 5**: Deployment, Documentation

---

## 📦 Setup Project & Kết Nối API

### Step 1: Khởi Tạo Project

```bash
# Node.js 18+ được khuyến cáo
node --version

# Tạo project với Vite
npm create vite@latest admin-blog-dashboard -- --template react-ts
cd admin-blog-dashboard

# Cài đặt dependencies cơ bản
npm install
```

### Step 2: Cài Đặt Dependencies Chính

```bash
# HTTP Client & Routing
npm install axios react-router-dom

# State Management
npm install zustand

# UI Framework - Chọn một:
# Option 1: Ant Design (Khuyến cáo cho Admin)
npm install antd

# Option 2: Material-UI
# npm install @mui/material @emotion/react @emotion/styled

# Styling
npm install tailwindcss postcss autoprefixer
npm install -D tailwindcss

# Development Tools
npm install -D typescript @types/react @types/react-dom
npm install -D eslint prettier
```

### Step 3: Cấu Hình File .env

Tạo file `.env` tại root project:

```env
VITE_API_BASE_URL=http://76.13.21.84:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Blog Admin Dashboard
VITE_APP_VERSION=1.0.0
```

### Step 4: Setup API Client

Tạo file `src/services/apiClient.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
});

// Thêm token vào headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

### Step 5: Khởi Động Development Server

```bash
npm run dev

# Server chạy tại: http://localhost:5173
```

Kiểm tra kết nối API:

```bash
# Lấy danh sách blogs pending
curl -X GET "http://76.13.21.84:3000/api/v1/blogs?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 6: Build Production

```bash
npm run build

# Output được lưu tại: dist/
```

### Step 7: Deployment

#### Option A: Docker

Tạo `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Tạo `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/v1/ {
        proxy_pass http://76.13.21.84:3000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Chạy:

```bash
docker build -t blog-admin-dashboard .
docker run -p 3001:80 blog-admin-dashboard
```

#### Option B: Vercel/Netlify

```bash
# Vercel
npm install -g vercel
vercel deploy

# Netlify
npm run build
# Deploy thư mục 'dist' lên Netlify
```

#### Option C: VPS (Using PM2)

```bash
# Cài PM2
npm install -g pm2

# Build
npm run build

# Serve with PM2
pm2 serve dist 3001 --spa
```

---

## 🎨 Design Guidelines

### Color Scheme

```
Primary:    #1890ff (Blue)      - Main actions
Success:    #52c41a (Green)     - Approve/success
Danger:     #ff4d4f (Red)       - Reject/danger
Warning:    #faad14 (Orange)    - Warning
Neutral:    #f5f5f5 (Gray)      - Backgrounds
Text:       #262626 (Dark)      - Primary text
```

### Typography

```
Heading 1:  24px, Bold    (Page titles)
Heading 2:  20px, Bold    (Section titles)
Heading 3:  16px, Semibold (Subsections)
Body:       14px, Regular  (Content)
Small:      12px, Regular  (Labels, hints)
```

### Spacing

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

---

## 📊 API Integration Examples

### Service Layer

Tạo `src/services/blogService.ts`:

```typescript
import apiClient from './apiClient';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl?: string;
  images: string[];
  status: 'draft' | 'pending' | 'published' | 'rejected';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const blogService = {
  // ===== PENDING BLOGS =====
  getPendingBlogs: async () => {
    const response = await apiClient.get('/blogs', {
      params: { status: 'pending' },
    });
    return response.data;
  },

  // ===== PUBLISHED BLOGS =====
  getPublishedBlogs: async () => {
    const response = await apiClient.get('/blogs', {
      params: { status: 'published' },
    });
    return response.data;
  },

  // ===== REJECTED BLOGS =====
  getRejectedBlogs: async () => {
    const response = await apiClient.get('/blogs', {
      params: { status: 'rejected' },
    });
    return response.data;
  },

  // ===== DRAFT BLOGS =====
  getDraftBlogs: async () => {
    const response = await apiClient.get('/blogs', {
      params: { status: 'draft' },
    });
    return response.data;
  },

  // ===== GET BLOG DETAIL =====
  // Lấy bài viết theo ID
  getBlogById: async (id: string) => {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data;
  },

  // Lấy bài viết theo slug
  getBlogBySlug: async (slug: string) => {
    const response = await apiClient.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // ===== APPROVAL ACTIONS =====
  // Phê duyệt bài viết
  approveBlog: async (id: string, note?: string) => {
    const response = await apiClient.post(`/blogs/${id}/approve`, { note });
    return response.data;
  },

  // Từ chối bài viết
  rejectBlog: async (id: string, reason: string) => {
    if (!reason) {
      throw new Error('Reason is required for rejection');
    }
    const response = await apiClient.post(`/blogs/${id}/reject`, { reason });
    return response.data;
  },
};
```

### Response Format Example

```typescript
// GET /api/v1/blogs?status=pending
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-123",
      "title": "Amazing React Tips",
      "slug": "amazing-react-tips",
      "content": "<p>React is awesome...</p>",
      "thumbnailUrl": "https://example.com/thumb.jpg",
      "images": ["https://example.com/img1.jpg"],
      "status": "pending",
      "rejectionReason": null,
      "publishedAt": null,
      "createdAt": "2026-01-22T10:00:00Z",
      "updatedAt": "2026-01-22T11:30:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}

// POST /api/v1/blogs/:id/approve
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "published",
  "publishedAt": "2026-01-22T12:00:00Z",
  ...
}

// POST /api/v1/blogs/:id/reject
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "rejected",
  "rejectionReason": "Content violates community guidelines",
  ...
}
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Project setup (Vite + React + TypeScript)
- [ ] Install & configure Ant Design
- [ ] Setup API client with axios
- [ ] Setup Zustand for state management
- [ ] Configure environment variables
- [ ] Create basic layout (Header + Sidebar)
- [ ] Implement routing structure

### Phase 2: Authentication & Core Pages (Week 1-2)

- [ ] Create login page
- [ ] Implement token storage/management
- [ ] Create dashboard page with stats
- [ ] Create pending blogs list page
- [ ] Implement filter & search
- [ ] Implement pagination

### Phase 3: Moderation Features (Week 2-3)

- [ ] Create blog detail page
- [ ] Implement approve modal
- [ ] Implement reject modal
- [ ] Connect API endpoints
- [ ] Add success/error notifications
- [ ] Test approval workflow

### Phase 4: Additional Pages (Week 3)

- [ ] Create published blogs page
- [ ] Create rejected blogs page
- [ ] Add activity feed
- [ ] Add basic statistics

### Phase 5: Polish & Optimization (Week 3-4)

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states & skeletons
- [ ] Error handling & error pages
- [ ] Optimize images & performance
- [ ] Add loading indicators
- [ ] Improve UX/accessibility

### Phase 6: Testing & Deployment (Week 4)

- [ ] Unit tests for services
- [ ] Component tests
- [ ] E2E tests
- [ ] User acceptance testing
- [ ] Build & deploy to VPS/Docker

---

## 📚 Công Nghệ & Tools

### Frontend Framework

- **React 18+** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (faster than Webpack)

### UI Library

- **Ant Design** - Complete component library for admin
- **Tailwind CSS** - Utility-first CSS (optional)

### State Management

- **Zustand** - Lightweight alternative to Redux

### HTTP Client

- **Axios** - Promise-based HTTP client

### Routing

- **React Router v6** - Client-side routing

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Cypress** - E2E testing

---

## 🎨 Design System

### Color Palette

```
Brand Blue:   #1890ff
Success:      #52c41a
Warning:      #faad14
Error:        #ff4d4f
Border:       #d9d9d9
Background:   #fafafa
Text Primary: #000000 (87%)
Text Secondary: #000000 (45%)
```

### Typography Scale

```
Heading 1: 32px / Bold     (Page title)
Heading 2: 24px / Semibold (Section title)
Heading 3: 18px / Semibold (Subsection)
Body:      14px / Regular  (Content)
Small:     12px / Regular  (Labels, hints)
Tiny:      12px / Regular  (Metadata)
```

### Spacing System

```
xs: 4px    (tight spacing)
sm: 8px    (small spacing)
md: 16px   (default spacing)
lg: 24px   (large spacing)
xl: 32px   (extra large)
2xl: 48px  (huge spacing)
```

### Button Styles

```
Primary:   Blue background, white text (main actions)
Default:   Gray background, dark text (secondary)
Danger:    Red background, white text (destructive)
Ghost:     No background (tertiary actions)
```

---

## 📞 Support & Contacts

- **Backend API**: http://76.13.21.84:3000/api/v1
- **Team Email**: team@fepa.dev
- **Documentation**: README.md (Backend)

---

**Version**: 1.0  
**Last Updated**: January 22, 2026  
**Frontend Only Guide** ✨
