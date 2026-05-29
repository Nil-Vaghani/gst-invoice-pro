# GST InvoicePro - Invoice Generator SaaS

**GST InvoicePro** is a comprehensive GST invoice generation system built with **React**, **Node.js**, and **MongoDB**. It allows users to create, manage, and download professional invoices with GST calculations in real-time.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [System Requirements](#-system-requirements)
4. [Project Structure](#-project-structure)
5. [Quick Start Guide](#-quick-start-guide)
6. [Environment Variables](#-environment-variables)
7. [API Documentation](#-api-documentation)
8. [Development](#-development)
9. [Production Deployment](#-production-deployment)
10. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Features

- **User Authentication**: Sign up, login, and JWT-based session management
- **Invoice Management**: Create, edit, delete, and view invoices
- **GST Calculations**: Automatic tax calculations with real-time updates
- **PDF Export**: Download invoices as PDF with professional formatting
- **Invoice History**: View and manage all previously created invoices
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin & Security

- Role-based access control (User roles)
- Secure password hashing with bcryptjs
- JWT token-based authentication
- CORS protection
- MongoDB Atlas cloud database

---

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js v20.20.0+
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB 8.9.5 (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken 9.0.3), bcryptjs 3.0.3
- **Security**: CORS 2.8.5, dotenv for environment management
- **Firebase**: firebase-admin 13.6.1 (optional authentication layer)

### Frontend

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.7
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.13.0
- **PDF Generation**: jsPDF 2.5.2, html2canvas 1.4.1
- **Icons**: Lucide React 0.468.0
- **Animations**: Framer Motion 12.34.3
- **Firebase**: firebase 12.9.0 (authentication & data)

---

## 💻 System Requirements

### Minimum Requirements

- **Node.js**: v20.20.0 or higher
- **npm**: v10.8.2 or higher
- **MongoDB**: Atlas (cloud) or local MongoDB v7.0+
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Recommended

- **RAM**: 4GB minimum for development
- **Disk Space**: 500MB for dependencies
- **Internet**: Required for MongoDB Atlas and Firebase

---

## 📁 Project Structure

```
GST Calculator/
│
├── backend/                          # Node.js Backend
│   ├── server.js                     # Main server entry point
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables (not in git)
│   │
│   ├── routes/                       # API endpoints
│   │   ├── authRoutes.js             # Authentication endpoints
│   │   └── invoiceRoutes.js          # Invoice CRUD operations
│   │
│   ├── models/                       # MongoDB Mongoose models
│   │   ├── User.js                   # User schema
│   │   └── Invoice.js                # Invoice schema
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                   # JWT authentication
│   │   └── errorHandler.js           # Error handling (if applicable)
│   │
│   ├── firebaseAdmin.js              # Firebase admin configuration
│   └── node_modules/                 # Dependencies (auto-generated)
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   ├── index.css                 # Global styles
│   │   ├── firebaseConfig.js         # Firebase client configuration
│   │   │
│   │   ├── components/               # React components
│   │   │   ├── InvoiceForm.jsx       # Invoice creation form
│   │   │   ├── InvoicePreview.jsx    # Invoice preview/PDF
│   │   │   ├── InvoiceHistory.jsx    # Past invoices list
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Signup.jsx            # Signup page
│   │   │   └── LandingPage.jsx       # Landing/home page
│   │   │
│   │   └── utils/                    # Utility functions
│   │       ├── calculations.js       # GST calculation logic
│   │       └── api.js                # API calls to backend
│   │
│   ├── public/                       # Static assets
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   └── node_modules/                 # Dependencies (auto-generated)
│
├── .env                              # Environment variables (root level)
├── .env.example                      # Template for environment variables
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "GST Calculator"
```

### Step 2: Setup Backend

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the root directory (or in `backend/` folder) with the following variables:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?appName=Cluster0

# Backend Server Port
PORT=5001

# JWT Secret for token signing
JWT_SECRET=your_secure_jwt_secret_key_here

# Frontend API URL (for development)
VITE_API_BASE_URL=http://localhost:5001/api

# Firebase Config (optional, if using Firebase auth)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

#### 2.3 Start Backend Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Backend will be available at: `http://localhost:5001`

### Step 3: Setup Frontend

#### 3.1 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Configure Firebase

Update `frontend/src/firebaseConfig.js` with your Firebase credentials:

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

#### 3.3 Start Frontend Development Server

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will be available at: `http://localhost:5173` (Vite default)

### Step 4: Verify Setup

1. Open `http://localhost:5173` in your browser
2. You should see the GST InvoicePro landing page
3. Try signing up for an account
4. Create a test invoice
5. Download the invoice as PDF

---

## ⚙️ Environment Variables

### Backend (.env file in root or backend folder)

| Variable            | Description                      | Example                                          |
| ------------------- | -------------------------------- | ------------------------------------------------ |
| `MONGODB_URI`       | MongoDB connection string        | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT`              | Backend server port              | `5001`                                           |
| `JWT_SECRET`        | Secret key for JWT token signing | `your_secure_secret_key`                         |
| `VITE_API_BASE_URL` | Frontend API URL                 | `http://localhost:5001/api`                      |

### Frontend (.env file in frontend folder)

| Variable                    | Description          | Example                     |
| --------------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL`         | Backend API base URL | `http://localhost:5001/api` |
| `VITE_FIREBASE_API_KEY`     | Firebase API key     | `AIzaSy...`                 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com`   |
| `VITE_FIREBASE_PROJECT_ID`  | Firebase project ID  | `my-project`                |

**Note**: Environment variables prefixed with `VITE_` are exposed to the frontend. Never include sensitive secrets (API keys, private keys) in VITE variables.

---

## 📡 API Documentation

### Base URL

```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User

```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login User

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Invoice Endpoints

_All invoice endpoints require JWT authentication_

#### Create Invoice

```
POST /invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "Acme Corp",
  "businessAddress": "123 Main St",
  "businessGSTIN": "18AABCT0001H1Z0",
  "items": [
    {
      "description": "Product A",
      "quantity": 10,
      "unitPrice": 100,
      "gstRate": 18
    }
  ]
}

Response (201):
{
  "success": true,
  "invoice": { ... }
}
```

#### Get All Invoices

```
GET /invoices
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "invoices": [ ... ]
}
```

#### Get Single Invoice

```
GET /invoices/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "invoice": { ... }
}
```

#### Update Invoice

```
PUT /invoices/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "invoice": { ... }
}
```

#### Delete Invoice

```
DELETE /invoices/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Invoice deleted"
}
```

### Health Check

```
GET /
Response (200):
{
  "status": "ok",
  "message": "GST Invoice Generator API is running",
  "database": "connected"
}
```

---

## 👨‍💻 Development

### Running Both Services Simultaneously

#### Option 1: Two Terminal Windows

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
```

#### Option 2: Using npm-run-all (Recommended)

```bash
npm install --save-dev npm-run-all
```

Add to root `package.json`:

```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:backend dev:frontend",
    "dev:backend": "npm --prefix backend run dev",
    "dev:frontend": "npm --prefix frontend run dev"
  }
}
```

Then run:

```bash
npm run dev
```

### Code Structure Notes

#### Backend

- **Models** (`backend/models/`): Mongoose schemas for User and Invoice
- **Routes** (`backend/routes/`): Express route handlers
- **Middleware** (`backend/middleware/`): Auth and error handling
- **Server** (`backend/server.js`): Express app setup with MongoDB connection

#### Frontend

- **Components** (`frontend/src/components/`): Reusable React components
- **Utils** (`frontend/src/utils/`): Helper functions for calculations and API calls
- **Styling**: Tailwind CSS utility classes (no separate CSS files needed)

### Adding New Features

#### Add a New API Endpoint

1. Create route in `backend/routes/`
2. Create model in `backend/models/` (if needed)
3. Add middleware protection if needed
4. Call from frontend using `utils/api.js`

#### Add a New Component

1. Create `.jsx` file in `frontend/src/components/`
2. Import in `frontend/src/App.jsx`
3. Add route if it's a page component

---

## 🚢 Production Deployment

### Backend Deployment (Render, Heroku, AWS)

1. **Set Environment Variables** on hosting platform
2. **Deploy Command**:
   ```bash
   npm start
   ```
3. **Update Frontend** `VITE_API_BASE_URL` to production backend URL

### Frontend Deployment (Vercel, Netlify)

1. **Build**:
   ```bash
   npm run build
   ```
2. **Deploy** the `dist/` folder
3. **Set Environment Variables**:
   - `VITE_API_BASE_URL=https://your-backend-url/api`

### MongoDB Atlas Setup

- Create MongoDB cluster at https://www.mongodb.com/cloud/atlas
- Get connection string with credentials
- Whitelist deployment IP in Network Access

---

## 🔍 Troubleshooting

### MongoDB Connection Issues

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB URI is correct. If using Atlas, whitelist your IP.

### CORS Errors

```
Access to XMLHttpRequest from origin blocked by CORS
```

**Solution**: Update backend `server.js` CORS settings:

```javascript
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution**:

```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change PORT in .env
PORT=5002
```

### Firebase Authentication Not Working

```
Solution: Verify firebaseConfig.js has correct credentials
```

### Vite Port Conflict

```
# Change Vite port in vite.config.js
export default {
  server: {
    port: 3000
  }
}
```

### Dependencies Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📞 Support & Contact

For issues, feature requests, or questions:

- Check existing issues on GitHub
- Contact development team
- Review API documentation

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 🔐 Security Notes

### Sensitive Data

- Never commit `.env` files to version control
- API keys and secrets are in `.gitignore`
- Use environment variables for all credentials

### Best Practices

- Always use HTTPS in production
- Keep dependencies updated
- Validate all user inputs on backend
- Use strong JWT secrets
- Enable MongoDB IP whitelisting

---

**Last Updated**: April 2026
**Version**: 1.0.0
