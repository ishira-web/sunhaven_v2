"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  onOpenTripPlanner?: () => void;
}

export default function Footer({ onOpenTripPlanner }: FooterProps) {
  return (
    <footer id="contact" className="scroll-mt-16 bg-[#06140e] border-t border-[#cca45b]/20 pt-16 pb-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div>
            <Logo />
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-xs">
              Private bespoke luxury journeys, chauffeur transfers, and boutique villa experiences throughout Sri Lanka.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#cca45b] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#cca45b] transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link href="/packages/10-days-relaxed-private-tour" className="hover:text-[#cca45b] transition-colors">
                  10-Day Relaxed Tour
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-[#cca45b] transition-colors">
                  All Tour Packages
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#cca45b] transition-colors">
                  Travel Gallery
                </Link>
              </li>
              <li>
                <Link href="/inquiry" className="hover:text-[#cca45b] transition-colors">
                  Detailed Tour Inquiry
                </Link>
              </li>
              <li>
                <Link href="/#transfers" className="hover:text-[#cca45b] transition-colors">
                  Airport Transfers & Fleet
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#cca45b] transition-colors">
                  About SunHaven Lanka
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#cca45b] mb-4">
              Concierge Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#cca45b]" />
                <span>+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#cca45b]" />
                <span>concierge@sunhavenlanka.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#cca45b]" />
                <span>Colombo 03 & Galle Fort, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Col 4: Inquiry CTA */}
          <div>
            <h4 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#cca45b] mb-4">
              Direct Booking
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Speak directly with an experiential travel designer today.
            </p>
            {onOpenTripPlanner ? (
              <button
                onClick={onOpenTripPlanner}
                className="w-full bg-[#cca45b] hover:bg-[#d9b46e] text-[#0a2118] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Plan Your Trip
              </button>
            ) : (
              <Link
                href="/inquiry"
                className="block text-center w-full bg-[#cca45b] hover:bg-[#d9b46e] text-[#0a2118] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Plan Your Trip
              </Link>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} SunHaven Lanka. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">|</span>
            <p className="text-[11px] text-slate-500">
              Made by{" "}
              <span className="text-[#cca45b]/90 font-medium">Idea Tech Solutions</span>
            </p>
          </div>
          <p className="text-[#cca45b]/80">Private Journeys, Made Personal.</p>
        </div>
      </div>
    </footer>
  );
}
