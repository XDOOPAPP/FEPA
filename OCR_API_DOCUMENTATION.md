# � API Documentation - OCR Service

## 📋 Tổng Quan

OCR Service cung cấp các RESTful API endpoints để quét hóa đơn/biên lai và trích xuất dữ liệu tự động bằng công nghệ OCR (Optical Character Recognition) và QR code detection. Service sử dụng Tesseract.js cho OCR và jsQR cho QR detection với QR-first approach.

**Base URL (qua API Gateway):** `http://localhost:3000/api/v1/ocr`

**Service Internal:** NestJS Microservice trên RabbitMQ queue `ocr_queue`

**Xử lý:** Bất đồng bộ - trả về jobId ngay, kết quả được tính toán sau

**⚠️ Feature Guard:** Requires subscription với OCR feature enabled (Premium plan trở lên)

---

## 🔐 Authentication

**Required Headers:**

```http
Authorization: Bearer {JWT_TOKEN}
x-user-id: {USER_ID}
```

**Feature Requirement:**

- User must have active subscription with `OCR: true` feature
- Premium plan or higher required
- Checked via FeatureGuard at API Gateway level

---

## 📌 HTTP Endpoints

### Danh sách Endpoints

| Method | Endpoint           | Auth     | Feature | Description           |
| ------ | ------------------ | -------- | ------- | --------------------- |
| POST   | `/ocr/scan`        | ✅       | OCR     | Quét hóa đơn/biên lai |
| GET    | `/ocr/jobs`        | ✅       | OCR     | Lấy lịch sử quét      |
| GET    | `/ocr/jobs/:jobId` | ✅       | OCR     | Lấy chi tiết quét     |
| GET    | `/ocr/admin/stats` | ✅ Admin | -       | Thống kê OCR toàn bộ  |

---

## 🔹 Endpoints Chi Tiết

### 1. Quét Hóa Đơn/Biên Lai

Quét ảnh hóa đơn hoặc biên lai. Service sử dụng QR-first approach: nếu detect được QR code (Vietnamese e-invoice format), trích xuất dữ liệu từ QR; nếu không, fallback sang OCR text recognition.

**Endpoint:**

```http
POST /api/v1/ocr/scan
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
Content-Type: application/json
```

**Request Body:**

```json
{
  "fileUrl": "https://storage.example.com/invoices/abc123.jpg"
}
```

**Body Parameters:**

| Field     | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `fileUrl` | string | ✅       | URL của ảnh hóa đơn (https only) |

**Response - 200 OK:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "status": "queued",
  "fileUrl": "https://storage.example.com/invoices/abc123.jpg",
  "resultJson": null,
  "createdAt": "2026-01-22T10:30:00.000Z",
  "completedAt": null
}
```

**Status Values:**

| Status       | Description                           |
| ------------ | ------------------------------------- |
| `queued`     | Waiting for processing                |
| `processing` | Currently being processed             |
| `completed`  | Successfully processed, has result    |
| `failed`     | Processing failed, check errorMessage |

**Response Fields:**

| Field         | Type   | Description                                      |
| ------------- | ------ | ------------------------------------------------ |
| `id`          | string | Job ID (UUID) - dùng để tracking                 |
| `status`      | string | Job status (queued/processing/completed/failed)  |
| `fileUrl`     | string | URL của ảnh được quét                            |
| `resultJson`  | object | Result (null nếu chưa xong, xem schema bên dưới) |
| `createdAt`   | string | Khi request được tạo (ISO 8601)                  |
| `completedAt` | string | Khi xong (null nếu chưa xong)                    |

**Result JSON Schema (khi completed):**

```json
{
  "rawText": "Tên cửa hàng: Lotteria...",
  "confidence": 0.87,
  "hasQrCode": false,
  "qrData": null,
  "expenseData": {
    "amount": 250000,
    "description": "Cơm gà Lotteria",
    "spentAt": "2026-01-22T10:30:00.000Z",
    "category": "food",
    "confidence": 0.85,
    "source": "ocr"
  }
}
```

**Error Responses:**

```json
// 403 Forbidden - Không có OCR feature
{
  "statusCode": 403,
  "message": "OCR features require Premium plan. Please upgrade your subscription.",
  "timestamp": "2026-01-22T10:30:00.000Z"
}

// 400 Bad Request - fileUrl không hợp lệ
{
  "statusCode": 400,
  "message": "fileUrl is required and must be https URL",
  "timestamp": "2026-01-22T10:30:00.000Z"
}

