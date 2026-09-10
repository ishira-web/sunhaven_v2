"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import {
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Compass,
  Clock,
  Calendar,
  MapPin,
  Car,
  ChevronRight,
} from "lucide-react";

interface HeaderProps {
  onOpenTripPlanner?: () => void;
}

interface DropdownItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
}

export default function Header({ onOpenTripPlanner }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);
  const [mobilePackagesExpanded, setMobilePackagesExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("HOME");

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll listener for sticky header styling & section spying
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Only spy sections when on the homepage
      if (pathname === "/") {
        const sections = [
          { id: "contact", name: "CONTACT" },
          { id: "about", name: "ABOUT" },
          { id: "experiences", name: "EXPERIENCES" },
          { id: "transfers", name: "AIRPORT TRANSFERS" },
          { id: "journeys", name: "PACKAGES" },
          { id: "home", name: "HOME" },
        ];

        const scrollPosition = window.scrollY + 140;

        let found = false;
        for (const section of sections) {
          const el = document.getElementById(section.id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section.name);
              found = true;
              break;
            }
          }
        }

        if (!found && window.scrollY < 200) {
          setActiveSection("HOME");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Determine active tab based on route
  useEffect(() => {
    if (pathname.startsWith("/packages")) {
      setActiveSection("PACKAGES");
    } else if (pathname === "/inquiry") {
      setActiveSection("INQUIRY");
    } else if (pathname === "/") {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.toLowerCase();
        if (hash.includes("transfers")) setActiveSection("AIRPORT TRANSFERS");
        else if (hash.includes("experiences")) setActiveSection("EXPERIENCES");
        else if (hash.includes("about")) setActiveSection("ABOUT");
        else if (hash.includes("contact")) setActiveSection("CONTACT");
        else if (hash.includes("journeys")) setActiveSection("PACKAGES");
        else setActiveSection("HOME");
      }
    }
  }, [pathname]);

  const packageSubItems: DropdownItem[] = [
    {
      title: "All Tour Packages",
      desc: "Multi-day & single-day expeditions",
      href: "/packages",
      icon: Compass,
    },
    {
      title: "10-Day Relaxed Tour",
      desc: "Signature luxury private island circuit",
      href: "/packages/10-days-relaxed-private-tour",
      icon: Sparkles,
    },
    {
      title: "One Day Excursions",
      desc: "Kandy, Sigiriya, Galle & day trips",
      href: "/packages?tab=one-day",
      icon: Clock,
    },
    {
      title: "Custom Tailor-Made",
      desc: "100% personalized private proposal",
      href: "/inquiry",
      icon: Calendar,
    },
    {
      title: "Signature Highlights",
      desc: "Featured handcrafted itineraries",
      href: "/#journeys",
      icon: MapPin,
    },
  ];

  const navItems = [
    { name: "HOME", href: "/", isPage: true },
    {
      name: "PACKAGES",
      href: "/packages",
      isPage: true,
      hasDropdown: true,
    },
    { name: "AIRPORT TRANSFERS", href: "/#transfers", isPage: false },
    { name: "EXPERIENCES", href: "/#experiences", isPage: false },
    { name: "INQUIRY", href: "/inquiry", isPage: true },
    { name: "ABOUT", href: "/#about", isPage: false },
    { name: "CONTACT", href: "/#contact", isPage: false },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    name: string
  ) => {
    setActiveSection(name);
    setMobileMenuOpen(false);
    setPackagesDropdownOpen(false);

    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  const handlePlanYourTrip = () => {
    setMobileMenuOpen(false);
    if (onOpenTripPlanner) {
      onOpenTripPlanner();
    } else {
      router.push("/inquiry");
    }
  };

  const handleMouseEnterPackages = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setPackagesDropdownOpen(true);
  };

  const handleMouseLeavePackages = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setPackagesDropdownOpen(false);
    }, 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#091f16]/98 backdrop-blur-md shadow-lg shadow-black/40 py-2.5 sm:py-3"
          : "bg-[#0a2118] py-3.5 sm:py-4 border-b border-[#cca45b]/15"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Brand Logo - Always links to home */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navItems.map((item) => {
            const isActive =
              activeSection === item.name ||
              (item.name === "PACKAGES" && pathname.startsWith("/packages")) ||
              (item.name === "INQUIRY" && pathname === "/inquiry") ||
              (item.name === "HOME" && pathname === "/" && activeSection === "HOME");

            if (item.hasDropdown) {
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={handleMouseEnterPackages}
                  onMouseLeave={handleMouseLeavePackages}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`relative py-1 inline-flex items-center gap-1 text-[12px] xl:text-[13px] tracking-[0.1em] font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-[#cca45b] font-semibold"
                        : "text-slate-100/90 hover:text-[#cca45b]"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        packagesDropdownOpen ? "rotate-180 text-[#cca45b]" : "text-slate-400"
                      }`}
                    />
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#cca45b] rounded-full shadow-[0_0_8px_rgba(204,164,91,0.6)]" />
                    )}
                  </Link>

                  {/* Packages Dropdown Menu */}
                  {packagesDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="bg-[#071911]/98 backdrop-blur-xl border border-[#cca45b]/30 shadow-[0_12px_35px_rgba(0,0,0,0.6)] rounded-2xl p-2 overflow-hidden">
                        <div className="px-3 py-2 border-b border-[#cca45b]/15 mb-1">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#cca45b]">
                            EXPLORE SRI LANKA
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {packageSubItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                onClick={(e) => handleNavClick(e, subItem.href, "PACKAGES")}
                                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#cca45b]/10 hover:border hover:border-[#cca45b]/20 border border-transparent transition-all"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#0a2419] border border-[#cca45b]/30 flex items-center justify-center text-[#cca45b] shrink-0 group-hover:bg-[#cca45b] group-hover:text-[#0a2419] transition-colors">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-100 group-hover:text-[#cca45b] transition-colors flex items-center justify-between">
                                    <span>{subItem.title}</span>
                                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#cca45b]" />
                                  </div>
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                    {subItem.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.name)}
                className={`relative py-1 text-[12px] xl:text-[13px] tracking-[0.1em] font-medium transition-colors duration-200 ${
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
            onClick={handlePlanYourTrip}
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
        <div className="lg:hidden fixed inset-x-0 top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto bg-[#081a12]/98 backdrop-blur-xl border-b border-[#cca45b]/20 px-6 py-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                activeSection === item.name ||
                (item.name === "PACKAGES" && pathname.startsWith("/packages")) ||
                (item.name === "INQUIRY" && pathname === "/inquiry") ||
                (item.name === "HOME" && pathname === "/" && activeSection === "HOME");

              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="border-b border-white/5 py-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href, item.name)}
                        className={`py-2 text-sm tracking-[0.12em] font-medium transition-colors flex-1 ${
                          isActive
                            ? "text-[#cca45b] font-semibold"
                            : "text-slate-200 hover:text-[#cca45b]"
                        }`}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => setMobilePackagesExpanded(!mobilePackagesExpanded)}
                        className="p-2 text-slate-400 hover:text-[#cca45b]"
                        aria-label="Toggle packages submenu"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobilePackagesExpanded ? "rotate-180 text-[#cca45b]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Expandable Mobile Submenu */}
                    {mobilePackagesExpanded && (
                      <div className="pl-4 pb-2 pt-1 space-y-2">
                        {packageSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={(e) => handleNavClick(e, sub.href, "PACKAGES")}
                              className="flex items-center gap-2.5 py-1.5 text-xs text-slate-300 hover:text-[#cca45b]"
                            >
                              <SubIcon className="w-3.5 h-3.5 text-[#cca45b]" />
                              <span>{sub.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.name)}
                  className={`py-3 text-sm tracking-[0.12em] font-medium transition-colors border-b border-white/5 flex items-center justify-between ${
                    isActive
                      ? "text-[#cca45b] font-semibold"
                      : "text-slate-200 hover:text-[#cca45b]"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#cca45b]" />}
                </Link>
              );
            })}

            {/* Mobile Plan Your Trip CTA */}
            <div className="pt-4 pb-2">
              <button
                onClick={handlePlanYourTrip}
                className="w-full flex items-center justify-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0d2218] py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-[#0d2218] stroke-[2.4]" />
                <span>PLAN YOUR TRIP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
