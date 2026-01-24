# 🚀 KẾ HOẠCH HOÀN THIỆN DỰ ÁN FEPA WEB ADMIN

> **Roadmap chi tiết để đạt 90%+ completion**  
> Ngày bắt đầu: 24/01/2026  
> Thời gian ước tính: 3-4 tháng (12-16 tuần)  
> Version: 1.0

---

## 📑 MỤC LỤC

1. [Tổng Quan Kế Hoạch](#1-tổng-quan-kế-hoạch)
2. [Phase 1: Foundation & Quick Wins](#2-phase-1-foundation--quick-wins)
3. [Phase 2: User Management](#3-phase-2-user-management)
4. [Phase 3: Analytics & Reporting](#4-phase-3-analytics--reporting)
5. [Phase 4: Advanced Features](#5-phase-4-advanced-features)
6. [Phase 5: Polish & Production](#6-phase-5-polish--production)
7. [Resource & Timeline](#7-resource--timeline)
8. [Risk Management](#8-risk-management)
9. [Success Metrics](#9-success-metrics)

---

## 1. TỔNG QUAN KẾ HOẠCH

### 1.1 Hiện Trạng

| Metric             | Current     | Target       | Gap       |
| ------------------ | ----------- | ------------ | --------- |
| Overall Completion | 65%         | 90%+         | -25%      |
| Design System      | 65%         | 95%+         | -30%      |
| Core Features      | 55%         | 90%+         | -35%      |
| API Integration    | 60% (26/43) | 95%+ (41/43) | -35%      |
| Code Quality       | B-          | A            | -2 grades |

### 1.2 Mục Tiêu

**Sprint Goal:** Đạt 90%+ completion trong 12-16 tuần

**Deliverables:**

- ✅ Design system 100% aligned với brand FEPA
- ✅ User & Admin management hoàn chỉnh
- ✅ Blog & Subscription analytics
- ✅ Payment management system
- ✅ 41/43 APIs integrated (95%+)
- ✅ Code quality grade A
- ✅ Production-ready application

### 1.3 Team Composition (Assumed)

- **1 Full-stack Developer** (Primary)
- **1 Backend Developer** (Support - APIs)
- **1 Designer** (Part-time - Design review)
- **1 QA Tester** (Part-time - Testing)

---

## 2. PHASE 1: FOUNDATION & QUICK WINS

**Duration:** Week 1-2 (10 working days)  
**Goal:** Fix design system & setup foundation  
**Priority:** 🔴 CRITICAL

### 2.1 Week 1: Design System Alignment

#### Day 1-2: Brand Colors & Theme Config

**Tasks:**

- [ ] Update `src/App.tsx` ConfigProvider

  ```typescript
  theme: {
    token: {
      colorPrimary: '#0EA5E9',      // ✅ Sky Blue
      colorSuccess: '#10B981',       // ✅ Green
      colorError: '#F43F5E',         // ✅ Rose
      colorWarning: '#F59E0B',       // ✅ Amber
      colorBgBase: '#F8FAFC',        // ✅ Slate 50
      borderRadius: 12,              // ✅ 12px
    }
  }
  ```

- [ ] Add CSS custom properties (`src/index.css`)

  ```css
  :root {
    --primary: #0ea5e9;
    --primary-dark: #0284c7;
    --primary-light: #38bdf8;
    --accent: #f59e0b;
    --success: #10b981;
    --danger: #f43f5e;
    --bg: #f8fafc;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
  }
  ```

- [ ] Update all hardcoded colors trong components
- [ ] Test color consistency across pages

**Estimated Effort:** 6-8 hours  
**Blockers:** None  
**Dependencies:** None

#### Day 3-4: Gradients & Visual Effects

**Tasks:**

- [ ] Add gradient variables (`src/App.css`)

  ```css
  --primary-gradient: linear-gradient(90deg, #0ea5e9, #2563eb);
  --success-gradient: linear-gradient(90deg, #10b981, #059669);
  --danger-gradient: linear-gradient(90deg, #f43f5e, #e11d48);
  --accent-gradient: linear-gradient(90deg, #f59e0b, #d97706);
  ```

- [ ] Add shadow utilities

  ```css
  --shadow-soft: 0 4px 10px rgba(100, 116, 139, 0.05);
  --shadow-card: 0 8px 16px rgba(100, 116, 139, 0.08);
  ```

- [ ] Apply gradients to buttons/headers
- [ ] Update card shadows
- [ ] Add glassmorphism effects (optional)

**Estimated Effort:** 4-6 hours  
**Blockers:** None  
**Dependencies:** Day 1-2 completed

#### Day 5: Design Review & Testing

**Tasks:**

- [ ] Cross-browser testing (Chrome, Firefox, Edge)
- [ ] Mobile responsive check
- [ ] Accessibility audit (color contrast)
- [ ] Designer review & feedback
- [ ] Fix design issues

**Estimated Effort:** 4 hours  
**Deliverables:** ✅ Design system 95%+ aligned

---

### 2.2 Week 2: Admin Management Module

#### Day 6-7: Admin APIs Integration

**Backend Work (Support needed):**

- [ ] Verify `POST /auth/register-admin` endpoint
- [ ] Verify `GET /auth/all-admin` endpoint
- [ ] Test endpoints với Postman

**Frontend Work:**

- [ ] Create `src/services/api/adminAPI.ts`

  ```typescript
  export const adminAPI = {
    registerAdmin: async (data: RegisterAdminRequest) => {...},
    getAllAdmins: async () => {...},
  }
  ```

- [ ] Add React Query hooks
  ```typescript
  export const useGetAllAdmins = () =>
    useQuery(["admins"], adminAPI.getAllAdmins);
  export const useRegisterAdmin = () => useMutation(adminAPI.registerAdmin);
  ```

**Estimated Effort:** 6 hours  
**Blockers:** Backend APIs must be ready  
**Dependencies:** None

#### Day 8-9: Admin Management UI

**Tasks:**

- [ ] Create `src/pages/admin/AdminManagement.tsx`
- [ ] Build admin creation form/drawer
  - Email input (validation)
  - Full name input
  - Password input (strength indicator)
  - Role selector (if needed)
  - Submit button

- [ ] Build admin list table

  ```typescript
  Columns: Email | Full Name | Role | Created At | Actions
  ```

- [ ] Add search & filter functionality
- [ ] Add loading states
- [ ] Add error handling & success messages

**Estimated Effort:** 10 hours  
**Blockers:** APIs must be integrated  
**Dependencies:** Day 6-7

#### Day 10: Testing & Polish

**Tasks:**

- [ ] Unit tests for admin APIs (optional)
- [ ] Integration testing (create admin flow)
- [ ] Edge case testing (duplicate email, etc.)
- [ ] UI polish & refinements
- [ ] Code review

**Estimated Effort:** 4 hours  
**Deliverables:** ✅ Admin management module complete

---

## 3. PHASE 2: USER MANAGEMENT

**Duration:** Week 3-6 (20 working days)  
**Goal:** Complete user management & statistics  
**Priority:** 🔴 CRITICAL

### 3.1 Week 3: User Management APIs

#### Day 11-12: User CRUD APIs Integration

**Backend Work (Support needed):**

- [ ] `GET /auth/users` - List all users
- [ ] `PATCH /auth/users/:userId/deactivate` - Deactivate user
- [ ] `PATCH /auth/users/:userId/reactivate` - Reactivate user
- [ ] `DELETE /auth/users/:userId` - Delete user

**Frontend Work:**

- [ ] Create `src/services/api/userAPI.ts`

  ```typescript
  export const userAPI = {
    getUsers: async (params?: UserFilters) => {...},
    deactivateUser: async (userId: string) => {...},
    reactivateUser: async (userId: string) => {...},
    deleteUser: async (userId: string) => {...},
  }
  ```

- [ ] Add TypeScript types

  ```typescript
  interface User {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "USER";
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  }
  ```

- [ ] Add React Query hooks

**Estimated Effort:** 8 hours  
**Blockers:** Backend APIs  
**Dependencies:** None

#### Day 13-15: User Management UI

**Tasks:**

- [ ] Create `src/pages/admin/UserManagement.tsx`
- [ ] Build user list table

  ```typescript
  Columns: Email | Full Name | Status | Verified | Role | Created | Actions
  Status: Active (Green badge) | Inactive (Gray badge)
  Actions: Deactivate/Reactivate | Delete
  ```

- [ ] Implement filters
  - Status filter (All/Active/Inactive)
  - Role filter (All/Admin/User)
  - Verified filter (All/Verified/Unverified)
  - Search by email/name

- [ ] Add pagination (if needed)
- [ ] Add sorting (by date, name, etc.)

**Estimated Effort:** 12 hours  
**Dependencies:** Day 11-12

#### Day 16-17: User Actions & Modals

**Tasks:**

- [ ] Build Deactivate confirmation modal

  ```typescript
  <Modal title="Deactivate User">
    <p>Are you sure you want to deactivate {user.fullName}?</p>
    <Alert type="warning">
      User will lose access to the platform
    </Alert>
  </Modal>
  ```

- [ ] Build Delete confirmation modal

  ```typescript
  <Modal title="Delete User" danger>
    <p>⚠️ This action cannot be undone!</p>
    <p>Type "DELETE" to confirm</p>
    <Input placeholder="Type DELETE" />
  </Modal>
  ```

- [ ] Implement action handlers
- [ ] Add loading states for actions
- [ ] Add success/error notifications
- [ ] Add optimistic updates

**Estimated Effort:** 8 hours  
**Dependencies:** Day 13-15

---

### 3.2 Week 4-5: User Statistics

#### Day 18-19: Stats APIs Integration

**Backend Work (Support needed):**

- [ ] `GET /auth/stats/total` - Total user stats

  ```json
  {
    "total": 1234,
    "verified": 987,
    "admin": 12,
    "user": 1222
  }
  ```

- [ ] `GET /auth/stats/users-over-time?period=daily&days=30`
  ```json
  {
    "period": "daily",
    "days": 30,
    "data": [
      { "date": "2026-01-01", "count": 10 },
      { "date": "2026-01-02", "count": 15 }
    ]
  }
  ```

**Frontend Work:**

- [ ] Create stats API client
- [ ] Add React Query hooks with caching
- [ ] Add TypeScript types

**Estimated Effort:** 6 hours  
**Blockers:** Backend APIs  
**Dependencies:** None

#### Day 20-22: Stats Dashboard UI

**Tasks:**

- [ ] Create `src/pages/admin/UserStatistics.tsx`
- [ ] Build stats cards

  ```typescript
  <Row gutter={16}>
    <Col span={6}>
      <Card>
        <Statistic
          title="Total Users"
          value={stats.total}
          prefix={<UserOutlined />}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Verified Users"
          value={stats.verified}
          prefix={<CheckCircleOutlined />}
          valueStyle={{ color: '#10B981' }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic title="Admins" value={stats.admin} />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic title="Regular Users" value={stats.user} />
      </Card>
    </Col>
  </Row>
  ```

- [ ] Build user growth chart (Line chart)

  ```typescript
  <Card title="User Growth Over Time">
    <LineChart data={growthData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#0EA5E9"
        strokeWidth={2}
      />
    </LineChart>
  </Card>
  ```

- [ ] Add time period selector (7d, 30d, 90d, 1y)
- [ ] Add refresh button
- [ ] Add loading states

**Estimated Effort:** 12 hours  
**Dependencies:** Day 18-19

#### Day 23-25: Integration & Testing

**Tasks:**

- [ ] Integrate stats into AdminDashboard
- [ ] Add navigation links
- [ ] Test all user management flows
  - Create admin → Success
  - List users → Filters work
  - Deactivate → Status updates
  - Reactivate → Status updates
  - Delete → Confirmation works
  - Stats → Charts render correctly

- [ ] Performance testing (large datasets)
- [ ] Edge case testing
- [ ] Code review
- [ ] Bug fixes

**Estimated Effort:** 12 hours  
**Deliverables:** ✅ User management & statistics complete

---

### 3.3 Week 6: Subscription CRUD UI

#### Day 26-28: Subscription Management UI

**Tasks:**

- [ ] Update `src/pages/admin/AdminSubscription.tsx`
- [ ] Build plan creation drawer

  ```typescript
  <Drawer title="Create Subscription Plan">
    <Form>
      <Form.Item name="name" label="Plan Name">
        <Input placeholder="Premium Plan" />
      </Form.Item>
      <Form.Item name="price" label="Price">
        <InputNumber prefix="$" />
      </Form.Item>
      <Form.Item name="interval" label="Billing Interval">
        <Select>
          <Option value="MONTHLY">Monthly</Option>
          <Option value="YEARLY">Yearly</Option>
          <Option value="LIFETIME">Lifetime</Option>
        </Select>
      </Form.Item>
      <Form.Item name="features" label="Features">
        <Checkbox.Group>
          <Checkbox value="OCR">OCR</Checkbox>
          <Checkbox value="AI">AI</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item name="isFree" valuePropName="checked">
        <Checkbox>Free Plan</Checkbox>
      </Form.Item>
      <Form.Item name="isActive" valuePropName="checked">
        <Checkbox>Active</Checkbox>
      </Form.Item>
    </Form>
  </Drawer>
  ```

- [ ] Build plan edit form (reuse drawer)
- [ ] Add delete confirmation modal
- [ ] Implement CRUD actions
- [ ] Add validation
- [ ] Add success/error messages

**Estimated Effort:** 12 hours  
**Blockers:** None (APIs already exist)  
**Dependencies:** None

#### Day 29-30: Testing & Polish

**Tasks:**

- [ ] Test CRUD operations
- [ ] Test edge cases (free plan validation, etc.)
- [ ] UI refinements
- [ ] Code review
- [ ] Documentation

**Estimated Effort:** 8 hours  
**Deliverables:** ✅ Subscription CRUD complete

---

## 4. PHASE 3: ANALYTICS & REPORTING

**Duration:** Week 7-10 (20 working days)  
**Goal:** Complete blog & subscription analytics  
**Priority:** 🟡 HIGH

### 4.1 Week 7-8: Blog Statistics

#### Day 31-33: Blog Stats APIs Integration

**Backend Work (Support needed):**

- [ ] `GET /blogs/statistics/status`

  ```json
  {
    "draft": 45,
    "pending": 23,
    "published": 189,
    "rejected": 12
  }
  ```

- [ ] `GET /blogs/statistics/monthly?year=2026`
  ```json
  [
    { "month": 1, "count": 15 },
    { "month": 2, "count": 23 },
    ...
  ]
  ```

**Frontend Work:**

- [ ] Update `src/services/api/blogAPI.ts`
- [ ] Add stats functions
- [ ] Add React Query hooks
- [ ] Add TypeScript types

**Estimated Effort:** 6 hours  
**Blockers:** Backend APIs  
**Dependencies:** None

#### Day 34-37: Blog Analytics Dashboard

**Tasks:**

- [ ] Create `src/pages/admin/BlogAnalytics.tsx`
- [ ] Build status summary cards

  ```typescript
  <Row gutter={16}>
    <Col span={6}>
      <Card>
        <Statistic title="Total Blogs" value={total} />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Pending Review"
          value={pending}
          valueStyle={{ color: '#F59E0B' }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Published"
          value={published}
          valueStyle={{ color: '#10B981' }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Rejected"
          value={rejected}
          valueStyle={{ color: '#F43F5E' }}
        />
      </Card>
    </Col>
  </Row>
  ```

- [ ] Build status pie chart

  ```typescript
  <Card title="Blog Distribution by Status">
    <PieChart width={400} height={400}>
      <Pie
        data={statusData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        label
      />
      <Tooltip />
      <Legend />
    </PieChart>
  </Card>
  ```

- [ ] Build monthly trend chart

  ```typescript
  <Card title="Monthly Blog Publications">
    <BarChart data={monthlyData}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#0EA5E9" />
    </BarChart>
  </Card>
  ```

- [ ] Add year selector
- [ ] Add export functionality (CSV)

**Estimated Effort:** 16 hours  
**Dependencies:** Day 31-33

#### Day 38-40: Integration & Testing

**Tasks:**

- [ ] Add navigation to blog analytics
- [ ] Integrate with AdminDashboard
- [ ] Add refresh functionality
- [ ] Test all charts
- [ ] Performance optimization
- [ ] Code review

**Estimated Effort:** 12 hours  
**Deliverables:** ✅ Blog analytics complete

---

### 4.2 Week 9-10: Revenue Analytics

#### Day 41-43: Revenue APIs Integration

**Backend Work (Support needed):**

- [ ] `GET /subscriptions/stats/revenue-over-time?period=daily&days=30`
- [ ] `GET /subscriptions/stats/total-revenue`
- [ ] `GET /subscriptions/stats/revenue-by-plan`

**Frontend Work:**

- [ ] Update subscription API client
- [ ] Add revenue functions
- [ ] Add React Query hooks
- [ ] Add caching strategy

**Estimated Effort:** 6 hours  
**Blockers:** Backend APIs  
**Dependencies:** None

#### Day 44-48: Revenue Dashboard

**Tasks:**

- [ ] Create `src/pages/admin/RevenueDashboard.tsx`
- [ ] Build revenue summary cards

  ```typescript
  <Row gutter={16}>
    <Col span={6}>
      <Card>
        <Statistic
          title="Total Revenue"
          value={stats.totalRevenue}
          prefix="$"
          precision={2}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          valueStyle={{ color: '#10B981' }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Cancelled"
          value={stats.cancelledSubscriptions}
          valueStyle={{ color: '#F43F5E' }}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Total Subscriptions"
          value={stats.totalSubscriptions}
        />
      </Card>
    </Col>
  </Row>
  ```

- [ ] Build revenue trend line chart

  ```typescript
  <Card title="Revenue Over Time">
    <LineChart data={revenueData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip formatter={(value) => `$${value}`} />
      <Line
        type="monotone"
        dataKey="revenue"
        stroke="#10B981"
        strokeWidth={3}
      />
    </LineChart>
  </Card>
  ```

- [ ] Build revenue by plan bar chart
- [ ] Add period selector (7d, 30d, 90d, 1y)
- [ ] Add export functionality

**Estimated Effort:** 20 hours  
**Dependencies:** Day 41-43

#### Day 49-50: Testing & Integration

**Tasks:**

- [ ] Integration testing
- [ ] Performance testing
- [ ] Add to main dashboard
- [ ] Code review
- [ ] Documentation

**Estimated Effort:** 8 hours  
**Deliverables:** ✅ Revenue analytics complete

---

## 5. PHASE 4: ADVANCED FEATURES

**Duration:** Week 11-12 (10 working days)  
**Goal:** Payment management & remaining features  
**Priority:** 🟢 MEDIUM

### 5.1 Week 11: Payment Management

#### Day 51-53: Payment APIs Integration

**Backend Work (Support needed):**

- [ ] `GET /payments/:ref` - Payment lookup
- [ ] `GET /payments/vnpay/ipn` - IPN logs (if available)

**Frontend Work:**

- [ ] Create `src/services/api/paymentAPI.ts`
- [ ] Add payment lookup function
- [ ] Add IPN log viewer function
- [ ] Add TypeScript types

**Estimated Effort:** 6 hours  
**Blockers:** Backend APIs & VNPay integration  
**Dependencies:** Backend team support

#### Day 54-56: Payment Management UI

**Tasks:**

- [ ] Create `src/pages/admin/PaymentManagement.tsx`
- [ ] Build payment search interface

  ```typescript
  <Card title="Payment Lookup">
    <Search
      placeholder="Enter payment reference"
      onSearch={handleSearch}
      enterButton="Search"
    />
  </Card>
  ```

- [ ] Build payment details card

  ```typescript
  <Card title="Payment Details">
    <Descriptions>
      <Descriptions.Item label="Reference">
        {payment.ref}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <Badge status={statusMap[payment.status]} />
      </Descriptions.Item>
      <Descriptions.Item label="Amount">
        ${payment.amount}
      </Descriptions.Item>
      <Descriptions.Item label="Plan">
        {payment.planName}
      </Descriptions.Item>
      <Descriptions.Item label="User">
        {payment.userEmail}
      </Descriptions.Item>
      <Descriptions.Item label="Created">
        {formatDate(payment.createdAt)}
      </Descriptions.Item>
    </Descriptions>
  </Card>
  ```

- [ ] Build IPN log viewer (if available)
- [ ] Add payment history table (optional)
- [ ] Add troubleshooting guides (for CS)

**Estimated Effort:** 12 hours  
**Dependencies:** Day 51-53

#### Day 57-58: Testing & Documentation

**Tasks:**

- [ ] Test payment lookup
- [ ] Test edge cases (invalid ref, etc.)
- [ ] Write CS documentation
- [ ] Code review

**Estimated Effort:** 8 hours  
**Deliverables:** ✅ Payment management complete

---

### 5.2 Week 12: Remaining Features

#### Day 59-60: AI Service Integration

**Backend Work (Support needed):**

- [ ] `GET /ai/admin/stats` endpoint

**Frontend Work:**

- [ ] Create AI stats API client
- [ ] Add to AdminDashboard
- [ ] Build AI metrics cards

**Estimated Effort:** 6 hours  
**Blockers:** Backend API (if not ready, skip to Phase 5)

#### Day 61-62: Expense Categories

**Backend Work (Support needed):**

- [ ] `GET /expenses/categories` endpoint

**Frontend Work:**

- [ ] Create categories page
- [ ] Build categories table
- [ ] Add search/filter

**Estimated Effort:** 6 hours  
**Blockers:** Backend API (if not ready, skip)

#### Day 63-64: Buffer & Bug Fixes

**Tasks:**

- [ ] Fix accumulated bugs
- [ ] Performance optimization
- [ ] Code refactoring
- [ ] Technical debt reduction

**Estimated Effort:** 8 hours  
**Deliverables:** ✅ Phase 4 complete

---

## 6. PHASE 5: POLISH & PRODUCTION

**Duration:** Week 13-16 (20 working days)  
**Goal:** Production-ready application  
**Priority:** 🔵 ESSENTIAL

### 6.1 Week 13: Testing & QA

#### Day 65-67: Comprehensive Testing

**Tasks:**

- [ ] **Unit Testing** (if not done incrementally)
  - Critical business logic functions
  - API client functions
  - Utility functions

- [ ] **Integration Testing**
  - Complete user flows
  - API integration tests
  - State management tests

- [ ] **E2E Testing** (Critical paths)
  - Login → Dashboard
  - Create admin → Success
  - Approve blog → Notification
  - Manage users → Status changes
  - View analytics → Charts render

- [ ] **Performance Testing**
  - Lighthouse audit (target: 90+)
  - Large dataset handling
  - Memory leak detection
  - Bundle size optimization

**Estimated Effort:** 12 hours

#### Day 68-70: Bug Fixing Sprint

**Tasks:**

- [ ] Fix all P0/P1 bugs
- [ ] Fix UI/UX issues
- [ ] Fix performance issues
- [ ] Cross-browser testing
- [ ] Mobile responsive fixes

**Estimated Effort:** 12 hours  
**Deliverables:** ✅ Clean test suite

---

### 6.2 Week 14: Security & Optimization

#### Day 71-73: Security Audit

**Tasks:**

- [ ] **XSS Prevention**
  - Sanitize user inputs
  - Use dangerouslySetInnerHTML safely
  - Content Security Policy

- [ ] **CSRF Protection**
  - Token validation
  - SameSite cookies

- [ ] **Authentication Security**
  - Token expiration handling
  - Refresh token flow
  - Secure storage

- [ ] **Authorization Checks**
  - Route protection
  - API permission checks
  - Role-based access

- [ ] **Data Validation**
  - Input validation
  - Type checking
  - SQL injection prevention (backend)

**Estimated Effort:** 12 hours

#### Day 74-76: Performance Optimization

**Tasks:**

- [ ] **Code Splitting**
  - Lazy load routes
  - Dynamic imports
  - Reduce initial bundle

- [ ] **Caching Strategy**
  - React Query cache config
  - Service Worker (if PWA)
  - Browser caching

- [ ] **Image Optimization**
  - Compress images
  - Lazy loading
  - WebP format

- [ ] **Bundle Optimization**
  - Tree shaking
  - Remove unused code
  - Minification

- [ ] **Runtime Performance**
  - Memoization (React.memo, useMemo)
  - Debounce/Throttle
  - Virtualization (large lists)

**Estimated Effort:** 12 hours  
**Deliverables:** ✅ Secure & optimized app

---

### 6.3 Week 15: Documentation & Training

#### Day 77-79: Documentation

**Tasks:**

- [ ] **Technical Documentation**
  - Architecture overview
  - Component documentation
  - API integration guide
  - State management guide
  - Deployment guide

- [ ] **User Documentation**
  - Admin user guide
  - Feature documentation
  - Troubleshooting guide
  - FAQ

- [ ] **Developer Documentation**
  - Setup instructions
  - Coding standards
  - Git workflow
  - Testing guide

**Estimated Effort:** 12 hours

#### Day 80-82: Code Review & Cleanup

**Tasks:**

- [ ] Final code review
- [ ] Remove dead code
- [ ] Fix code smells
- [ ] Consistent formatting
- [ ] Update dependencies
- [ ] Add missing comments

**Estimated Effort:** 12 hours  
**Deliverables:** ✅ Complete documentation

---

### 6.4 Week 16: Deployment & Launch

#### Day 83-85: Staging Deployment

**Tasks:**

- [ ] **Environment Setup**
  - Configure environment variables
  - Setup staging server
  - Configure CI/CD pipeline

- [ ] **Build & Deploy**
  - Production build
  - Deploy to staging
  - Smoke testing

- [ ] **Integration Testing**
  - Test with production data (anonymized)
  - Test with real backend APIs
  - Test payment flow (sandbox)

**Estimated Effort:** 12 hours

#### Day 86-88: Production Deployment

**Tasks:**

- [ ] **Pre-deployment Checklist**
  - [ ] All tests passing
  - [ ] Security audit complete
  - [ ] Performance metrics met
  - [ ] Documentation complete
  - [ ] Backup plan ready

- [ ] **Deployment**
  - Deploy to production
  - Monitor deployment
  - Verify all features

- [ ] **Post-deployment**
  - Smoke testing
  - Monitor errors
  - User acceptance testing

**Estimated Effort:** 12 hours

#### Day 89-90: Launch & Monitoring

**Tasks:**

- [ ] Official launch
- [ ] Monitor application
- [ ] Collect user feedback
- [ ] Quick bug fixes
- [ ] Performance monitoring
- [ ] Celebrate! 🎉

**Estimated Effort:** 8 hours  
**Deliverables:** ✅ Production-ready application launched

---

## 7. RESOURCE & TIMELINE

### 7.1 Timeline Summary

| Phase                    | Duration     | Days   | Completion Target |
| ------------------------ | ------------ | ------ | ----------------- |
| Phase 1: Foundation      | 2 weeks      | 10     | 70% → 75%         |
| Phase 2: User Management | 4 weeks      | 20     | 75% → 85%         |
| Phase 3: Analytics       | 4 weeks      | 20     | 85% → 90%         |
| Phase 4: Advanced        | 2 weeks      | 10     | 90% → 92%         |
| Phase 5: Production      | 4 weeks      | 20     | 92% → 95%+        |
| **TOTAL**                | **16 weeks** | **80** | **95%+**          |

### 7.2 Resource Allocation

**Full-stack Developer (You):**

- 100% allocation (8h/day)
- Total: 640 hours
- Focus: Frontend development, integration, testing

**Backend Developer (Support):**

- 25% allocation (2h/day)
- Total: 160 hours
- Focus: API development, bug fixes, support

**Designer (Part-time):**

- 10% allocation (0.8h/day)
- Total: 64 hours
- Focus: Design review, UI polish

**QA Tester (Part-time):**

- 20% allocation (1.6h/day)
- Total: 128 hours
- Focus: Testing, bug reporting

### 7.3 Cost Estimate

**Assuming hourly rates:**

- Full-stack Developer: $50/h × 640h = $32,000
- Backend Developer: $60/h × 160h = $9,600
- Designer: $40/h × 64h = $2,560
- QA Tester: $30/h × 128h = $3,840

**Total Estimated Cost:** $48,000

**Note:** Adjust based on your actual rates and location.

---

## 8. RISK MANAGEMENT

### 8.1 Critical Risks

| Risk                        | Probability | Impact | Mitigation Strategy                                                                                      |
| --------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------- |
| **Backend APIs not ready**  | Medium      | High   | ① Early coordination with backend team<br>② Mock APIs for frontend development<br>③ Parallel development |
| **Scope creep**             | High        | High   | ① Strict feature freeze after Phase 3<br>② Change request process<br>③ Prioritization framework          |
| **Technical blockers**      | Medium      | Medium | ① Technical spike before each phase<br>② Buffer time in schedule<br>③ Alternative solutions ready        |
| **Team member unavailable** | Low         | High   | ① Cross-training<br>② Documentation<br>③ Knowledge sharing sessions                                      |
| **Performance issues**      | Low         | Medium | ① Regular performance audits<br>② Load testing<br>③ Optimization sprints                                 |

### 8.2 Contingency Plans

**If Backend APIs Delayed:**

- Week 1-2: Continue with design system work
- Week 3+: Use mock APIs, catch up later
- Adjust timeline by 1-2 weeks

**If Critical Bug Discovered:**

- Pause new features
- Allocate 2-3 days for bug fixing
- Resume roadmap after fix

**If Timeline Slips:**

- Prioritize P0 features only
- Move P1/P2 to post-launch
- Reduce scope to meet deadline

---

## 9. SUCCESS METRICS

### 9.1 Technical Metrics

**Code Quality:**

- [ ] ESLint: 0 errors, <10 warnings
- [ ] TypeScript: 0 type errors
- [ ] Test coverage: >70% (if applicable)
- [ ] Lighthouse score: >90
- [ ] Bundle size: <500KB initial load

**Performance:**

- [ ] First Contentful Paint: <1.5s
- [ ] Time to Interactive: <3.5s
- [ ] Page load time: <2s
- [ ] API response time: <500ms

**Security:**

- [ ] No critical vulnerabilities
- [ ] HTTPS everywhere
- [ ] Secure token storage
- [ ] XSS/CSRF protected

### 9.2 Functional Metrics

**Feature Completion:**

- [ ] 95%+ of required endpoints integrated (41/43)
- [ ] 90%+ of core features implemented
- [ ] 100% of critical user flows working
- [ ] All P0/P1 bugs fixed

**User Experience:**

- [ ] Design system 95%+ aligned
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)
- [ ] Intuitive navigation

### 9.3 Business Metrics

**Launch Readiness:**

- [ ] Admin can create accounts
- [ ] Admin can manage users
- [ ] Admin can moderate content
- [ ] Admin can view analytics
- [ ] Admin can manage subscriptions
- [ ] Customer support can lookup payments

**Post-Launch (Week 1):**

- [ ] Zero critical bugs reported
- [ ] <5 minor bugs reported
- [ ] User satisfaction: >4/5
- [ ] Admin adoption: 100%

---

## 10. DELIVERABLES CHECKLIST

### Phase 1 ✅

- [ ] Brand colors updated
- [ ] Gradients & shadows applied
- [ ] Admin management module
- [ ] Design system 95%+ aligned

### Phase 2 ✅

- [ ] User CRUD functionality
- [ ] User statistics dashboard
- [ ] Subscription CRUD UI
- [ ] All user management flows working

### Phase 3 ✅

- [ ] Blog analytics dashboard
- [ ] Revenue analytics dashboard
- [ ] Charts & visualizations
- [ ] Export functionality

### Phase 4 ✅

- [ ] Payment management system
- [ ] AI service integration (if possible)
- [ ] Expense categories (if possible)
- [ ] Bug fixes & optimizations

### Phase 5 ✅

- [ ] Complete test suite
- [ ] Security audit passed
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Production deployment
- [ ] Launch successful

---

## 11. COMMUNICATION PLAN

### 11.1 Daily Standups (Recommended)

**Format:** 15 minutes, same time daily  
**Participants:** Full team  
**Agenda:**

- What I did yesterday
- What I'll do today
- Any blockers

### 11.2 Weekly Reviews

**Format:** 1 hour, end of week  
**Participants:** Full team + stakeholders  
**Agenda:**

- Demo completed features
- Review metrics
- Adjust next week's plan
- Risk assessment

### 11.3 Sprint Retrospectives

**Format:** 1 hour, end of each phase  
**Participants:** Development team  
**Agenda:**

- What went well
- What didn't go well
- Action items for improvement

---

## 12. NEXT STEPS

### Immediate Actions (This Week)

**Monday:**

- [ ] Review and approve this plan
- [ ] Schedule kickoff meeting
- [ ] Coordinate with backend team on API timeline
- [ ] Setup project tracking (Jira/Trello/GitHub Projects)

**Tuesday:**

- [ ] Start Phase 1 Day 1
- [ ] Update ConfigProvider colors
- [ ] Begin CSS variable setup

**Wednesday - Friday:**

- [ ] Complete design system updates
- [ ] Test color consistency
- [ ] Begin admin management work

### Success Criteria

**End of Week 1:**

- ✅ Design system 80%+ aligned
- ✅ Admin APIs integrated
- ✅ Team rhythm established

**End of Month 1:**

- ✅ Phase 1 & 2 completed
- ✅ User management working
- ✅ 75%+ overall completion

**End of Month 2:**

- ✅ Phase 3 completed
- ✅ All analytics working
- ✅ 85%+ overall completion

**End of Month 3:**

- ✅ Phase 4 & 5 completed
- ✅ Production deployment
- ✅ 95%+ overall completion

---

## 📞 SUPPORT & ESCALATION

**For Blockers:**

- Technical: Escalate to senior developer
- Backend APIs: Coordinate with backend lead
- Design: Consult with designer
- Priority conflicts: Product owner decision

**For Questions:**

- Review this plan first
- Check project documentation
- Ask in team chat
- Schedule 1-on-1 if needed

---

**Good luck! 🚀 Let's build something amazing!**

---

_Kế hoạch được tạo vào: 24/01/2026_  
_Người tạo: AI Assistant_  
_Version: 1.0_
