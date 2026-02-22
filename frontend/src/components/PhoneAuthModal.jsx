import { useState, useEffect, useRef } from "react";
import { X, Smartphone, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import {
  initRecaptcha,
  sendPhoneOTP,
  verifyPhoneOTP,
} from "../utils/firebaseAuth";

export default function PhoneAuthModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);

  // Initialize reCAPTCHA when modal opens
  useEffect(() => {
    if (open && recaptchaRef.current) {
      try {
        initRecaptcha("recaptcha-container");
      } catch {
        /* will re-init on send */
      }
    }
  }, [open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("+91");
      setOtp("");
      setError(null);
      setConfirmationResult(null);
      setLoading(false);
    }
  }, [open]);

  const handleSendOTP = async () => {
    setError(null);
    const cleaned = phone.replace(/\s+/g, "");
    if (!/^\+\d{10,15}$/.test(cleaned)) {
      setError(
        "Enter a valid phone number with country code (e.g. +919876543210)",
      );
      return;
    }
    setLoading(true);
    try {
      initRecaptcha("recaptcha-container");
      const result = await sendPhoneOTP(cleaned);
      setConfirmationResult(result);
      setStep("otp");
    } catch (err) {
      const msg =
        err?.code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : err?.code === "auth/invalid-phone-number"
            ? "Invalid phone number format."
            : err.message || "Failed to send OTP. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const result = await verifyPhoneOTP(confirmationResult, otp);
      onSuccess(result);
    } catch (err) {
      const msg =
        err?.code === "auth/invalid-verification-code"
          ? "Invalid OTP. Please check and try again."
          : err?.code === "auth/code-expired"
            ? "OTP expired. Please request a new one."
            : err.message || "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-3 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/70 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
            <Smartphone size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {step === "phone" ? "Mobile Login" : "Verify OTP"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {step === "phone"
              ? "We'll send a one-time code to your phone"
              : `OTP sent to ${phone}`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        {step === "phone" ? (
          /* ── Phone Number Input ── */
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Phone Number
            </label>
            <div className="relative">
              <Smartphone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                className={inputCls}
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending OTP…
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        ) : (
          /* ── OTP Verification ── */
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Enter 6-digit OTP
            </label>
            <div className="relative">
              <ShieldCheck
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className={
                  inputCls + " tracking-[0.3em] text-center font-mono text-base"
                }
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                autoFocus
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Verify & Sign In
                  <ShieldCheck size={16} />
                </>
              )}
            </button>
            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError(null);
              }}
              className="mt-3 w-full text-center text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Didn't receive it? Change number & resend
            </button>
          </div>
        )}

        {/* reCAPTCHA container (invisible) */}
        <div id="recaptcha-container" ref={recaptchaRef} />
      </div>
    </div>
  );
}
