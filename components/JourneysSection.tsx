"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface JourneysSectionProps {
  onSelectJourney?: (journeyTitle: string) => void;
  onViewAllJourneys?: () => void;
}

interface DynamicPackage {
  id: string;
  slug: string;
  type: string;
  title: string;
  durationTag: string;
  durationNightsDays?: string;
  subtitle?: string;
  overview: string[] | string;
  heroImage: string;
  posterImage?: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function JourneysSection({
  onSelectJourney,
  onViewAllJourneys,
}: JourneysSectionProps) {
  const [packages, setPackages] = useState<DynamicPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/packages?featured=true&published=true")
      .then((res) => (res.ok ? res.json() : { packages: [] }))
      .then((data) => {
        if (isMounted) {
          if (data.packages && Array.isArray(data.packages)) {
            setPackages(data.packages);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load featured packages:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getPackageDescription = (pkg: DynamicPackage): string => {
    if (Array.isArray(pkg.overview) && pkg.overview.length > 0 && typeof pkg.overview[0] === "string") {
      return pkg.overview[0];
    }
    if (typeof pkg.overview === "string" && pkg.overview.trim().length > 0) {
      return pkg.overview;
    }
    return pkg.subtitle || "Handcrafted private journey across Sri Lanka's most iconic landscapes and heritage.";
  };

  return (
    <section id="journeys" className="scroll-mt-16 bg-[#faf6f0] text-slate-800 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#cca45b]/15 border border-[#cca45b]/40 px-3.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#b88e44] uppercase font-sans">
              FEATURED SIGNATURE TOURS
            </span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-[44px] font-bold text-[#0c2419] mt-1 mb-3 tracking-normal">
            Handcrafted Journeys, Just for You
          </h2>

          {/* Golden Diamond Line Divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-14 sm:w-20 h-[1.5px] bg-[#cca45b]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#cca45b] shadow-[0_0_6px_rgba(204,164,91,0.4)]" />
            <div className="w-14 sm:w-20 h-[1.5px] bg-[#cca45b]" />
          </div>
        </div>

        {/* Loading State: Luxury Skeleton Cards */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-stone-200/80 animate-pulse flex flex-col"
              >
                <div className="h-48 sm:h-52 bg-stone-200" />
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                    <div className="h-3 bg-stone-100 rounded w-full" />
                    <div className="h-3 bg-stone-100 rounded w-5/6" />
                  </div>
                  <div className="h-4 bg-stone-200 rounded w-1/3 pt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Featured Packages Cards */}
        {!loading && packages.length > 0 && (
          <div
            className={`grid gap-6 lg:gap-8 items-stretch ${
              packages.length === 1
                ? "grid-cols-1 max-w-lg mx-auto"
                : packages.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-stone-200/80 hover:shadow-xl hover:border-[#cca45b]/50 transition-all duration-300 flex flex-col group"
              >
                {/* Top Image with Days & Featured Badges */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={pkg.heroImage || pkg.posterImage || "/images/sigiriya_hero_bg.jpg"}
                    alt={`${pkg.title} - SunHaven Lanka`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Green Pill Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-[#082215] text-white text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase shadow-md">
                    {pkg.durationTag || "FEATURED TOUR"}
                  </div>

                  {/* Highlight Pill Badge */}
                  <div className="absolute top-3.5 right-3.5 bg-[#cca45b] text-[#082215] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>HIGHLIGHT</span>
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[14.5px] sm:text-[15px] tracking-[0.03em] text-[#0e271c] uppercase leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-[#b88e44] text-xs sm:text-[13px] font-semibold mt-1 mb-2.5">
                      {pkg.durationNightsDays || pkg.durationTag}
                    </p>
                    <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-4 line-clamp-3">
                      {getPackageDescription(pkg)}
                    </p>
                  </div>

                  {/* View Journey Link directly navigating to tour package */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      onClick={() => {
                        if (onSelectJourney) onSelectJourney(pkg.title);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b88e44] hover:text-[#916b2a] transition-colors group-hover:translate-x-0.5 transform duration-200 cursor-pointer"
                    >
                      <span>VIEW FULL JOURNEY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (if no packages are marked as featured) */}
        {!loading && packages.length === 0 && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-stone-200/80 max-w-xl mx-auto shadow-sm space-y-3">
            <Sparkles className="w-10 h-10 text-[#cca45b] mx-auto mb-2" />
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#0c2419]">
              Curating Featured Journeys
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
              Explore our complete collection of private multi-day itineraries and single-day excursions.
            </p>
            <div className="pt-2">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                <span>EXPLORE ALL PACKAGES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Center CTA: VIEW ALL JOURNEYS */}
        <div className="flex justify-center mt-12">
          <Link
            href="/packages"
            onClick={() => {
              if (onViewAllJourneys) onViewAllJourneys();
            }}
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
