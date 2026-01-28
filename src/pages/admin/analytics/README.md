# 📊 Admin Analytics - AI & OCR Dashboard

## Giới thiệu

Bộ analytics mới được thiết kế dựa trên **Admin API Documentation** với giao diện hiện đại, tương tác cao và cải thiện UX/UI đáng kể.

### 📁 Các file chính

```
src/pages/admin/analytics/
├── AiAnalytics.tsx          # Trang thống kê AI Service
├── OcrAnalytics.tsx         # Trang thống kê OCR Service
├── AnalyticsDashboard.tsx   # Dashboard tổng hợp AI + OCR
├── Analytics.css            # Styling cho toàn bộ analytics
└── README.md               # Tài liệu này
```

---

## 🎯 Các tính năng chính

### AI Analytics (AiAnalytics.tsx)

Hiển thị thống kê chi tiết về AI Service với các metric sau:

#### 📈 KPI Cards

- **Tổng cuộc hội thoại**: Số lượng conversation được tạo
- **Tổng tin nhắn**: Số lượng message tổng cộng
- **Người dùng sử dụng**: Số người dùng đã dùng AI
- **Tin nhắn/Cuộc**: Trung bình tin nhắn trên mỗi conversation

#### 📊 Biểu đồ

1. **Phân loại tin nhắn theo vai trò** (Bar Chart)
   - Hiển thị số lượng tin nhắn của `user` vs `assistant`
2. **Tỉ lệ phân phối tin nhắn** (Pie Chart)
   - Tỉ lệ % giữa user và assistant messages

#### 📋 Danh sách

- **10 cuộc hội thoại gần đây nhất** (Table)
  - ID cuộc hội thoại
  - ID người dùng
  - Số tin nhắn
  - Thời gian tạo

#### 📌 Summary Stats

- Cuộc hội thoại/Người dùng
- Tin nhắn/Người dùng
- Thống kê tổng quan

---

### OCR Analytics (OcrAnalytics.tsx)

Giám sát chi tiết hoạt động OCR với các metric:

#### 📈 KPI Cards

- **Tổng OCR Job**: Số lượng job OCR tổng cộng
- **Hoàn thành**: Số job xử lý thành công
- **Thất bại**: Số job xử lý không thành công
- **Người dùng**: Số người dùng đã sử dụng OCR

#### 📊 Biểu đồ & Progress

1. **Tỉ lệ thành công** (Progress Circle)
   - Hiển thị % job thành công
   - Gradient color từ đỏ → xanh
2. **Phân loại job theo trạng thái** (Pie Chart)
   - Completed, Failed, Processing
3. **Khối lượng job theo trạng thái** (Bar Chart)
   - Số lượng job mỗi trạng thái

#### ⚠️ Alert System

- Hiển thị cảnh báo nếu có job đang xử lý

#### 📋 Danh sách

- **10 OCR Job gần đây nhất** (Table)
  - Job ID
  - Người dùng
  - Trạng thái (badges với icon)
  - Thời gian tạo
  - Thời gian hoàn thành

#### 📌 Summary Stats

- Job/Người dùng
- Thời gian xử lý trung bình
- Tổng kết (tỉ lệ + số job thất bại)

---

### Dashboard Tổng hợp (AnalyticsDashboard.tsx)

Dashboard tổng quát với:

- Quick stats overview (AI + OCR)
- Tab navigation giữa AI & OCR analytics
- Real-time updates

---

## 🎨 Design Highlights

### Color Palette

```
AI Service:     #8B5CF6 (Purple)
OCR Service:    #0EA5E9 (Sky Blue)
Success:        #10B981 (Green)
Failed:         #F43F5E (Red)
Processing:     #F59E0B (Amber)
Assistant:      #06B6D4 (Cyan)
```

### Layout Features

1. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: xs, sm, md, lg, xl
2. **Modern UI Components**
   - Card with hover effects
   - Progress circles & bars
   - Gradient backgrounds
   - Status badges with icons
3. **Interactive Charts**
   - Recharts với Tooltip tùy chỉnh
   - Smooth animations
   - Legend & labels
4. **Data Tables**
   - Pagination
   - Sortable columns
   - Responsive overflow

### Styling Philosophy

- **Minimalist**: Chỉ dùng necessary styling
- **Consistent**: Unified color & spacing scheme
- **Accessible**: Good contrast, readable fonts
- **Performant**: CSS không heavyweight

---

## 📡 API Integration

### AI Analytics