// 500 Internal Server Error - Download/processing error
{
  "statusCode": 500,
  "message": "Failed to download image from provided URL",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/ocr/scan \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "fileUrl": "https://storage.example.com/invoices/receipt.jpg"
  }'
```

**Workflow:**

1. Validate fileUrl (must be https)
2. Create OcrJob with status `queued`
3. Return jobId immediately
4. Background processing:
   - Download image
   - Attempt QR detection first
   - If QR found: parse QR data
   - If QR not found: perform OCR using Tesseract
   - Parse text to extract expense data
   - Update job status to `completed` with resultJson
   - Emit event to Expense Service (optional auto-create expense)

**Processing Time:**

- Typically 2-10 seconds depending on image quality
- Processed asynchronously in background
- Client polls `/ocr/jobs/:jobId` to check progress

---

### 2. Lấy Lịch Sử Quét

**Endpoint:**

```http
GET /api/v1/ocr/jobs
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
```

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                                |
| --------- | ------ | -------- | ------- | ------------------------------------------ |
| `status`  | string | ❌       | -       | Filter: queued/processing/completed/failed |
| `page`    | number | ❌       | 1       | Page number (min: 1)                       |
| `limit`   | number | ❌       | 10      | Items per page (min: 1, max: 100)          |

**Response - 200 OK:**

```json
{
  "data": [
    {
      "id": "uuid-1",
      "userId": "user123",
      "status": "completed",
      "fileUrl": "https://storage.example.com/invoices/abc.jpg",
      "resultJson": {
        "rawText": "Tên cửa hàng: Lotteria...",
        "confidence": 0.87,
        "hasQrCode": false,
        "expenseData": {
          "amount": 250000,
          "description": "Cơm gà Lotteria",
          "spentAt": "2026-01-22T10:30:00.000Z",
          "category": "food"
        }
      },
      "createdAt": "2026-01-22T10:30:00.000Z",
      "completedAt": "2026-01-22T10:35:00.000Z"
    },
    {
      "id": "uuid-2",
      "userId": "user123",
      "status": "processing",
      "fileUrl": "https://storage.example.com/invoices/def.jpg",
      "resultJson": null,
      "createdAt": "2026-01-22T11:00:00.000Z",
      "completedAt": null
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "timestamp": "2026-01-22T11:05:00.000Z"
  }
}
```

**Example cURL:**

```bash
# Get all jobs
curl -X GET "http://localhost:3000/api/v1/ocr/jobs" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Filter by status
curl -X GET "http://localhost:3000/api/v1/ocr/jobs?status=completed&page=1&limit=20" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Get failed jobs
curl -X GET "http://localhost:3000/api/v1/ocr/jobs?status=failed" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 3. Lấy Chi Tiết Quét

**Endpoint:**

```http
GET /api/v1/ocr/jobs/:jobId
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
```

**Response - 200 OK (Completed Job):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "status": "completed",
  "fileUrl": "https://storage.example.com/invoices/receipt.jpg",
  "resultJson": {
    "rawText": "Lotteria\nCơm gà xốt cà chua: 120,000đ\nNước cam: 30,000đ\nTổng: 150,000đ",
    "confidence": 0.87,
    "hasQrCode": false,
    "qrData": null,
    "expenseData": {
      "amount": 150000,
      "description": "Cơm gà + nước cam Lotteria",
      "spentAt": "2026-01-22T12:00:00.000Z",
      "category": "food",
      "confidence": 0.85,
      "source": "ocr"
    }
  },
  "createdAt": "2026-01-22T10:30:00.000Z",
  "completedAt": "2026-01-22T10:35:00.000Z"
}
```

**Response - 200 OK (QR Code Job):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "user123",
  "status": "completed",
  "fileUrl": "https://storage.example.com/invoices/einvoice.jpg",
  "resultJson": {
    "rawText": "01000|Công ty TNHH Lotteria Vietnam|MST:0123456789|...",
    "confidence": 0.99,
    "hasQrCode": true,
    "qrData": {
      "invoiceNo": "00112233",
      "issueDate": "2026-01-22",
      "totalAmount": 250000,
      "sellerName": "Lotteria Vietnam",
      "confidence": 0.99
    },
    "expenseData": {
      "amount": 250000,
      "description": "Hóa đơn điện tử - Lotteria Vietnam",
      "spentAt": "2026-01-22T12:00:00.000Z",
      "category": "food",
      "confidence": 0.99,
      "source": "qr"
    }
  },
  "createdAt": "2026-01-22T10:30:00.000Z",
  "completedAt": "2026-01-22T10:31:00.000Z"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "OCR job with ID {jobId} not found",
  "timestamp": "2026-01-22T15:00:00.000Z"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "You do not have access to this OCR job",
  "timestamp": "2026-01-22T15:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X GET http://localhost:3000/api/v1/ocr/jobs/{jobId} \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 4. Thống Kê Admin

Admin endpoint để xem thống kê OCR jobs của tất cả users.

**Endpoint:**

```http
GET /api/v1/ocr/admin/stats
```

**Headers:**

```http
Authorization: Bearer {admin_token}
x-user-id: {admin_userId}
```

**Response - 200 OK:**

```json
{
  "totalJobs": 5420,
  "totalUsers": 1850,
  "successRate": 94.5,
  "byStatus": [
    {
      "status": "completed",
      "count": 5120
    },
    {
      "status": "failed",
      "count": 300
    },
    {
      "status": "processing",
      "count": 0
    },
    {
      "status": "queued",
      "count": 0
    }
  ],
  "recentJobs": [
    {
      "id": "uuid-1",
      "userId": "user456",
      "status": "completed",
      "fileUrl": "https://storage.example.com/invoices/recent.jpg",
      "resultJson": { "amount": 180000, "confidence": 0.89 },
      "createdAt": "2026-01-22T15:00:00.000Z",
      "completedAt": "2026-01-22T15:05:00.000Z"
    }
  ]
}
```

**Error Responses:**

```json
// 403 Forbidden - Not admin
{
  "statusCode": 403,
  "message": "Only administrators can access this endpoint",
  "timestamp": "2026-01-22T15:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X GET http://localhost:3000/api/v1/ocr/admin/stats \
  -H "Authorization: Bearer {admin_token}" \
  -H "x-user-id: admin123"
```

---

## 💡 Use Cases & Examples

### Use Case 1: Quét Hóa Đơn (Async Pattern)

```javascript
const scanReceipt = async (fileUrl) => {
  // Step 1: Start scan job
  const scanResponse = await fetch('http://localhost:3000/api/v1/ocr/scan', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileUrl }),
  });

  const job = await scanResponse.json();
  console.log(`Scanning started. Job ID: ${job.id}`);

  // Step 2: Poll for results
  const result = await pollUntilComplete(job.id, 30000); // 30 second timeout

  if (result.status === 'completed') {
    const { expenseData } = result.resultJson;
    console.log(`Extracted amount: ${expenseData.amount}`);
    console.log(`Confidence: ${expenseData.confidence}`);

    // Step 3: Auto-create expense from extracted data
    await createExpenseFromOcr(expenseData);
  } else if (result.status === 'failed') {
    showError(`OCR failed: ${result.errorMessage}`);
  }
};

