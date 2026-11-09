"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Hotel,
  DollarSign,
  MapPin,
  Send,
  CheckCircle2,
  Plus,
  Loader2,
  Package as PackageIcon,
} from "lucide-react";

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

function InquiryFormContent() {
  const searchParams = useSearchParams();
  const packageParam = searchParams.get("package") || "";
  const placesParam = searchParams.get("places") || "";

  const [formData, setFormData] = useState(() => {
    const initialPlaces = placesParam
      ? Array.from(
          new Set(placesParam.split(",").map((p) => p.trim()).filter(Boolean))
        )
      : [];
    return {
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
      customPlaces: initialPlaces,
      otherRequirements: "",
    };
  });

  const [availablePackages, setAvailablePackages] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [customPlaceInput, setCustomPlaceInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages?published=true")
      .then((res) => (res.ok ? res.json() : { packages: [] }))
      .then((data) => {
        if (data.packages && Array.isArray(data.packages)) {
          setAvailablePackages(data.packages);
          if (packageParam) {
            const matched = data.packages.find(
              (p: { id: string; slug: string; title: string }) =>
                p.slug.toLowerCase() === packageParam.toLowerCase() ||
                p.id === packageParam ||
                p.title.toLowerCase().includes(packageParam.toLowerCase())
            );
            if (matched) {
              setFormData((prev) => ({
                ...prev,
                packageId: matched.id,
                packageTitle: matched.title,
              }));
            }
          }
        }
      })
      .catch(() => {});
  }, [packageParam]);

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
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);

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
      setFormError("Could not transmit your inquiry. Please verify your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#cca45b]/15 border border-[#cca45b]/30 px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-[#cca45b]" />
          <span className="text-xs font-bold tracking-[0.2em] text-[#cca45b] uppercase">
            Private Travel Specialist
          </span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Detailed Tour Inquiry Form
        </h1>
        <div className="w-16 h-[2px] bg-[#cca45b] mx-auto mt-4 mb-4 shadow-[0_0_10px_rgba(204,164,91,0.5)]" />
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Tell us about your holiday plans and preferred style of travel. Our destination concierge will formulate a personalized itinerary and clear quote for your approval.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#0a2118] border border-[#cca45b]/40 rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-[#cca45b]/20 border-2 border-[#cca45b] rounded-full flex items-center justify-center mx-auto text-[#cca45b]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
            Inquiry Successfully Transmitted
          </h2>
          <p className="text-slate-300 text-base max-w-lg mx-auto leading-relaxed">
            Thank you, <span className="text-[#cca45b] font-semibold">{formData.name}</span>. We have logged your request. Opening WhatsApp to connect directly with your dedicated trip curator...
          </p>
          <div className="pt-4">
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-3.5 bg-[#cca45b] text-[#07160f] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition shadow-lg shadow-[#cca45b]/20"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#081a13] border border-[#cca45b]/30 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {formError && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm">
                {formError}
              </div>
            )}

            {/* 1. Traveler Information */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-7 space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <User className="w-4 h-4" /> 1. Traveler Details & Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Country of Residence <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. United Kingdom, Germany, Switzerland"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor@luxurytravel.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    WhatsApp / Phone Number <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+44 7911 123456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Travel Dates & Group Composition */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-7 space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <Calendar className="w-4 h-4" /> 2. Dates & Group Composition
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Arrival Date (To SL) <span className="text-[#cca45b]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Departure Date (From SL) <span className="text-[#cca45b]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
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

            {/* 3. Hotel Category & Meal Plan */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-7 space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <Hotel className="w-4 h-4" /> 3. Hotel Style & Meal Plan
              </h2>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Hotel Category (Checkboxes)
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

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Meal Plan (Checkboxes)
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

            {/* 4. Interests & Budget */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-7 space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <Sparkles className="w-4 h-4" /> 4. Interests & Targeted Budget
              </h2>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Interests (Checkboxes)
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

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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

            {/* 5. Package & Custom Places */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-7 space-y-4">
              <h2 className="font-cinzel text-base font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <MapPin className="w-4 h-4" /> 5. Tour Package & Custom Destinations
              </h2>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Pre-Selected Package
                </label>
                <div className="relative">
                  <PackageIcon className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
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

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Must-Visit Places / Custom Destinations
                  </label>
                  <span className="text-[11px] text-[#cca45b]">
                    {formData.customPlaces.length} selected
                  </span>
                </div>

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

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom location name..."
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
                    <Plus className="w-3.5 h-3.5" /> Add Place
                  </button>
                </div>

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

            {/* 6. Other Requirements */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 sm:p-7 space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b]">
                6. Other Requirements & Special Notes
              </label>
              <textarea
                rows={3}
                placeholder="Flight details, dietary preferences, honeymoon arrangements, specific excursions..."
                value={formData.otherRequirements}
                onChange={(e) => setFormData({ ...formData, otherRequirements: e.target.value })}
                className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-[0_6px_25px_rgba(204,164,91,0.35)] hover:shadow-[0_8px_32px_rgba(204,164,91,0.55)] cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SUBMIT AND INQUIRY</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-[#07160f] text-slate-100 flex flex-col justify-between">
      <Header />
      <main className="pt-24 pb-16 flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin mx-auto" />
            </div>
          }
        >
          <InquiryFormContent />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
