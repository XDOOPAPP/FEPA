# Danh Sách Công Việc Webadmin - Độc Lập (Không Cần Backend)

**Ngày tạo:** 19/12/2025  
**Mục đích:** Các tính năng Webadmin có thể làm mà không phụ thuộc vào backend  
**Lưu ý:** Mỗi tính năng là một nhánh riêng (feature branch)

---

## 📋 Tổng Quan

Đây là danh sách các tính năng và cải tiến mà Webadmin có thể thực hiện **hoàn toàn độc lập**, không cần backend hỗ trợ. Tất cả đều làm việc với dữ liệu mock/localStorage hiện tại.

**Mỗi task được tổ chức thành một nhánh riêng để dễ quản lý và code review.**

---

## ✅ 1. TÍNH NĂNG EXPORT/IMPORT DATA

### 📁 Nhánh: `feature/export-csv-excel`

#### 1.1. Export CSV/Excel
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Cho phép export dữ liệu ra file CSV hoặc Excel

**Các trang cần thêm:**
- ✅ **User Management** - Export danh sách users
- ✅ **Admin Expenses** - Export danh sách expenses
- ✅ **Admin Budgets** - Export danh sách budgets
- ✅ **Blog Management** - Export danh sách blog posts
- ✅ **Subscription Management** - Export danh sách subscriptions
- ✅ **Admin Reports** - Export báo cáo
- ✅ **Admin Categories** - Export danh sách categories
- ✅ **Ads Management** - Export danh sách ads

**Cần làm:**
- Tạo utility function `src/utils/exportUtils.ts`:
  ```typescript
  export const exportToCSV = (data: any[], filename: string, columns?: string[]) => {}
  export const exportToExcel = (data: any[], filename: string, columns?: string[]) => {}
  ```
- Tạo component `ExportButton` reusable
- Thêm button "Export" vào các trang
- Format dữ liệu phù hợp (date format, currency format, etc.)

**Thư viện cần cài:**
- `xlsx` hoặc `exceljs` cho Excel export
- Hoặc chỉ dùng CSV (không cần thư viện)

**Files:**
- `src/utils/exportUtils.ts`
- `src/components/ExportButton.tsx`
- Update các trang admin

---

### 📁 Nhánh: `feature/print-reports`

#### 1.2. Print Reports
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Cho phép in báo cáo và danh sách

**Các trang cần thêm:**
- ✅ **Admin Reports** - In báo cáo
- ✅ **User Management** - In danh sách users
- ✅ **Admin Expenses** - In danh sách expenses
- ✅ **Admin Budgets** - In danh sách budgets
- ✅ **Blog Management** - In danh sách blog posts

**Cần làm:**
- Tạo component `PrintButton` hoặc `PrintView`
- CSS cho print media (`@media print`)
- Format dữ liệu cho in ấn (loại bỏ buttons, chỉ hiện data)
- Print preview modal

**Files:**
- `src/components/PrintButton.tsx`
- `src/styles/print.css`
- Update các trang admin

---

### 📁 Nhánh: `feature/import-data`

#### 1.3. Import Data (CSV/Excel)
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Cho phép import dữ liệu từ file CSV/Excel

**Các trang cần thêm:**
- ✅ **User Management** - Import users
- ✅ **Admin Expenses** - Import expenses
- ✅ **Blog Management** - Import blog posts
- ✅ **Admin Categories** - Import categories

**Cần làm:**
- Tạo utility function `src/utils/importUtils.ts`
- Tạo component `ImportButton` với file picker
- Validate dữ liệu trước khi import
- Hiển thị preview trước khi import
- Xử lý lỗi (format sai, thiếu cột, etc.)

**Files:**
- `src/utils/importUtils.ts`
- `src/components/ImportButton.tsx`
- Update các trang admin

---

## ✅ 2. BULK OPERATIONS (Thao Tác Hàng Loạt)

### 📁 Nhánh: `feature/bulk-operations`

#### 2.1. Bulk Select & Actions
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Cho phép chọn nhiều items và thực hiện action cùng lúc

**Các trang cần thêm:**
- ✅ **User Management** - Bulk delete, bulk lock/unlock, bulk export
- ✅ **Blog Management** - Bulk delete, bulk publish/unpublish
- ✅ **Admin Expenses** - Bulk delete
- ✅ **Admin Notifications** - Bulk mark as read, bulk delete
- ✅ **Ads Management** - Bulk activate/pause, bulk delete
- ✅ **Admin Budgets** - Bulk delete

**Cần làm:**
- Tạo component `BulkActionsBar` reusable
- Tạo hook `useBulkActions` để tái sử dụng logic
- Thêm checkbox column vào Table
- Thêm toolbar với actions khi có items được chọn
- Implement các bulk actions