// Helper: Poll job status
const pollUntilComplete = async (jobId, timeout) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const response = await fetch(
      `http://localhost:3000/api/v1/ocr/jobs/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId,
        },
      },
    );

    const job = await response.json();

    if (job.status === 'completed' || job.status === 'failed') {
      return job;
    }

    // Wait 1 second before polling again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error('OCR processing timeout');
};
```

### Use Case 2: Display Scan History

```javascript
const displayScanHistory = async () => {
  const response = await fetch(
    'http://localhost:3000/api/v1/ocr/jobs?limit=20',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
    },
  );

  const { data: jobs, meta } = await response.json();

  // Render list
  jobs.forEach((job) => {
    const statusColor = {
      completed: 'green',
      failed: 'red',
      processing: 'yellow',
      queued: 'gray',
    }[job.status];

    renderJobCard({
      id: job.id,
      status: job.status,
      statusColor,
      amount: job.resultJson?.expenseData?.amount,
      confidence: job.resultJson?.expenseData?.confidence,
      date: new Date(job.createdAt).toLocaleDateString('vi-VN'),
      onClick: () => showJobDetail(job),
    });
  });

  // Render pagination
  renderPagination(meta.page, meta.totalPages);
};
```

### Use Case 3: Create Expense from OCR

```javascript
const createExpenseFromOcr = async (expenseData) => {
  const response = await fetch('http://localhost:3000/api/v1/expenses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: expenseData.description,
      amount: expenseData.amount,
      category: expenseData.category,
      spentAt: expenseData.spentAt.split('T')[0], // YYYY-MM-DD format
    }),
  });

  if (response.ok) {
    const expense = await response.json();
    showSuccess(`Expense created: ${expense.description}`);
    return expense;
  }
};
```

---

## 🧪 Testing Examples

### Test 1: Start OCR Scan

```
POST http://localhost:3000/api/v1/ocr/scan
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
Body:
{
  "fileUrl": "https://storage.example.com/invoices/test.jpg"
}
```

### Test 2: Get Job Detail

```
GET http://localhost:3000/api/v1/ocr/jobs/{jobId}
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
```

### Test 3: Get Completed Jobs

```
GET http://localhost:3000/api/v1/ocr/jobs?status=completed&limit=10
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
```

---

## 🔐 Security & Best Practices

### 1. File URL Validation

- Only HTTPS URLs accepted (security requirement)
- Downloaded from trusted storage services
- Timeout: 30 seconds for download
- Max retries with exponential backoff

### 2. Rate Limiting

- Limit OCR requests per user (e.g., 100 jobs/day for free tier)
- Queue length limit to prevent server overload
- Concurrent job limit per user

### 3. Data Privacy

- OCR results not logged in plaintext
- Images not persisted (downloaded on-demand)
- Results encrypted in database
- User data isolation enforced

### 4. Feature Gating

- Requires OCR subscription feature
- Premium plan access required
- Rate limits based on plan tier

---

## 📈 Performance Tips

### 1. Image Optimization

- Resize large images before upload
- Use JPEG format (better compression than PNG)
- Optimal resolution: 1000-2000px width
- Avoid blurry/rotated images for better OCR

### 2. Polling Strategy

- Use exponential backoff: 500ms → 1s → 2s
- Max timeout: 30-60 seconds
- Most jobs complete within 5-10 seconds

### 3. Caching

- Cache OCR results for 24 hours
- Cache admin stats for 1 hour
- Cache job history for 10 minutes

### 4. Error Handling

- Retry failed downloads with backoff
- Log all errors for debugging
- Implement graceful degradation

---

## 🐛 Common Issues & Troubleshooting

| Issue                      | Cause                | Solution                                  |
| -------------------------- | -------------------- | ----------------------------------------- |
| "Failed to download image" | Invalid/expired URL  | Ensure HTTPS URL is accessible            |
| Low OCR confidence (<70%)  | Blurry/skewed image  | Use high-quality, well-lit photos         |
| Processing timeout         | Server overload      | Wait and retry, consider batch processing |
| "Feature not available"    | No OCR subscription  | Upgrade to Premium plan                   |
| QR parse failed            | Invalid/corrupted QR | Ensure QR code is clear and within frame  |

---

## 📞 Support & Contact

- **Service Name:** OCR Service
- **Default Port:** 3007 (microservice), 3000 (via Gateway)
- **RabbitMQ Queue:** `ocr_queue`
- **Database:** PostgreSQL (Prisma)
- **OCR Engine:** Tesseract.js
- **QR Detection:** jsQR library
- **Processing:** Asynchronous (background jobs)

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
{
"name": "Thịt bò Úc",
"quantity": 0.5,
"price": 130000
}
],
"taxAmount": 0,
"paymentMethod": "CREDIT_CARD",
"confidence": 0.95
},
"createdAt": "2026-01-22T14:35:00.000Z",
"completedAt": "2026-01-22T14:35:03.542Z"
}
}

