"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ItineraryDay } from "@/data/longDayPackages";
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, BedDouble, Camera } from "lucide-react";

interface ItineraryTimelineProps {
  itinerary: ItineraryDay[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  // By default, open days 1, 2, 3
  const [openDays, setOpenDays] = useState<number[]>([1, 2, 3]);

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAll = () => {
    setOpenDays(itinerary.map((d) => d.dayNumber));
  };

  const collapseAll = () => {
    setOpenDays([]);
  };

  return (
    <div className="space-y-6">
      {/* Controls header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#cca45b]">
            DETAILED STOPS & EXPERIENCES
          </span>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#0a2118] mt-0.5">
            Day-by-Day Stops & Itinerary
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-md bg-stone-100 hover:bg-[#cca45b]/20 text-[#0a2118] font-semibold transition-colors cursor-pointer"
          >
            Expand All Stops
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-md bg-stone-100 hover:bg-[#cca45b]/20 text-stone-600 font-semibold transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative pl-4 sm:pl-8 border-l-2 border-[#cca45b]/30 space-y-8 ml-2 sm:ml-4">
        {itinerary.map((day) => {
          const isOpen = openDays.includes(day.dayNumber);

          return (
            <div
              key={day.dayNumber}
              className="relative bg-white rounded-3xl border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:border-[#cca45b]/70"
            >
              {/* Timeline marker node on left line */}
              <div className="absolute -left-[27px] sm:-left-[43px] top-6 w-6 h-6 rounded-full bg-[#0a2118] border-2 border-[#cca45b] flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                {day.dayNumber}
              </div>

              {/* Day Header Bar / Accordion trigger */}
              <button
                type="button"
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="bg-[#0a2118] text-[#cca45b] text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase font-sans shadow-sm">
                      DAY {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-[#cca45b]" />
                      <span>{day.overnightStay}</span>
                    </span>
                    <span className="text-xs font-semibold text-[#b88e44] bg-[#faf6f0] border border-[#cca45b]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{day.stopLocation}</span>
                    </span>
                  </div>

                  <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#0a2118] leading-snug">
                    {day.title}
                  </h4>

                  {day.subtitle && (
                    <p className="text-xs sm:text-[13px] text-stone-500 font-medium font-sans">
                      {day.subtitle}
                    </p>
                  )}
                </div>

                <div className="shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[#0a2118] mt-1">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#0a2118]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#0a2118]" />
                  )}
                </div>
              </button>

              {/* Day Content Body with Stop Image */}
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-5 animate-in fade-in duration-200">
                  {/* Stop Image Banner */}
                  {day.image && (
                    <div className="relative h-52 sm:h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-md group">
                      <Image
                        src={day.image}
                        alt={day.imageAlt || `${day.title} stop image`}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Overlaid Stop Tag */}
                      <div className="absolute top-3.5 left-3.5 bg-[#0a2118]/90 backdrop-blur-md border border-[#cca45b]/40 text-[#cca45b] text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Day {day.dayNumber} Stop: {day.stopLocation}</span>
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4 text-white">
                        <span className="text-xs sm:text-sm font-semibold tracking-wide block drop-shadow-md">
                          {day.title}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Paragraphs */}
                  <div className="space-y-2.5 text-slate-700 text-xs sm:text-[14px] leading-relaxed">
                    {day.description.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Day Highlights Checklist */}
                  {day.highlights && day.highlights.length > 0 && (
                    <div className="bg-[#faf6f0] border border-[#cca45b]/20 rounded-xl p-4">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#b88e44] mb-2.5">
                        Day {day.dayNumber} Key Experiences & Highlights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {day.highlights.map((hl, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs sm:text-[13px] text-[#0a2118] font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overnight stay footer strip */}
                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500 gap-2">
                    <span className="flex items-center gap-1.5 font-medium text-[#0a2118]">
                      <MapPin className="w-3.5 h-3.5 text-[#cca45b]" />
                      <strong>Overnight Stay:</strong> {day.overnightStay}
                    </span>
                    <span className="text-[11px] text-stone-400">Private Chauffeur & Vehicle Included</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
