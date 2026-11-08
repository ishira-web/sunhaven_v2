"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
      title: "Handpicked Stays",
      desc: "Boutique, heritage and luxury properties.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#cca45b]">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      title: "Chauffeur Fleet",
      desc: "Dedicated luxury private air-conditioned vehicles.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-8 h-8 text-[#cca45b]">
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1L1 14v5a1 1 0 0 0 1 1h2" />
          <circle cx="6.5" cy="16.5" r="2.5" />
          <circle cx="16.5" cy="16.5" r="2.5" />
        </svg>
      ),
    },
  ];

  const experienceBanners = [
    {
      slug: "ancient-heritage",
      title: "ANCIENT HERITAGE",
      subtitle: "Sacred Cities & Rock Citadels",
      image: "/images/exp_ancient_heritage.jpg",
      alt: "Ancient Heritage temples and stupas in Sri Lanka",
    },
    {
      slug: "hill-country",
      title: "HILL COUNTRY",
      subtitle: "Tea Valleys & Scenic Rail",
      image: "/images/nine_arch_bridge_train.jpg",
      alt: "Misty hill country tea plantations and train",
    },
    {
      slug: "wildlife-safaris",
      title: "WILDLIFE SAFARIS",
      subtitle: "Leopards & Elephant Herds",
      image: "/images/exp_wildlife_safaris.jpg",
      alt: "Majestic elephant in Sri Lanka national park",
    },
    {
      slug: "beach-paradise",
      title: "BEACH PARADISE",
      subtitle: "Golden Sands & Colonial Forts",
      image: "/images/coastal_haven_galle.jpg",
      alt: "Pristine golden beach with turquoise water",
    },
    {
      slug: "culture-people",
      title: "CULTURE & PEOPLE",
      subtitle: "Living Arts & Island Warmth",
      image: "/images/exp_culture_people.jpg",
      alt: "Traditional Sri Lankan cultural dancer",
    },
  ];

  return (
    <section id="about" className="scroll-mt-16 bg-[#faf6f0] text-slate-800 border-t border-stone-200/60 overflow-hidden">
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
      <div id="experiences" className="scroll-mt-24 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0.5 sm:gap-1 bg-stone-200/50">
        {experienceBanners.map((exp) => (
          <Link
            key={exp.slug}
            href={`/experiences/${exp.slug}`}
            className="group relative h-44 sm:h-52 md:h-60 w-full overflow-hidden bg-stone-900 cursor-pointer block"
          >
            <Image
              src={exp.image}
              alt={exp.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
            />
            {/* Bottom dark gradient for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

            {/* Banner Category Title & Explore Badge */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-center z-10 flex flex-col items-center justify-end">
              <span className="font-bold text-xs sm:text-[13px] tracking-[0.15em] text-white uppercase drop-shadow-md group-hover:text-[#cca45b] transition-colors">
                {exp.title}
              </span>
              <span className="text-[10px] text-stone-300 font-medium tracking-wide mt-0.5 hidden sm:block opacity-85 group-hover:opacity-100 transition-opacity">
                {exp.subtitle}
              </span>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#cca45b] opacity-0 group-hover:opacity-100 transform -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <span>VIEW EXPERIENCE</span>
                <span className="text-xs">→</span>
              </div>
            </div>
          </Link>
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
