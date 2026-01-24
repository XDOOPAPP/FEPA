# **TỔNG HỢP THIẾT KẾ WEB ADMIN CHO DỰ ÁN FEPA**

**Dự án:** Trợ lý tài chính và dự toán chi tiêu cá nhân (Personal Finance and Expense Prediction Assistant)

**Viết tắt:** FEPA

**Ngày cập nhật:** 24/01/2026

**Tác giả:** Gemini (Hỗ trợ Duy Minh)

## **1\. Tổng quan thiết kế & Brand Consistency**

Web Admin sử dụng **Light Theme Modern Premium** đồng bộ với Mobile App FEPA:

* **Nền chủ đạo:** Clean White/Slate background.  
* **Màu nhấn:** Primary Sky Blue (\#0EA5E9) cho các hành động chính và Accent Amber (\#F59E0B) cho các điểm nhấn quan trọng.  
* **Phong cách:** Glassmorphism nhẹ (shadow soft \+ border radius) cho các thẻ (cards) và bảng (tables).  
* **Mục tiêu:** Đảm bảo tính nhất quán thương hiệu và khả năng truy cập (Accessibility WCAG AA).

## **2\. Bảng màu Web Admin (Đồng bộ với Mobile)**

### **Màu chủ đạo (Primary)**

| Biến (CSS/Tailwind) | Mã màu | Tên biến Mobile | Sử dụng trên Web Admin |
| :---- | :---- | :---- | :---- |
| \--primary | \#0EA5E9 | primary | Nút chính, link, tab active, sidebar selected |
| \--primary-dark | \#0284C7 | primaryDark | Trạng thái Hover/Pressed |
| \--primary-light | \#38BDF8 | primaryLight | Badge nhẹ, hover background |
| \--primary-bg | rgba(14,165,233,0.1) | primaryHighlight | Background dòng được chọn trong bảng |

### **Màu nhấn & Trạng thái (Accent & Status)**

| Biến | Mã màu | Tên biến Mobile | Sử dụng |
| :---- | :---- | :---- | :---- |
| \--accent | \#F59E0B | accent | Số doanh thu, badge quan trọng, cảnh báo |
| \--success | \#10B981 | success | Phê duyệt, tin nhắn thành công, thanh toán xong |
| \--danger | \#F43F5E | danger | Từ chối, lỗi, xóa, thanh toán thất bại |
| \--warning | \#F59E0B | warning | Chờ xử lý, thận trọng, ngân sách thấp |

### **Màu nền & Văn bản (Background & Text)**

| Biến | Mã màu | Tên biến Mobile | Sử dụng |
| :---- | :---- | :---- | :---- |
| \--bg | \#F8FAFC | background | Nền chính toàn trang |
| \--bg-secondary | \#FFFFFF | backgroundSecondary | Nền card, table, modal |
| \--text-primary | \#0F172A | textPrimary | Tiêu đề, nội dung chính |
| \--text-secondary | \#64748B | textSecondary | Mô tả, nhãn (label), phụ đề |

### **Màu theo danh mục chi tiêu (Giữ nguyên để đồng bộ biểu đồ)**

| Danh mục | Mã màu | Sử dụng |
| :---- | :---- | :---- |
| **Food** | \#FF6B6B | Pie chart, expense category badge |
| **Transport** | \#4ECDC4 | Pie chart, expense category badge |
| **Shopping** | \#FFE66D | Pie chart, expense category badge |
| **Utilities** | \#95E1D3 | Pie chart, expense category badge |
| **Entertainment** | \#A8E6CF | Pie chart, expense category badge |
| **Healthcare** | \#DCD6F7 | Pie chart, expense category badge |

## **3\. Gradient & Hiệu ứng (UI Effects)**

### **CSS Gradients**

\--primary-gradient: linear-gradient(90deg, \#0EA5E9, \#2563EB);  
\--success-gradient: linear-gradient(90deg, \#10B981, \#059669);  
\--danger-gradient:  linear-gradient(90deg, \#F43F5E, \#E11D48);  
\--accent-gradient:  linear-gradient(90deg, \#F59E0B, \#D97706);

### **Shadows & Border Radius**

\--shadow-soft: 0 4px 10px rgba(100, 116, 139, 0.05);  
\--shadow-card: 0 8px 16px rgba(100, 116, 139, 0.08);  
\--radius-lg: 12px;  
\--radius-xl: 16px;

## **4\. Cấu trúc Layout chung**

* **Background:** \#F8FAFC (Slate 50\) cho toàn bộ không gian làm việc.  
* **Sidebar:** Màu trắng \#FFFFFF, sử dụng shadow-card để tách biệt, menu active dùng màu \--primary.  
* **Header:** Màu trắng, bóng đổ nhẹ, các nút hành động chính sử dụng \--primary-gradient.  
* **Table:** Thiết kế dạng Zebra (sọc) nhẹ giữa \#F8FAFC và \#FFFFFF. Bo góc bảng \--radius-lg.

## **5\. Cấu hình kỹ thuật (Code Snippets)**

### **Tailwind Config**

// tailwind.config.js  
theme: {  
  extend: {  
    colors: {  
      primary: '\#0EA5E9',  
      'primary-dark': '\#0284C7',  
      accent: '\#F59E0B',  
      success: '\#10B981',  
      danger: '\#F43F5E',  
      'bg-main': '\#F8FAFC',  
    },  
    borderRadius: {  
      'fepa': '12px',  
    }  
  },  
}

### **Ant Design ConfigProvider**

// App.tsx  
\<ConfigProvider  
  theme={{  
    token: {  
      colorPrimary: '\#0EA5E9',  
      colorSuccess: '\#10B981',  
      colorError: '\#F43F5E',  
      colorWarning: '\#F59E0B',  
      colorBgBase: '\#F8FAFC',  
      borderRadius: 12,  
    },  
  }}  
\>  
  \<AdminLayout /\>  
\</ConfigProvider\>

## **6\. Phụ lục Brand FEPA**

* **Primary:** \#0EA5E9 (Sky Blue) \- Đại diện cho sự tin tưởng, công nghệ.  
* **Accent:** \#F59E0B (Amber) \- Đại diện cho sự thịnh vượng, tài chính.  
* **Text:** \#0F172A (Slate 900\) \- Độ tương phản cao, hiện đại.

*Chúc Duy Minh hoàn thành tốt đồ án FEPA\!*