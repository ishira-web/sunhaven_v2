"use client";

import React from "react";

export default function WhatsAppWidget() {
  const phoneNumber = "+94771234567"; // Replace or customize as needed
  const message = encodeURIComponent(
    "Hello SunHaven Lanka, I would like to inquire about planning a private luxury journey in Sri Lanka."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#0a2318]/90 hover:bg-[#0d2e20] backdrop-blur-lg border border-white/20 hover:border-[#cca45b]/50 px-4 py-2.5 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95"
    >
      {/* WhatsApp Icon Circle */}
      <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_12px_rgba(37,211,102,0.4)] group-hover:shadow-[0_0_18px_rgba(37,211,102,0.7)] transition-shadow">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5 text-white fill-white"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.477-.15-.678.15-.201.301-.78 0.978-.956 1.18-.176.201-.352.226-.653.075-.301-.151-1.272-.469-2.423-1.497-.897-.8-1.503-1.788-1.68-2.089-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.527.151-.176.201-.301.302-.502.101-.201.05-.377-.025-.527-.075-.151-.678-1.633-.929-2.236-.245-.588-.493-.508-.678-.517-.176-.009-.377-.01-.578-.01-.201 0-.527.075-.803.377-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.151.201 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.229 1.378.197 1.898.119.579-.087 1.78-.728 2.03-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.201-.577-.352z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.892.527 3.662 1.442 5.176L2 22l4.981-1.405A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.16 8.16 0 0 1-4.326-1.238l-.31-.192-2.964.836.837-2.889-.208-.332A8.163 8.163 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2 4.522 0 8.2 3.678 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z" />
        </svg>
      </div>

      {/* Widget Text */}
      <span className="text-white text-xs sm:text-sm font-medium tracking-wide pr-1 select-none">
        Chat on WhatsApp
      </span>
    </a>
  );
}
