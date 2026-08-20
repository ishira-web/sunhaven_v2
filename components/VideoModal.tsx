"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#081a12] border border-[#cca45b]/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#cca45b] text-white hover:text-[#081a12] flex items-center justify-center transition-all duration-200"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/5T2k-014pZ0?autoplay=1&mute=0&rel=0&modestbranding=1"
            title="Discover Sri Lanka - SunHaven Luxury Travel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Modal Footer Caption */}
        <div className="p-4 sm:p-5 bg-[#0a2118] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#cca45b]/15">
          <div>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide">
              SunHaven Lanka — The Private Odyssey
            </h3>
            <p className="text-xs text-slate-300">
              Immerse yourself in Sigiriya, misty hill country estates, wildlife safaris, and golden coastlines.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-[#cca45b] hover:underline font-semibold"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
