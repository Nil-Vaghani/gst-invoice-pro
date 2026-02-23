import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  FileDown,
  ShieldCheck,
  ArrowRight,
  ReceiptText,
  Sparkles,
  IndianRupee,
  UserPlus,
  ClipboardList,
  Download,
  Heart,
  Zap,
  Globe,
} from "lucide-react";

// ── Floating Invoice Mock (tilted glassmorphic card) ──────
function InvoiceMock() {
  return (
    <div className="relative [perspective:1200px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 blur-2xl scale-110" />
      <div
        className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl"
        style={{ transform: "rotateY(-8deg) rotateX(4deg)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ReceiptText size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white/90">TAX INVOICE</span>
          </div>
          <span className="text-xs font-mono text-white/50">INV-2026-0042</span>
        </div>
        <div className="space-y-3 mb-5">
          <div className="h-2.5 w-3/4 rounded-full bg-white/15" />
          <div className="h-2.5 w-1/2 rounded-full bg-white/10" />
          <div className="h-2.5 w-2/3 rounded-full bg-white/15" />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span>Item</span>
            <span>Amount</span>
          </div>
          {[
            ["Web Development", "₹45,000"],
            ["UI/UX Design", "₹25,000"],
            ["API Integration", "₹15,000"],
          ].map(([item, amt], i) => (
            <div key={i} className="flex justify-between text-xs text-white/70">
              <span>{item}</span>
              <span className="font-semibold text-white/80">{amt}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-4">
          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
            Grand Total
          </span>
          <div className="flex items-center gap-1">
            <IndianRupee size={14} className="text-emerald-400" />
            <span className="text-lg font-extrabold text-emerald-400">
              1,00,300
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature Card with Mouse Spotlight ─────────────────────
function SpotlightCard({ icon: Icon, title, description, gradient }) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    const spot = spotlightRef.current;
    if (!card || !spot) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spot.style.opacity = "1";
    spot.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(120,150,255,0.15), transparent 60%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:bg-white/[0.12] hover:shadow-[0_30px_80px_-15px_rgba(80,100,255,0.25)] hover:border-white/25"
    >
      {/* Cursor spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
      />
      <div className="relative z-10">
        <div
          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="mb-2 text-lg font-extrabold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-white/60 group-hover:text-white/70 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
}

// ── Step Card for "How it Works" ──────────────────────────
function StepCard({ icon: Icon, step, title, description, gradient }) {
  return (
    <div className="group relative flex flex-col items-center text-center">
      <div
        className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1`}
      >
        <Icon size={26} className="text-white" />
        <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-xs font-extrabold text-white ring-2 ring-white/30">
          {step}
        </div>
      </div>
      <h4 className="mb-1.5 text-base font-extrabold text-white">{title}</h4>
      <p className="max-w-[220px] text-sm leading-relaxed text-white/50">
        {description}
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Landing Page
// ══════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#1a1145] to-[#24243e] text-white">
      {/* ── Animated Ambient Blobs ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-blue-600/20 blur-[160px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] right-[-15%] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[160px] animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[-20%] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[140px] animate-[float_12s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] left-[-5%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px] animate-[float_9s_ease-in-out_infinite_reverse]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
            <ReceiptText size={18} className="text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            GST Invoice<span className="text-blue-400">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/70 shadow-lg">
              <Sparkles size={14} className="text-yellow-400" />
              <span>Trusted by 500+ Indian businesses</span>
            </div>

            <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Professional{" "}
              <span className="animate-gradient-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent">
                GST Invoicing
              </span>
              ,<br />
              Simplified.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              The modern way to generate, manage, and download GST-compliant
              invoices securely — all from one beautiful dashboard.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/40 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-600/50 hover:-translate-y-1 active:translate-y-0 active:shadow-lg"
              >
                Get Started Now
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm px-8 py-4 text-base font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.12] hover:text-white hover:-translate-y-0.5"
              >
                I have an account
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Bank-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <FileDown size={14} className="text-blue-400" />
                <span>Instant PDF export</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator size={14} className="text-violet-400" />
                <span>Auto GST calc</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-md animate-[floatSlow_6s_ease-in-out_infinite]">
              <InvoiceMock />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section (Spotlight Cards) ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              invoice like a pro
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50">
            Built for Indian freelancers, startups, and small businesses who
            want professional invoices without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SpotlightCard
            icon={Calculator}
            title="Instant Calculation"
            description="Automatic GST, CGST, SGST & grand total calculations — zero manual errors, every time."
            gradient="from-blue-500 to-cyan-500"
          />
          <SpotlightCard
            icon={FileDown}
            title="PDF Export"
            description="Generate beautifully formatted, professional PDF invoices and download them with one click."
            gradient="from-indigo-500 to-violet-500"
          />
          <SpotlightCard
            icon={ShieldCheck}
            title="Secure History"
            description="Your invoice data is stored securely in the cloud — access, search, and manage anytime."
            gradient="from-violet-500 to-purple-500"
          />
        </div>
      </section>

      {/* ── How it Works Section ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Simple{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              3-Step Process
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
            From sign-up to PDF download in under 2 minutes.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {/* Connecting dotted line (desktop only) */}
          <div className="pointer-events-none absolute top-8 left-[20%] right-[20%] hidden sm:block">
            <div className="h-px w-full border-t-2 border-dashed border-white/15" />
          </div>

          <StepCard
            icon={UserPlus}
            step="1"
            title="Create Account"
            description="Sign up securely in seconds with Google or email."
            gradient="from-blue-500 to-cyan-500"
          />
          <StepCard
            icon={ClipboardList}
            step="2"
            title="Enter Details"
            description="Fill in your GST info and line items in our smart dashboard."
            gradient="from-indigo-500 to-blue-500"
          />
          <StepCard
            icon={Download}
            step="3"
            title="Generate & Download"
            description="Get your professional PDF invoice instantly — ready to share."
            gradient="from-violet-500 to-indigo-500"
          />
        </div>
      </section>

      {/* ── Stats / Trust Banner ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <div className="rounded-3xl border border-white/15 bg-white/[0.05] backdrop-blur-xl p-10 shadow-2xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                label: "100% Free to Use",
                sub: "No hidden charges, ever",
                color: "text-yellow-400",
              },
              {
                icon: ShieldCheck,
                label: "Bank-grade Security",
                sub: "Firebase + JWT encryption",
                color: "text-emerald-400",
              },
              {
                icon: Globe,
                label: "Made for India",
                sub: "GST, CGST & SGST compliant",
                color: "text-blue-400",
              },
              {
                icon: Heart,
                label: "Built for Freelancers",
                sub: "Startups, MSMEs & consultants",
                color: "text-pink-400",
              },
            ].map(({ icon: Ic, label, sub, color }, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] ring-1 ring-white/10">
                  <Ic size={22} className={color} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to create your{" "}
          <span className="animate-gradient-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent">
            first invoice
          </span>
          ?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-white/50">
          Join hundreds of Indian businesses who trust InvoicePro for
          professional, error-free GST invoicing.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-blue-600/40 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-[0_30px_80px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-1.5 active:translate-y-0 active:shadow-xl"
          >
            Get Started — It's Free
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center">
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} GST InvoicePro — Built with ❤ for Indian
          Businesses.
        </p>
      </footer>

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient-text {
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