**Files:**
- `src/components/BulkActionsBar.tsx`
- `src/hooks/useBulkActions.ts`
- Update các trang admin

---

## ✅ 3. ADVANCED SEARCH & FILTERING

### 📁 Nhánh: `feature/advanced-search`

#### 3.1. Advanced Search Form
**Trạng thái:** ⚠️ CÓ CƠ BẢN, CẦN NÂNG CẤP  
**Mô tả:** Form tìm kiếm nâng cao với nhiều tiêu chí

**Các trang cần cải thiện:**
- ✅ **User Management** - Tìm theo email, tên, role, status, date range
- ✅ **Admin Expenses** - Tìm theo user, category, amount range, date range
- ✅ **Admin Budgets** - Tìm theo user, category, progress range
- ✅ **Blog Management** - Tìm theo title, author, status, date range
- ✅ **Admin Reports** - Filter nâng cao cho báo cáo

**Cần làm:**
- Tạo component `AdvancedSearch` hoặc `SearchForm` reusable
- Collapsible search form (mở/đóng)
- Multiple filters kết hợp (AND/OR logic)
- Save search presets vào localStorage
- Clear all filters button
- Tạo hook `useAdvancedSearch` để tái sử dụng

**Files:**
- `src/components/AdvancedSearch.tsx`
- `src/hooks/useAdvancedSearch.ts`
- Update các trang admin

---

### 📁 Nhánh: `feature/quick-filters`

#### 3.2. Quick Filters (Tags)
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Quick filter buttons dạng tags

**Ví dụ:**
- User Management: "Active Users", "Locked Users", "New This Month"
- Blog Management: "Published", "Drafts", "This Week"
- Expenses: "This Month", "Over Budget", "High Amount"

**Cần làm:**
- Tạo component `QuickFilters` reusable
- Thêm Tag/Button group ở trên table
- Click vào tag sẽ apply filter tương ứng
- Highlight tag đang active
- Configurable filters per page

**Files:**
- `src/components/QuickFilters.tsx`
- Update các trang admin

---

## ✅ 4. UI/UX IMPROVEMENTS

### 📁 Nhánh: `feature/loading-states`

#### 4.1. Loading States
**Trạng thái:** ⚠️ CẦN CẢI THIỆN  
**Mô tả:** Loading states tốt hơn

**Cần làm:**
- Tạo component `SkeletonLoader` reusable
- **Skeleton Loading** - Thay vì spinner, dùng skeleton
- **Progressive Loading** - Load từng phần thay vì tất cả cùng lúc
- **Loading Overlay** - Cho các actions lâu
- Update tất cả các trang

**Files:**
- `src/components/SkeletonLoader.tsx`
- `src/components/LoadingOverlay.tsx`
- Update các trang admin

---

### 📁 Nhánh: `feature/error-handling`

#### 4.2. Error Handling & User Feedback
**Trạng thái:** ⚠️ CẦN CẢI THIỆN  
**Mô tả:** Xử lý lỗi và feedback tốt hơn

**Cần làm:**
- Tạo component `ErrorBoundary` để catch React errors
- Tạo component `ToastNotification` thay vì `message.success/error`
- **Inline Validation** - Validate form fields real-time
- **Error Messages** - Messages rõ ràng, có hướng dẫn
- **Retry Mechanism** - Cho failed operations

**Files:**
- `src/components/ErrorBoundary.tsx`
- `src/components/ToastNotification.tsx`
- `src/hooks/useErrorHandler.ts`
- Update các trang admin

---

### 📁 Nhánh: `feature/responsive-design`

#### 4.3. Responsive Design
**Trạng thái:** ⚠️ CẦN KIỂM TRA  
**Mô tả:** Đảm bảo responsive trên mobile/tablet

**Cần làm:**
- Test trên các screen sizes
- **Mobile Menu** - Collapsible sidebar cho mobile
- **Table Responsive** - Scroll horizontal hoặc card view trên mobile
- **Form Layout** - Stack columns trên mobile
- **Touch-friendly** - Buttons và inputs đủ lớn

**Files:**
- Update `AdminSidebar.tsx` cho mobile
- Update các Table components
- Update form layouts
- `src/styles/responsive.css`

---

### 📁 Nhánh: `feature/dark-mode`

#### 4.4. Dark Mode
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Theme dark mode

**Cần làm:**
- Tạo theme context `ThemeContext`
- Toggle button trong header
- Save preference vào localStorage
- Custom CSS variables cho colors
- Test tất cả components với dark mode

**Files:**
- `src/context/ThemeContext.tsx`
- `src/styles/dark-theme.css`
- Update `AdminHeader.tsx`
- Update tất cả components

---

## ✅ 5. DATA VISUALIZATION IMPROVEMENTS

