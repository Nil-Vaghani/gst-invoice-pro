# 📡 GST InvoicePro - API Reference

Complete API documentation for GST Invoice Generator backend.

---

## 🌐 Base URL

**Development**: `http://localhost:5001/api`  
**Production**: `https://your-domain.com/api`

---

## 🔐 Authentication

All invoice-related endpoints require JWT authentication. Include token in request header:

```
Authorization: Bearer <your_jwt_token>
```

Get token from signup/login endpoints.

---

## 📍 Endpoints

### Health Check

#### GET /

Check if API is running and database is connected.

**Request**:

```bash
curl http://localhost:5001
```

**Response** (200 OK):

```json
{
  "status": "ok",
  "message": "GST Invoice Generator API is running",
  "database": "connected"
}
```

---

## 🔑 Authentication Endpoints

### Sign Up (Register New User)

**Endpoint**: `POST /api/auth/signup`

**Request**:

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Full name of user |
| email | string | ✅ | Unique email address |
| password | string | ✅ | Minimum 6 characters |

**Response** (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-22T10:30:00Z"
  }
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### Login

**Endpoint**: `POST /api/auth/login`

**Request**:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✅ | Registered email |
| password | string | ✅ | Account password |

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error** (401 Unauthorized):

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 📄 Invoice Endpoints

### Get All Invoices (Paginated)

**Endpoint**: `GET /api/invoices`

**Headers**:

```
Authorization: Bearer <token>
```

**Query Parameters** (Optional):
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| search | string | Search in business name |

**Request**:

```bash
curl -X GET "http://localhost:5001/api/invoices?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response** (200 OK):

```json
{
  "success": true,
  "invoices": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "businessName": "Acme Corp",
      "businessAddress": "123 Main Street, New York",
      "businessGSTIN": "18AABCT0001H1Z0",
      "businessPhone": "+1234567890",
      "items": [
        {
          "description": "Product A",
          "quantity": 10,
          "unitPrice": 100,
          "gstRate": 18,
          "total": 1180
        }
      ],
      "subtotal": 1000,
      "totalTax": 180,
      "totalAmount": 1180,
      "notes": "Thank you for your business",
      "createdAt": "2026-02-22T10:30:00Z",
      "updatedAt": "2026-02-22T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### Create Invoice

**Endpoint**: `POST /api/invoices`

**Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "businessName": "Acme Corp",
  "businessAddress": "123 Main Street, New York",
  "businessGSTIN": "18AABCT0001H1Z0",
  "businessPhone": "+1234567890",
  "items": [
    {
      "description": "Product A",
      "quantity": 10,
      "unitPrice": 100,
      "gstRate": 18
    },
    {
      "description": "Product B",
      "quantity": 5,
      "unitPrice": 200,
      "gstRate": 5
    }
  ],
  "notes": "Thank you for your business"
}
```

**Request Schema**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| businessName | string | ✅ | Your business name |
| businessAddress | string | ✅ | Complete address |
| businessGSTIN | string | ✅ | GST Identification Number |
| businessPhone | string | ⭕ | Contact phone number |
| items | array | ✅ | Array of invoice items |
| items[].description | string | ✅ | Item name/description |
| items[].quantity | number | ✅ | Quantity (> 0) |
| items[].unitPrice | number | ✅ | Price per unit |
| items[].gstRate | number | ✅ | Tax rate (0, 5, 12, 18) |
| notes | string | ⭕ | Additional notes |

**Response** (201 Created):

```json
{
  "success": true,
  "message": "Invoice created successfully",
  "invoice": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439010",
    "businessName": "Acme Corp",
    "businessAddress": "123 Main Street, New York",
    "businessGSTIN": "18AABCT0001H1Z0",
    "businessPhone": "+1234567890",
    "items": [...],
    "subtotal": 1500,
    "totalTax": 245,
    "totalAmount": 1745,
    "createdAt": "2026-02-22T10:35:00Z"
  }
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "businessName": "Business name is required",
    "items": "At least one item is required"
  }
}
```

---

### Get Single Invoice

**Endpoint**: `GET /api/invoices/:id`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | ✅ | Invoice MongoDB ID |

**Headers**:

```
Authorization: Bearer <token>
```

**Request**:

```bash
curl -X GET "http://localhost:5001/api/invoices/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response** (200 OK):

```json
{
  "success": true,
  "invoice": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439010",
    "businessName": "Acme Corp",
    "businessAddress": "123 Main Street, New York",
    "businessGSTIN": "18AABCT0001H1Z0",
    "businessPhone": "+1234567890",
    "items": [...],
    "subtotal": 1500,
    "totalTax": 245,
    "totalAmount": 1745,
    "createdAt": "2026-02-22T10:35:00Z",
    "updatedAt": "2026-02-22T10:35:00Z"
  }
}
```

**Error** (404 Not Found):

```json
{
  "success": false,
  "message": "Invoice not found"
}
```

---

### Update Invoice

**Endpoint**: `PUT /api/invoices/:id`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | ✅ | Invoice MongoDB ID |

**Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**: Same as Create Invoice (partial update is allowed)

**Request**:

```bash
curl -X PUT "http://localhost:5001/api/invoices/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Acme Corp Updated",
    "items": [...]
  }'
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Invoice updated successfully",
  "invoice": {
    "_id": "507f1f77bcf86cd799439012",
    "businessName": "Acme Corp Updated",
    ...
  }
}
```

---

### Delete Invoice

**Endpoint**: `DELETE /api/invoices/:id`

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | ✅ | Invoice MongoDB ID |

**Headers**:

```
Authorization: Bearer <token>
```

**Request**:

```bash
curl -X DELETE "http://localhost:5001/api/invoices/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

**Error** (404 Not Found):

```json
{
  "success": false,
  "message": "Invoice not found"
}
```

---

## 📊 GST Calculation Reference

GST rates supported:
| Rate | Description |
|------|-------------|
| 0% | Exempt goods |
| 5% | Essential items |
| 12% | Standard items |
| 18% | Premium items |

**Calculation**:

```
Item Total = Quantity × Unit Price
GST Amount = Item Total × (GST Rate / 100)
Item Total with GST = Item Total + GST Amount

Invoice Subtotal = Sum of all Item Totals
Invoice Total Tax = Sum of all GST Amounts
Invoice Total = Invoice Subtotal + Invoice Total Tax
```

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "status": "error_code"
}
```

**Common Status Codes**:
| Code | Meaning | Solution |
|------|---------|----------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Invalid token or not logged in |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Contact support |
| 503 | Service Unavailable | Database not connected |

---

## 🧪 Testing with cURL

### Test Authentication Flow

```bash
# 1. Sign up
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123"}'

# 2. Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'

# 3. Create Invoice (use token from login response)
curl -X POST http://localhost:5001/api/invoices \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>" \
  -H "Content-Type: application/json" \
  -d '{...invoice data...}'
```

---

## 📱 Frontend Integration Example

```javascript
// utils/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getInvoices(token) {
  const res = await fetch(`${API_BASE}/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createInvoice(invoiceData, token) {
  const res = await fetch(`${API_BASE}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoiceData),
  });
  return res.json();
}
```

---

**Last Updated**: February 2026  
**API Version**: 1.0.0
