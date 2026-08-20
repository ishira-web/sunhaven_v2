"use client";

import React from "react";
import Image from "next/image";
import { Radio, Clock, UserCheck, Car, ArrowRight } from "lucide-react";

interface AirportTransfersSectionProps {
  onBookTransfer?: () => void;
  onViewAllTransfers?: () => void;
}

export default function AirportTransfersSection({
  onBookTransfer,
  onViewAllTransfers,
}: AirportTransfersSectionProps) {
  const vehicles = [
    {
      type: "CAR",
      guests: "1 – 3 Guests",
      description: "Ideal for couples or solo travelers.",
      image: "/images/car.png",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#22c55e]">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
    {
      type: "MINIVAN",
      guests: "4 – 6 Guests",
      description: "Perfect for families and small groups.",
      image: "/images/min-van.jpg",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#22c55e]">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M6 18h12" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="9" y1="6" x2="9" y2="12" />
        </svg>
      ),
    },
    {
      type: "LUXURY VAN",
      guests: "7 – 12 Guests",
      description: "Spacious & comfortable for larger groups.",
      image: "/images/luxury-van.jfif",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#22c55e]">
          <path d="M4 17h16" />
          <rect x="3" y="5" width="18" height="13" rx="2" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
          <line x1="3" y1="11" x2="21" y2="11" />
          <line x1="8" y1="5" x2="8" y2="11" />
          <line x1="14" y1="5" x2="14" y2="11" />
        </svg>
      ),
    },
  ];

  return (
    <section id="transfers" className="bg-[#081e14] py-20 px-4 sm:px-6 lg:px-10 border-t border-[#cca45b]/15 text-slate-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Description, Features & Primary CTA */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Gold Plane Icon */}
            <div className="mb-3">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 text-[#cca45b] transform -rotate-45"
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] font-bold tracking-[0.18em] text-[#cca45b] uppercase font-sans mb-1.5">
              ARRIVE IN SRI LANKA WITH EASE
            </p>

            {/* Main Title */}
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight mb-3">
              Airport Transfers
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mb-8">
              Comfortable private transfers from Bandaranaike International Airport to anywhere in Sri Lanka.
            </p>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg mb-8">
              {/* Feature 1: Meet & Greet */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-[#cca45b]/40 flex items-center justify-center text-[#cca45b] mb-2 bg-[#0a261a]/60">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-200 font-medium leading-tight">
                  Meet & Greet Service
                </span>
              </div>

              {/* Feature 2: Flight Monitoring */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-[#cca45b]/40 flex items-center justify-center text-[#cca45b] mb-2 bg-[#0a261a]/60">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-200 font-medium leading-tight">
                  Flight Monitoring
                </span>
              </div>

              {/* Feature 3: 24/7 Support */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-[#cca45b]/40 flex items-center justify-center text-[#cca45b] mb-2 bg-[#0a261a]/60">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-200 font-medium leading-tight">
                  24/7 Support
                </span>
              </div>

              {/* Feature 4: Clean & Comfortable Vehicles */}
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-[#cca45b]/40 flex items-center justify-center text-[#cca45b] mb-2 bg-[#0a261a]/60">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-200 font-medium leading-tight">
                  Clean & Comfortable Vehicles
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onBookTransfer}
              className="group flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#081e14] px-6 sm:px-7 py-3.5 rounded-lg text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_16px_rgba(204,164,91,0.3)] hover:shadow-[0_6px_22px_rgba(204,164,91,0.5)] cursor-pointer"
            >
              <span>BOOK AIRPORT TRANSFER</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column: 3 Vehicle Cards */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {vehicles.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-white text-slate-800 rounded-2xl overflow-hidden shadow-lg border border-stone-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  {/* Vehicle Image */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={v.image}
                      alt={`${v.type} - SunHaven Lanka Airport Transfer`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Overlapping Vehicle Badge Icon */}
                  <div className="relative -mt-6 ml-5 z-10">
                    <div className="w-11 h-11 rounded-full bg-[#082215] border-2 border-white shadow-md flex items-center justify-center">
                      {v.icon}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="pt-2 pb-6 px-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[15px] uppercase tracking-wide text-[#0b1f16]">
                        {v.type}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5 mb-2.5">
                        {v.guests}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Center Link */}
            <div className="flex justify-center mt-8">
              <button
                onClick={onViewAllTransfers}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#cca45b] hover:text-[#e0bb72] transition-colors cursor-pointer group"
              >
                <span>VIEW ALL TRANSFER OPTIONS</span>
                <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
