import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ReceiptText,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Smartphone,
  Chrome,
} from "lucide-react";
import { loginUser, socialLogin } from "../utils/api";
import {
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithApple,
} from "../utils/firebaseAuth";
import PhoneAuthModal from "./PhoneAuthModal";

// ── Inline SVG icons for social buttons ───────────────────
const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);
const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "microsoft" | "apple" | null
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-3 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300";

  // ── Social login handler ──────────────────────────────
  const handleSocial = async (provider, signInFn) => {
    setError(null);
    setSocialLoading(provider);
    try {
      const firebaseResult = await signInFn();
      const res = await socialLogin(firebaseResult.idToken);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      // User closed popup — don't show error
      if (err?.code === "auth/popup-closed-by-user") return;
      if (err?.code === "auth/cancelled-popup-request") return;
      setError(err.message || `${provider} sign-in failed. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  // ── Phone OTP success handler ─────────────────────────
  const handlePhoneSuccess = async ({ idToken }) => {
    setError(null);
    setSocialLoading("phone");
    try {
      const res = await socialLogin(idToken);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Phone sign-in failed.");
    } finally {
      setSocialLoading(null);
      setShowPhoneModal(false);
    }
  };

  const socialCls =
    "flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm active:scale-[0.98]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/30 px-4 py-10">
      {/* Background blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-[400px] w-[400px] rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/25">
            <ReceiptText size={22} className="text-white" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
            Sign in to <span className="text-indigo-600">InvoicePro</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back — pick up where you left off
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)]">
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={socialCls}
              disabled={!!socialLoading}
              onClick={() => handleSocial("google", signInWithGoogle)}
            >
              {socialLoading === "google" ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <Chrome size={18} className="text-slate-500" />
              )}
              Google
            </button>
            <button
              type="button"
              className={socialCls}
              disabled={!!socialLoading}
              onClick={() => handleSocial("microsoft", signInWithMicrosoft)}
            >
              {socialLoading === "microsoft" ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <MicrosoftIcon />
              )}
              Microsoft
            </button>
            <button
              type="button"
              className={socialCls}
              disabled={!!socialLoading}
              onClick={() => handleSocial("apple", signInWithApple)}
            >
              {socialLoading === "apple" ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <AppleIcon />
              )}
              Apple
            </button>
            <button
              type="button"
              className={socialCls}
              disabled={!!socialLoading}
              onClick={() => setShowPhoneModal(true)}
            >
              {socialLoading === "phone" ? (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              ) : (
                <Smartphone size={18} className="text-slate-500" />
              )}
              Mobile
            </button>
          </div>

          {/* OR Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  className={inputCls}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputCls + " pr-11"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Phone Auth Modal */}
      <PhoneAuthModal
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={handlePhoneSuccess}
      />
    </div>
  );
}
