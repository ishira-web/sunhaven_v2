"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  Hotel,
  Utensils,
  Sparkles,
  DollarSign,
  MapPin,
  Send,
  CheckCircle2,
  Plus,
  Loader2,
  Package,
} from "lucide-react";

export interface SelectedPackageInfo {
  id?: string;
  slug?: string;
  title?: string;
  duration?: string;
}

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: SelectedPackageInfo | null;
  initialPlaces?: string[];
}

const POPULAR_DESTINATIONS = [
  "Sigiriya",
  "Kandy",
  "Ella",
  "Galle",
  "Nuwara Eliya",
  "Yala National Park",
  "Mirissa",
  "Colombo",
  "Bentota",
  "Trincomalee",
  "Anuradhapura",
  "Polonnaruwa",
  "Dambulla",
  "Horton Plains",
  "Udawalawe",
  "Jaffna",
];

const HOTEL_CATEGORIES = [
  { id: "Boutique", label: "Boutique & Luxury Heritage" },
  { id: "5-Star", label: "5-Star Ultra Luxury" },
  { id: "4-Star", label: "4-Star Premium" },
  { id: "3-Star", label: "3-Star Standard Comfort" },
  { id: "Budget", label: "Budget Friendly" },
];

const MEAL_PLANS = [
  { id: "BB", label: "BB (Bed & Breakfast)" },
  { id: "HB", label: "HB (Half Board - Breakfast & Dinner)" },
  { id: "FB", label: "FB (Full Board - All 3 Meals)" },
];

const INTEREST_OPTIONS = [
  "Culture and Heritage",
  "Nature",
  "Ancient and Archaeology",
  "Wildlife",
  "Adventure",
  "Beach",
  "Shopping",
];

const BUDGET_RANGES = [
  "$1 - $300 (Day Tour / Short Excursion)",
  "$300 - $800",
  "$800 - $1,500",
  "$1,500 - $2,500",
  "$2,500 - $3,500",
  "$3,500 - $5,000",
  "$5,000 Above (Ultra Luxury Private)",
];

import QuickInquiryCard from "./QuickInquiryCard";