````

**Response - 200 OK (QR Code Scan):**

```json
{
  "data": {
    "jobId": "550e8400-e29b-41d4-a716-446655440001",
    "userId": "user123",
    "type": "QR_CODE",
    "status": "COMPLETED",
    "imageUrl": "https://storage.example.com/qr/xyz789.jpg",
    "extractedData": {
      "content": "https://payment.example.com/pay?id=12345&amount=500000",
      "type": "URL",
      "parsedData": {
        "paymentId": "12345",
        "amount": 500000
      },
      "confidence": 1.0
    },
    "createdAt": "2026-01-22T14:36:00.000Z",
    "completedAt": "2026-01-22T14:36:01.234Z"
  }
}
````

**Error Responses:**

```json
// 403 Forbidden - Không có quyền OCR
{
  "statusCode": 403,
  "message": "OCR feature requires Pro plan or higher. Please upgrade your subscription.",
  "timestamp": "2026-01-22T14:35:00.000Z"
}

// 400 Bad Request - File không hợp lệ
{
  "statusCode": 400,
  "message": "File must be an image (JPEG, PNG). Max size: 5MB",
  "timestamp": "2026-01-22T14:35:00.000Z"
}

// 400 Bad Request - Không detect được text
{
  "statusCode": 400,
  "message": "No text detected in image. Please ensure the receipt is clear and well-lit.",
  "timestamp": "2026-01-22T14:35:00.000Z"
}

