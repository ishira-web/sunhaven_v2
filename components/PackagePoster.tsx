"use client";

import React from "react";
import Image from "next/image";
import { LongDayPackage } from "@/data/longDayPackages";
import { MapPin, Sparkles, Compass, ShieldCheck, Download, Share2, MessageCircle } from "lucide-react";

interface PackagePosterProps {
  pkg: LongDayPackage;
  onOpenInquiry?: () => void;
}

export default function PackagePoster({ pkg, onOpenInquiry }: PackagePosterProps) {
  const routeHighlights = [
    "Dambulla & Sigiriya 5th-Century Rock Citadel",
    "Minneriya & Yala 4x4 Leopard Safaris",
    "Nuwara Eliya High Tea & Scenic Train to Ella",
    "Galle Dutch Fort & Bentota Madu River",
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#0a2318] via-[#07160f] to-[#040e0a] text-white rounded-3xl border border-[#cca45b]/40 shadow-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">
      {/* Background Watermark / Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#cca45b]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Poster Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#cca45b]/20">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#cca45b]/20 border border-[#cca45b]/40 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3 h-3 text-[#cca45b]" />
            <span className="text-[10px] font-bold tracking-[0.22em] text-[#cca45b] uppercase">
              OFFICIAL TOUR POSTER & ROUTE MAP
            </span>
          </div>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
            {pkg.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#cca45b] font-medium mt-0.5">
            {pkg.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenInquiry}
            className="bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Request Inquiry
          </button>
        </div>
      </div>

      {/* Main Poster Body: Visual Mosaic & Route Timeline */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
        {/* Left: 4-Stop Photo Mosaic Collage */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5">
          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-md group">
            <Image
              src="/images/sigiriya_hero_bg.jpg"
              alt="Sigiriya Rock"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#cca45b] font-bold block">Day 02 Stop</span>
              <span className="text-xs font-bold text-white leading-tight">Sigiriya Lion Rock Citadel</span>
            </div>
          </div>

          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-md group">
            <Image
              src="/images/nine_arch_bridge_train.jpg"
              alt="Nine Arch Bridge"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#cca45b] font-bold block">Day 06 Stop</span>
              <span className="text-xs font-bold text-white leading-tight">Nine Arches Scenic Rail</span>
            </div>
          </div>

          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-md group">
            <Image
              src="/images/exp_wildlife_safaris.jpg"
              alt="Yala Safari"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#cca45b] font-bold block">Day 07/08 Stop</span>
              <span className="text-xs font-bold text-white leading-tight">Yala & Minneriya Safari</span>
            </div>
          </div>

          <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-white/15 shadow-md group">
            <Image
              src="/images/coastal_haven_galle.jpg"
              alt="Galle Fort & Coast"
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-left">
              <span className="text-[10px] uppercase tracking-wider text-[#cca45b] font-bold block">Day 08/09 Stop</span>
              <span className="text-xs font-bold text-white leading-tight">Galle Fort & Bentota Beach</span>
            </div>
          </div>
        </div>

        {/* Right: Route Stops Sequence */}
        <div className="lg:col-span-5 bg-[#081a12] border border-[#cca45b]/30 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#cca45b]">
              Journey Itinerary Route
            </span>
            <span className="text-[11px] bg-[#cca45b]/20 text-[#cca45b] font-bold px-2.5 py-0.5 rounded-full">
              9 Overnights
            </span>
          </div>

          <div className="space-y-3">
            {pkg.routeMapStops.map((stop, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-[#cca45b]/20 border border-[#cca45b] text-[#cca45b] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{stop.name}</span>
                    <span className="text-[11px] text-[#cca45b] font-medium">{stop.night}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{stop.keyHighlight}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Private AC Chauffeur Vehicle</span>
            <span className="text-[#cca45b] font-semibold">100% Tailor-Made</span>
          </div>
        </div>
      </div>

      {/* Poster Highlights Bar */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 border-t border-[#cca45b]/20">
        {routeHighlights.map((hl, i) => (
          <div key={i} className="flex items-center gap-2.5 bg-[#092016] border border-white/10 rounded-xl p-3 text-xs text-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#cca45b] shrink-0" />
            <span className="font-medium">{hl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
