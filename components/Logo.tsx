import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "header" | "footer" | "hero";
}

export default function Logo({ className = "", variant = "header" }: LogoProps) {
  return (
    <Link href="/" className={`group flex items-center gap-3.5 select-none ${className}`}>
      {/* Sun & Mountain Stylized Emblem */}
      <div className="relative flex items-center justify-center w-11 h-11 shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 100 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(204,164,91,0.25)]"
        >
          {/* Sun Rays radiating outwards */}
          <g stroke="#cca45b" strokeWidth="2.8" strokeLinecap="round" opacity="0.95">
            {/* Top center ray */}
            <line x1="50" y1="6" x2="50" y2="15" />
            {/* Left rays */}
            <line x1="33" y1="11" x2="38" y2="19" />
            <line x1="20" y1="21" x2="27" y2="27" />
            <line x1="12" y1="36" x2="20" y2="39" />
            {/* Right rays */}
            <line x1="67" y1="11" x2="62" y2="19" />
            <line x1="80" y1="21" x2="73" y2="27" />
            <line x1="88" y1="36" x2="80" y2="39" />
          </g>

          {/* Sun Arc / Semi-circle */}
          <path
            d="M26 44 A 24 24 0 0 1 74 44"
            stroke="#cca45b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Mountain Peak / Rock Form */}
          {/* Left golden slope */}
          <path
            d="M10 74 L48 30 Q50 27 52 30 L64 45 L70 41 L90 74 C75 73 60 74 50 74 C35 74 20 73 10 74 Z"
            fill="#cca45b"
            opacity="0.95"
          />
          {/* Mountain Facet / Ridge Shadow & Highlight */}
          <path
            d="M48 30 L53 50 L64 45 L72 56 L90 74 L50 74 Z"
            fill="#b08535"
            opacity="0.85"
          />
          {/* Stylized base sweep */}
          <path
            d="M6 76 C20 75 40 76 50 76 C65 76 80 75 94 76"
            stroke="#cca45b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-baseline leading-none">
          <span className="font-serif font-medium text-[22px] tracking-[0.02em] text-white">
            SunHaven
          </span>
        </div>
        <div className="flex items-center justify-between mt-[2px] leading-tight">
          <span className="font-serif text-[11px] tracking-[0.32em] font-semibold text-[#cca45b]">
            LANKA
          </span>
        </div>
        <span className="font-sans text-[6.5px] uppercase tracking-[0.18em] font-medium text-[#c4a66a]/90 mt-[1.5px] whitespace-nowrap">
          PRIVATE JOURNEYS, MADE PERSONAL
        </span>
      </div>
    </Link>
  );
}