export default function TripPlannerModal({
  isOpen,
  onClose,
  selectedPackage = null,
  initialPlaces = [],
}: TripPlannerModalProps) {
  const [formMode, setFormMode] = useState<"quick" | "detailed">("quick");
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    email: "",
    phone: "",
    arrivalDate: "",
    departureDate: "",
    pax: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    hotelCategory: ["5-Star", "Boutique"] as string[],
    mealPlan: ["HB"] as string[],
    interests: ["Culture and Heritage", "Nature", "Wildlife"] as string[],
    budget: "$1,500 - $2,500",
    packageId: "",
    packageTitle: "",
    customPlaces: [] as string[],
    otherRequirements: "",
  });

  const [availablePackages, setAvailablePackages] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [customPlaceInput, setCustomPlaceInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch packages list once when opened
  useEffect(() => {
    if (isOpen && availablePackages.length === 0) {
      fetch("/api/packages?published=true")
        .then((res) => (res.ok ? res.json() : { packages: [] }))
        .then((data) => {
          if (data.packages && Array.isArray(data.packages)) {
            setAvailablePackages(data.packages);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, availablePackages.length]);

  const pkgId = selectedPackage?.id;
  const pkgTitle = selectedPackage?.title;
  const placesKey = initialPlaces ? initialPlaces.join(",") : "";

  // Adjust state when inbound props change — React 19 pattern.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [syncKey, setSyncKey] = useState<string | null>(null);
  const currentSyncKey = isOpen ? `${pkgId ?? ""}|${pkgTitle ?? ""}|${placesKey}` : null;
  if (isOpen && currentSyncKey !== syncKey) {
    setSyncKey(currentSyncKey);
    setFormData((prev) => {
      const nextPackageId = pkgId || prev.packageId;
      const nextPackageTitle = pkgTitle || prev.packageTitle || "100% Custom Tailor-Made Tour";
      const incomingPlaces = initialPlaces || [];
      const nextPlaces =
        incomingPlaces.length > 0
          ? Array.from(new Set([...prev.customPlaces, ...incomingPlaces]))
          : prev.customPlaces;

      if (
        prev.packageId === nextPackageId &&
        prev.packageTitle === nextPackageTitle &&
        prev.customPlaces.length === nextPlaces.length
      ) {
        return prev;
      }

      return {
        ...prev,
        packageId: nextPackageId,
        packageTitle: nextPackageTitle,
        customPlaces: nextPlaces,
      };
    });
  } else if (!isOpen && syncKey !== null) {
    setSyncKey(null);
  }

  // Modal ESC key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleHotelCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      hotelCategory: prev.hotelCategory.includes(cat)
        ? prev.hotelCategory.filter((c) => c !== cat)
        : [...prev.hotelCategory, cat],
    }));
  };

  const toggleMealPlan = (plan: string) => {
    setFormData((prev) => ({
      ...prev,
      mealPlan: prev.mealPlan.includes(plan)
        ? prev.mealPlan.filter((p) => p !== plan)
        : [...prev.mealPlan, plan],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleCustomPlace = (place: string) => {
    setFormData((prev) => ({
      ...prev,
      customPlaces: prev.customPlaces.includes(place)
        ? prev.customPlaces.filter((p) => p !== place)
        : [...prev.customPlaces, place],
    }));
  };

  const handleAddCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPlaceInput.trim()) {
      const trimmed = customPlaceInput.trim();
      if (!formData.customPlaces.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          customPlaces: [...prev.customPlaces, trimmed],
        }));
      }
      setCustomPlaceInput("");
    }
  };

  const removeCustomPlace = (placeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      customPlaces: prev.customPlaces.filter((p) => p !== placeToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!formData.arrivalDate || !formData.departureDate) {
      setFormError("Please select both Arrival and Departure dates.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.packageId ? "DIRECT_INQUIRY" : "TRIP_PLANNER",
          name: formData.name,
          country: formData.country,
          email: formData.email,
          phone: formData.phone,
          arrivalDate: formData.arrivalDate,
          departureDate: formData.departureDate,
          travelDates: `${formData.arrivalDate} to ${formData.departureDate}`,
          pax: formData.pax,
          adults: formData.adults,
          children: formData.children,
          rooms: formData.rooms,
          hotelCategory: formData.hotelCategory,
          mealPlan: formData.mealPlan,
          interests: formData.interests,
          budget: formData.budget,
          customPlaces: formData.customPlaces,
          specialRequests: formData.otherRequirements,
          packageId: formData.packageId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save inquiry to database");
      }

      setSubmitted(true);

      // Construct WhatsApp concierge message
      const waMessage =
        `*NEW DETAILED TOUR INQUIRY - SunHaven Lanka*%0A%0A` +
        `*Package:* ${formData.packageTitle || "Tailor-Made Custom Tour"}%0A` +
        `*Name:* ${formData.name}%0A` +
        `*Country:* ${formData.country}%0A` +
        `*Email:* ${formData.email}%0A` +
        `*WhatsApp:* ${formData.phone}%0A` +
        `*Dates (SL):* ${formData.arrivalDate} to ${formData.departureDate}%0A` +
        `*Total Pax:* ${formData.pax} (Adults 12+: ${formData.adults}, Children <12: ${formData.children})%0A` +
        `*Rooms:* ${formData.rooms}%0A` +
        `*Hotel Category:* ${formData.hotelCategory.join(", ") || "Standard"}%0A` +
        `*Meal Plan:* ${formData.mealPlan.join(", ") || "HB"}%0A` +
        `*Interests:* ${formData.interests.join(", ") || "All"}%0A` +
        `*Budget (USD):* ${formData.budget}%0A` +
        (formData.customPlaces.length > 0 ? `*Custom Places:* ${formData.customPlaces.join(", ")}%0A` : "") +
        (formData.otherRequirements ? `*Requirements:* ${formData.otherRequirements}` : "");

      setTimeout(() => {
        window.open(`https://wa.me/94771234567?text=${waMessage}`, "_blank");
      }, 700);
    } catch (err: unknown) {
      console.error(err);
      setFormError("Something went wrong submitting your inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-[#081a13] border border-[#cca45b]/40 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl text-slate-100 my-auto max-h-[92vh] overflow-y-auto scrollbar-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-[#cca45b] text-slate-300 hover:text-[#081a13] flex items-center justify-center transition-all shadow-md z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 border-b border-emerald-950/80 pb-5">
          <div className="inline-flex items-center gap-2 bg-[#cca45b]/15 border border-[#cca45b]/30 px-3.5 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#cca45b] uppercase">
              Bespoke Luxury Concierge
            </span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
            Plan Your Sri Lanka Tour
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Choose between a 30-second fast inquiry or custom tailor your complete multi-destination itinerary.
          </p>

          {/* Mode Switcher */}
          {!submitted && (
            <div className="flex justify-center mt-5">
              <div className="bg-[#05110b] p-1 rounded-2xl border border-emerald-950/80 inline-flex shadow-inner">
                <button
                  type="button"
                  onClick={() => setFormMode("quick")}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    formMode === "quick"
                      ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>⚡ Quick Inquiry (30 Sec)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode("detailed")}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    formMode === "detailed"
                      ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>📋 Detailed Tour Planner</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {formMode === "quick" && !submitted ? (
          <div className="py-2">
            <QuickInquiryCard
              className="bg-transparent border-0 p-0 shadow-none"
              defaultPackageTitle={selectedPackage?.title}
              onSuccess={() => {}}
            />
          </div>
        ) : submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#cca45b]/20 border border-[#cca45b] rounded-full flex items-center justify-center mx-auto text-[#cca45b]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Inquiry Dispatched Successfully
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your inquiry has been logged in our reservations system. Connecting you with our WhatsApp concierge specialist...
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 bg-[#cca45b] text-[#081a13] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition shadow-lg shadow-[#cca45b]/20"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm">
                {formError}
              </div>
            )}

            {/* SECTION 1: Personal & Contact Details */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <User className="w-4 h-4" /> 1. Traveler Information & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NAME */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Johnathan Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* COUNTRY */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Country of Residence <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. United Kingdom, Germany, Australia"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* EMAIL ADDRESS */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* WHATSAPP NUMBER */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    WhatsApp Number <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+44 7911 123456 / +1 555..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Travel Dates & Party Composition */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <Calendar className="w-4 h-4" /> 2. Travel Dates & Group Composition
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ARRIVAL DATE */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Arrival Date (To SL) <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.arrivalDate}
                      onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* DEPARTURE DATE */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Departure Date (From SL) <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* PAX, ADULTS, CHILDREN, ROOMS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {/* NO OF PAX */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Total Pax (1-25)
                  </label>
                  <select
                    value={formData.pax}
                    onChange={(e) => setFormData({ ...formData, pax: Number(e.target.value) })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Person" : "Persons"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ADULTS (12<) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Adults (12+)
                  </label>
                  <select
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CHILDREN (12>) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Children (&lt;12)
                  </label>
                  <select
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 16 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>
                        {n === 0 ? "0 None" : `${n} Child${n > 1 ? "ren" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* NO ROOMS */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    No. of Rooms (1-20)
                  </label>
                  <select
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} Room{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Accommodation Style & Meal Plan */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <Hotel className="w-4 h-4" /> 3. Hotel Category & Meal Plan
              </h3>

              {/* HOTEL CATEGORY (CHECKBOXES) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Hotel Category (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {HOTEL_CATEGORIES.map((cat) => {
                    const checked = formData.hotelCategory.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleHotelCategory(cat.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 ${
                          checked
                            ? "bg-[#cca45b]/15 border-[#cca45b] text-[#cca45b] shadow-sm"
                            : "bg-[#05110b] border-emerald-950/90 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            checked ? "bg-[#cca45b] border-[#cca45b]" : "border-slate-600"
                          }`}
                        >
                          {checked && <span className="text-[#081a13] font-bold text-[10px]">✓</span>}
                        </div>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MEAL PLAN (CHECKBOXES) */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Meal Plan (Select preferences)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {MEAL_PLANS.map((plan) => {
                    const checked = formData.mealPlan.includes(plan.id);
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => toggleMealPlan(plan.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 ${
                          checked
                            ? "bg-[#cca45b]/15 border-[#cca45b] text-[#cca45b] shadow-sm"
                            : "bg-[#05110b] border-emerald-950/90 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            checked ? "bg-[#cca45b] border-[#cca45b]" : "border-slate-600"
                          }`}
                        >
                          {checked && <span className="text-[#081a13] font-bold text-[10px]">✓</span>}
                        </div>
                        <span className="truncate">{plan.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 4: Interests & Budget */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <Sparkles className="w-4 h-4" /> 4. Travel Interests & Targeted Budget
              </h3>

              {/* INTERESTS (CHECKBOXES) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Interests (Select all that inspire you)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => {
                    const selected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3.5 py-2 rounded-full border text-xs font-medium transition-all ${
                          selected
                            ? "bg-[#cca45b] border-[#cca45b] text-[#081a13] font-bold shadow-md"
                            : "bg-[#05110b] border-emerald-950/90 text-slate-300 hover:border-slate-500 hover:text-white"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TARGETED PACKAGE BUDGET */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Targeted Package Budget (USD $)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    {BUDGET_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 5: Package Selection & Custom Places (Interactive Route Builder) */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <MapPin className="w-4 h-4" /> 5. Tour Package & Custom Places
              </h3>

              {/* PRE-SELECTED / TARGET PACKAGE */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Selected Tour Package (Optional)
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                  <select
                    value={formData.packageId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const matched = availablePackages.find((p) => p.id === selectedId);
                      setFormData({
                        ...formData,
                        packageId: selectedId,
                        packageTitle: matched ? matched.title : "100% Custom Tailor-Made Tour",
                      });
                    }}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="">100% Custom Tailor-Made Private Tour</option>
                    {availablePackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CUSTOM PLACES TAGGER / SELECTOR */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Must-Visit Places / Custom Destinations
                  </label>
                  <span className="text-[11px] text-[#cca45b]">
                    {formData.customPlaces.length} selected
                  </span>
                </div>

                {/* Popular places quick tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {POPULAR_DESTINATIONS.map((place) => {
                    const isSelected = formData.customPlaces.includes(place);
                    return (
                      <button
                        key={place}
                        type="button"
                        onClick={() => toggleCustomPlace(place)}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? "bg-[#cca45b]/20 border-[#cca45b] text-[#cca45b] font-semibold"
                            : "bg-[#05110b]/60 border-emerald-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {place}
                      </button>
                    );
                  })}
                </div>

                {/* Freeform place adder */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type any other location/place (e.g. Horton Plains, Arugam Bay)..."
                    value={customPlaceInput}
                    onChange={(e) => setCustomPlaceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomPlace(e);
                      }
                    }}
                    className="flex-1 bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPlace}
                    className="px-4 py-2 bg-[#cca45b]/15 border border-[#cca45b]/40 text-[#cca45b] hover:bg-[#cca45b]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Selected Places Badges */}
                {formData.customPlaces.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-emerald-950/60">
                    {formData.customPlaces.map((place) => (
                      <span
                        key={place}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#cca45b]/20 border border-[#cca45b]/50 text-[#cca45b] text-xs font-semibold rounded-lg"
                      >
                        <MapPin className="w-3 h-3" />
                        {place}
                        <button
                          type="button"
                          onClick={() => removeCustomPlace(place)}
                          className="hover:text-white transition cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 6: Other Requirements */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b]">
                6. Other Requirements & Special Notes
              </label>
              <textarea
                rows={3}
                placeholder="Flight details, dietary requirements, honeymoon surprises, accessibility needs, preferred vehicle type..."
                value={formData.otherRequirements}
                onChange={(e) => setFormData({ ...formData, otherRequirements: e.target.value })}
                className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-[0_6px_25px_rgba(204,164,91,0.35)] hover:shadow-[0_8px_32px_rgba(204,164,91,0.55)] cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT AND INQUIRY</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                🔒 Your personal information is kept strictly private. You will receive a verified quotation directly via email & WhatsApp.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
