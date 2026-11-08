"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      {/* Return to website link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#cca45b] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SunHaven Website</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cca45b]/10 border border-[#cca45b]/20 text-[11px] font-medium text-[#cca45b]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Gateway
        </span>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-14 h-14 bg-gradient-to-br from-[#cca45b] to-[#b38a44] rounded-2xl flex items-center justify-center shadow-lg shadow-[#cca45b]/20 group-hover:scale-105 transition-transform">
            <span className="text-[#07160f] font-bold text-2xl tracking-wider">SH</span>
          </div>
          <div className="text-left">
            <p className="font-cinzel text-2xl font-bold text-white tracking-wide">SunHaven</p>
            <p className="text-[11px] text-[#cca45b] uppercase tracking-widest font-semibold">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="bg-[#0a2118]/90 backdrop-blur-xl border border-[#cca45b]/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60">
        <div className="text-center mb-7">
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">Sign In</h1>
          <p className="text-slate-400 text-sm mt-1.5">Enter your credentials to manage operations</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2.5 p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#cca45b] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#07160f]/90 border border-white/15 focus:border-[#cca45b] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#cca45b]/50 transition-all"
                placeholder="admin@sunhavenlanka.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#cca45b] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#07160f]/90 border border-white/15 focus:border-[#cca45b] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#cca45b]/50 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] disabled:bg-[#cca45b]/50 text-[#07160f] py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#cca45b]/10 hover:shadow-[#cca45b]/25 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#07160f]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In to Admin Panel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#07160f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#cca45b]/15 via-[#07160f] to-[#07160f] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#cca45b]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#0a2118] rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="text-center py-12">
            <div className="text-[#cca45b] font-cinzel text-xl">Loading...</div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}