### 📁 Nhánh: `feature/more-chart-types`

#### 5.1. More Chart Types
**Trạng thái:** ⚠️ CÓ CƠ BẢN  
**Mô tả:** Thêm nhiều loại biểu đồ hơn

**Cần thêm:**
- ✅ **Area Chart** - Cho trends
- ✅ **Scatter Plot** - Cho correlation analysis
- ✅ **Heatmap** - Cho activity patterns
- ✅ **Gauge Chart** - Cho progress indicators
- ✅ **Treemap** - Cho category breakdown

**Trang cần thêm:**
- Admin Dashboard
- Admin Reports
- Partner Portal

**Files:**
- `src/components/charts/AreaChart.tsx`
- `src/components/charts/ScatterChart.tsx`
- `src/components/charts/HeatmapChart.tsx`
- `src/components/charts/GaugeChart.tsx`
- Update các trang

---

### 📁 Nhánh: `feature/interactive-charts`

#### 5.2. Interactive Charts
**Trạng thái:** ⚠️ CẦN CẢI THIỆN  
**Mô tả:** Charts có thể tương tác nhiều hơn

**Cần làm:**
- **Zoom & Pan** - Cho line charts
- **Data Point Tooltips** - Hiển thị chi tiết khi hover
- **Click to Filter** - Click vào chart để filter table
- **Export Chart as Image** - Export PNG/SVG
- **Chart Settings** - Cho phép thay đổi colors, styles

**Files:**
- Update chart components
- `src/utils/chartUtils.ts`

---

## ✅ 6. FORM IMPROVEMENTS

### 📁 Nhánh: `feature/rich-text-editor`

#### 6.1. Rich Text Editor
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Editor cho blog content

**Trang cần:** Blog Management

**Cần làm:**
- Tích hợp `react-quill` hoặc `draft-js`
- Tạo component `RichTextEditor` wrapper
- Toolbar với formatting options
- Image upload (local, base64, không cần backend)
- Preview mode

**Files:**
- `src/components/RichTextEditor.tsx`
- Update `BlogManagement.tsx`

---

### 📁 Nhánh: `feature/file-upload`

#### 6.2. File Upload Component
**Trạng thái:** ❌ CHƯA CÓ  
**Mô tả:** Component upload file

**Cần làm:**
- Tạo `FileUpload` component
- Drag & drop support
- Preview images
- Progress indicator
- File validation (size, type)
- Multiple files support
- Base64 conversion (không upload lên server)

**Trang cần:**
- Blog Management (featured image)
- Ads Management (banner images)
- OCR Management (invoice images) - khi có trang này

**Files:**
- `src/components/FileUpload.tsx`
- Update các trang

---

### 📁 Nhánh: `feature/date-picker-improvements`

#### 6.3. Date Range Picker Improvements
**Trạng thái:** ⚠️ CÓ CƠ BẢN  
**Mô tả:** Date picker tốt hơn

**Cần làm:**
- Tạo component `DateRangePicker` với preset ranges
- **Preset Ranges** - "Today", "This Week", "This Month", "Last Month"
- **Quick Select** - Click để chọn range nhanh
- **Calendar View** - View calendar đẹp hơn

**Files:**
- `src/components/DateRangePicker.tsx`
- Update các trang

---

## ✅ 7. CODE QUALITY & MAINTENANCE

### 📁 Nhánh: `feature/reusable-components`

#### 7.1. Reusable Components
**Trạng thái:** ⚠️ CẦN CẢI THIỆN  
**Mô tả:** Tạo các components tái sử dụng

**Cần tạo:**
- `DataTable` - Table component với pagination, sorting, filtering built-in
- `SearchBar` - Search component reusable
- `FilterPanel` - Filter panel component
- `StatisticsCard` - Card hiển thị statistics
- `ChartCard` - Card wrapper cho charts

**Files:**
- `src/components/DataTable.tsx`
- `src/components/SearchBar.tsx`
- `src/components/FilterPanel.tsx`
- `src/components/StatisticsCard.tsx`
- `src/components/ChartCard.tsx`

---

### 📁 Nhánh: `feature/custom-hooks`

#### 7.2. Custom Hooks
**Trạng thái:** ⚠️ CẦN TẠO  
**Mô tả:** Tạo custom hooks để tái sử dụng logic

**Cần tạo:**
- `useTable` - Hook cho table logic (pagination, sorting, filtering)
- `useLocalStorage` - Hook để sync với localStorage
- `useDebounce` - Hook cho search debounce
- `usePrint` - Hook cho print functionality
- `useExport` - Hook cho export functionality

**Files:**
- `src/hooks/useTable.ts`
- `src/hooks/useLocalStorage.ts`
- `src/hooks/useDebounce.ts`
- `src/hooks/usePrint.ts`
- `src/hooks/useExport.ts`

