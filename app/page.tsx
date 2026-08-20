"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import JourneysSection from "@/components/JourneysSection";
import AirportTransfersSection from "@/components/AirportTransfersSection";
import WhyTravelWithUsSection from "@/components/WhyTravelWithUsSection";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import VideoModal from "@/components/VideoModal";
import TripPlannerModal from "@/components/TripPlannerModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07160f] text-slate-100 flex flex-col selection:bg-[#cca45b] selection:text-[#07160f]">
      {/* Exact SunHaven Header */}
      <Header onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      <main className="flex-1">
        {/* Exact SunHaven Hero Section */}
        <Hero
          onOpenVideo={() => setIsVideoModalOpen(true)}
          onExploreJourneys={() => {
            const el = document.getElementById("journeys");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Handcrafted Journeys Section */}
        <JourneysSection
          onSelectJourney={() => setIsTripPlannerOpen(true)}
          onViewAllJourneys={() => setIsTripPlannerOpen(true)}
        />

        {/* Airport Transfers & Vehicle Fleet Section */}
        <AirportTransfersSection
          onBookTransfer={() => setIsTripPlannerOpen(true)}
          onViewAllTransfers={() => setIsTripPlannerOpen(true)}
        />

        {/* Why Travel With Us, Experiences, and Testimonial Section */}
        <WhyTravelWithUsSection />
      </main>

      {/* Luxury Footer */}
      <Footer onOpenTripPlanner={() => setIsTripPlannerOpen(true)} />

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Interactive Modals */}
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      <TripPlannerModal isOpen={isTripPlannerOpen} onClose={() => setIsTripPlannerOpen(false)} />
    </div>
  );
}
