"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickInquiryCard from "@/components/QuickInquiryCard";
import JourneysSection from "@/components/JourneysSection";
import AirportTransfersSection from "@/components/AirportTransfersSection";
import WhyTravelWithUsSection from "@/components/WhyTravelWithUsSection";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import VideoModal from "@/components/VideoModal";
import TripPlannerModal from "@/components/TripPlannerModal";
import VehicleBookingModal from "@/components/VehicleBookingModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState("CAR");

  useEffect(() => {
    const scrollToHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const id = window.location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  const handleOpenVehicleBooking = (vehicleType: string = "CAR") => {
    setSelectedVehicleType(vehicleType);
    setIsVehicleModalOpen(true);
  };

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

        {/* Prominent Quick Inquiry Booking Card (Hero Overlap) */}
        <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 md:-mt-20 mb-12 sm:mb-16">
          <QuickInquiryCard />
        </section>

        {/* Handcrafted Journeys Section */}
        <JourneysSection
          onSelectJourney={() => setIsTripPlannerOpen(true)}
          onViewAllJourneys={() => setIsTripPlannerOpen(true)}
        />

        {/* Airport Transfers & Vehicle Fleet Section */}
        <AirportTransfersSection
          onBookTransfer={() => handleOpenVehicleBooking("CAR")}
          onSelectVehicle={(vType) => handleOpenVehicleBooking(vType)}
          onViewAllTransfers={() => handleOpenVehicleBooking("CAR")}
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
      <VehicleBookingModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        initialVehicleType={selectedVehicleType}
      />
    </div>
  );
}
