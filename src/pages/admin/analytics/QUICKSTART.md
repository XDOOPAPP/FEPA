# 🚀 Quick Start Guide - Analytics Pages

## ⚡ 5 Phút Setup

### Bước 1: Verify API Services

```typescript
// Kiểm tra: src/services/api/aiAPI.ts
export default {
  getAdminStats: async () => {
    const response = await axiosInstance.get("/ai/admin/stats");
    return response.data;
  },
};

// Kiểm tra: src/services/api/ocrAPI.ts
export default {
  getAdminStats: async () => {
    const response = await axiosInstance.get("/ocr/admin/stats");
    return response.data;
  },
};
```

### Bước 2: Add Routes

```typescript
// Trong admin router config:
{
  path: 'analytics',
  children: [
    { path: '', element: <AnalyticsDashboard /> },
    { path: 'ai', element: <AiAnalytics /> },
    { path: 'ocr', element: <OcrAnalytics /> },
  ]
}
```

### Bước 3: Update Sidebar Menu

```typescript
{
  key: 'analytics',
  icon: <BarChartOutlined />,
  label: 'Analytics',
  children: [
    { key: 'analytics-dashboard', label: 'Dashboard', onClick: () => navigate('/admin/analytics') },
    { key: 'analytics-ai', label: 'AI Service', onClick: () => navigate('/admin/analytics/ai') },
    { key: 'analytics-ocr', label: 'OCR Service', onClick: () => navigate('/admin/analytics/ocr') },
  ]
}
```

### Bước 4: Verify React Query Setup

```typescript
// Trong App.tsx hoặc _app.tsx:
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
    }
  }
})

<QueryClientProvider client={queryClient}>
  {/* Your app */}
</QueryClientProvider>
```

Done! ✅

---

## 📋 File Checklist

```
src/pages/admin/analytics/
├── ✅ AiAnalytics.tsx (redesigned)
├── ✅ OcrAnalytics.tsx (redesigned)
├── ✅ AnalyticsDashboard.tsx (new)
├── ✅ Analytics.css (new)
├── ✅ README.md (new)
├── ✅ INTEGRATION_GUIDE.md (new)
└── ✅ CHANGES.md (new)

src/types/
└── ✅ analytics.ts (updated with new types)

src/services/api/
├── ✅ aiAPI.ts (verify getAdminStats)
└── ✅ ocrAPI.ts (verify getAdminStats)
```

---

## 🎯 URLs

```
Dashboard:    http://localhost:5173/admin/analytics
AI Stats:     http://localhost:5173/admin/analytics/ai
OCR Stats:    http://localhost:5173/admin/analytics/ocr
```

---

## 📊 What You'll See

### AI Analytics Page

- 4 KPI cards (conversations, messages, users, avg)
- Bar chart (messages by role)
- Pie chart (message distribution)
- Table (10 recent conversations)
- Summary stats card

### OCR Analytics Page

- 4 KPI cards (jobs, completed, failed, users)
- Progress circle (success rate)
- Pie chart (jobs by status)
- Bar chart (job volume)
- Alert (if processing jobs exist)
- Table (10 recent jobs)

### Dashboard

- Quick stats (both AI + OCR)
- Tabbed interface
- Navigate between AI & OCR

---

## 🔍 API Response Formats

### AI Stats

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
      "id": "conv-1",
      "userId": "user-1",
      "messageCount": 5,
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  ]
}
```

### OCR Stats

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
      "id": "job-1",
      "userId": "user-1",
      "status": "completed",
      "createdAt": "2026-01-25T10:00:00.000Z",
      "completedAt": "2026-01-25T10:02:30.000Z"
    }
  ]
}
```

---

## 🎨 Color Reference

```
AI:         #8B5CF6 (Purple)
OCR:        #0EA5E9 (Sky Blue)
Success:    #10B981 (Green)
Failed:     #F43F5E (Red)
Processing: #F59E0B (Amber)
Assistant:  #06B6D4 (Cyan)
```

---

## ⚙️ Customization

### Change Refresh Interval

```typescript
// In AiAnalytics.tsx or OcrAnalytics.tsx:
staleTime: 5 * 60 * 1000,  // 5 minutes instead of 2
```

### Change Colors

```typescript
// In component:
const COLORS = ["#Your", "#Custom", "#Colors"];
```

### Change Table Size

```typescript
// In component:
<Table
  size="small"  // or "large"
  pagination={{ pageSize: 20 }}  // or any number
/>
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] AI Analytics page loads
- [ ] OCR Analytics page loads
- [ ] Dashboard loads both
- [ ] KPI cards display numbers
- [ ] Charts render correctly
- [ ] Tables show data
- [ ] Mobile responsive (use DevTools)
- [ ] Dark mode works (if supported)

### Quick Test

```bash
# Open browser dev console and check:
# 1. No console errors
# 2. API calls in Network tab successful
# 3. Charts render without warnings
```

---

## 🆘 Troubleshooting

### Pages don't load

- ✅ Check routes are added
- ✅ Check API services exist
- ✅ Check auth token in localStorage

### No data shown

- ✅ Check API response in Network tab
- ✅ Verify JWT token is valid
- ✅ Check API endpoint URLs

### Charts empty

- ✅ Check data transformation logic
- ✅ Verify API response has required fields
- ✅ Check console for errors

### Styles look broken

- ✅ Check Analytics.css is imported
- ✅ Check Ant Design CSS imported
- ✅ Clear browser cache

### Mobile layout broken

- ✅ Check responsive col definitions
- ✅ Test with Chrome DevTools
- ✅ Verify gutter spacing

---

## 📚 Additional Docs

1. **README.md** - Complete feature documentation
2. **INTEGRATION_GUIDE.md** - Detailed integration steps
3. **CHANGES.md** - What was changed from v1.0 to v2.0

---

## 🎓 Learn More

- **Recharts**: https://recharts.org/
- **Ant Design**: https://ant.design/
- **React Query**: https://tanstack.com/query/latest

---

## ✨ Features Highlights

### AI Analytics

✅ Real-time conversation stats  
✅ Message distribution breakdown  
✅ Recent conversation history  
✅ User engagement metrics  
✅ Average messages calculation

### OCR Analytics

✅ Job completion tracking  
✅ Success rate visualization  
✅ Job status breakdown  
✅ Recent job history  
✅ Processing alerts

### General

✅ Responsive design  
✅ Dark mode compatible  
✅ Accessible (WCAG)  
✅ Performance optimized  
✅ Modern UI/UX

---

## 🚀 Next Steps

1. Deploy to staging
2. Test with real data
3. Gather feedback
4. Fine-tune UI if needed
5. Deploy to production

---

**Last Updated**: 28 Jan 2026  
**Status**: ✅ Ready to Use  
**Support**: Check README.md or INTEGRATION_GUIDE.md
