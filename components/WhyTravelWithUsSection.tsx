"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function WhyTravelWithUsSection() {
  const features = [
    {
      title: "Private & Personalized",
      desc: "100% private journeys made around you.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#cca45b]">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Local Expertise",
      desc: "Travel with experienced local chauffeur guides.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#cca45b]">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      title: "Handpicked Experiences",
      desc: "Authentic places, hidden gems and must-see highlights.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#cca45b]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="9" y1="11" x2="11" y2="11" />
        </svg>
      ),
    },
    {
      title: "Travel in Comfort",
      desc: "Modern vehicles, carefully selected accommodation.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#cca45b]">
          <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />
          <rect x="2" y="9" width="20" height="10" rx="2" />
          <circle cx="7" cy="14" r="2" />
          <circle cx="17" cy="14" r="2" />
        </svg>
      ),
    },
  ];

  const experienceBanners = [
    {
      title: "ANCIENT HERITAGE",
      image: "/images/exp_ancient_heritage.jpg",
      alt: "Ancient Heritage temples and stupas in Sri Lanka",
    },
    {
      title: "HILL COUNTRY",
      image: "/images/nine_arch_bridge_train.jpg",
      alt: "Misty hill country tea plantations and train",
    },
    {
      title: "WILDLIFE SAFARIS",
      image: "/images/exp_wildlife_safaris.jpg",
      alt: "Majestic elephant in Sri Lanka national park",
    },
    {
      title: "BEACH PARADISE",
      image: "/images/coastal_haven_galle.jpg",
      alt: "Pristine golden beach with turquoise water",
    },
    {
      title: "CULTURE & PEOPLE",
      image: "/images/exp_culture_people.jpg",
      alt: "Traditional Sri Lankan cultural dancer",
    },
  ];

  return (
    <section id="about" className="bg-[#faf6f0] text-slate-800 border-t border-stone-200/60 overflow-hidden">
      {/* 1. Top Sub-Section: WHY TRAVEL WITH US */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Title Block */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <span className="text-xs sm:text-[13px] font-bold tracking-[0.18em] text-[#cca45b] uppercase font-sans">
              WHY TRAVEL
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0a2118] leading-tight mt-0.5 mb-2">
              WITH US
            </h2>
            <div className="w-10 h-[2px] bg-[#cca45b]" />
          </div>

          {/* Right 4 Features Grid */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-sm text-[#0a2118] leading-tight mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle Sub-Section: 5 Horizontal Experience Photo Banners */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0.5 sm:gap-1 bg-stone-200/50">
        {experienceBanners.map((exp, idx) => (
          <div
            key={idx}
            className="group relative h-44 sm:h-52 md:h-60 w-full overflow-hidden bg-stone-900 cursor-pointer"
          >
            <Image
              src={exp.image}
              alt={exp.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
            />
            {/* Bottom dark gradient for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Banner Category Title */}
            <div className="absolute bottom-4 inset-x-0 text-center px-2 z-10">
              <span className="font-bold text-xs sm:text-[13px] tracking-[0.15em] text-white uppercase drop-shadow-md">
                {exp.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Sub-Section: Guest Testimonial Banner */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Quote mark and Text */}
          <div className="flex items-start gap-4 flex-1">
            <span className="font-serif text-5xl sm:text-6xl text-[#cca45b] leading-none select-none shrink-0 -mt-2">
              “
            </span>
            <p className="text-slate-800 text-sm sm:text-[15px] md:text-base font-normal leading-relaxed font-sans">
              Our journey across Sri Lanka was absolutely unforgettable. Every detail was perfectly planned. Thank you SunHaven Lanka for the amazing memories!
            </p>
          </div>

          {/* Guest Avatar and Info */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-[#cca45b] shadow-md">
              <Image
                src="/images/testimonial_couple.jpg"
                alt="Emily & James - Australia"
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-[17px] text-[#0a2118] leading-tight">
                Emily & James
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                Australia
              </p>
              <div className="flex items-center gap-1 text-[#cca45b] mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#cca45b] text-[#cca45b]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
