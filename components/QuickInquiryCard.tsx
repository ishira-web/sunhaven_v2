"use client";

import React, { useState } from "react";
import {
  Calendar,
  Users,
  Hotel,
  Mail,
  User,
  Globe,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

interface QuickInquiryCardProps {
  className?: string;
  defaultPackageTitle?: string;
  onSuccess?: () => void;
}

const HOTEL_CATEGORIES = ["Boutique", "5-Star", "4-Star", "3-Star", "Budget"];

export default function QuickInquiryCard({
  className = "",
  defaultPackageTitle,
  onSuccess,
}: QuickInquiryCardProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [pax, setPax] = useState<number>(2);
  const [hotelCategory, setHotelCategory] = useState<string[]>(["5-Star", "Boutique"]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleHotelCategory = (cat: string) => {
    setHotelCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!country.trim()) {
      setError("Please enter your country.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!arrivalDate) {
      setError("Please select your arrival date to Sri Lanka.");
      return;
    }
    if (!departureDate) {
      setError("Please select your departure date from Sri Lanka.");
      return;
    }
    if (hotelCategory.length === 0) {
      setError("Please select at least one hotel category preference.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: defaultPackageTitle ? "DIRECT_INQUIRY" : "TRIP_PLANNER",
          name: name.trim(),
          country: country.trim(),
          email: email.trim(),
          phone: "Not provided (Quick Form)",
          arrivalDate,
          departureDate,
          travelDates: `${arrivalDate} to ${departureDate}`,
          pax: Number(pax),
          passengers: `${pax} Pax`,
          hotelCategory,
          mealPlan: ["HB"],
          specialRequests: defaultPackageTitle
            ? `Quick inquiry for tour: ${defaultPackageTitle}`
            : "Quick inquiry submitted from website homepage",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Quick inquiry submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCountry("");
    setEmail("");
    setArrivalDate("");
    setDepartureDate("");
    setPax(2);
    setHotelCategory(["5-Star", "Boutique"]);
    setSubmitted(false);
    setError(null);
  };

  return (
    <div
      className={`bg-[#0a2118]/95 backdrop-blur-md border border-[#cca45b]/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${className}`}
    >
      {submitted ? (
        <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-[#cca45b]/20 border border-[#cca45b] text-[#cca45b] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(204,164,91,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-cinzel text-2xl font-bold text-white">
            Thank You, {name}!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Your quick inquiry has been received. Our luxury travel curators are
            preparing your customized holiday proposal and will email you at{" "}
            <span className="text-[#cca45b] font-semibold">{email}</span> shortly.
          </p>
          <div className="pt-4">
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-white/5 border border-white/15 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="border-b border-[#cca45b]/20 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#cca45b] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30-Second Quick Inquiry</span>
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Plan Your Private Journey
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xs text-left sm:text-right">
              Get your bespoke Sri Lanka itinerary and instant quote
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-[#cca45b]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 2. Country */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Country <span className="text-[#cca45b]">*</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. United Kingdom"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 3. Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address <span className="text-[#cca45b]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="alexander@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 4. Arrival Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Arrival Date (To SL) <span className="text-[#cca45b]">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* 5. Departure Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Departure Date (From SL) <span className="text-[#cca45b]">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* 6. No of Pax Dropdown (1-25) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                No of Pax <span className="text-[#cca45b]">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                >
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Person (Solo)" : "Pax (Persons)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 7. Hotel Category Checkboxes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Preferred Hotel Category <span className="text-[#cca45b]">*</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {HOTEL_CATEGORIES.map((cat) => {
                const isSelected = hotelCategory.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleHotelCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#cca45b]/20 border-[#cca45b] text-[#cca45b] shadow-[0_0_12px_rgba(204,164,91,0.25)]"
                        : "bg-[#07160f] border-white/15 text-slate-400 hover:border-white/30 hover:text-slate-200"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border transition-colors ${
                        isSelected
                          ? "bg-[#cca45b] border-[#cca45b] text-[#07160f]"
                          : "border-white/30"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </span>
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Submit and Inquiry Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant response & tailored proposal sent to your email</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_20px_rgba(204,164,91,0.35)] hover:shadow-[0_6px_25px_rgba(204,164,91,0.5)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SUBMITTING INQUIRY...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SUBMIT AND INQUIRY</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
