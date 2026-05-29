# 🚀 GST InvoicePro - Complete Setup Guide

This guide will help you get GST InvoicePro running on your machine in **less than 10 minutes**.

## ✅ Prerequisites

Before you start, make sure you have:

- **Node.js** v20+ and **npm** v10+ ([Download](https://nodejs.org/))
- **MongoDB Atlas Account** (free tier available at https://www.mongodb.com/cloud/atlas)
- **Firebase Account** (optional, for authentication)
- A code editor (VS Code recommended)

Check your versions:

```bash
node --version  # Should be v20.20.0 or higher
npm --version   # Should be v10.8.2 or higher
```

## 📋 Step-by-Step Setup

### Step 1: Clone & Navigate to Project

```bash
cd "GST Calculator"
```

### Step 2: Prepare Environment File

1. Copy the template:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials:

   ```powershell
   notepad .env
   ```

### Step 3: Setup MongoDB Atlas (5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account or login
3. Create a new cluster (M0 free tier is fine)
4. Click "CONNECT" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your password in connection string
7. Paste in `.env` as `MONGODB_URI`

**Example**:

```
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abcdef.mongodb.net/gst-calculator?appName=Cluster0
```

### Step 4: Setup Backend (2 min)

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:

```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5001
```

**Leave this running in Terminal 1**

### Step 5: Setup Frontend (2 min)

Open a **new terminal** and run:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:

```
VITE v6.0.7  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Step 6: Test the Application

1. Open browser and go to: **http://localhost:5173**
2. Click "Sign Up" to create an account
3. Fill in details and register
4. Create a test invoice
5. Download as PDF to verify everything works

**✅ Congratulations! Your application is running!**

## 🔧 Environment Variables Explained

Edit `.env` file with these variables:

| Variable            | What to Put                    | Example                           |
| ------------------- | ------------------------------ | --------------------------------- |
| `MONGODB_URI`       | Your MongoDB connection string | See Step 3 above                  |
| `PORT`              | Backend port (default is fine) | `5001`                            |
| `JWT_SECRET`        | Any random string for security | `my_secret_key_123`               |
| `VITE_API_BASE_URL` | Backend URL (for development)  | `http://localhost:5001/api`       |
| `VITE_FIREBASE_*`   | Firebase keys (optional)       | Leave as is if not using Firebase |

## 📱 Common Issues & Fixes

### ❌ "MongoDB connection error"

**Problem**: Can't connect to database
**Fix**:

1. Check your MONGODB_URI in `.env`
2. Go to MongoDB Atlas → Network Access
3. Add your IP address to whitelist
4. Verify username and password are correct

### ❌ "Port 5001 already in use"

**Problem**: Another app is using port 5001
**Fix**:

```powershell
# Find process ID on port 5001
netstat -ano | findstr :5001

# Kill the process (replace PID with the number shown in the last column)
taskkill /F /PID <PID>

# OR change PORT in .env
PORT=5002
```

### ❌ "Cannot find module"

**Problem**: Dependencies not installed
**Fix**:

```powershell
# Clear cache and reinstall
npm cache clean --force
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### ❌ "Blank page / Nothing loading"

**Problem**: Frontend can't reach backend
**Fix**:

1. Make sure backend is running on port 5001
2. Check VITE_API_BASE_URL in `.env`
3. Open browser console (F12) and check for errors

### ❌ "Cannot write to project folder"

**Problem**: Permission issues
**Fix**: Open PowerShell as Administrator (right-click PowerShell -> Run as Administrator) and rerun:

```powershell
npm install
```

## 🎯 Next Steps

### To Use the Application:

1. **Create Account**: Sign up with email
2. **Create Invoice**: Click "New Invoice"
3. **Add Items**: Fill in product details and rates
4. **Calculate GST**: Automatically calculated at 5%, 12%, or 18%
5. **Download PDF**: Click "Download as PDF"

### To Modify Code:

- **Backend**: Edit files in `backend/` folder
- **Frontend**: Edit files in `frontend/src/` folder
- Changes auto-reload (hot reload enabled)

### To Deploy:

See main **README.md** for production deployment options

## 📞 Need Help?

Check these files for more info:

- `README.md` - Full project documentation
- `backend/README.md` - Backend specific info
- `frontend/README.md` - Frontend specific info
- `.env.example` - Environment variables template

## ✨ Tips

- **Use different terminals** for backend and frontend (don't close them!)
- **Check error messages carefully** - they tell you what went wrong
- **Clear browser cache** if something looks weird (Ctrl+Shift+Delete)
- **Restart both services** if changes don't show up
- **Keep .env file secure** - never commit to git!

---

**You're all set! Happy invoicing! 🎉**
