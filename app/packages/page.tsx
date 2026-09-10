"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import TripPlannerModal from "@/components/TripPlannerModal";
import CustomTourRequestBanner from "@/components/CustomTourRequestBanner";
import { longDayPackages } from "@/data/longDayPackages";
import { oneDayPackages } from "@/data/oneDayPackages";
import { Clock, Users, Car, ArrowRight, Sparkles, Compass, CheckCircle2, ShieldCheck } from "lucide-react";

export default function PackagesListingPage() {
  const [activeTab, setActiveTab] = useState<"long-day" | "one-day" | "custom">("long-day");
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);

  useEffect(() => {
    const handleTabFromUrl = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "long-day" || tab === "one-day" || tab === "custom") {
          setActiveTab(tab);
        } else if (window.location.hash === "#one-day") {
          setActiveTab("one-day");
        } else if (window.location.hash === "#custom") {
          setActiveTab("custom");
        }
      }
    };

    handleTabFromUrl();
    window.addEventListener("popstate", handleTabFromUrl);
    return () => window.removeEventListener("popstate", handleTabFromUrl);
  }, []);

  const handleTabChange = (tab: "long-day" | "one-day" | "custom") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-slate-800 flex flex-col selection:bg-[#cca45b] selection:text-[#07160f]">
      <Header onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-20 bg-[#07160f] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sigiriya_hero_bg.jpg"
            alt="Sri Lanka Private Tour Packages - SunHaven Lanka"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07160f] via-[#07160f]/80 to-[#07160f]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#cca45b]/20 border border-[#cca45b]/50 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#cca45b] uppercase font-sans">
              CURATED PRIVATE TOURS
            </span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Sri Lanka Private Tour Packages
          </h1>
          <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Choose from immersive multi-day expeditions, curated single-day excursions, or design a 100% tailor-made journey.
          </p>

          {/* 3 Package Types Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            <button
              onClick={() => handleTabChange("long-day")}
              className={`px-6 py-3 rounded-xl text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "long-day"
                  ? "bg-[#cca45b] text-[#07160f] shadow-[0_4px_16px_rgba(204,164,91,0.4)]"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
              }`}
            >
              Long Day Packages (Multi-Day)
            </button>
            <button
              onClick={() => handleTabChange("one-day")}
              className={`px-6 py-3 rounded-xl text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "one-day"
                  ? "bg-[#cca45b] text-[#07160f] shadow-[0_4px_16px_rgba(204,164,91,0.4)]"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
              }`}
            >
              One Day Excursions
            </button>
            <button
              onClick={() => handleTabChange("custom")}
              className={`px-6 py-3 rounded-xl text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "custom"
                  ? "bg-[#cca45b] text-[#07160f] shadow-[0_4px_16px_rgba(204,164,91,0.4)]"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
              }`}
            >
              Custom Tailor-Made Packages
            </button>
          </div>
        </div>
      </section>

      {/* Main Packages Listing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 space-y-16">
        {activeTab === "long-day" && (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                SIGNATURE LONG DAY ITINERARIES
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#0a2118] mt-1 mb-3">
                Experience Sri Lanka at a Relaxed, Authentic Pace
              </h2>
              <div className="w-14 h-[2px] bg-[#cca45b] mx-auto mb-3" />
              <p className="text-stone-600 text-xs sm:text-sm">
                Complete multi-day journeys combining ancient kingdoms, tea estates, wildlife safaris, and tropical beaches.
              </p>
            </div>

            {/* Featured Long Day Tour: 10-Days Relaxed Tour */}
            {longDayPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Image Column */}
                <div className="lg:col-span-5 relative h-72 lg:h-auto min-h-[320px]">
                  <Image
                    src={pkg.heroImage}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 lg:hidden" />
                  <div className="absolute top-4 left-4 bg-[#0a2118] text-[#cca45b] text-xs font-bold px-3.5 py-1.5 rounded-lg border border-[#cca45b]/30">
                    {pkg.durationNightsDays}
                  </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold mb-2">
                      <span className="text-[#cca45b] uppercase tracking-wider">{pkg.pace}</span>
                      <span>•</span>
                      <span>Private Chauffeur Included</span>
                    </div>

                    <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0a2118] mb-2">
                      {pkg.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#b88e44] font-semibold mb-4">
                      {pkg.subtitle}
                    </p>

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6">
                      {pkg.overview[0]}
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 bg-[#faf6f0] p-4 rounded-xl border border-stone-200/60">
                      {pkg.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#0a2118]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                          <span className="truncate">{h.category}: {h.items[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-100">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="inline-flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <span>VIEW FULL 10-DAY ITINERARY</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setIsTripPlannerOpen(true)}
                      className="px-5 py-3 rounded-xl border border-stone-300 hover:border-[#cca45b] text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#0a2118] transition-colors cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "one-day" && (
          <div className="space-y-12">
            {oneDayPackages.map((pkg, idx) => (
              <div 
                key={pkg.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-200/60"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Image Column */}
                  <div className="lg:col-span-5 relative h-[300px] lg:h-auto overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#cca45b]" />
                      <span className="text-[10px] font-bold text-[#07160f] uppercase tracking-wider">
                        {pkg.durationTag}
                      </span>
                    </div>
                    
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold mb-2">
                        <span className="text-[#cca45b] uppercase tracking-wider">{pkg.pace}</span>
                        <span>•</span>
                        <span>Private Chauffeur Included</span>
                      </div>

                      <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0a2118] mb-2">
                        {pkg.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#b88e44] font-semibold mb-4">
                        {pkg.subtitle}
                      </p>

                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6">
                        {pkg.overview[0]}
                      </p>

                      {/* Highlights Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 bg-[#faf6f0] p-4 rounded-xl border border-stone-200/60">
                        {pkg.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#0a2118]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                            <span className="truncate">{h.category}: {h.items[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-100">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="inline-flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        <span>VIEW EXCURSION DETAILS</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "custom" && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200/80 max-w-3xl mx-auto space-y-4">
            <Sparkles className="w-12 h-12 text-[#cca45b] mx-auto" />
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0a2118]">
              100% Custom Tailor-Made Packages
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Tell us your preferred pacing, destinations, hotel styles, and dates. Our concierge will curate a private custom proposal tailored precisely to your party.
            </p>
            <button
              onClick={() => setIsTripPlannerOpen(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#cca45b] text-[#07160f] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e]"
            >
              Start Designing Custom Tour
            </button>
          </div>
        )}
      </main>

      {/* Mandatory Custom Tour Request Banner */}
      <CustomTourRequestBanner packageTitle="Sri Lanka Tour Packages" />

      <Footer onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />
      <WhatsAppWidget />
      <TripPlannerModal isOpen={isTripPlannerOpen} onClose={() => setIsTripPlannerOpen(false)} />
    </div>
  );
}
