# 🔐 GST InvoicePro - Security Best Practices Guide

**IMPORTANT**: This document outlines security considerations for developers and deployment teams. Always follow these guidelines before sharing with buyers or deploying to production.

---

## 🛑 Critical: Sensitive Data Protection

### 1. Protect API Keys and Secrets

**❌ NEVER DO THIS:**

```javascript
// ❌ Bad - exposing secrets in code
const dbConnection = "mongodb+srv://admin:password123@cluster.mongodb.net/db";
const jwtSecret = "my_super_secret_key";
const apiKey = "AIzaSyBTEEoldDXCmGCEih-UfNurhMD4gGfO6yY";
```

**✅ ALWAYS DO THIS:**

```javascript
// ✅ Good - using environment variables
const dbConnection = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const apiKey = process.env.VITE_FIREBASE_API_KEY;
```

### 2. .env File Protection

**Your .env file contains sensitive data and MUST NEVER be committed to Git:**

```bash
# Verify .env is in .gitignore
cat .gitignore | grep -i env
```

**Should see**:

```
.env
.env.local
.env.*.local
```

**If not, add it immediately:**

```bash
echo ".env" >> .gitignore
```

### 3. Firebase API Keys

Firebase keys have two categories:

**🔓 PUBLIC KEYS** (safe to expose to frontend):

- API Key
- Auth Domain
- Project ID
- Storage Bucket
- These are prefixed with `VITE_` for frontend access

**🔐 PRIVATE KEYS** (never expose):

- Private Key (for admin SDK)
- Service Account JSON
- Keep in backend `.env` only
- Never commit to repository

---

## 🔑 Credential Rotation & Reset

### If You Accidentally Exposed Credentials:

#### MongoDB

1. Go to MongoDB Atlas dashboard
2. Database Access → Change password immediately
3. Create new connection string
4. Update all .env files
5. Test connection works

#### Firebase

1. Go to Firebase Console → Project Settings
2. Service Accounts → Generate new private key
3. Delete old key
4. Update backend configuration

#### JWT Secret

1. Generate new random string:
   ```bash
   openssl rand -base64 32
   ```
2. Update JWT_SECRET in .env
3. All existing tokens become invalid (users need to re-login)

---

## 🔒 Authentication Security

### Password Security

- **Backend**: Uses bcryptjs for hashing (good!)
- **Frontend**: Never store passwords in localStorage
- **HTTPS Only**: In production, always use HTTPS

### JWT Tokens

```javascript
// ✅ Good - token stored securely
localStorage.setItem("token", jwtToken);

// ❌ Avoid - tokens visible in URL
window.location.href = `/?token=${jwtToken}`;
```

### Token Expiration (Recommended)

Add token expiration to JWT:

```javascript
// Backend - generate token with expiration
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }, // Token expires in 7 days
);

// Frontend - refresh token before expiry
// Implement token refresh endpoint for seamless experience
```

---

## 🌐 API Security

### CORS Configuration

**Current Setup** (in backend/server.js):

```javascript
app.use(cors()); // ⚠️ Allows all origins
```

**Recommended for Production**:

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
```

### Input Validation

**Backend** should validate ALL inputs:

```javascript
// ❌ Bad - no validation
app.post("/api/invoices", (req, res) => {
  const invoice = req.body; // Could be anything!
  Invoice.create(invoice);
});

// ✅ Good - validate inputs
app.post("/api/invoices", (req, res) => {
  const { error, value } = invoiceSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  Invoice.create(value);
});
```

### Rate Limiting

Prevent brute force attacks:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/auth/", limiter);
```

---

## 🗄️ Database Security

### MongoDB

- **IP Whitelist**: Only allow known IP addresses
- **User Roles**: Create database-specific users with minimal permissions
- **Backups**: Enable automatic daily backups in Atlas
- **Encryption**: Use TLS/SSL for all connections (Atlas does this by default)

### Sensitive Data

Fields that should be encrypted or masked:

- User passwords (already hashed ✅)
- GSTIN numbers (consider encryption)
- Business addresses (if sensitive)
- Email addresses (for compliance)

---

## 🚀 Deployment Security Checklist

Before deploying to production, verify:

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] CORS is restricted to your frontend domain
- [ ] HTTPS is enabled
- [ ] JWT secrets are strong and random
- [ ] MongoDB is IP whitelisted
- [ ] Database backups are enabled
- [ ] Rate limiting is configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Admin panel has authentication
- [ ] User roles are properly enforced

---

## 🎬 Demo & Presentation Security

When recording or demoing the app:

### 1. Use Dummy Data

```javascript
// Before demo, populate with test data
const testUser = {
  email: "demo@example.com",
  password: "DemoPassword123!", // Use obvious test password
  businessName: "Demo Business",
};
```

### 2. Redact Sensitive Information

Use tools like:

- **Supademo** - Built-in smart blur for sensitive data
- **Scribe** - Screen recording with data masking
- **OBS** - Manual blur filter for screen areas

### 3. Clean Up After Demo

```bash
# Remove test invoices
# Reset test accounts
# Clear browser history
# Close developer tools showing sensitive data
```

---

## 🔍 Security Audit Checklist

Run these checks regularly:

### Code Scan for Secrets

```bash
# Using npm package
npm install -g detect-secrets
detect-secrets scan .

# Using git hooks
npm install husky pre-commit --save-dev
```

### Dependency Vulnerabilities

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically (if safe)
npm audit fix
```

### Outdated Packages

```bash
# Check for updates
npm outdated

# Update packages
npm update
```

---

## 🚨 Incident Response

### If a Secret is Exposed:

1. **Identify** what was exposed (API key, password, token, etc.)
2. **Rotate** the credential immediately
3. **Audit** where it was exposed (logs, backups, etc.)
4. **Notify** relevant services (MongoDB, Firebase, etc.)
5. **Monitor** for unauthorized access
6. **Document** what happened for future prevention

---

## 📚 Security Resources

### Tools

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Common vulnerabilities
- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) - Dependency scanning
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) - Automated secret detection

### Best Practices

- [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

### Compliance

- **PII Protection**: Protect Personally Identifiable Information (emails, GST numbers)
- **Data Privacy**: GDPR/Local regulations for data storage
- **Audit Logs**: Log who accessed what and when

---

## ✅ Security Verified

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens for API authentication
- ✅ MongoDB connection uses TLS/SSL
- ✅ CORS is configured
- ✅ .env file is in .gitignore
- ⚠️ Input validation needs enhancement
- ⚠️ Rate limiting recommended
- ⚠️ Consider token refresh mechanism

---

**Last Updated**: February 2026
**Security Level**: Production Ready (with recommendations)
