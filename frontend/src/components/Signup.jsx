import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ReceiptText,
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { signupUser, socialLogin } from "../utils/api";
import { signInWithGoogle } from "../utils/firebaseAuth";

// ── Official multicolor Google "G" logo ───────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Email / Password signup ───────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
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

  // ── Google signup via Firebase signInWithPopup ─────────
  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const firebaseResult = await signInWithGoogle();
      const res = await socialLogin(firebaseResult.idToken);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") return;
      if (err?.code === "auth/cancelled-popup-request") return;
      setError(err.message || "Google sign-up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Dark Glowing Input Style ────────────────────────────
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-sm text-white shadow-inner transition-all duration-300 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:border-indigo-500/50 hover:bg-black/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#1a1145] to-[#24243e] px-4 py-10">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[160px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/15 blur-[140px] animate-pulse [animation-delay:4s]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* ── Branding ── */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/40 ring-2 ring-white/20">
            <ReceiptText size={28} className="text-white drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Create your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              InvoicePro
            </span>{" "}
            account
          </h1>
          <p className="mt-2 text-sm font-medium text-white/50">
            Free forever — start generating GST invoices in seconds
          </p>
        </div>

        {/* ── Glassmorphic Card ── */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* ── Google Button ── */}
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignup}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 text-sm font-bold text-white/90 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={20} className="animate-spin text-white/40" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          {/* ── OR Divider ── */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              or
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-4 py-3 text-sm text-red-300 shadow-sm">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Signup Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/40">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="text"
                  className={inputCls}
                  placeholder="e.g. Rajesh Patel"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/40">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
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
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/40">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputCls + " pr-11"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-white/40">
                Confirm Password
              </label>
              <div className="relative">
                <ShieldCheck
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  className={inputCls + " pr-11"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ── Neon Create Account Button ── */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:translate-y-0 active:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-medium text-white/40">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline underline-offset-4 decoration-indigo-500/50"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
