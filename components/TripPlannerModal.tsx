"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, User, Mail, Phone, MapPin, Sparkles, Send } from "lucide-react";

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TripPlannerModal({ isOpen, onClose }: TripPlannerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelDates: "",
    duration: "7 - 10 Days",
    interests: ["Culture & Heritage", "Tea Country Estates"],
    passengers: "2 Adults",
    specialRequests: "",
  });

  const [submitted, setSubmitted] = useState(false);

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

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // WhatsApp direct redirect option
    const message = `*New Trip Inquiry - SunHaven Lanka*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Email:* ${formData.email}%0A*Duration:* ${formData.duration}%0A*Passengers:* ${formData.passengers}%0A*Dates:* ${formData.travelDates}%0A*Interests:* ${formData.interests.join(", ")}%0A*Requests:* ${formData.specialRequests}`;
    setTimeout(() => {
      window.open(`https://wa.me/94771234567?text=${message}`, "_blank");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#0a2118] border border-[#cca45b]/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-[#cca45b] text-slate-300 hover:text-[#0a2118] flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#cca45b]">
            Bespoke Concierge
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1">
            Design Your Private Journey
          </h2>
          <div className="w-12 h-[2px] bg-[#cca45b] mx-auto mt-3 mb-2" />
          <p className="text-xs sm:text-sm text-slate-300">
            Tell us your travel dream and our luxury travel specialists will craft a tailored itinerary.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#cca45b]/20 border border-[#cca45b] rounded-full flex items-center justify-center mx-auto text-[#cca45b]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Inquiry Received
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Thank you, {formData.name}. Opening WhatsApp concierge to connect you directly with your personal travel curator...
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#cca45b] text-[#0a2118] rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#cca45b] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lorde Harrington"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#cca45b] mb-1.5">
                  WhatsApp / Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+44 7911 123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#cca45b] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@luxury.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#cca45b] mb-1.5">
                  Preferred Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                >
                  <option>3 - 5 Days (Mini Escape)</option>
                  <option>7 - 10 Days (Signature Odyssey)</option>
                  <option>12 - 16 Days (Grand Sri Lanka)</option>
                  <option>Custom Bespoke Length</option>
                </select>
              </div>
            </div>

            {/* Travel Experiences & Highlights */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#cca45b] mb-2">
                Curated Highlights of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Culture & Heritage",
                  "Sigiriya & Ancient Cities",
                  "Tea Country Estates",
                  "Wildlife Leopard Safari",
                  "Galle Fort & Beaches",
                  "Ayurveda & Wellness",
                  "Helicopter Scenic Transfer",
                ].map((item) => {
                  const selected = formData.interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selected
                          ? "bg-[#cca45b] text-[#0a2118] border-[#cca45b] font-semibold"
                          : "bg-white/5 border-white/15 text-slate-300 hover:border-[#cca45b]/50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#cca45b] mb-1.5">
                Special Wishes / Travel Dates
              </label>
              <textarea
                rows={2}
                placeholder="Approximate travel dates, boutique hotel preferences, or private guide requirements..."
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0a2118] py-3.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-[#cca45b]/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Connect with Concierge</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
