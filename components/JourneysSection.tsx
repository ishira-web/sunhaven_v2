"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface JourneysSectionProps {
  onSelectJourney?: (journeyTitle: string) => void;
  onViewAllJourneys?: () => void;
}

export default function JourneysSection({
  onSelectJourney,
  onViewAllJourneys,
}: JourneysSectionProps) {
  const journeys = [
    {
      days: "10 DAYS",
      title: "GRAND SRI LANKA DISCOVERY",
      duration: "09 Nights / 10 Days",
      description:
        "Heritage, hill country, wildlife and beaches – the perfect first journey to Sri Lanka.",
      image: "/images/sigiriya_hero_bg.jpg",
      alt: "Sigiriya Rock Citadel at sunrise - Grand Sri Lanka Discovery",
      slug: "10-days-relaxed-private-tour",
    },
    {
      days: "12 DAYS",
      title: "GRAND SRI LANKA ODYSSEY",
      duration: "11 Nights / 12 Days",
      description:
        "A deeper exploration with ancient cities, tea country, wildlife and the south coast.",
      image: "/images/nine_arch_bridge_train.jpg",
      alt: "Nine Arch Bridge Scenic Train in Ella - Grand Sri Lanka Odyssey",
      slug: "10-days-relaxed-private-tour",
    },
    {
      days: "14 DAYS",
      title: "SRI LANKA ULTIMATE ESCAPE",
      duration: "13 Nights / 14 Days",
      description:
        "The complete island experience for those who want it all – relaxed and luxurious.",
      image: "/images/coastal_haven_galle.jpg",
      alt: "Tropical golden beach and turquoise ocean - Sri Lanka Ultimate Escape",
      slug: "10-days-relaxed-private-tour",
    },
  ];

  return (
    <section id="journeys" className="bg-[#faf6f0] text-slate-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Area Matching Exact Reference */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="text-xs sm:text-[13px] font-bold tracking-[0.2em] text-[#c09448] uppercase font-sans">
            PRIVATE LUXURY JOURNEYS
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-[44px] font-bold text-[#0c2419] mt-2 mb-3 tracking-normal">
            Handcrafted Journeys, Just for You
          </h2>

          {/* Golden Diamond Line Divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-14 sm:w-20 h-[1.5px] bg-[#cca45b]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#cca45b] shadow-[0_0_6px_rgba(204,164,91,0.4)]" />
            <div className="w-14 sm:w-20 h-[1.5px] bg-[#cca45b]" />
          </div>
        </div>

        {/* 3 Compact Journeys Cards (No excessive height, exact proportions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {journeys.map((journey, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-stone-200/80 hover:shadow-xl hover:border-[#cca45b]/50 transition-all duration-300 flex flex-col group"
            >
              {/* Top Image with Days Badge */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                <Image
                  src={journey.image}
                  alt={journey.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Exact Dark Green Pill Badge */}
                <div className="absolute top-3.5 left-3.5 bg-[#082215] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase shadow-md">
                  {journey.days}
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[14.5px] sm:text-[15px] tracking-[0.03em] text-[#0e271c] uppercase leading-snug">
                    {journey.title}
                  </h3>
                  <p className="text-stone-500 text-xs sm:text-[13px] font-medium mt-1 mb-2.5">
                    {journey.duration}
                  </p>
                  <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-4">
                    {journey.description}
                  </p>
                </div>

                {/* View Journey Link directly navigating to tour package */}
                <Link
                  href={`/packages/${journey.slug}`}
                  className="w-fit inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b88e44] hover:text-[#916b2a] transition-colors group-hover:translate-x-0.5 transform duration-200 cursor-pointer pt-2"
                >
                  <span>VIEW JOURNEY</span>
                  <span className="text-sm font-normal">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Center CTA: VIEW ALL JOURNEYS */}
        <div className="flex justify-center mt-12">
          <Link
            href="/packages"
            className="group flex items-center gap-2.5 bg-[#082215] hover:bg-[#0d3320] text-white border border-[#cca45b]/60 px-8 py-3.5 rounded-full text-xs sm:text-[13px] font-bold tracking-[0.15em] uppercase shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <div className="w-3.5 h-3.5 rotate-45 border border-[#cca45b] bg-[#cca45b]/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#cca45b]" />
            </div>
            <span>VIEW ALL JOURNEYS</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
