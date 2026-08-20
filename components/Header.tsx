"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { MessageCircle, Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenTripPlanner?: () => void;
}

export default function Header({ onOpenTripPlanner }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("HOME");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "HOME", href: "#home" },
    { name: "JOURNEYS", href: "#journeys" },
    { name: "EXPERIENCES", href: "#experiences" },
    { name: "AIRPORT TRANSFERS", href: "#transfers" },
    { name: "ABOUT", href: "#about" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#091f16]/98 backdrop-blur-md shadow-lg shadow-black/40 py-3"
          : "bg-[#0a2118] py-3.5 sm:py-4 border-b border-[#cca45b]/15"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveTab(item.name)}
                className={`relative py-1 text-[13px] tracking-[0.12em] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#cca45b] font-semibold"
                    : "text-slate-100/90 hover:text-[#cca45b]"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#cca45b] rounded-full shadow-[0_0_8px_rgba(204,164,91,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Action Button */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={onOpenTripPlanner}
            className="flex items-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0d2218] px-5 py-2.5 rounded-lg text-xs md:text-[13px] font-bold tracking-[0.08em] uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_2px_12px_rgba(204,164,91,0.25)] hover:shadow-[0_4px_16px_rgba(204,164,91,0.4)] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#0d2218] stroke-[2.4]" />
            <span>PLAN YOUR TRIP</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#cca45b]" />
            ) : (
              <Menu className="w-6 h-6 text-[#cca45b]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#081a12]/98 backdrop-blur-xl border-b border-[#cca45b]/20 px-6 py-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.name);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 text-sm tracking-[0.12em] font-medium transition-colors border-b border-white/5 ${
                  activeTab === item.name
                    ? "text-[#cca45b] font-semibold"
                    : "text-slate-200 hover:text-[#cca45b]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenTripPlanner) onOpenTripPlanner();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0d2218] py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>PLAN YOUR TRIP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
