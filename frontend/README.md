# GST InvoicePro - Frontend

React + Vite + Tailwind CSS frontend for GST Invoice Generator.

## 📋 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create `.env` file in frontend directory:

```
VITE_API_BASE_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── firebaseConfig.js       # Firebase initialization
│   │
│   ├── components/             # Reusable React components
│   │   ├── InvoiceForm.jsx     # Form for creating/editing invoices
│   │   ├── InvoicePreview.jsx  # Invoice display and PDF export
│   │   ├── InvoiceHistory.jsx  # List of past invoices
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Registration page
│   │   └── LandingPage.jsx     # Home/landing page
│   │
│   └── utils/                  # Utility functions
│       ├── calculations.js     # GST calculation logic
│       ├── api.js              # API calls to backend
│       └── ...
│
├── public/                     # Static assets (images, fonts)
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── index.html                  # HTML entry point
```

## 🔧 Dependencies

| Package          | Version | Purpose                  |
| ---------------- | ------- | ------------------------ |
| react            | 18.3.1  | UI library               |
| react-router-dom | 7.13.0  | Client-side routing      |
| firebase         | 12.9.0  | Authentication & data    |
| vite             | 6.0.7   | Build tool & dev server  |
| tailwindcss      | 3.4.17  | Utility-first CSS        |
| jspdf            | 2.5.2   | PDF generation           |
| html2canvas      | 1.4.1   | HTML to canvas converter |
| framer-motion    | 12.34.3 | Animation library        |
| lucide-react     | 0.468.0 | Icon library             |

## 📄 Page Structure

### Landing Page

- Hero section
- Feature showcase
- Call-to-action
- Sign up / Login links

### Login / Signup

- Email & password authentication
- Form validation
- Error handling
- Redirect to dashboard

### Dashboard

- Sidebar navigation
- Create new invoice button
- Recent invoices quick view
- User profile menu

### Invoice Creation

- Form for invoice details
- Dynamic item rows
- Real-time GST calculations
- Preview before saving

### Invoice Preview

- Professional invoice layout
- Item breakdown with taxes
- PDF download button
- Print option

### Invoice History

- Table of all invoices
- Search and filter
- Edit/delete actions
- PDF export per invoice

## 🎨 Styling

Uses **Tailwind CSS** for all styling:

- Utility-first approach (no separate CSS files for components)
- Responsive design (mobile-first)
- Dark mode support (can be enabled)
- Custom colors in `tailwind.config.js`

### Common Tailwind Classes Used

```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
  Click me
</button>
```

## 🚀 Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint JavaScript (if configured)
npm run lint
```

## 📱 Responsive Design

Breakpoints used:

- `sm`: 640px (small phones)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)

## 🔗 API Integration

All API calls in `utils/api.js`. Example:

```javascript
// Call from component
import { saveInvoice } from "./utils/api.js";

const response = await saveInvoice(invoiceData);
```

## 🔐 Authentication Flow

1. User signs up / logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent in every API request header
5. Token used to fetch user-specific invoices

## 📦 Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
# Output: dist/ folder ready for deployment
```

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist/ folder to Netlify
```

## 🔍 Component Examples

### Creating a New Component

```jsx
// src/components/MyComponent.jsx
export default function MyComponent() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold">Hello World</h1>
    </div>
  );
}
```

### Adding a New Route

```jsx
// In App.jsx
<Routes>
  <Route path="/my-page" element={<MyComponent />} />
</Routes>
```

## 🐛 Debugging

### React DevTools

Install [React DevTools Browser Extension](https://react-devtools-tutorial.vercel.app/)

### Vite Debug Mode

```bash
DEBUG=vite:* npm run dev
```

### Network Debugging

- Open browser DevTools (F12)
- Go to Network tab
- See all API calls to backend

## 🌍 Environment Variables

Prefixed with `VITE_` to be exposed to frontend:

```
VITE_API_BASE_URL          # Backend API URL
VITE_FIREBASE_API_KEY      # Firebase credentials
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
```

**Never put sensitive secrets in VITE variables!**

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Firebase Web SDK](https://firebase.google.com/docs/web)

## 🎯 Performance Tips

1. Use React.memo() for expensive components
2. Lazy load routes with React.lazy()
3. Optimize images before deployment
4. Use production build for testing

## 📞 Troubleshooting

### Blank Page on Load

- Check browser console for errors
- Verify VITE_API_BASE_URL is correct
- Ensure backend is running

### API Calls Failing

- Check network tab in DevTools
- Verify backend is running on correct port
- Check JWT token in localStorage

### Styling Not Applied

- Clear node_modules and rebuild: `npm install && npm run dev`
- Check Tailwind CSS config
- Verify class names are spelled correctly

### Build Fails

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```
