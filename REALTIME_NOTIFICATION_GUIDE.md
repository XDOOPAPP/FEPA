# 🔔 Hướng Dẫn Tích Hợp Realtime Notification Cho Web

> **Tài liệu này hướng dẫn cách kết nối Socket.IO với backend đã deploy trên VPS để nhận thông báo realtime.**

**Server VPS:** `76.13.21.84`

---

## 📋 Mục Lục

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Cài Đặt Thư Viện](#2-cài-đặt-thư-viện)
3. [Tích Hợp Socket Service](#3-tích-hợp-socket-service)
4. [Tích Hợp vào Ứng Dụng](#4-tích-hợp-vào-ứng-dụng)
5. [Testing](#5-testing)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Tổng Quan Kiến Trúc

### Kiến Trúc Microservice

Hệ thống sử dụng kiến trúc microservice với các component sau:

```
┌──────────────────────────────────────────────────────────────────┐
│                        VPS: 76.13.21.84                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐      ┌──────────────┐      ┌───────────────┐  │
│  │ API Gateway │      │   RabbitMQ   │      │ Socket Gateway│  │
│  │  Port 3000  │      │  Port 5672   │      │  Port 3102    │  │
│  └──────┬──────┘      └──────┬───────┘      └───────┬───────┘  │
│         │                    │                      │          │
│         ├──────┐             │                      │          │
│         │      │             │                      │          │
│    ┌────▼───┐ ┌▼──────────┐ │         WebSocket    │          │
│    │ Auth   │ │Notification│◀┘         (Socket.IO) │          │
│    │Service │ │  Service   │                        │          │
│    │Port3001│ │ Port 3006  │◀───────Events──────────┘          │
│    └────────┘ └────────────┘                                   │
│                                                                  │
│    ┌─────────┐ ┌─────────┐ ┌─────────┐                         │
│    │  Blog   │ │ Expense │ │ Budget  │ ...                     │
│    │ Service │ │ Service │ │ Service │                          │
│    └─────────┘ └─────────┘ └─────────┘                         │
│                      │                                           │
│                      └──────Events────▶ RabbitMQ                │
└──────────────────────────────────────────────────────────────────┘
                             │
                             │ WebSocket
                             ▼
                   ┌─────────────────┐
                   │   Web Client    │
                   │   (Frontend)    │
                   └─────────────────┘
```

### Các Component Liên Quan

1. **API Gateway** (`Port 3000`): Cổng vào chính cho REST API
2. **Socket Gateway** (`Port 3102`): WebSocket server riêng biệt cho realtime communication
3. **Notification Service** (`Port 3006`): Quản lý lưu trữ thông báo
4. **Auth Service** (`Port 3001`): Xác thực và quản lý JWT token
5. **Backend Services**: Các microservices khác (Blog, Expense, Budget, etc.) phát sinh events
6. **RabbitMQ** (`Port 5672`): Message broker trung gian (Exchange: `domain_events`)

### URL Endpoints

- **API Gateway**: `http://76.13.21.84:3000`
- **Socket Gateway**: `http://76.13.21.84:3102` ⚡ (Dùng cho WebSocket)
- **Notification API**: `http://76.13.21.84:3000/api/v1/notifications` (qua Gateway)

### Các Event Hệ Thống Hỗ Trợ

| Event                  | Mô tả                 | Target       |
| ---------------------- | --------------------- | ------------ |
| `USER_CREATED`         | Chào mừng user mới    | User + Admin |
| `PAYMENT_SUCCESS`      | Thanh toán thành công | User         |
| `PAYMENT_FAILED`       | Thanh toán thất bại   | User + Admin |
| `SUBSCRIPTION_EXPIRED` | Hết hạn gói dịch vụ   | User         |
| `BLOG_SUBMITTED`       | Blog mới chờ duyệt    | Admin        |
| `BLOG_APPROVED`        | Blog đã được duyệt    | User         |
| `BLOG_REJECTED`        | Blog bị từ chối       | User         |

---

## 2. Cài Đặt Thư Viện

### React / Next.js

```bash
npm install socket.io-client
```

### Vue.js

```bash
npm install socket.io-client
```

### Angular

```bash
npm install socket.io-client
npm install @types/socket.io-client --save-dev
```

### Vanilla JS (CDN)

```html
<script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
```

### 📝 Environment Variables

Thêm vào file `.env` của frontend:

```env
# React
REACT_APP_API_URL=http://76.13.21.84:3000
REACT_APP_SOCKET_URL=http://76.13.21.84:3102

# Vue/Vite
VITE_API_URL=http://76.13.21.84:3000
VITE_SOCKET_URL=http://76.13.21.84:3102

# Next.js
NEXT_PUBLIC_API_URL=http://76.13.21.84:3000
NEXT_PUBLIC_SOCKET_URL=http://76.13.21.84:3102
```

---

## 3. Tích Hợp Socket Service

### Tạo Socket Service

Tạo file `src/services/socketService.js` (hoặc `src/utils/socketService.js`):

```javascript
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Kết nối Socket với authentication
   * @param {string} token - JWT access token
   */
  connect(token) {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    const SOCKET_URL =
      process.env.REACT_APP_SOCKET_URL || "http://76.13.21.84:3102";

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupDefaultListeners();
  }

  /**
   * Setup các listener mặc định
   */
  setupDefaultListeners() {
    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
    });

    this.socket.on("error", (error) => {
      console.error("🔴 Socket error:", error);
    });
  }

  /**
   * Lắng nghe event notification mới
   * @param {Function} callback - Hàm xử lý khi nhận notification
   * @returns {string} listenerId - ID để unsubscribe sau này
   */
  onNotification(callback) {
    if (!this.socket) {
      throw new Error("Socket not initialized. Call connect() first.");
    }

    const listenerId = `notification_${Date.now()}`;

    const handler = (data) => {
      console.log("📬 New notification received:", data);
      callback(data);
    };

    this.socket.on("notification:new", handler);
    this.listeners.set(listenerId, { event: "notification:new", handler });

    return listenerId;
  }

  /**
   * Hủy lắng nghe notification
   * @param {string} listenerId - ID từ onNotification
   */
  offNotification(listenerId) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      this.socket.off(listener.event, listener.handler);
      this.listeners.delete(listenerId);
    }
  }

  /**
   * Ngắt kết nối socket
   */
  disconnect() {
    if (this.socket) {
      // Clear all listeners
      this.listeners.forEach((listener) => {
        this.socket.off(listener.event, listener.handler);
      });
      this.listeners.clear();

      this.socket.disconnect();
      this.socket = null;
      console.log("Socket disconnected manually");
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;
```

---

## 4. Tích Hợp vào Ứng Dụng

### Cách 1: Tích Hợp Đơn Giản (Không dùng Context)

Nếu UI notification đã có sẵn, bạn chỉ cần kết nối socket và lắng nghe event:

```javascript
// Trong component notification của bạn
import { useEffect } from "react";
import socketService from "./services/socketService";

function YourNotificationComponent() {
  useEffect(() => {
    // Lấy token từ localStorage hoặc auth context
    const token = localStorage.getItem("access_token");

    if (token) {
      // Kết nối socket
      socketService.connect(token);

      // Lắng nghe notification mới
      const listenerId = socketService.onNotification((notification) => {
        console.log("📬 Notification mới:", notification);

        // Xử lý notification: cập nhật UI, hiển thị toast, etc.
        // notification có format:
        // {
        //   title: "Tiêu đề",
        //   message: "Nội dung",
        //   type: "PAYMENT_SUCCESS",
        //   userId: "user_id",
        //   createdAt: "2026-01-22T...",
        //   isRead: false
        // }

        // Gọi hàm cập nhật UI của bạn
        handleNewNotification(notification);
      });

      // Cleanup khi component unmount
      return () => {
        socketService.offNotification(listenerId);
        socketService.disconnect();
      };
    }
  }, []);

  const handleNewNotification = (notification) => {
    // TODO: Implement logic cập nhật UI notification của bạn
    // Ví dụ:
    // - Thêm vào danh sách notification
    // - Tăng unread count
    // - Hiển thị toast/alert
    // - Phát âm thanh
  };

  return (
    // UI notification của bạn
    <div>...</div>
  );
}
```

### Cách 2: Tích Hợp với Context (Nâng Cao)

Nếu bạn muốn quản lý notification state toàn app, tạo Context:

**Tạo file `src/contexts/NotificationContext.jsx`:**

```javascript
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import socketService from "../services/socketService";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Khởi tạo socket connection
   */
  const initSocket = useCallback((token) => {
    try {
      socketService.connect(token);
      setIsConnected(true);

      // Lắng nghe notification mới
      const listenerId = socketService.onNotification((notification) => {
        handleNewNotification(notification);
      });

      // Cleanup khi unmount
      return () => {
        socketService.offNotification(listenerId);
      };
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      setIsConnected(false);
    }
  }, []);

  /**
   * Xử lý notification mới
   */
  const handleNewNotification = (notification) => {
    // Thêm vào danh sách
    setNotifications((prev) => [notification, ...prev]);

    // Tăng unread count
    setUnreadCount((prev) => prev + 1);

    // Hiển thị browser notification (nếu được phép)
    showBrowserNotification(notification);

    // Phát âm thanh (optional)
    playNotificationSound();
  };

  /**
   * Hiển thị browser notification
   */
  const showBrowserNotification = (notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png",
        badge: "/badge-icon.png",
      });
    }
  };

  /**
   * Phát âm thanh thông báo
   */
  const playNotificationSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.log("Failed to play sound:", err));
  };

  /**
   * Yêu cầu quyền browser notification
   */
  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  };

  /**
   * Đánh dấu một notification đã đọc
   */
  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Đánh dấu tất cả đã đọc
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
    setUnreadCount(0);
  }, []);

  /**
   * Xóa notification
   */
  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      if (notification && !notification.isRead) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  }, []);

  /**
   * Clear tất cả notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    initSocket,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
```

**Wrap App với Provider** trong `src/App.jsx`:

```javascript
import React, { useEffect } from "react";
import {
  NotificationProvider,
  useNotification,
} from "./contexts/NotificationContext";
import { useAuth } from "./contexts/AuthContext"; // Your auth context

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

function AppContent() {
  const { token } = useAuth(); // Lấy JWT token từ auth context
  const { initSocket, requestNotificationPermission } = useNotification();

  useEffect(() => {
    // Khi user đã login, init socket
    if (token) {
      initSocket(token);

      // Request browser notification permission
      requestNotificationPermission();
    }
  }, [token, initSocket, requestNotificationPermission]);

  return <div>{/* Your app components */}</div>;
}

export default App;
```

### Cách 3: Vue.js Implementation

#### Step 1: Tạo Socket Plugin

Tạo file `src/plugins/socket.js`:

```javascript
import { io } from "socket.io-client";
import { ref } from "vue";

export const socketPlugin = {
  install(app, options) {
    const socket = ref(null);
    const isConnected = ref(false);

    const connect = (token) => {
      const SOCKET_URL =
        import.meta.env.VITE_SOCKET_URL || "http://76.13.21.84:3102";

      socket.value = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.value.on("connect", () => {
        console.log("✅ Socket connected");
        isConnected.value = true;
      });

      socket.value.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        isConnected.value = false;
      });
    };

    const disconnect = () => {
      if (socket.value) {
        socket.value.disconnect();
        socket.value = null;
      }
    };

    // Provide to all components
    app.provide("socket", {
      socket,
      isConnected,
      connect,
      disconnect,
    });
  },
};
```

#### Step 2: Composable cho Notification

Tạo file `src/composables/useNotifications.js`:

```javascript
import { ref, computed, inject } from "vue";

export function useNotifications() {
  const { socket } = inject("socket");
  const notifications = ref([]);
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length,
  );

  const startListening = () => {
    if (!socket.value) return;

    socket.value.on("notification:new", (notification) => {
      notifications.value.unshift(notification);
      showBrowserNotification(notification);
    });
  };

  const showBrowserNotification = (notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png",
      });
    }
  };

  const markAsRead = (id) => {
    const notif = notifications.value.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  };

  return {
    notifications,
    unreadCount,
    startListening,
    markAsRead,
  };
}
```

#### Step 3: Sử dụng trong Component

```vue
<template>
  <div>
    <button @click="toggleNotifications">
      🔔 Notifications ({{ unreadCount }})
    </button>

    <div v-if="showPanel" class="notification-panel">
      <div v-for="notif in notifications" :key="notif.id">
        {{ notif.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useNotifications } from "@/composables/useNotifications";

const { socket, connect } = inject("socket");
const { notifications, unreadCount, startListening } = useNotifications();
const showPanel = ref(false);

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    connect(token);
    startListening();
  }
});

const toggleNotifications = () => {
  showPanel.value = !showPanel.value;
};
</script>
```

---

### Cách 4: Vanilla JavaScript Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Realtime Notifications</title>
    <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
  </head>
  <body>
    <div id="notification-bell">🔔 <span id="unread-count">0</span></div>

    <div id="notification-list"></div>

    <script>
      // Configuration
      const SOCKET_URL = "http://76.13.21.84:3102";
      const TOKEN = localStorage.getItem("access_token");

      // State
      let notifications = [];
      let unreadCount = 0;

      // Connect socket
      const socket = io(SOCKET_URL, {
        auth: { token: TOKEN },
      });

      // Connection events
      socket.on("connect", () => {
        console.log("✅ Connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected");
      });

      // Listen for notifications
      socket.on("notification:new", (notification) => {
        console.log("📬 New notification:", notification);

        // Add to list
        notifications.unshift(notification);
        unreadCount++;

        // Update UI
        updateNotificationUI();
        showBrowserNotification(notification);
      });

      // Update UI
      function updateNotificationUI() {
        document.getElementById("unread-count").textContent = unreadCount;

        const listEl = document.getElementById("notification-list");
        listEl.innerHTML = notifications
          .map(
            (n) => `
          <div class="notification-item ${n.isRead ? "read" : "unread"}">
            <strong>${n.title}</strong>
            <p>${n.message}</p>
            <small>${new Date(n.createdAt).toLocaleString()}</small>
          </div>
        `,
          )
          .join("");
      }

      // Browser notification
      function showBrowserNotification(notification) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/icon.png",
          });
        }
      }

      // Request permission
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    </script>
  </body>
