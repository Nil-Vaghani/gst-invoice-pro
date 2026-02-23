import { useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  ReceiptText,
  History,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  LogOut,
  UserCircle,
} from "lucide-react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import InvoiceHistory from "./components/InvoiceHistory";
import Login from "./components/Login";
import Signup from "./components/Signup";
import LandingPage from "./components/LandingPage";
import {
  calculateInvoiceTotals,
  createEmptyItem,
  calcItemAmount,
} from "./utils/calculations";
import { saveInvoice } from "./utils/api";

const INITIAL_FORM = {
  businessName: "",
  businessAddress: "",
  businessGSTIN: "",
  businessPhone: "",
  businessEmail: "",
  clientName: "",
  clientAddress: "",
  clientGSTIN: "",
  clientPhone: "",
  items: [createEmptyItem()],
  gstRate: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  notes: "",
};

const TABS = {
  CREATE: "create",
  HISTORY: "history",
};

export default function App() {
  // ── Auth State ──────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ── If not logged in, show auth routes ──────────────────
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // ── Logged-in dashboard ─────────────────────────────────
  return <Dashboard user={user} onLogout={handleLogout} />;
}

// ══════════════════════════════════════════════════════════
// Dashboard — the original App content, now auth-protected
// ══════════════════════════════════════════════════════════
function Dashboard({ user, onLogout }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [activeTab, setActiveTab] = useState(TABS.CREATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [toast, setToast] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  // ── Show toast ──────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Submit handler ──────────────────────────────────────
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.businessName.trim()) {
      showToast("Please enter a business name.", "error");
      return;
    }
    if (!formData.clientName.trim()) {
      showToast("Please enter a client name.", "error");
      return;
    }
    if (!formData.items.some((i) => i.productName.trim())) {
      showToast("Please add at least one item.", "error");
      return;
    }
    if (formData.gstRate === "" || formData.gstRate === 0) {
      showToast("Please select a GST rate.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload with computed items & totals
      const itemsWithAmounts = formData.items
        .filter((i) => i.productName.trim())
        .map((i) => ({
          ...i,
          amount: calcItemAmount(i.quantity, i.price),
        }));

      const { subTotal, cgstAmount, sgstAmount, grandTotal } =
        calculateInvoiceTotals(itemsWithAmounts, formData.gstRate);

      const payload = {
        ...formData,
        items: itemsWithAmounts,
        subTotal,
        cgstAmount,
        sgstAmount,
        grandTotal,
      };

      const res = await saveInvoice(payload);
      setInvoiceNumber(res.data?.invoiceNumber || null);
      setHistoryRefreshKey((k) => k + 1); // trigger history reload
      showToast("Invoice saved successfully!");
    } catch (err) {
      showToast(err.message || "Failed to save invoice.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reset form ──────────────────────────────────────────
  const handleReset = () => {
    setFormData({ ...INITIAL_FORM, items: [createEmptyItem()] });
    setInvoiceNumber(null);
  };

  // ── Tab button helper ───────────────────────────────────
  const tabCls = (tab) =>
    `flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
      activeTab === tab
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
        : "text-white/50 hover:text-white/70 hover:bg-white/5"
    }`;

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#0f0c29] via-[#1a1145] to-[#24243e] text-white">
      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[160px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[160px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      {/* ── Toast Notification ─────────────────────────── */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 animate-fade-in rounded-xl px-5 py-3.5 text-sm font-semibold shadow-xl backdrop-blur-xl border ${
            toast.type === "error"
              ? "bg-red-500/20 border-red-500/30 text-red-300"
              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 rounded-full p-0.5 transition-colors hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <ReceiptText size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                GST Invoice<span className="text-indigo-400">Pro</span>
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                Premium Invoice Generator
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-3">
            <nav className="flex gap-1 rounded-xl bg-white/5 border border-white/10 p-1">
              <button
                className={tabCls(TABS.CREATE)}
                onClick={() => setActiveTab(TABS.CREATE)}
              >
                <PlusCircle size={15} />
                Create
              </button>
              <button
                className={tabCls(TABS.HISTORY)}
                onClick={() => setActiveTab(TABS.HISTORY)}
              >
                <History size={15} />
                History
              </button>
            </nav>

            {/* User menu */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <UserCircle size={18} className="text-white/40" />
              <span className="hidden sm:inline text-xs font-medium text-white/60 max-w-[120px] truncate">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="ml-1 rounded-lg p-1 text-white/30 transition-colors hover:bg-red-500/20 hover:text-red-400"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-8">
        {activeTab === TABS.CREATE ? (
          <>
            {/* New Invoice Button (reset) */}
            {invoiceNumber && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm px-5 py-3">
                <p className="text-sm text-emerald-300">
                  <span className="font-bold">✓ Invoice {invoiceNumber}</span>{" "}
                  saved successfully. Download it from the preview, or create a
                  new one.
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                >
                  <PlusCircle size={13} />
                  New Invoice
                </button>
              </div>
            )}

            {/* Split Layout: Form | Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <section>
                <InvoiceForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </section>
              <section className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar">
                <InvoicePreview
                  formData={formData}
                  invoiceNumber={invoiceNumber}
                />
              </section>
            </div>
          </>
        ) : (
          <InvoiceHistory refreshKey={historyRefreshKey} />
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 py-5 text-center text-xs text-white/30">
        © {new Date().getFullYear()} GST InvoicePro — Built for Indian
        Businesses.
      </footer>
    </div>
  );
}
