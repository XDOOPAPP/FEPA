# Tổng hợp chức năng Web Admin

> Phạm vi: chức năng admin/dashboard. Ghi ngắn gọn công dụng, request body, response chính và gợi ý hiển thị UI.

## 1) Quản trị tài khoản & người dùng

- Công dụng: tạo/quản lý admin, xem danh sách user, kích hoạt/vô hiệu hóa account, xem thống kê người dùng.
- Endpoints:
  - Admin: `POST /auth/register-admin` tạo admin, `GET /auth/all-admin` danh sách admin.
  - User: `GET /auth/users` danh sách tất cả user, `PATCH /auth/users/:userId/deactivate` vô hiệu hóa, `PATCH /auth/users/:userId/reactivate` kích hoạt lại, `DELETE /auth/users/:userId` xoá user.
  - Stats: `GET /auth/stats/total` (tổng user, verified, admin, user), `GET /auth/stats/users-over-time?period=daily|weekly|monthly&days=30` (line chart).
- Request chính:
  - Register-admin body: { email, fullName, password }
  - Other endpoints: không cần body (id trên path, query param cho stats).
- Response chính:
  - Register-admin: { message }
  - Get users: mảng user { id, email, fullName, role, isVerified, createdAt }
  - Get admins: mảng admin { email, fullName, role }
  - Deactivate/Reactivate: { message }
  - Delete user: { message }
  - Total stats: { total, verified, admin, user }
  - Users-over-time: { period, days, data: [{ date, count }] }
- UI gợi ý (chi tiết):
  - Tab 1 - Quản lý Admin: form tạo admin (email, fullName, password); data table: Email | Họ tên | Role | Ngày tạo | Actions (resend invite? nếu bổ sung). Filter theo role, search email.
  - Tab 2 - Quản lý User: data table: Email | Họ tên | Trạng thái (Active/Inactive) | Verified | Ngày tạo | Actions (Deactivate/Reactivate, Delete). Filter trạng thái, search.
  - Dashboard/Stats: Cards: Tổng user, Verified, Admin count, User count; Line chart đăng ký theo thời gian.
  - Confirm modal khi deactivate/delete account (cảnh báo mất dữ liệu?).

## 2) Moderation blog

- Công dụng: duyệt/từ chối blog chờ review và xem thống kê bài viết.
- Endpoints:
  - `GET /blogs?status=pending` lọc bài chờ duyệt.
  - `POST /blogs/:id/approve` duyệt.
  - `POST /blogs/:id/reject` từ chối.
  - Thống kê: `GET /blogs/statistics/status`, `GET /blogs/statistics/monthly?year=YYYY`.
- Request chính:
  - Approve body: {} (kèm id trên path).
  - Reject body: { rejectionReason }.
- Response chính:
  - Approve/Reject: blog đã cập nhật { id, status, publishedAt|rejectionReason }.
  - Thống kê status: { draft, pending, published, rejected } count.
  - Thống kê monthly: [{ month, count }].
- UI gợi ý (chi tiết):
  - Queue table: Tiêu đề | Tác giả | SubmittedAt | Trạng thái | Preview | Actions (Approve, Reject). Row click mở side panel hiển thị nội dung + ảnh.
  - Reject modal: textarea lý do, nút Confirm.
  - Charts: Pie status (draft/pending/published/rejected); Column theo tháng (số blog). Cards: tổng pending, published, rejected.

## 3) Quản lý gói subscription & doanh thu

- Công dụng: CRUD gói, xem hiệu suất doanh thu/subscription.
- Endpoints (Admin):
  - CRUD: `POST /subscriptions/plans`, `PATCH /subscriptions/plans/:id`, `DELETE /subscriptions/plans/:id`.
  - Stats: `GET /subscriptions/admin/stats`, `GET /subscriptions/stats/revenue-over-time?period=daily|weekly|monthly&days=30`, `GET /subscriptions/stats/total-revenue`, `GET /subscriptions/stats/revenue-by-plan`.
- Request chính:
  - Create body: { name, price, interval, isActive, isFree, features? }.
  - Update body: các trường tương tự cần đổi.
  - Revenue-over-time query: period, days.
- Response chính:
  - CRUD: plan { id, name, price, interval, isActive, isFree }.
  - admin/stats: thống kê số sub theo gói { planId: { name, count } }.
  - revenue-over-time: { period, days, data: [{ date, revenue }] }.
  - total-revenue: { totalRevenue, activeSubscriptions, cancelledSubscriptions, totalSubscriptions }.
  - revenue-by-plan: { data: [{ planId, name, revenue }] }.
