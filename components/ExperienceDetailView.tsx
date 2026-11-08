"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";
import TripPlannerModal from "./TripPlannerModal";
import CustomTourRequestBanner from "./CustomTourRequestBanner";
import { Experience, experiencesData } from "@/data/experiencesData";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Compass,
  Sun,
  ShieldCheck,
  Award,
  Info,
} from "lucide-react";

interface ExperienceDetailViewProps {
  experience: Experience;
}

export default function ExperienceDetailView({
  experience,
}: ExperienceDetailViewProps) {
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);

  // Other experiences for the bottom carousel / switcher
  const otherExperiences = experiencesData.filter(
    (e) => e.slug !== experience.slug
  );

  return (
    <div className="min-h-screen bg-[#faf6f0] text-slate-800 flex flex-col selection:bg-[#cca45b] selection:text-[#07160f]">
      {/* SunHaven Luxury Header */}
      <Header onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-16 md:pt-36 md:pb-24 bg-[#07160f] text-white overflow-hidden">
        {/* Background Image with High Contrast Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={experience.heroImage}
            alt={experience.title}
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
            <Link href="/#experiences" className="hover:text-[#cca45b] transition-colors">
              Experiences
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#cca45b] truncate max-w-xs sm:max-w-md">
              {experience.shortTitle}
            </span>
          </nav>

          {/* Title & Badge */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#cca45b]/20 border border-[#cca45b]/50 px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#cca45b] uppercase font-sans">
                SIGNATURE SRI LANKA EXPERIENCE
              </span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.1] mb-4">
              {experience.title}
            </h1>

            <p className="font-sans text-base sm:text-lg md:text-xl text-[#cca45b] font-medium mb-6 leading-relaxed">
              {experience.subtitle}
            </p>

            <p className="font-sans text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {experience.tagline}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsTripPlannerOpen(true)}
                className="flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-6 sm:px-7 py-3.5 rounded-xl text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(204,164,91,0.35)] cursor-pointer"
              >
                <span>PLAN THIS EXPERIENCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#curated-tours"
                className="px-6 py-3.5 rounded-xl border border-white/20 hover:border-[#cca45b] text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                View Matching Tours
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary Pill Bar */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3.5 sm:border-r sm:border-stone-200 sm:pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0a2118] text-[#cca45b] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Recommended Pacing
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0a2118]">
                {experience.durationRecommended}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:border-r sm:border-stone-200 sm:pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#0a2118] text-[#cca45b] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Best Time to Visit
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0a2118] truncate">
                {experience.bestTimeToVisit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0a2118] text-[#cca45b] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Service Standard
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0a2118]">
                100% Private Chauffeur Guide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 flex-1">
        {/* 1. In-Depth Experiential Narrative */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/80 shadow-sm">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                IMMERSIVE TRAVEL PERSPECTIVE
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a2118] mt-1 mb-4">
                The Essence of {experience.title}
              </h2>
              <div className="w-14 h-[2px] bg-[#cca45b] mb-6" />
            </div>

            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
              {experience.overview.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-base sm:text-lg text-stone-800 font-medium leading-relaxed" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#faf6f0] border border-stone-200 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-[#b88e44] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0a2118] uppercase tracking-wider mb-1">
                  Weather & Seasonal Guidance
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {experience.weatherNotes}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Highlights Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
              ICONIC SIGHTS & EXPERIENCES
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a2118] mt-1 mb-2">
              Must-Experience Destinations
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mx-auto mb-3" />
            <p className="text-stone-600 text-xs sm:text-sm">
              Carefully curated locations that showcase the very best of this journey style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {experience.highlights.map((h, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={h.image}
                    alt={h.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-[#082215]/90 backdrop-blur text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-[#cca45b]" />
                    <span>{h.location}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#0a2118] mb-2 group-hover:text-[#b88e44] transition-colors">
                      {h.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {h.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Authentic Experiential Activities & Practical Travel Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Authentic Curated Activities */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a2118] text-[#cca45b] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                  EXCLUSIVE ARRANGEMENTS
                </span>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#0a2118]">
                  Curated Private Activities
                </h3>
              </div>
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Every SunHaven Lanka itinerary is tailored with moments that transcend typical sightseeing:
            </p>

            <ul className="space-y-3.5">
              {experience.curatedActivities.map((act, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Travel Advice & Insider Tips */}
          <div className="lg:col-span-5 bg-[#0a2118] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#cca45b]/30 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#cca45b] text-[#0a2118] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
                  INSIDER TIPS
                </span>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white">
                  Practical Travel Advice
                </h3>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Essential guidance formulated by our private concierge team for this region:
            </p>

            <div className="space-y-4">
              {experience.travelTips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cca45b] shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsTripPlannerOpen(true)}
                className="w-full bg-[#cca45b] hover:bg-[#d9b46e] text-[#0a2118] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer text-center"
              >
                Inquire With Our Specialist
              </button>
            </div>
          </div>
        </div>

        {/* 4. Curated Private Tours Matching This Experience */}
        <section id="curated-tours" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
              READY-TO-TRAVEL ITINERARIES
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a2118] mt-1 mb-2">
              Featured Tours Featuring This Experience
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mx-auto mb-3" />
            <p className="text-stone-600 text-xs sm:text-sm">
              Embark on a private handcrafted itinerary tailored with private vehicle, chauffeur, and handpicked hotels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {experience.relatedPackageSlugs.map((pkg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#cca45b]/15 text-[#0a2118] text-[11px] font-bold px-3 py-1 rounded-md mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" />
                    <span>{pkg.duration}</span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#0a2118] mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    A comprehensive private journey incorporating this experience alongside Sri Lanka&apos;s most magnificent cultural and natural marvels.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#cca45b] hover:text-[#b88e44] transition-colors"
                  >
                    <span>VIEW TOUR DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setIsTripPlannerOpen(true)}
                    className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#0a2118] transition-colors cursor-pointer"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Explore Other Sri Lanka Experiences Switcher */}
        <section className="pt-12 border-t border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#cca45b]">
              MORE ISLAND WONDERS
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0a2118] mt-1 mb-2">
              Explore Other Sri Lanka Experiences
            </h2>
            <div className="w-14 h-[2px] bg-[#cca45b] mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherExperiences.map((other) => (
              <Link
                key={other.id}
                href={`/experiences/${other.slug}`}
                className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <Image
                  src={other.heroImage}
                  alt={other.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 inset-x-0 text-center px-2">
                  <span className="font-bold text-[11px] sm:text-xs tracking-wider text-white uppercase drop-shadow-md group-hover:text-[#cca45b] transition-colors">
                    {other.shortTitle}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Mandatory Custom Tour Banner */}
      <CustomTourRequestBanner packageTitle={experience.title} />

      {/* Footer */}
      <Footer onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      {/* Floating WhatsApp Widget & Trip Planner Modal */}
      <WhatsAppWidget />
      <TripPlannerModal
        isOpen={isTripPlannerOpen}
        onClose={() => setIsTripPlannerOpen(false)}
      />
    </div>
  );
}
