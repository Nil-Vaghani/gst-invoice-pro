# GST InvoicePro - Backend API

Node.js/Express backend for GST Invoice Generator with MongoDB and JWT authentication.

## 📋 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create `.env` file in the root directory:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gst-calculator
PORT=5001
JWT_SECRET=your_secret_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5001`

## 📁 Folder Structure

```
backend/
├── server.js              # Main entry point - Express app setup
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in git)
│
├── routes/
│   ├── authRoutes.js      # Authentication endpoints (signup, login)
│   └── invoiceRoutes.js   # Invoice CRUD endpoints
│
├── models/
│   ├── User.js            # User schema with password hashing
│   └── Invoice.js         # Invoice schema with items
│
├── middleware/
│   └── auth.js            # JWT verification middleware
│
└── firebaseAdmin.js       # Firebase admin initialization
```

## 🔧 Dependencies

| Package        | Version | Purpose                |
| -------------- | ------- | ---------------------- |
| express        | 4.21.2  | Web framework          |
| mongoose       | 8.9.5   | MongoDB ORM            |
| jsonwebtoken   | 9.0.3   | JWT authentication     |
| bcryptjs       | 3.0.3   | Password hashing       |
| cors           | 2.8.5   | Cross-origin requests  |
| dotenv         | 16.4.7  | Environment variables  |
| firebase-admin | 13.6.1  | Firebase backend SDK   |
| nodemon        | 3.1.9   | Auto-reload (dev only) |

## 🚀 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Invoices (Protected)

- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get single invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Health

- `GET /` - Health check endpoint

## 🔐 Authentication

JWT tokens are required for invoice endpoints. Include in request header:

```
Authorization: Bearer <token>
```

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice Model

```javascript
{
  userId: ObjectId,
  businessName: String,
  businessAddress: String,
  businessGSTIN: String,
  businessPhone: String,
  items: [
    {
      description: String,
      quantity: Number,
      unitPrice: Number,
      gstRate: Number
    }
  ],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠 Development

### Watch Mode

```bash
npm run dev
```

### Production Build

```bash
npm start
```

### Debugging

```bash
# Enable debug logs
DEBUG=* npm run dev
```

## 🚢 Deployment

### Render / Heroku

1. Set environment variables in platform dashboard
2. Run: `npm start`

### AWS Lambda / Serverless

Configure serverless.yml and deploy with serverless CLI

## 📝 Error Handling

All endpoints return consistent JSON responses:

```javascript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  message: "Error description"
}
```

## 🔍 Troubleshooting

### MongoDB Connection Failed

- Check MONGODB_URI in .env
- Verify IP is whitelisted in MongoDB Atlas

### JWT Errors

- Verify JWT_SECRET is set
- Check token format in Authorization header

### Port Already in Use

```bash
lsof -ti:5001 | xargs kill -9
```

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [Mongoose Docs](https://mongoosejs.com)
- [JWT Explained](https://jwt.io)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