// 500 Internal Server Error - Google Cloud Vision API error
{
  "statusCode": 500,
  "message": "OCR processing failed. Please try again.",
  "timestamp": "2026-01-22T14:35:00.000Z"
}
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/ocr/scan \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123" \
  -F "file=@receipt.jpg" \
  -F "type=RECEIPT"
```

**Example with JavaScript (FormData):**

```javascript
const scanReceipt = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('type', 'RECEIPT');

  const response = await fetch('http://localhost:3000/api/v1/ocr/scan', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
    },
    body: formData,
  });

  const { data: result } = await response.json();
  return result;
};
```

**Workflow:**

1. Validate user has OCR feature in subscription
2. Validate image file (type, size)
3. Upload image to storage (S3/Cloud Storage)
4. Call Google Cloud Vision API
5. Extract text using OCR
6. Parse receipt data (merchant, amount, items, date)
7. Calculate confidence score
8. Save OCR job result to database
9. Return extracted data

**Processing Time:**

- Typical: 2-5 seconds
- Complex receipts: 5-10 seconds

---

### 2. Lấy Lịch Sử Quét

Lấy danh sách tất cả OCR jobs của user.

**Endpoint:**

```http
GET /api/v1/ocr/jobs
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
```

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                              |
| --------- | ------ | -------- | ------- | ---------------------------------------- |
| `type`    | string | ❌       | -       | Filter: `RECEIPT` hoặc `QR_CODE`         |
| `status`  | string | ❌       | -       | Filter: `PENDING`, `COMPLETED`, `FAILED` |
| `page`    | number | ❌       | 1       | Số trang                                 |
| `limit`   | number | ❌       | 10      | Items per page                           |

**Response - 200 OK:**

```json
{
  "data": [
    {
      "jobId": "uuid-1",
      "type": "RECEIPT",
      "status": "COMPLETED",
      "imageUrl": "https://storage.example.com/receipts/img1.jpg",
      "extractedData": {
        "merchant": "Coopmart",
        "amount": 250000
      },
      "createdAt": "2026-01-22T14:35:00.000Z"
    },
    {
      "jobId": "uuid-2",
      "type": "QR_CODE",
      "status": "COMPLETED",
      "extractedData": {
        "content": "https://example.com/payment",
        "type": "URL"
      },
      "createdAt": "2026-01-22T14:30:00.000Z"
    },
    {
      "jobId": "uuid-3",
      "type": "RECEIPT",
      "status": "FAILED",
      "error": "No text detected",
      "createdAt": "2026-01-22T14:25:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "timestamp": "2026-01-22T15:00:00.000Z"
  }
}
```

**Example cURL:**

```bash
# Lấy tất cả jobs
curl -X GET "http://localhost:3000/api/v1/ocr/jobs" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Filter theo type
curl -X GET "http://localhost:3000/api/v1/ocr/jobs?type=RECEIPT" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"

# Filter completed jobs
curl -X GET "http://localhost:3000/api/v1/ocr/jobs?status=COMPLETED&page=1&limit=20" \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 3. Chi Tiết OCR Job

Lấy thông tin chi tiết của một OCR job.

**Endpoint:**

```http
GET /api/v1/ocr/jobs/:id
```

**Headers:**

```http
Authorization: Bearer {token}
x-user-id: {userId}
```

**URL Parameters:**

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `id`      | string | ✅       | UUID của OCR job |

**Response - 200 OK:**

```json
{
  "data": {
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user123",
    "type": "RECEIPT",
    "status": "COMPLETED",
    "imageUrl": "https://storage.example.com/receipts/abc123.jpg",
    "extractedData": {
      "merchant": "Coopmart Supermarket",
      "amount": 250000,
      "currency": "VND",
      "date": "2026-01-22",
      "time": "14:30:00",
      "items": [
        {
          "name": "Gạo ST25 5kg",
          "quantity": 1,
          "price": 120000
        },
        {
          "name": "Thịt bò Úc",
          "quantity": 0.5,
          "price": 130000
        }
      ],
      "taxAmount": 0,
      "totalAmount": 250000,
      "paymentMethod": "CREDIT_CARD",
      "confidence": 0.95
    },
    "rawText": "COOPMART SUPERMARKET\nĐịa chỉ: 168 Nguyễn Văn Cừ, Q1\n...",
    "processingTime": 3542,
    "createdAt": "2026-01-22T14:35:00.000Z",
    "completedAt": "2026-01-22T14:35:03.542Z"
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "OCR job not found",
  "timestamp": "2026-01-22T15:00:00.000Z"
}

// 403 Forbidden
{
  "statusCode": 403,
  "message": "You can only access your own OCR jobs",
  "timestamp": "2026-01-22T15:00:00.000Z"
}
```

**Example cURL:**

```bash
curl -X GET http://localhost:3000/api/v1/ocr/jobs/{jobId} \
  -H "Authorization: Bearer {token}" \
  -H "x-user-id: user123"
```

---

### 4. Thống Kê Admin

Xem thống kê tổng quan về OCR usage (admin only).

**Endpoint:**

```http
GET /api/v1/ocr/admin/stats
```

**Headers:**

```http
Authorization: Bearer {admin_token}
x-user-id: {adminId}
```

**Response - 200 OK:**

```json
{
  "data": {
    "totalScans": 5432,
    "successfulScans": 4891,
    "failedScans": 541,
    "successRate": 90.04,
    "averageProcessingTime": 3245,
    "typeBreakdown": {
      "RECEIPT": 4821,
      "QR_CODE": 611
    },
    "monthlyTrend": [
      { "month": "2026-01", "scans": 1234 },
      { "month": "2025-12", "scans": 1098 }
    ],
    "topUsers": [
      { "userId": "user123", "scanCount": 456 },
      { "userId": "user456", "scanCount": 234 }
    ]
  }
}
```

**Example cURL:**

```bash
curl -X GET http://localhost:3000/api/v1/ocr/admin/stats \
  -H "Authorization: Bearer {admin_token}" \
  -H "x-user-id: admin123"
```

---

## 💡 Use Cases & Examples

### Use Case 1: Scan Receipt và Thêm Expense

**Complete Workflow:**

```javascript
const scanAndAddExpense = async (imageFile) => {
  try {
    // Step 1: Scan receipt
    showLoading('Đang quét hóa đơn...');

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('type', 'RECEIPT');

    const scanResponse = await fetch('http://localhost:3000/api/v1/ocr/scan', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId,
      },
      body: formData,
    });

    if (!scanResponse.ok) {
      if (scanResponse.status === 403) {
        showUpgradePrompt('OCR feature requires Pro plan');
        return;
      }
      throw new Error('Scan failed');
    }

    const { data: scanResult } = await scanResponse.json();
    const extracted = scanResult.extractedData;

    // Step 2: Show preview with editable fields
    const confirmed = await showExpensePreview({
      amount: extracted.amount,
      merchant: extracted.merchant,
      date: extracted.date,
      items: extracted.items,
      receiptUrl: scanResult.imageUrl,
    });

    if (!confirmed) return;

    // Step 3: Create expense
    const expenseResponse = await fetch(
      'http://localhost:3000/api/v1/expenses',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: extracted.amount,
          category: 'FOOD', // User can select
          description: extracted.merchant || 'Từ hóa đơn',
          date: `${extracted.date}T${extracted.time || '12:00:00'}.000Z`,
          receiptUrl: scanResult.imageUrl,
          paymentMethod: extracted.paymentMethod || 'CASH',
        }),
      },
    );

    if (expenseResponse.ok) {
      showSuccess('Đã thêm chi tiêu từ hóa đơn!');
      navigateToExpenses();
    }
  } catch (error) {
    showError('Không thể xử lý hóa đơn. Vui lòng thử lại.');
    console.error(error);
  }
};
```

### Use Case 2: Scan QR Payment Code

```javascript
const scanQRPayment = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('type', 'QR_CODE');

  const response = await fetch('http://localhost:3000/api/v1/ocr/scan', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
    },
    body: formData,
  });

  const { data: result } = await response.json();
  const qrData = result.extractedData;

  if (qrData.type === 'URL' && qrData.parsedData) {
    // Redirect to payment with pre-filled amount
    window.location.href = qrData.content;
  } else {
    // Display raw QR content
    showQRContent(qrData.content);
  }
};
```

### Use Case 3: Display Scan History

```javascript
const displayScanHistory = async () => {
  const response = await fetch('http://localhost:3000/api/v1/ocr/jobs', {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-user-id': userId,
    },
  });

  const { data: jobs } = await response.json();

  jobs.forEach((job) => {
    renderJobCard({
      type: job.type,
      status: job.status,
      merchant: job.extractedData?.merchant,
      amount: job.extractedData?.amount,
      date: job.createdAt,
      thumbnail: job.imageUrl,
      onClick: () => viewJobDetail(job.jobId),
    });
  });
};
```

### Use Case 4: Camera Capture for OCR

```javascript
const captureAndScan = async () => {
  // Open camera
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.getElementById('camera-preview');
  video.srcObject = stream;

  // Capture photo
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  // Convert to blob
  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'receipt.jpg', { type: 'image/jpeg' });

    // Scan
    await scanAndAddExpense(file);

    // Stop camera
    stream.getTracks().forEach((track) => track.stop());
  }, 'image/jpeg');
};
```

---

## 🧪 Testing Examples

### Postman Collection

#### Test 1: Scan Receipt

```
POST http://localhost:3000/api/v1/ocr/scan
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
Body (form-data):
  file: [select image file]
  type: RECEIPT
```

#### Test 2: Scan QR Code

```
POST http://localhost:3000/api/v1/ocr/scan
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
Body (form-data):
  file: [select QR code image]
  type: QR_CODE
```

#### Test 3: Get Scan History

```
GET http://localhost:3000/api/v1/ocr/jobs?type=RECEIPT
Headers:
  Authorization: Bearer {token}
  x-user-id: user123
```

---

## 🔐 Security & Best Practices

### 1. Feature Authorization

- Always check subscription has OCR feature enabled
- Return clear error message with upgrade CTA
- FeatureGuard at Gateway prevents unauthorized access

### 2. Image Validation

- Validate file type (JPEG, PNG only)
- Limit file size (max 5MB)
- Check image dimensions (min 100x100px)
- Sanitize file names

### 3. Data Privacy

- Store images securely (encrypted S3 buckets)
- Set expiration policy for old images (e.g., 90 days)
- Never log extracted sensitive data
- Allow users to delete OCR jobs and images

### 4. Rate Limiting

- Limit OCR scans per user (e.g., 100/month for Pro, unlimited for Premium)
- Implement cooldown between scans (e.g., 5 seconds)
- Track usage for billing/analytics

---

## 📈 Performance & Cost Optimization

### 1. Google Cloud Vision API

- Use Document Text Detection (cheaper than full OCR)
- Batch process multiple images when possible
- Cache common receipt patterns
- Monitor API usage and costs

### 2. Image Processing

- Compress images before uploading to Vision API
- Auto-rotate images based on EXIF data
- Enhance image contrast for better OCR accuracy

### 3. Confidence Threshold

- Only return results with confidence > 0.7
- Flag low-confidence results for manual review
- Retry failed scans with different preprocessing

---

## ⚠️ Common Issues & Troubleshooting

### Issue 1: Low OCR Accuracy

**Causes:**

- Poor image quality (blurry, dark)
- Receipt crumpled or damaged
- Non-standard receipt format

**Solutions:**

- Guide users to take clear photos
- Provide image quality tips
- Use flash in low light
- Allow manual editing of extracted data

### Issue 2: No Text Detected

**Causes:**

- Image too small or too large
- Wrong image type (not a receipt)
- Text in unsupported language

**Solutions:**

- Validate image before processing
- Show preview before scanning
- Support multiple languages in Vision API

### Issue 3: Incorrect Amount Extraction

**Causes:**

- Multiple amounts on receipt (subtotal, tax, total)
- Currency symbols confusion
- Decimal separator issues

**Solutions:**

- Use regex patterns to identify total amount
- Look for keywords: "Total", "Tổng cộng", "Grand Total"
- Always allow manual correction

---

## 📞 Support & Contact

- **Service Name:** OCR Service
- **Default Port:** 3007 (microservice), 3000 (via Gateway)
- **RabbitMQ Queue:** `ocr_queue`
- **Database:** PostgreSQL (Prisma)
- **OCR Provider:** Google Cloud Vision API
- **Feature Required:** OCR enabled in subscription

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
