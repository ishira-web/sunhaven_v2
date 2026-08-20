"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Play } from "lucide-react";

interface HeroProps {
  onOpenVideo?: () => void;
  onExploreJourneys?: () => void;
}

export default function Hero({ onOpenVideo, onExploreJourneys }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-start overflow-hidden pt-28 pb-20 md:py-0"
    >
      {/* Background Image: Sigiriya Lion Rock Fortress at Sunrise */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/sigiriya_hero_bg.jpg"
          alt="Sigiriya Lion Rock sunrise in Sri Lanka - SunHaven Lanka Luxury Journeys"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] lg:object-center transform scale-100"
        />

        {/* Multi-layer Gradient Overlays for Exact Visual Match to Reference */}
        {/* Deep forest green transition from header */}
        <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#0a2118] via-[#0a2118]/80 to-transparent z-10" />

        {/* Left-side dark emerald shadow vignette for crystalline text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07160f]/95 via-[#07160f]/75 md:via-[#07160f]/60 to-transparent w-full md:w-[70%] lg:w-[58%] z-10" />

        {/* Bottom subtle grounding vignette */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#07160f] via-[#07160f]/50 to-transparent z-10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-6 md:pt-14 pb-8">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Main Editorial Headline - Exact 3 Lines */}
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-bold tracking-[0.03em] leading-[1.12] drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]">
            <span className="block text-white">DISCOVER</span>
            <span className="block text-[#cca45b] mt-1">SRI LANKA</span>
            <span className="block text-white mt-1 whitespace-nowrap">THE SUNHAVEN WAY</span>
          </h1>

          {/* Golden Divider Accent Line */}
          <div className="w-12 sm:w-16 h-[2px] bg-[#cca45b] mt-5 sm:mt-6 mb-5 sm:mb-6 shadow-[0_0_10px_rgba(204,164,91,0.5)]" />

          {/* Editorial Subtitle Paragraph */}
          <p className="text-slate-200 text-sm sm:text-base md:text-[17px] font-normal leading-[1.65] max-w-lg font-jakarta drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Private luxury journeys across a paradise island of timeless culture,
            stunning nature and unforgettable experiences.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
            {/* Primary CTA Button: EXPLORE JOURNEYS */}
            <a
              href="#journeys"
              onClick={(e) => {
                if (onExploreJourneys) {
                  e.preventDefault();
                  onExploreJourneys();
                }
              }}
              className="group flex items-center justify-center gap-2.5 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0d2218] px-6 sm:px-7 py-3.5 rounded-lg text-xs sm:text-[13px] font-bold tracking-[0.09em] uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_18px_rgba(204,164,91,0.3)] hover:shadow-[0_6px_24px_rgba(204,164,91,0.5)] cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#0d2218] transition-transform duration-200 group-hover:scale-110" />
              <span>EXPLORE JOURNEYS</span>
            </a>

            {/* Secondary CTA Button: WATCH VIDEO */}
            <button
              onClick={onOpenVideo}
              className="group flex items-center justify-center gap-2.5 bg-black/35 hover:bg-black/55 backdrop-blur-md border border-white/40 hover:border-white text-white px-6 sm:px-7 py-3.5 rounded-lg text-xs sm:text-[13px] font-semibold tracking-[0.09em] uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-lg shadow-black/40"
            >
              <div className="w-5 h-5 rounded-full border border-white/80 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-colors">
                <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
              </div>
              <span>WATCH VIDEO</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
