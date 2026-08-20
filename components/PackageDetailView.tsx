"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LongDayPackage } from "@/data/longDayPackages";
import ItineraryTimeline from "./ItineraryTimeline";
import PackagePoster from "./PackagePoster";
import PackageFAQ from "./PackageFAQ";
import CustomTourRequestBanner from "./CustomTourRequestBanner";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";
import TripPlannerModal from "./TripPlannerModal";
import {
  Calendar,
  Clock,
  Car,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  ShieldCheck,
  Award,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Landmark,
  Trees,
  Sun,
  ChevronRight,
  Map,
} from "lucide-react";

interface PackageDetailViewProps {
  pkg: LongDayPackage;
}

export default function PackageDetailView({ pkg }: PackageDetailViewProps) {
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getHighlightIcon = (name: string) => {
    switch (name) {
      case "Landmark":
        return <Landmark className="w-5 h-5 text-[#cca45b]" />;
      case "Trees":
        return <Trees className="w-5 h-5 text-[#cca45b]" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-[#cca45b]" />;
      case "Sun":
        return <Sun className="w-5 h-5 text-[#cca45b]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#cca45b]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-slate-800 flex flex-col selection:bg-[#cca45b] selection:text-[#07160f]">
      {/* Header */}
      <Header onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-20 bg-[#07160f] text-white overflow-hidden">
        {/* Hero Background with High Contrast Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src={pkg.heroImage}
            alt={pkg.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07160f] via-[#07160f]/80 to-[#07160f]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-6 font-medium">
            <Link href="/" className="hover:text-[#cca45b] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link href="/packages" className="hover:text-[#cca45b] transition-colors">
              Long Day Packages
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#cca45b] truncate max-w-xs sm:max-w-md">
              {pkg.durationNightsDays} Tour
            </span>
          </nav>

          {/* Title & Badge */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#cca45b]/20 border border-[#cca45b]/50 px-3.5 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-[#cca45b] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#cca45b] uppercase font-sans">
                {pkg.durationNightsDays} PRIVATE JOURNEY
              </span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.1] mb-4">
              {pkg.title}
            </h1>

            <p className="font-sans text-base sm:text-lg md:text-xl text-[#cca45b] font-medium mb-6">
              {pkg.subtitle}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection("custom-quote-section")}
                className="flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-6 sm:px-7 py-3.5 rounded-xl text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(204,164,91,0.35)] cursor-pointer"
              >
                <span>REQUEST INQUIRY</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("poster-section")}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-[13px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Map className="w-4 h-4 text-[#cca45b]" />
                <span>View Route Poster</span>
              </button>

              <a
                href={`https://wa.me/94771234567?text=${encodeURIComponent(`Hello SunHaven Lanka, I would like to inquire about the ${pkg.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-black/40 hover:bg-black/60 border border-white/25 text-white px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-[13px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat with Curator</span>
              </a>
            </div>
          </div>

          {/* Key Tour Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
            <div className="bg-[#0b2218]/70 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[#cca45b] mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Duration</span>
              </div>
              <p className="text-sm font-bold text-white">{pkg.durationNightsDays}</p>
            </div>

            <div className="bg-[#0b2218]/70 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[#cca45b] mb-1">
                <Compass className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Travel Pace</span>
              </div>
              <p className="text-sm font-bold text-white">{pkg.pace}</p>
            </div>

            <div className="bg-[#0b2218]/70 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[#cca45b] mb-1">
                <Car className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Vehicle</span>
              </div>
              <p className="text-sm font-bold text-white">Private Luxury AC Chauffeur</p>
            </div>

            <div className="bg-[#0b2218]/70 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-[#cca45b] mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Ideal For</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{pkg.idealFor}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky In-Page Navigation Bar */}
      <div className="sticky top-[68px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {[
              { id: "overview", label: "Overview" },
              { id: "poster-section", label: "Tour Poster" },
              { id: "highlights", label: "Highlights" },
              { id: "itinerary", label: "Stops & Itinerary" },
              { id: "inclusions", label: "Inclusions" },
              { id: "accommodation", label: "Accommodation" },
              { id: "why-choose", label: "Why Choose" },
              { id: "faqs", label: "FAQs" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0a2118] text-[#cca45b]"
                    : "text-stone-600 hover:text-[#0a2118] hover:bg-stone-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToSection("custom-quote-section")}
            className="shrink-0 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Get Custom Quote
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20 flex-1">
        {/* 1. Overview Section */}
        <section id="overview" className="scroll-mt-36">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                THE EXPERIENCE
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#0a2118] mt-1 mb-4">
                Experience Sri Lanka at a Comfortable but Active Pace
              </h2>
              <div className="w-14 h-[2px] bg-[#cca45b] mb-6" />

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                {pkg.overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Package Poster & Visual Route Map */}
        <section id="poster-section" className="scroll-mt-36">
          <PackagePoster pkg={pkg} onOpenInquiry={() => setIsTripPlannerOpen(true)} />
        </section>

        {/* 3. Tour Highlights (4 Categories Grid) */}
        <section id="highlights" className="scroll-mt-36">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
              CURATED EXPERIENCES
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#0a2118] mt-1 mb-3">
              Tour Highlights
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mx-auto mb-3" />
            <p className="text-stone-600 text-xs sm:text-sm">
              Carefully curated cultural wonders, wildlife expeditions, and scenic landmarks included in this itinerary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pkg.highlights.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#cca45b]/50 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-[#faf6f0] border border-[#cca45b]/30 flex items-center justify-center">
                    {getHighlightIcon(cat.iconName)}
                  </div>
                  <h3 className="font-bold text-base text-[#0a2118] leading-tight">
                    {cat.category}
                  </h3>
                </div>

                <ul className="space-y-2.5 flex-1 text-xs sm:text-[13px] text-slate-700">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#22c55e] font-bold text-sm leading-none mt-0.5">✔</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Day-by-Day Stops & Itinerary (Timeline with Stop Photos) */}
        <section id="itinerary" className="scroll-mt-36">
          <ItineraryTimeline itinerary={pkg.itinerary} />
        </section>

        {/* 5. Inclusions & Exclusions Side-by-Side */}
        <section id="inclusions" className="scroll-mt-36">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
              TRANSPARENT VALUE
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#0a2118] mt-1 mb-3">
              Tour Inclusions & Exclusions
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mx-auto mb-3" />
            <p className="text-stone-600 text-xs sm:text-sm">
              Clear, transparent terms with no hidden surprises during your private tour.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tour Includes Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/15 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#0a2118]">
                    Tour Includes
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold">Standard in every private package</span>
                </div>
              </div>

              <ul className="space-y-3.5">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="text-emerald-600 font-bold text-base leading-none shrink-0 mt-0.5">✔</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tour Excludes Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-100">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#0a2118]">
                    Tour Excludes
                  </h3>
                  <span className="text-xs text-stone-500 font-semibold">Personal or optional items</span>
                </div>
              </div>

              <ul className="space-y-3.5">
                {pkg.excludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                    <span className="text-rose-400 font-bold text-base leading-none shrink-0 mt-0.5">✘</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Accommodation Section */}
        <section id="accommodation" className="scroll-mt-36">
          <div className="bg-[#0a2118] text-white rounded-3xl p-8 sm:p-12 border border-[#cca45b]/30 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                REST IN ELEGANCE
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1 mb-4">
                {pkg.accommodation.title}
              </h2>
              <div className="w-14 h-[2px] bg-[#cca45b] mb-6" />

              <div className="space-y-3 text-slate-200 text-xs sm:text-sm leading-relaxed">
                {pkg.accommodation.description.map((desc, i) => (
                  <p key={i}>{desc}</p>
                ))}
              </div>
            </div>

            {/* Hotel Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {pkg.accommodation.hotelTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-[#07160f]/80 backdrop-blur-sm border border-white/15 hover:border-[#cca45b]/60 rounded-2xl p-6 transition-all"
                >
                  <Building2 className="w-6 h-6 text-[#cca45b] mb-3" />
                  <h3 className="font-bold text-base text-white mb-2 font-cinzel">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Why Choose This Journey? */}
        <section id="why-choose" className="scroll-mt-36">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                  THE SUNHAVEN PROMISE
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#0a2118]">
                  {pkg.whyChooseThisJourney.title}
                </h2>
                <div className="w-14 h-[2px] bg-[#cca45b] mb-4" />

                <div className="space-y-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {pkg.whyChooseThisJourney.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#faf6f0] border border-[#cca45b]/30 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-cinzel text-base font-bold text-[#0a2118] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#cca45b]" />
                  <span>Signature Standard Checklist</span>
                </h3>

                <ul className="space-y-3">
                  {pkg.whyChooseThisJourney.bulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0a2118] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#cca45b] shrink-0 mt-0.5" />
                      <span className="leading-snug">{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Frequently Asked Questions */}
        <section id="faqs" className="scroll-mt-36">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#0a2118] mt-1 mb-3">
              Frequently Asked Questions
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mx-auto mb-3" />
            <p className="text-stone-600 text-xs sm:text-sm">
              Everything you need to know about customizing, booking, and experiencing this private tour.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <PackageFAQ faqs={pkg.faqs} />
          </div>
        </section>
      </main>

      {/* 9. Bottom Mandatory Ask Custom Tour Banner */}
      <CustomTourRequestBanner packageTitle={pkg.title} />

      {/* Footer */}
      <Footer onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      {/* WhatsApp Floating Widget */}
      <WhatsAppWidget />

      {/* Bespoke Concierge Modal */}
      <TripPlannerModal isOpen={isTripPlannerOpen} onClose={() => setIsTripPlannerOpen(false)} />
    </div>
  );
}
