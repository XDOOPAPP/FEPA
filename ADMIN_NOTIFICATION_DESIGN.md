# 🔔 Hướng Dẫn Thiết Kế Notification cho Web Admin

## 📋 Tổng Quan

Tài liệu này hướng dẫn thiết kế và triển khai hệ thống notification cho trang web admin, tích hợp với notification service backend đã có sẵn.

## 🎯 Mục Tiêu

- Hiển thị thông báo real-time cho admin khi có sự kiện quan trọng
- Quản lý trạng thái đã đọc/chưa đọc
- Hiển thị số lượng thông báo chưa đọc
- Lịch sử thông báo và khả năng xóa
- UX/UI thân thiện và không gây xao nhãng

## 🏗️ Kiến Trúc Tổng Quan

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  Admin Web App  │◄────────│  API Gateway     │◄────────│  Notification   │
│  (Frontend)     │  HTTP   │                  │  HTTP   │  Service        │
│                 │         │                  │         │                 │
└────────┬────────┘         └──────────────────┘         └────────┬────────┘
         │                                                          │
         │                  ┌──────────────────┐                  │
         │                  │                  │                  │
         └──────WebSocket───┤  Socket Gateway  │◄─────RabbitMQ────┘
                            │  (Real-time)     │
                            └──────────────────┘