---

### 📁 Nhánh: `feature/typescript-improvements`

#### 7.3. TypeScript Improvements
**Trạng thái:** ⚠️ CẦN CẢI THIỆN  
**Mô tả:** Cải thiện type safety

**Cần làm:**
- Tạo shared types trong `src/types/`
- Strict type checking
- Remove `any` types
- Add JSDoc comments cho functions

**Files:**
- `src/types/user.ts`
- `src/types/expense.ts`
- `src/types/budget.ts`
- `src/types/blog.ts`
- Update các files hiện có

---

### 📁 Nhánh: `feature/constants-config`

#### 7.4. Constants & Config
**Trạng thái:** ⚠️ CẦN TẠO  
**Mô tả:** Tách constants và config

**Cần tạo:**
- `src/constants/` - Constants (statuses, roles, etc.)
- `src/config/` - Config (table page sizes, date formats, etc.)
- `src/utils/formatters.ts` - Format functions (currency, date, etc.)

**Files:**
- `src/constants/statuses.ts`
- `src/constants/roles.ts`
- `src/config/table.ts`
- `src/utils/formatters.ts`

---

## 📊 8. PRIORITY RANKING

### 🔴 High Priority (Làm Ngay)
1. ✅ **Export CSV/Excel** - Tính năng quan trọng, users cần
2. ✅ **Bulk Operations** - Tiết kiệm thời gian cho admin
3. ✅ **Advanced Search** - Tìm kiếm tốt hơn
4. ✅ **Loading States** - UX tốt hơn
5. ✅ **Error Handling** - Xử lý lỗi tốt hơn

### 🟡 Medium Priority (Làm Sau)
6. ✅ **Print Reports** - Tính năng bổ sung
7. ✅ **Import Data** - Tính năng bổ sung
8. ✅ **Dark Mode** - Nice to have
9. ✅ **More Chart Types** - Visualization tốt hơn
10. ✅ **Rich Text Editor** - Cho blog

### 🟢 Low Priority (Nice to Have)
11. ✅ **Accessibility** - Cải thiện A11Y
12. ✅ **Keyboard Shortcuts** - Power users
13. ✅ **Component Documentation** - Developer experience
14. ✅ **User Guide** - End user experience

---

## 📝 9. CHECKLIST IMPLEMENTATION

### Phase 1: Core Features (Week 1)
- [ ] **Nhánh:** `feature/export-csv-excel`
- [ ] **Nhánh:** `feature/bulk-operations`
- [ ] **Nhánh:** `feature/advanced-search`

### Phase 2: UX Improvements (Week 2)
- [ ] **Nhánh:** `feature/loading-states`
- [ ] **Nhánh:** `feature/error-handling`
- [ ] **Nhánh:** `feature/print-reports`

### Phase 3: Advanced Features (Week 3)
- [ ] **Nhánh:** `feature/import-data`
- [ ] **Nhánh:** `feature/more-chart-types`
- [ ] **Nhánh:** `feature/rich-text-editor`
- [ ] **Nhánh:** `feature/file-upload`

### Phase 4: Code Quality (Week 4)
- [ ] **Nhánh:** `feature/reusable-components`
- [ ] **Nhánh:** `feature/custom-hooks`
- [ ] **Nhánh:** `feature/typescript-improvements`
- [ ] **Nhánh:** `feature/constants-config`

### Phase 5: Polish (Week 5)
- [ ] **Nhánh:** `feature/dark-mode`
- [ ] **Nhánh:** `feature/responsive-design`
- [ ] **Nhánh:** `feature/interactive-charts`
- [ ] **Nhánh:** `feature/quick-filters`

---

## 🔗 10. RESOURCES & LIBRARIES

### Recommended Libraries:
- **Export:** `xlsx` hoặc `exceljs`
- **Rich Text:** `react-quill` hoặc `draft-js`
- **File Upload:** `react-dropzone`
- **Charts:** `recharts` (đã có) hoặc `chart.js`
- **Date:** `dayjs` (đã có)
- **Print:** `react-to-print`

---

## 📞 11. NOTES

- ✅ Tất cả tính năng này có thể làm **hoàn toàn độc lập** với frontend
- ✅ Làm việc với localStorage/mock data hiện tại
- ✅ **Mỗi tính năng là một nhánh riêng** để dễ quản lý và code review
- ✅ Có thể làm song song nhiều nhánh nếu có nhiều người
- ✅ Ưu tiên các tính năng cải thiện UX và productivity
- ✅ Test kỹ trên các browsers và devices

---

**Tác giả:** Auto-generated  
**Ngày tạo:** 19/12/2025  
**Version:** 2.0.0 (Đã tổ chức theo nhánh)