```typescript
// Endpoint: GET /api/v1/ai/admin/stats
aiAPI.getAdminStats();
```

**Response Format**:

```json
{
  "totalConversations": 890,
  "totalMessages": 3456,
  "totalUsers": 567,
  "avgMessagesPerConversation": "3.88",
  "messagesByRole": [
    { "role": "user", "count": 1890 },
    { "role": "assistant", "count": 1566 }
  ],
  "recentConversations": [
    {
      "id": "conv-id-1",
      "userId": "user-1",
      "messageCount": 5,
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  ]
}
```

### OCR Analytics

```typescript
// Endpoint: GET /api/v1/ocr/admin/stats
ocrAPI.getAdminStats();
```

**Response Format**:

```json
{
  "totalJobs": 5678,
  "totalUsers": 1234,
  "successRate": 92.18,
  "byStatus": [
    { "status": "completed", "count": 5234 },
    { "status": "failed", "count": 444 },
    { "status": "processing", "count": 123 }
  ],
  "recentJobs": [
    {
      "id": "job-id-1",
      "userId": "user-1",
      "status": "completed",
      "createdAt": "2026-01-25T10:00:00.000Z",
      "completedAt": "2026-01-25T10:02:30.000Z"
    }
  ]
}
```

---

## 🚀 Usage

### Mounting Pages

```tsx
// In your router configuration:
import AiAnalytics from "./pages/admin/analytics/AiAnalytics";
import OcrAnalytics from "./pages/admin/analytics/OcrAnalytics";
import AnalyticsDashboard from "./pages/admin/analytics/AnalyticsDashboard";

const routes = [
  { path: "/admin/analytics", element: <AnalyticsDashboard /> },
  { path: "/admin/analytics/ai", element: <AiAnalytics /> },
  { path: "/admin/analytics/ocr", element: <OcrAnalytics /> },
];
```

### Customization

#### Thay đổi cache time

```tsx
staleTime: 2 * 60 * 1000,  // 2 minutes
```

#### Thay đổi colors

```tsx
const COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#EC4899",
];
```

#### Thay đổi card styling

```tsx
// Modify card props
<Card
  style={{
    border: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderRadius: 8,
  }}
>
  {/* content */}
</Card>
```

---

## 📱 Responsive Breakpoints

| Screen  | Width | Layout                          |
| ------- | ----- | ------------------------------- |
| Mobile  | xs    | Single column, full width       |
| Tablet  | sm    | 2 columns for cards             |
| Desktop | md    | 4 columns for KPI, 2 for charts |
| Large   | lg+   | Full responsive grid            |

---

## 🔄 Data Refresh

**Auto-refresh interval**: 2 minutes (React Query `staleTime`)

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["ai-admin-stats"],
  queryFn: aiAPI.getAdminStats,
  staleTime: 2 * 60 * 1000, // 2 minutes
});
```

Để thay đổi interval, sửa `staleTime` giá trị.

---

## 🐛 Troubleshooting

### Biểu đồ không hiển thị

- Kiểm tra dữ liệu từ API
- Ensure array format khớp với chart data structure
- Check Recharts version compatibility

### Table không load dữ liệu

- Verify API response structure
- Check column `dataIndex` mappings
- Ensure data transformation logic

### Styling issues

- Verify `Analytics.css` imported
- Check Ant Design version
- Clear browser cache

---

## 📚 Dependencies

```json
{
  "@tanstack/react-query": "^4.x",
  "antd": "^5.x",
  "recharts": "^2.x",
  "react-icons": "^4.x"
}
```

---

## 🎓 Best Practices

1. **Performance**
   - Use React Query for caching
   - Memoize chart data transformations
   - Lazy load components if needed

2. **Maintainability**
   - Keep API calls in separate services
   - Extract reusable components
   - Use TypeScript for type safety

3. **UX**
   - Show loading states
   - Display empty states
   - Provide meaningful error messages
   - Use tooltips for clarification

4. **Accessibility**
   - Use semantic HTML
   - Proper color contrast
   - ARIA labels where needed

---

## 📝 Version History

| Version | Date       | Changes                             |
| ------- | ---------- | ----------------------------------- |
| 2.0     | 2026-01-28 | Complete redesign with new features |
| 1.0     | 2026-01-20 | Initial implementation              |

---

## 🤝 Contributing

Khi thêm features mới:

1. Update data transformations
2. Add corresponding chart types
3. Test responsive design
4. Update this README

---

**Last Updated**: 28 January 2026
**Developed for**: FEPA Admin Dashboard v2.0