```

## 🔌 API Integration

### Backend APIs Đã Có Sẵn

Backend notification service đã cung cấp các endpoint sau (qua Gateway):

#### 1. **Tạo Thông Báo Mới (Admin Broadcast)**

Admin có thể tạo thông báo thủ công để gửi đến tất cả user hoặc chỉ admins.

```http
POST /api/v1/notifications
Authorization: Bearer {token}
x-user-id: {adminUserId}
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Thông báo bảo trì hệ thống",
  "message": "Hệ thống sẽ bảo trì từ 22h-24h hôm nay. Vui lòng lưu công việc.",
  "type": "SYSTEM_MAINTENANCE",
  "target": "ALL"
}
```

**Body Parameters:**

| Field     | Type   | Required | Description                                      |
| --------- | ------ | -------- | ------------------------------------------------ |
| `title`   | string | ✅       | Tiêu đề thông báo                                |
| `message` | string | ✅       | Nội dung thông báo                               |
| `type`    | string | ❌       | Loại thông báo (default: "INFO")                 |
| `target`  | string | ✅       | `"ALL"` (gửi tất cả) hoặc `"ADMINS"` (chỉ admin) |

**Response - 201 Created:**

```json
{
  "_id": "65abc123def456789",
  "userId": "all",
  "title": "Thông báo bảo trì hệ thống",
  "message": "Hệ thống sẽ bảo trì từ 22h-24h hôm nay. Vui lòng lưu công việc.",
  "type": "SYSTEM_MAINTENANCE",
  "metadata": {},
  "isRead": false,
  "createdAt": "2026-01-22T10:30:00.000Z",
  "updatedAt": "2026-01-22T10:30:00.000Z"
}
```

**Use Cases:**

- Thông báo bảo trì hệ thống
- Thông báo cập nhật tính năng mới
- Thông báo khẩn cấp
- Thông tin quan trọng cần chú ý

---

#### 2. **Lấy danh sách thông báo**

```http
GET /api/v1/notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer {token}
x-user-id: {userId}
```

**Query Parameters:**

- `page`: Số trang (default: 1)
- `limit`: Số item mỗi trang (default: 10)
- `unreadOnly`: Filter chỉ lấy chưa đọc, value: `"true"` (optional)

**Response:** Array trực tiếp (không có wrapper)

```json
[
  {
    "_id": "65abc123def456789",
    "userId": "admins",
    "type": "BLOG_SUBMITTED",
    "title": "Blog mới chờ duyệt",
    "message": "Blog 'Hướng dẫn React' đang chờ duyệt",
    "metadata": {
      "blogId": "xyz789",
      "authorId": "user123"
    },
    "isRead": false,
    "createdAt": "2026-01-22T10:30:00.000Z",
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
]
```

#### 2. **Lấy số lượng thông báo chưa đọc**

```http
GET /api/v1/notifications/unread-count
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response:**

```json
{
  "count": 5
}
```

#### 3. **Đánh dấu đã đọc một thông báo**

```http
POST /api/v1/notifications/:id/read
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response:** `204 No Content`

#### 4. **Đánh dấu tất cả đã đọc**

```http
POST /api/v1/notifications/read-all
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response:** `204 No Content`

#### 5. **Xóa một thông báo**

```http
DELETE /api/v1/notifications/:id
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response:** `204 No Content`

#### 6. **Xóa tất cả thông báo**

```http
DELETE /api/v1/notifications
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response:** `204 No Content`

**⚠️ Lưu ý quan trọng về Headers:**

Tất cả requests **BẮT BUỘC** phải có 2 headers:

1. `Authorization: Bearer {token}` - JWT token
2. `x-user-id: {userId}` - User ID (thường được Gateway inject tự động)

Nếu frontend gọi trực tiếp service (không qua Gateway), cần tự thêm `x-user-id`.

### 📌 Lưu Ý Quan Trọng Khi Tích Hợp

#### 1. Response Format

- **GET /notifications**: Trả về **Array trực tiếp**, KHÔNG có wrapper object

  ```javascript
  // ✅ Đúng
  const notifications = await response.data; // Array

  // ❌ Sai
  const notifications = await response.data.notifications; // undefined
  ```

#### 2. Query Parameters

- Filter chưa đọc: Dùng `unreadOnly=true` (không phải `isRead=false`)

  ```javascript
  // ✅ Đúng
  getAll({ page: 1, limit: 20, unreadOnly: "true" });

  // ❌ Sai
  getAll({ page: 1, limit: 20, isRead: false });
  ```

#### 3. User ID cho Admin

- Admin notifications có `userId = "admins"` (lowercase, số nhiều)
- Public notifications có `userId = "all"`
- User riêng có `userId = {userId}`

#### 4. Metadata Field

- `metadata` là object chứa thông tin bổ sung (blogId, authorId, etc.)
- Có thể dùng để navigate đến trang chi tiết khi click notification

#### 5. Role-based Access

- Backend tự động filter notifications dựa vào `req.user.role`:
  - `role = "ADMIN"`: Nhận notifications có userId = "admins" hoặc "all"
  - `role = "USER"`: Nhận notifications có userId = {userId} hoặc "all"

## 🔄 Real-time Notifications

### Cách 1: WebSocket (Khuyến nghị)

#### Socket Gateway Setup

Cần có Socket Gateway service riêng để xử lý WebSocket connections.

**Socket Events:**

**Client → Server:**

```javascript
// Kết nối với authentication
socket.emit("authenticate", { token: "Bearer xxx" });
```

**Server → Client:**

```javascript
// Thông báo mới
socket.on("notification:new", (notification) => {
  console.log("New notification:", notification);
});

// Thông báo đã đọc
socket.on("notification:read", (notificationId) => {
  console.log("Notification read:", notificationId);
});

// Cập nhật số lượng chưa đọc (hiển thị badge ở sidebar)
socket.on("notification:unread-count", (count) => {
  console.log("Unread count:", count);
});
```

### Cách 2: Server-Sent Events (SSE)

Nếu không muốn setup WebSocket phức tạp, có thể dùng SSE:

```http
GET /api/v1/notifications/stream
Authorization: Bearer {token}
```

Client code:

```javascript
const eventSource = new EventSource("/api/v1/notifications/stream", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

eventSource.addEventListener("notification", (event) => {
  const notification = JSON.parse(event.data);
  // Update UI
});
```

### Cách 3: Polling (Đơn giản nhất)

Poll endpoint `/unread-count` mỗi 30 giây:

```javascript
setInterval(async () => {
  const response = await fetch("/api/v1/notifications/unread-count", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { count } = await response.json();
  updateBadge(count);
}, 30000);
```

## 🎨 UI/UX Design

### Sidebar Navigation (Primary)

Thông báo được truy cập chính từ sidebar bên trái, có trang riêng để hiển thị và thao tác.

**Vị trí:** Sidebar trái, nhóm cùng mục "Hoạt động" hoặc "Hệ thống".

**Hành vi:**

- Hiển thị badge số lượng chưa đọc ngay trên item của sidebar.
- Click vào item điều hướng tới trang `/admin/notifications` (page riêng).
- Badge cập nhật real-time (WebSocket/SSE) hoặc polling định kỳ.

```
┌────────────── Admin Sidebar ──────────────┐
│  Dashboard                                │
│  Người dùng                               │
│  Bài viết                                 │
│  Thanh toán                                │
│  Thông báo            ● 5                 │  ◄── Badge chưa đọc
│  Cấu hình                                 │
└───────────────────────────────────────────┘
```

**Quick actions:** Nhấn chuột phải (hoặc menu ngữ cảnh) trên item để "Đánh dấu tất cả đã đọc".

### (Optional) Notification Bell Icon

**Vị trí:** Header/Navbar (góc phải)

**Thiết kế:**

```
┌─────────────────────────────────────┐
│  Admin Dashboard        [🔔] 👤 ▼  │
│                          (5)         │
└─────────────────────────────────────┘
```

**Features:**

- Badge đỏ hiển thị số lượng thông báo chưa đọc
- Animation khi có thông báo mới (pulse/shake)
- Click để mở dropdown

### (Optional) Notification Dropdown

**Kích thước:** 400px x 500px  
**Vị trí:** Dropdown từ bell icon, align right

```
┌──────────────────────────────────────────┐
│  Thông báo                    ⚙️  ✓      │
│  ─────────────────────────────────────   │
│                                          │
│  🟦 Blog mới chờ duyệt          • 2 phút│
│     Bài viết 'React Guide' cần duyệt    │
│  ──────────────────────────────────────  │
│  ⬜ Thanh toán thất bại         10 phút  │
│     User #123 - Giao dịch #456          │
│  ──────────────────────────────────────  │
│  ⬜ Người dùng mới               1 giờ   │
│     admin@example.com đã đăng ký         │
│  ──────────────────────────────────────  │
│                                          │
│  [    Xem tất cả thông báo    ]          │
└──────────────────────────────────────────┘
```

**Elements:**

- Header với title và action buttons (⚙️ settings, ✓ mark all read)
- List hiển thị 5-10 thông báo gần nhất
- Visual indicator cho unread (🟦) vs read (⬜)
- Timestamp relative (2 phút, 1 giờ, 1 ngày)
- Link "Xem tất cả" dẫn đến trang đầy đủ

### 3. Notification Item Design

**States:**

- **Unread:** Background màu xanh nhạt (#E3F2FD), font bold
- **Read:** Background trắng, font normal
- **Hover:** Background xám nhạt (#F5F5F5)

**Interactive:**

- Click vào item → Mark as read + Navigate đến chi tiết (nếu có)
- Hover hiển thị action menu (🗑️ Delete, ✓ Mark read)

### Notification Page (Sidebar)

**Route:** `/admin/notifications`

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Thông báo                      [+ Tạo Thông Báo]          │
│  ──────────────────────────────────────────────────────── │
│  [All ▼] [🔍 Search...]     [✓ Mark All Read]              │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  Hôm nay                                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ 🟦 Blog mới chờ duyệt         14:30              🗑️│  │
│  │    Bài viết 'React Guide' cần duyệt                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ⬜ Thanh toán thất bại        10:15              🗑️│  │
│  │    User #123 - Giao dịch #456                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  Hôm qua                                                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ⬜ Người dùng mới              15:20              🗑️│  │
│  │    admin@example.com đã đăng ký                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [← Prev]           Page 1 of 5                  [Next →]  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**

- **Button "Tạo Thông Báo"** (chỉ admin) - Mở modal để tạo broadcast notification
- Filter: All, Unread, Read
- Search trong title và message
- Group theo ngày (Hôm nay, Hôm qua, Tuần này, Tháng này)
- Pagination
- Bulk actions (Select multiple → Delete/Mark read)

### Create Notification Modal (Admin Only)

**Design:**

```
┌────────────────────────────────────────┐
│  Tạo Thông Báo Mới             ✕      │
│  ──────────────────────────────────── │
│                                        │
│  Tiêu đề *                             │
│  ┌──────────────────────────────────┐ │
│  │ Thông báo bảo trì hệ thống       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Nội dung *                            │
│  ┌──────────────────────────────────┐ │
│  │ Hệ thống sẽ bảo trì từ...       │ │
│  │                                  │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Loại thông báo                        │
│  ┌──────────────────────────────────┐ │
│  │ SYSTEM_MAINTENANCE          ▼   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Gửi đến *                             │
│  ○ Tất cả người dùng (ALL)            │
│  ○ Chỉ Admin (ADMINS)                 │
│                                        │
│  ──────────────────────────────────── │
│          [Hủy]      [Gửi Thông Báo]   │
└────────────────────────────────────────┘
```

**Validation Rules:**

- Tiêu đề: Required, min 5 chars, max 100 chars
- Nội dung: Required, min 10 chars, max 500 chars
- Loại: Optional (default: "INFO")
- Target: Required (ALL hoặc ADMINS)

**Notification Types để chọn:**

- `INFO` - Thông tin chung
- `SYSTEM_MAINTENANCE` - Bảo trì hệ thống
- `FEATURE_UPDATE` - Cập nhật tính năng
- `URGENT` - Khẩn cấp
- `ANNOUNCEMENT` - Thông báo quan trọng

## 💻 Implementation Guide

### Tech Stack Recommendations

**Frontend:**

- **React:** với Redux/Zustand cho state management
- **Socket.io-client:** cho WebSocket
- **React Query/SWR:** cho data fetching và caching
- **Headless UI/Radix UI:** cho accessible components
- **Tailwind CSS:** cho styling

### Frontend Architecture

```
src/
├── features/
│   └── notifications/
│       ├── components/
│       │   ├── NotificationNavItem.jsx
│       │   ├── NotificationItem.jsx
│       │   └── NotificationPage.jsx
│       ├── hooks/
│       │   ├── useNotifications.js
│       │   ├── useNotificationSocket.js
│       │   └── useNotificationActions.js
│       ├── services/
│       │   └── notificationService.js
│       ├── store/
│       │   └── notificationSlice.js (Redux)
│       └── types/
│           └── notification.types.js
```

### 📖 Complete Example: Fetch & Display Notifications

Ví dụ hoàn chỉnh về cách fetch và hiển thị notifications đúng cách:

```javascript
// Example: NotificationPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get("/api/v1/notifications", {
        params: {
          page: page,
          limit: 20,
          // unreadOnly: 'true' // Uncomment để chỉ lấy chưa đọc
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": userId,
        },
      });

      // ✅ Backend trả về array trực tiếp
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      await axios.post(
        `/api/v1/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        },
      );

      // Update UI
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Thông báo</h1>

      {notifications.length === 0 ? (
        <p>Không có thông báo nào</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              onClick={() => handleMarkAsRead(notification._id)}
              className={notification.isRead ? "" : "font-bold"}
            >
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
};

export default NotificationPage;
```

### Code Examples

#### 1. Notification Service

```javascript
// services/notificationService.js
import axios from "axios";

const API_URL = "/api/v1/notifications";

// Tạo axios instance với interceptor
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor tự động thêm headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Hoặc từ auth store

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["x-user-id"] = userId;
  }

  return config;
});

