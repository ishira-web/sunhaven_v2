"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Radio, Clock, UserCheck, Car, ArrowRight } from "lucide-react";

interface AirportTransfersSectionProps {
  onBookTransfer?: () => void;
  onSelectVehicle?: (vehicleType: string) => void;
  onViewAllTransfers?: () => void;
}

const DEFAULT_VEHICLES = [
  {
    type: "CAR",
    name: "Luxury Car / Sedan",
    guests: "1 – 3 Guests",
    description: "Ideal for couples or solo travelers.",
    image: "/images/car.png",
  },
  {
    type: "MINIVAN",
    name: "Comfort Minivan",
    guests: "4 – 6 Guests",
    description: "Perfect for families and small groups.",
    image: "/images/min-van.jpg",
  },
  {
    type: "LUXURY VAN",
    name: "Executive Luxury Van",
    guests: "7 – 12 Guests",
    description: "Spacious & comfortable for larger groups.",
    image: "/images/luxury-van.jfif",
  },
];

export default function AirportTransfersSection({
  onBookTransfer,
  onSelectVehicle,
  onViewAllTransfers,
}: AirportTransfersSectionProps) {
  const [fleet, setFleet] = useState(DEFAULT_VEHICLES);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (data.vehicles && data.vehicles.length > 0) {
          const dynamicFleet = data.vehicles.map((v: any) => ({
            type: v.type,
            name:
              v.type === "CAR"
                ? "Luxury Car / Sedan"
                : v.type === "MINIVAN"
                ? "Comfort Minivan"
                : v.type === "LUXURY VAN"
                ? "Executive Luxury Van"
                : v.type,
            guests: v.guests || "1 – 4 Guests",
            description: v.description || "Private air-conditioned chauffeur transfer.",
            image: v.image || "/images/car.png",
          }));
          setFleet(dynamicFleet);
        }
      })
      .catch((err) => console.error("Failed to load airport transfers fleet:", err));
  }, []);

  return (
    <section id="transfers" className="scroll-mt-16 bg-[#081e14] py-20 px-4 sm:px-6 lg:px-10 border-t border-[#cca45b]/15 text-slate-100">
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
              Airport Transfers & Fleet
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mb-8">
              Comfortable private transfers from Bandaranaike International Airport (BIA) to anywhere in Sri Lanka with licensed chauffeur guides.
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
              onClick={() => (onSelectVehicle ? onSelectVehicle("CAR") : onBookTransfer?.())}
              className="group flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#081e14] px-6 sm:px-7 py-3.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_16px_rgba(204,164,91,0.3)] hover:shadow-[0_6px_22px_rgba(204,164,91,0.5)] cursor-pointer"
            >
              <span>BOOK AIRPORT TRANSFER</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column: Top 3 Featured Vehicle Cards */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {fleet.slice(0, 3).map((v, idx) => (
                <div
                  key={idx}
                  onClick={() => (onSelectVehicle ? onSelectVehicle(v.type) : onBookTransfer?.())}
                  className="bg-white text-slate-800 rounded-2xl overflow-hidden shadow-lg border border-stone-200/50 hover:shadow-2xl hover:border-[#cca45b] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Vehicle Image */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                      <Image
                        src={v.image}
                        alt={`${v.type} - SunHaven Lanka Airport Transfer`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    </div>

                    {/* Overlapping Vehicle Badge Icon */}
                    <div className="relative -mt-6 ml-5 z-10">
                      <div className="w-11 h-11 rounded-full bg-[#082215] border-2 border-white shadow-md flex items-center justify-center group-hover:border-[#cca45b] transition-colors">
                        <Car className="w-5 h-5 text-[#22c55e]" />
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="pt-2 pb-4 px-5">
                      <h3 className="font-bold text-[15px] uppercase tracking-wide text-[#0b1f16] group-hover:text-[#cca45b] transition-colors">
                        {v.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5 mb-2.5">
                        {v.guests}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {v.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 pb-4 px-5 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#cca45b] uppercase tracking-wider group-hover:underline">
                      Book Vehicle
                    </span>
                    <span className="text-stone-400 group-hover:translate-x-1 group-hover:text-[#cca45b] transition-all">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Center Link */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => (onSelectVehicle ? onSelectVehicle("CAR") : onViewAllTransfers?.())}
                className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em] text-[#cca45b] hover:text-[#e0bb72] transition-colors cursor-pointer group"
              >
                <span>BOOK CHAUFFEUR OR TRANSFER</span>
                <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
