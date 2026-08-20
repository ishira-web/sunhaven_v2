"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Users, Hotel, Send, MessageCircle, CheckCircle2 } from "lucide-react";

interface CustomTourRequestBannerProps {
  packageTitle?: string;
}

export default function CustomTourRequestBanner({
  packageTitle = "10 Days Relaxed Private Tour",
}: CustomTourRequestBannerProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelDates: "",
    guests: "2 Adults",
    hotelCategory: "4-Star & Premium Boutique",
    mealPlan: "Bed & Breakfast + Selected Dinners",
    specialWishes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const message = `*Custom Tour & Quote Request - SunHaven Lanka*%0A%0A*Tour Reference:* ${packageTitle}%0A*Name:* ${formData.name}%0A*Phone/WhatsApp:* ${formData.phone}%0A*Email:* ${formData.email}%0A*Travel Dates:* ${formData.travelDates || "Flexible"}%0A*Group Size:* ${formData.guests}%0A*Preferred Accommodation:* ${formData.hotelCategory}%0A*Meal Plan:* ${formData.mealPlan}%0A*Special Requests:* ${formData.specialWishes || "None"}`;

    setTimeout(() => {
      window.open(`https://wa.me/94771234567?text=${message}`, "_blank");
    }, 700);
  };

  const handleWhatsAppQuickChat = () => {
    const message = `Hello SunHaven Lanka, I would like to request a personalized quote for the ${packageTitle}.`;
    window.open(`https://wa.me/94771234567?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="custom-quote-section" className="bg-[#07160f] text-slate-100 py-20 px-4 sm:px-6 lg:px-10 border-t border-[#cca45b]/20 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cca45b]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Need a Custom Tour Narrative & Pricing Philosophy */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 bg-[#cca45b]/15 border border-[#cca45b]/30 px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#cca45b] uppercase">
                TAILOR-MADE CONCIERGE
              </span>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-tight mb-4">
              Need a Custom Tour?
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mb-5 shadow-[0_0_8px_rgba(204,164,91,0.5)]" />

            <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed mb-4">
              <strong className="text-white font-semibold">Every traveler is unique, and so is every journey.</strong> If you are looking for something more personalized, we will be delighted to create a tailor-made itinerary based on your travel dates, preferred hotel category, special interests, group size, and budget.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Our travel specialists will work with you to design a seamless Sri Lankan holiday that perfectly matches your travel style.
            </p>

            {/* Personalized Quotation Card */}
            <div className="w-full bg-[#0a2318] border border-[#cca45b]/30 rounded-2xl p-5 sm:p-6 mb-6">
              <h3 className="font-cinzel text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-[#cca45b]">✦</span> Request Your Personalized Quote
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                Instead of offering rigid fixed prices, we prepare personalized quotations based on your travel dates, group size, preferred accommodation, meal plan, and travel preferences. This ensures you receive the most suitable itinerary and the best possible value for your Sri Lankan holiday.
              </p>
            </div>

            {/* Quick Direct WhatsApp Button */}
            <button
              onClick={handleWhatsAppQuickChat}
              className="group flex items-center gap-3 bg-[#0d2a1c] hover:bg-[#113825] text-slate-200 hover:text-white border border-[#cca45b]/40 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all w-full sm:w-auto"
            >
              <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-4 h-4 fill-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#cca45b] uppercase tracking-wider font-bold">Instant Concierge</span>
                <span>Chat Directly on WhatsApp</span>
              </div>
            </button>
          </div>

          {/* Right Column: Interactive Bespoke Quote Form */}
          <div className="lg:col-span-7 bg-[#0a2118]/90 backdrop-blur-xl border border-[#cca45b]/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#cca45b]/20 border border-[#cca45b] rounded-full flex items-center justify-center mx-auto text-[#cca45b]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                  Quote Request Dispatched
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name}. We have logged your request for <span className="text-[#cca45b] font-medium">{packageTitle}</span>. Our bespoke travel designers are opening WhatsApp to share your customized itinerary & proposal.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#cca45b] text-[#0a2118] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-white/10 pb-4 mb-2">
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#cca45b]">
                    Bespoke Itinerary Builder
                  </span>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Get My Personalized Quote
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Receive your customized proposal within 12 hours with transparent pricing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 7911 123456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@luxurytravel.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                      Estimated Travel Dates
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. October 2026 / 10 Days"
                      value={formData.travelDates}
                      onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                      Party / Group Size
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    >
                      <option>2 Adults (Couple / Honeymoon)</option>
                      <option>1 Adult (Solo Traveler)</option>
                      <option>Family (2 Adults + 1-2 Kids)</option>
                      <option>Small Group (4 - 6 Adults)</option>
                      <option>Private Group (7+ Adults)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                      Preferred Hotel Category
                    </label>
                    <select
                      value={formData.hotelCategory}
                      onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    >
                      <option>5-Star & Ultra Luxury Boutique</option>
                      <option>4-Star & Premium Boutique</option>
                      <option>3-Star & Comfortable Heritage</option>
                      <option>Mix of 4-Star & Luxury Tea Bungalows</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#cca45b] mb-1.5">
                    Custom Wishes, Extra Days or Preferred Destinations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about specific sights (e.g., scenic train tickets, Yala leopard safari, private catamaran, Ayurveda spa)..."
                    value={formData.specialWishes}
                    onChange={(e) => setFormData({ ...formData, specialWishes: e.target.value })}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0a2118] py-4 rounded-xl text-xs sm:text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(204,164,91,0.35)] hover:shadow-[0_6px_28px_rgba(204,164,91,0.55)] cursor-pointer mt-3 transform active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>GET MY PERSONALIZED QUOTE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