export const notificationService = {
  // Tạo thông báo mới (Admin only)
  createNotification: async (data) => {
    const response = await apiClient.post("", data);
    return response.data;
  },

  // Lấy danh sách thông báo
  getAll: async (params = {}) => {
    const response = await apiClient.get("", { params });
    return response.data; // Trả về array trực tiếp
  },

  // Lấy số lượng chưa đọc
  getUnreadCount: async () => {
    const response = await apiClient.get("/unread-count");
    return response.data.count; // Backend trầ về {count: 5}
  },

  // Đánh dấu đã đọc
  markAsRead: async (id) => {
    await apiClient.post(`/${id}/read`);
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    await apiClient.post("/read-all");
  },

  // Xóa thông báo
  deleteNotification: async (id) => {
    await apiClient.delete(`/${id}`);
  },

  // Xóa tất cả
  deleteAll: async () => {
    await apiClient.delete("");
  },
};
```

#### 2. WebSocket Hook

```javascript
// hooks/useNotificationSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useNotificationStore } from "../store/notificationSlice";

export const useNotificationSocket = () => {
  const { addNotification, updateUnreadCount } = useNotificationStore();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    // Lắng nghe thông báo mới
    socket.on("notification:new", (notification) => {
      addNotification(notification);

      // Hiển thị toast/alert
      showNotificationToast(notification);

      // Play sound (optional)
      playNotificationSound();
    });

    // Lắng nghe cập nhật số lượng
    socket.on("notification:unread-count", (count) => {
      updateUnreadCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification, updateUnreadCount]);
};
```

#### 3. Create Notification Modal Component (Admin Only)

```javascript
// components/CreateNotificationModal.jsx
import React, { useState } from "react";
import { notificationService } from "../services/notificationService";