- UI gợi ý (chi tiết):
  - Plan table: Tên | Giá | Chu kỳ (MONTHLY/YEARLY) | Free/Pay | Trạng thái | Actions (Edit, Disable).
  - Drawer form create/edit với toggle Free/Active, nhập price, interval, features list.
  - Dashboard: Line chart doanh thu theo thời gian; Cards: Total revenue, Active subs, Cancelled, Total subs; Bar/Pie doanh thu theo gói.

## 4) Thông báo hệ thống cho admin

- Công dụng: gửi broadcast tới tất cả user hoặc riêng admin.
- Endpoint: `POST /notifications` (Roles: ADMIN)
- Request body: { target: "ADMINS"|"ALL", title, message, type? }
- Response: notification { id, target, title, message, type, timestamp }.
- UI gợi ý (chi tiết):
  - Composer: input Title, textarea Message, select Target (Admins/All), select Type (INFO/WARN/SUCCESS), live preview.
  - History table: Title | Target | Type | Timestamp | Sender (nếu có) | Actions (re-send? nếu bổ sung sau).

## 5) Dashboard số liệu AI/OCR/Expense/Budget

- Công dụng: xem thống kê tổng hợp theo dịch vụ.
- Endpoints:
  - AI: `GET /ai/admin/stats`
  - OCR: `GET /ocr/admin/stats`
  - Expenses: `GET /expenses/admin/stats`
  - Budgets: `GET /budgets/admin/stats`
- Request: none (GET).
- Response chung: các trường thống kê (total, byCategory/byStatus, recent items) tùy dịch vụ.
- UI gợi ý (chi tiết):
  - Cards: tổng request, tỉ lệ thành công, tổng user sử dụng.
  - Recent table: 10 bản ghi gần nhất (tùy dịch vụ: scan job, expense, budget).
  - Charts: Pie phân bổ danh mục (expense), Column trạng thái job (OCR), Line trend theo thời gian (AI calls nếu có dữ liệu thời gian).

## 6) Quản lý thanh toán & kiểm tra trạng thái (hỗ trợ CS)

- Công dụng: tra cứu trạng thái thanh toán theo mã ref; xem callback VNPay.
- Endpoints: `GET /payments/:ref`, `GET /payments/vnpay/ipn`
- Request:
  - /:ref path param ref, header Authorization.
  - /vnpay/ipn query từ VNPay (dùng để log/verify).
- Response:
  - /:ref: { paymentRef, status, amount, planId, userId, createdAt }.
  - /vnpay/ipn: { message: "OK" } nếu hợp lệ.
- UI gợi ý (chi tiết):
  - Search box + nút Tra cứu; hiển thị thẻ trạng thái với badge màu (SUCCESS/FAILED/PENDING), số tiền, plan, user, createdAt.
  - Nếu FAILED: hiển thị hướng dẫn retry; nếu PENDING: badge cảnh báo.
  - IPN log viewer (read-only), sắp xếp theo thời gian nhận.

## 7) Thông báo cá nhân (admin cũng xem được)

- Công dụng: đọc, đếm, đánh dấu đã đọc, xoá thông báo cá nhân (user hoặc admin).
- Endpoints: `GET /notifications`, `GET /notifications/unread-count`, `POST /notifications/:id/read`, `POST /notifications/read-all`, `DELETE /notifications/:id`, `DELETE /notifications`
- Request chính:
  - GET list query: page?, limit?, unreadOnly?=true|false.
  - Mark read body: {} (id trên path).
- Response chính:
  - List: { data: [{ id, title, message, type, isRead, timestamp }], meta: { page, total } }.
  - unread-count: { count }.
  - Mark read / read-all / delete: 204 hoặc { success }.
- UI gợi ý (chi tiết):
  - Header bell icon với badge unread.
  - Drawer/list: mỗi item có title, message, type badge, timestamp; swipe/hover actions Mark read, Delete.
  - Toolbar: filter unread/all, nút Mark all read, nút Clear all; pagination hoặc infinite scroll.

## 8) Thống kê blog (bổ sung cho dashboard)

- Công dụng: hiển thị biểu đồ blog theo trạng thái/tháng.
- Endpoints: `GET /blogs/statistics/status`, `GET /blogs/statistics/monthly`
- Request: status (none) hoặc query year.
- Response: tương tự mục #2 thống kê (status counts, monthly series).
- UI gợi ý (chi tiết):
  - Cards: tổng blog, pending, published, rejected.
  - Pie status; Column theo tháng (stacked nếu muốn phân tách trạng thái theo tháng).

## 9) Danh mục chi tiêu (tham khảo)

- Công dụng: lấy danh mục chi tiêu chuẩn (public) để map báo cáo.
- Endpoint: `GET /expenses/categories`
- Request: none.
- Response: mảng category { slug, name }.
- UI gợi ý (chi tiết):
  - Table: Slug | Tên danh mục; search/filter nhanh.
  - Nếu tương lai cần chỉnh sửa, thêm nút “Request change” (ghi chú cần backend mở quyền).