</html>
```

---

## 5. Testing

### 5.1. Test Nhanh với Browser Console

Mở Console trong trình duyệt và chạy:

```javascript
// Load Socket.IO
const script = document.createElement("script");
script.src = "https://cdn.socket.io/4.7.4/socket.io.min.js";
document.head.appendChild(script);

script.onload = () => {
  const token = "YOUR_JWT_TOKEN_HERE"; // Thay bằng token thật
  const socket = io("http://76.13.21.84:3102", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
  });

  socket.on("notification:new", (data) => {
    console.log("📬 Notification:", data);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Error:", error.message);
  });
};
```

### 5.2. Fetch Notification History từ API

Nếu bạn muốn load lịch sử notification khi app khởi động:

```javascript
// src/services/notificationApi.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://76.13.21.84:3000";

export const notificationApi = {
  /**
   * Lấy danh sách notification
   */
  async getNotifications(page = 1, limit = 20, unreadOnly = false) {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_BASE_URL}/api/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit, unreadOnly: unreadOnly ? "true" : undefined },
    });
    return response.data;
  },

  /**
   * Lấy số lượng chưa đọc
   */
  async getUnreadCount() {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/notifications/unread-count`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data.count;
  },

  /**
   * Đánh dấu đã đọc
   */
  async markAsRead(notificationId) {
    const token = localStorage.getItem("access_token");
    await axios.post(
      `${API_BASE_URL}/api/v1/notifications/${notificationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  /**
   * Đánh dấu tất cả đã đọc
   */
  async markAllAsRead() {
    const token = localStorage.getItem("access_token");
    await axios.post(
      `${API_BASE_URL}/api/v1/notifications/read-all`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  /**
   * Xóa notification
   */
  async deleteNotification(notificationId) {
    const token = localStorage.getItem("access_token");
    await axios.delete(
      `${API_BASE_URL}/api/v1/notifications/${notificationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },
};
```

### 5.3. Test Socket Connection

Tạo file `test-socket.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Socket Test</title>
    <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
  </head>
  <body>
    <h1>Socket Connection Test</h1>
    <div id="status">Connecting...</div>
    <div id="notifications"></div>

    <script>
      const token = prompt("Enter your JWT token:");
      const socket = io("http://76.13.21.84:3102", {
        auth: { token },
      });

      socket.on("connect", () => {
        document.getElementById("status").innerHTML =
          "✅ Connected: " + socket.id;
      });

      socket.on("disconnect", () => {
        document.getElementById("status").innerHTML = "❌ Disconnected";
      });

      socket.on("notification:new", (data) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <strong>${data.title}</strong><br>
        ${data.message}<br>
        <small>${new Date().toLocaleString()}</small>
        <hr>
      `;
        document.getElementById("notifications").prepend(div);
      });

      socket.on("connect_error", (error) => {
        document.getElementById("status").innerHTML =
          "🔴 Error: " + error.message;
      });
    </script>
  </body>
</html>
```

### 5.4. Test với cURL

Trigger một notification thủ công:

```bash
# Lấy token từ Auth Service
TOKEN="your_jwt_token_here"

# Gửi notification qua API Gateway
curl -X POST http://76.13.21.84:3000/api/v1/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test notification",
    "type": "INFO",
    "target": "ALL"
  }'
```

---

## 6. Troubleshooting

````javascript
// Trong blog-service, sau khi approve blog
const amqp = require("amqplib");

async function publishBlogApprovedEvent(userId, blogTitle) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange("domain_events", "topic", { durable: true });

  const event = {
    eventType: "BLOG_APPROVED",
    userId: userId,
    data: {
      title: blogTitle,
      approvedAt: new Date().toISOString(),
    },
  };

  channel.publish(
    "domain_events",
    "blog.approved",
    Buffer.from(JSON.stringify(event)),
  );

  console.log("✅ Published BLOG_APPROVED event");



### Vấn Đề 1: Socket không connect được

**Nguyên nhân:**

- Token không hợp lệ
- CORS không được cấu hình đúng
- Socket Gateway không chạy

**Giải pháp:**

```javascript
// 1. Kiểm tra token
console.log('Token:', localStorage.getItem('access_token'));

// 2. Kiểm tra Socket Gateway đang chạy
fetch('http://76.13.21.84:3102/health')
  .then(r => r.json())
  .then(data => console.log('Socket Gateway health:', data))
  .catch(err => console.error('Socket Gateway không response:', err));

// 2b. Kiểm tra API Gateway
fetch('http://76.13.21.84:3000/health')
  .then(r => r.json())
  .then(data => console.log('API Gateway health:', data));

// 3. Test kết nối socket trực tiếp
const testSocket = io('http://76.13.21.84:3102', {
  auth: { token: 'YOUR_TOKEN' }
});
testSocket.on('connect', () => console.log('✅ Kết nối OK'));
testSocket.on('connect_error', (err) => console.error('❌ Lỗi:', err));
````

### Vấn Đề 2: Không nhận được notification

**Nguyên nhân:**

- Event listener chưa được setup
- RabbitMQ chưa chạy
- Notification Service chưa publish event

**Giải pháp:**

```javascript
// 1. Kiểm tra listener đã được đăng ký chưa
socket.on("notification:new", (data) => {
  console.log("📬 Received:", data);
  alert("Nhận được notification: " + data.title);
});

// 2. Kiểm tra socket đã connected chưa
console.log("Socket connected:", socket.connected);
console.log("Socket ID:", socket.id);

// 3. Test trigger notification thủ công bằng cURL (xem section 5.4)
```

### Vấn Đề 3: Browser notification không hiển thị

**Nguyên nhân:**

- Chưa request permission
- Browser không hỗ trợ
- User đã block

**Giải pháp:**

```javascript
// Request permission
async function requestPermission() {
  if (!("Notification" in window)) {
    console.log("Browser không hỗ trợ notification");
    return false;
  }

  const permission = await Notification.requestPermission();
  console.log("Permission:", permission);
  return permission === "granted";
}

// Check permission hiện tại
console.log("Current permission:", Notification.permission);
```

### Vấn Đề 4: Socket bị disconnect liên tục

**Nguyên nhân:**

- Token hết hạn
- Network không ổn định
- Server restart

**Giải pháp:**

```javascript
// Implement reconnection logic
socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);

  if (reason === "io server disconnect") {
    // Server manually disconnected, reconnect manually
    socket.connect();
  }
  // Else socket will automatically try to reconnect
});

// Refresh token khi hết hạn
socket.on("connect_error", async (error) => {
  if (error.message === "Authentication error") {
    const newToken = await refreshAccessToken();
    socket.auth.token = newToken;
    socket.connect();
  }
});
```

---

## 📚 Tài Liệu Tham Khảo

- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [RabbitMQ Tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
- [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [JWT Authentication](https://jwt.io/introduction)

---

## 🎯 Best Practices

### 1. Quản Lý Connection

- ✅ Chỉ tạo 1 socket connection cho toàn app
- ✅ Disconnect socket khi user logout
- ✅ Implement reconnection strategy
- ✅ Handle authentication errors

### 2. Performance

- ✅ Limit số lượng notification hiển thị (pagination)
- ✅ Debounce API calls khi đánh dấu đã đọc
- ✅ Cache notification history locally
- ✅ Cleanup old notifications

### 3. User Experience

- ✅ Hiển thị loading state khi connecting
- ✅ Show error message khi connection failed
- ✅ Provide visual feedback khi có notification mới
- ✅ Support dark mode cho notification UI
- ✅ Responsive design cho mobile

### 4. Security

- ✅ Luôn validate token trên server
- ✅ Không log sensitive data
- ✅ Implement rate limiting
- ✅ Sanitize notification content (XSS prevention)

---

## 🚀 Next Steps

Sau khi tích hợp thành công, bạn có thể mở rộng với:

1. **Push Notifications cho Mobile**: Tích hợp Firebase Cloud Messaging
2. **Email Notifications**: Gửi email cho important notifications
3. **Notification Preferences**: Cho phép user config loại notification nhận
4. **Rich Notifications**: Hỗ trợ images, actions, buttons trong notification
5. **Analytics**: Track notification delivery và engagement rates

---

Chúc bạn tích hợp thành công! 🎉

_Tài liệu được cập nhật: 22/01/2026_