export const CreateNotificationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "INFO",
    target: "ALL",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const notificationTypes = [
    { value: "INFO", label: "Thông tin chung" },
    { value: "SYSTEM_MAINTENANCE", label: "Bảo trì hệ thống" },
    { value: "FEATURE_UPDATE", label: "Cập nhật tính năng" },
    { value: "URGENT", label: "Khẩn cấp" },
    { value: "ANNOUNCEMENT", label: "Thông báo quan trọng" },
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    }
    if (formData.title.length > 100) {
      newErrors.title = "Tiêu đề không được quá 100 ký tự";
    }

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = "Nội dung phải có ít nhất 10 ký tự";
    }
    if (formData.message.length > 500) {
      newErrors.message = "Nội dung không được quá 500 ký tự";
    }

    if (!formData.target) {
      newErrors.target = "Vui lòng chọn đối tượng nhận";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const result = await notificationService.createNotification(formData);

      // Show success message
      alert("Thông báo đã được gửi thành công!");

      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "INFO",
        target: "ALL",
      });

      // Close modal and refresh list
      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error("Failed to create notification:", error);
      alert("Gửi thông báo thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tạo Thông Báo Mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tiêu đề */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Thông báo bảo trì hệ thống"
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.title.length}/100
            </p>
          </div>

          {/* Nội dung */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Hệ thống sẽ bảo trì từ 22h-24h hôm nay..."
              maxLength={500}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.message.length}/500
            </p>
          </div>

          {/* Loại thông báo */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Loại thông báo
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {notificationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gửi đến */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Gửi đến <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="target"
                  value="ALL"
                  checked={formData.target === "ALL"}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                  className="mr-2"
                />
                <span>Tất cả người dùng (ALL)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="target"
                  value="ADMINS"
                  checked={formData.target === "ADMINS"}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                  className="mr-2"
                />
                <span>Chỉ Admin (ADMINS)</span>
              </label>
            </div>
            {errors.target && (
              <p className="text-red-500 text-xs mt-1">{errors.target}</p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi Thông Báo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

**Usage Example:**

```javascript
// In NotificationPage.jsx
import { CreateNotificationModal } from "./CreateNotificationModal";

const NotificationPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleNotificationCreated = (newNotification) => {
    // Refresh notifications list
    fetchNotifications();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Thông báo</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Tạo Thông Báo
        </button>
      </div>

      {/* Notifications list */}

      <CreateNotificationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleNotificationCreated}
      />
    </div>
  );
};
```

#### 4. Sidebar Navigation Item (Sidebar Left)

```javascript
// components/NotificationNavItem.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { notificationService } from "../services/notificationService";
// Nếu dùng state global (Redux/Zustand) được cập nhật bởi socket,
// có thể lấy unreadCount trực tiếp từ store thay vì polling.

export const NotificationNavItem = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Optional: cập nhật real-time qua store (nếu đã tích hợp socket)
  // const unreadFromStore = useNotificationStore((s) => s.unreadCount);
  // useEffect(() => setUnreadCount(unreadFromStore), [unreadFromStore]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (e) {
        console.error("Failed to load unread count", e);
      }
    };
    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <NavLink
      to="/admin/notifications"
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition ${
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
        }`
      }
    >
      <span className="flex items-center gap-2">
        <span aria-hidden>🔔</span>
        <span>Thông báo</span>
      </span>
      {unreadCount > 0 && (
        <span className="min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </NavLink>
  );
};
```

#### Routes Integration

```javascript
// routes/adminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { NotificationPage } from "../features/notifications/components/NotificationPage";

export const AdminRoutes = () => (
  <Routes>
    {/* ...other routes */}
    <Route path="/admin/notifications" element={<NotificationPage />} />
  </Routes>
);

// layout/Sidebar.jsx (đoạn liên quan)
import { NotificationNavItem } from "../features/notifications/components/NotificationNavItem";

export const Sidebar = () => (
  <nav className="space-y-1">
    {/* ...other nav items */}
    <NotificationNavItem />
  </nav>
);
```

#### (Optional) Notification Bell Component

```javascript
// components/NotificationBell.jsx
import React, { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { notificationService } from "../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    };

    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Animation khi có thông báo mới
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      const timer = setTimeout(() => setHasNewNotification(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full hover:bg-gray-100 ${
          hasNewNotification ? "animate-pulse" : ""
        }`}
      >
        <BellIcon className="h-6 w-6 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
          onCountChange={setUnreadCount}
        />
      )}
    </div>
  );
};
```

#### (Optional) Notification Dropdown Component

```javascript
// components/NotificationDropdown.jsx
import React, { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import NotificationItem from "./NotificationItem";
import { Link } from "react-router-dom";

export const NotificationDropdown = ({ onClose, onCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll({
          limit: 10,
          page: 1,
        });
        // Backend trả về array trực tiếp, không có wrapper
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onCountChange(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      const newCount = notifications.filter(
        (n) => !n.isRead && n._id !== id,
      ).length;
      onCountChange(newCount);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Thông báo</h3>
        <button
          onClick={handleMarkAllRead}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-center">
        <Link
          to="/admin/notifications"
          onClick={onClose}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
};
```

#### 5. Notification Item Component

```javascript
// components/NotificationItem.jsx
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { TrashIcon } from "@heroicons/react/24/outline";

const getNotificationIcon = (type) => {
  const icons = {
    BLOG_SUBMITTED: "📝",
    BLOG_APPROVED: "✅",
    BLOG_REJECTED: "❌",
    PAYMENT_SUCCESS: "💳",
    PAYMENT_FAILED: "⚠️",
    USER_CREATED: "👤",
    SUBSCRIPTION_EXPIRED: "⏰",
  };
  return icons[type] || "🔔";
};

export const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }

    // Navigate to related page based on metadata
    if (notification.metadata?.blogId) {
      window.location.href = `/admin/blogs/${notification.metadata.blogId}`;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div
      className={`group relative p-4 border-b hover:bg-gray-50 cursor-pointer ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${!notification.isRead ? "font-semibold" : ""}`}
          >
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">{timeAgo}</p>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
      )}
    </div>
  );
};
```

#### 6. Redux Store (Optional)

```javascript
// store/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload,
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    deleteNotification: (state, action) => {
      const index = state.notifications.findIndex(
        (n) => n._id === action.payload,
      );
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        state.notifications.splice(index, 1);
        if (wasUnread) state.unreadCount -= 1;
      }
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  updateUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
```

## 🎨 Styling Examples

### Tailwind CSS Classes

```css
/* Notification Badge (sidebar/header) */
.notification-badge {
  @apply absolute -top-1 -right-1 bg-red-500 text-white text-xs 
         font-bold rounded-full h-5 w-5 flex items-center justify-center
         ring-2 ring-white;
}

/* Notification Item Unread */
.notification-unread {
  @apply bg-blue-50 border-l-4 border-blue-500;
}

/* Notification Item Read */
.notification-read {
  @apply bg-white border-l-4 border-transparent;
}

/* Pulse Animation */
@keyframes pulse-soft {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.notification-pulse {
  animation: pulse-soft 2s ease-in-out infinite;
}
```

## 📱 Responsive Design

### Mobile View

- Sidebar thu gọn thành Drawer/Hamburger menu; mục "Thông báo" vẫn hiển thị badge.
- Trang `/admin/notifications` mở full-screen, danh sách tối ưu cho chạm (khoảng cách item lớn hơn, hit-area rộng).
- Hỗ trợ thao tác vuốt để Delete/Mark read (optional).
- (Optional) Có thể giữ Bell icon như shortcut, nhưng không bắt buộc.

```javascript
// Mobile Sidebar / Drawer
const MobileSidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (!isMobile) return null;
  return (
    <Drawer>
      {/* ...other nav items */}
      <NotificationNavItem />
    </Drawer>
  );
};
```

## 🔔 Notification Types cho Admin

### Notification Types Nhận Được

Các loại thông báo admin cần nhận (tự động từ events):

| Type                   | Priority | Description            | Action                   |
| ---------------------- | -------- | ---------------------- | ------------------------ |
| `BLOG_SUBMITTED`       | High     | Blog mới cần duyệt     | Navigate to blog review  |
| `PAYMENT_FAILED`       | High     | Thanh toán thất bại    | View transaction details |
| `USER_CREATED`         | Medium   | Người dùng mới đăng ký | View user profile        |
| `SUBSCRIPTION_EXPIRED` | Low      | Subscription hết hạn   | View subscription list   |
| `SYSTEM_ERROR`         | Critical | Lỗi hệ thống           | View error logs          |

### Notification Types Có Thể Tạo (Broadcast)

Admin có thể tạo thủ công các loại thông báo sau:

| Type                 | Label                | Use Case                    |
| -------------------- | -------------------- | --------------------------- |
| `INFO`               | Thông tin chung      | Thông tin chung không khẩn  |
| `SYSTEM_MAINTENANCE` | Bảo trì hệ thống     | Thông báo bảo trì, nâng cấp |
| `FEATURE_UPDATE`     | Cập nhật tính năng   | Tính năng mới, cập nhật     |
| `URGENT`             | Khẩn cấp             | Vấn đề cần xử lý ngay       |
| `ANNOUNCEMENT`       | Thông báo quan trọng | Thông báo chính thức        |

### Role-Based Access Control

```javascript
// Helper function to check admin permission
const canCreateNotification = (user) => {
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
};

// In component
const NotificationPage = () => {
  const { user } = useAuth(); // Get current user

  return (
    <div>
      <div className="flex justify-between">
        <h1>Thông báo</h1>

        {/* Only show create button for admin */}
        {canCreateNotification(user) && (
          <button onClick={() => setShowCreateModal(true)}>
            + Tạo Thông Báo
          </button>
        )}
      </div>

      {/* ... */}
    </div>
  );
};
```

## ⚙️ Settings & Preferences

Cho phép admin tùy chỉnh:

- Enable/disable notification types
- Sound on/off
- Desktop notifications
- Email digest (daily/weekly)

```javascript
// Notification Settings Component
const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    enableSound: true,
    enableDesktop: true,
    types: {
      BLOG_SUBMITTED: true,
      PAYMENT_FAILED: true,
      USER_CREATED: false,
      SUBSCRIPTION_EXPIRED: true,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Âm thanh thông báo</span>
        <Toggle checked={settings.enableSound} />
      </div>

      <div className="flex items-center justify-between">
        <span>Thông báo desktop</span>
        <Toggle checked={settings.enableDesktop} />
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-3">Loại thông báo</h4>
        {Object.entries(settings.types).map(([type, enabled]) => (
          <div key={type} className="flex items-center justify-between py-2">
            <span>{getNotificationTypeLabel(type)}</span>
            <Toggle checked={enabled} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🔊 Browser Notifications

```javascript
// Request permission và hiển thị browser notification
const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

const showBrowserNotification = (notification) => {
  if (Notification.permission === "granted") {
    new Notification(notification.title, {
      body: notification.message,
      icon: "/logo.png",
      badge: "/badge.png",
      tag: notification._id,
      requireInteraction: false,
    });
  }
};
```

## ⚡ Performance Optimization

### 1. Caching với React Query

```javascript
import { useQuery, useMutation, useQueryClient } from "react-query";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ["notifications"],
    () => notificationService.getAll({ limit: 10 }),
    {
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
    },
  );

  const markAsReadMutation = useMutation(
    (id) => notificationService.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
      },
    },
  );

  return {
    notifications: data || [], // data là array trực tiếp
    isLoading,
    markAsRead: markAsReadMutation.mutate,
  };
};
```

### 2. Virtual Scrolling

Cho danh sách thông báo dài:

```javascript
import { FixedSizeList } from "react-window";

const NotificationList = ({ notifications }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <NotificationItem notification={notifications[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={notifications.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### 3. Debounce Search

```javascript
import { useMemo, useState } from "react";
import debounce from "lodash/debounce";

const NotificationSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        // Search API call
        notificationService.getAll({ search: value });
      }, 300),
    [],
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Tìm kiếm thông báo..."
    />
  );
};
```

## 🧪 Testing

### Unit Tests

```javascript
// NotificationBell.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { NotificationBell } from "./NotificationBell";

describe("NotificationBell", () => {
  it("should display unread count", () => {
    render(<NotificationBell unreadCount={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should open dropdown on click", () => {
    render(<NotificationBell />);
    const bell = screen.getByRole("button");
    fireEvent.click(bell);
    expect(screen.getByText("Thông báo")).toBeInTheDocument();
  });
});
```

```javascript
// NotificationNavItem.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotificationNavItem } from "./NotificationNavItem";

jest.mock("../services/notificationService", () => ({
  notificationService: { getUnreadCount: jest.fn().mockResolvedValue(3) },
}));

describe("NotificationNavItem", () => {
  it("renders nav item with unread badge", async () => {
    render(
      <MemoryRouter>
        <NotificationNavItem />
      </MemoryRouter>,
    );
    const label = await screen.findByText(/Thông báo/i);
    expect(label).toBeInTheDocument();
    expect(await screen.findByText("3")).toBeInTheDocument();
  });
});
```

## 🚀 Deployment Checklist

- [ ] Setup Socket Gateway service
- [ ] Configure CORS cho WebSocket
- [ ] Environment variables cho frontend
- [ ] SSL certificate cho WSS (WebSocket Secure)
- [ ] Configure reverse proxy (Nginx) cho WebSocket
- [ ] Setup monitoring cho WebSocket connections
- [ ] Test với multiple browsers
- [ ] Test với mobile devices
- [ ] Load testing cho concurrent connections
- [ ] Setup analytics tracking

## 📊 Analytics & Monitoring

Track các metrics quan trọng:

```javascript
// Google Analytics Events
const trackNotificationEvent = (action, label) => {
  window.gtag("event", action, {
    event_category: "Notification",
    event_label: label,
  });
};

// Usage
trackNotificationEvent("notification_opened", "BLOG_SUBMITTED");
trackNotificationEvent("notification_read", notificationId);
trackNotificationEvent("notification_deleted", notificationId);
```

## ⚠️ Common Mistakes & Troubleshooting

### Mistake 1: Accessing Nested Properties

```javascript
// ❌ SAI - Backend không trả về wrapper object
const notifications = response.data.notifications; // undefined
const count = response.data.data.count; // undefined

// ✅ ĐÚNG
const notifications = response.data; // Array trực tiếp
const count = response.data.count; // Number trực tiếp
```

### Mistake 2: Missing Required Headers

```javascript
// ❌ SAI - Thiếu x-user-id header
axios.get("/api/v1/notifications", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
// Result: 401 Unauthorized

// ✅ ĐÚNG
axios.get("/api/v1/notifications", {
  headers: {
    Authorization: `Bearer ${token}`,
    "x-user-id": userId,
  },
});
```

### Mistake 3: Wrong Query Parameter

```javascript
// ❌ SAI - Backend không hỗ trợ isRead parameter
getAll({ isRead: false });

// ✅ ĐÚNG - Dùng unreadOnly
getAll({ unreadOnly: "true" });
```

### Mistake 4: Expecting Pagination Metadata

```javascript
// ❌ SAI - Backend không trả về pagination metadata
const { notifications, total, page } = response.data;

// ✅ ĐÚNG - Tự quản lý pagination ở frontend
const notifications = response.data;
const hasMore = notifications.length === limit;
```

### Mistake 5: Not Handling 204 No Content

```javascript
// ❌ SAI - Expect response body
const result = await markAsRead(id);
console.log(result.data); // undefined vì 204 No Content

// ✅ ĐÚNG - Check status code
await markAsRead(id);
// No response body, just update UI directly
```

### Debug Checklist

Nếu gặp lỗi, check theo thứ tự:

1. ✅ Headers có đầy đủ `Authorization` và `x-user-id`?
2. ✅ Response format có đúng (Array/Object trực tiếp)?
3. ✅ Query parameters có đúng tên (`unreadOnly`, không phải `isRead`)?
4. ✅ userId của admin có đúng format (`"admins"`, lowercase)?
5. ✅ Token có còn valid không (check expiry)?

### Testing với cURL

```bash
# Test với đầy đủ headers
curl -X GET "http://localhost:3003/api/v1/notifications?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "x-user-id: admin123" \
  -v

# Check response format
# Phải là array: [{"_id": "...", "title": "...", ...}]
# Không phải: {"notifications": [...]}
```

## 🔐 Security Considerations

1. **Authentication:** Verify JWT token trước khi establish WebSocket connection
2. **Authorization:** Chỉ admin mới nhận được admin notifications
3. **Rate Limiting:** Giới hạn số lượng API calls
4. **XSS Protection:** Sanitize notification message trước khi render
5. **CORS:** Cấu hình đúng CORS policy

```javascript
// Sanitize notification message
import DOMPurify from "dompurify";

const SafeNotificationMessage = ({ message }) => {
  const cleanMessage = DOMPurify.sanitize(message);
  return <div dangerouslySetInnerHTML={{ __html: cleanMessage }} />;
};
```

## 📚 Resources

- [Socket.io Documentation](https://socket.io/docs/)
- [React Query](https://tanstack.com/query/latest)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Headless UI](https://headlessui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🎯 Next Steps

1. Setup Socket Gateway service
2. Implement Sidebar `NotificationNavItem`
3. Integrate WebSocket connection (update badge real-time)
4. Test với real notifications
5. Add browser notifications (optional shortcut từ header)
6. Implement notification settings
7. Add analytics tracking
8. Performance optimization
9. Mobile responsive testing
10. Production deployment

---

**Chúc bạn triển khai thành công! 🚀**
