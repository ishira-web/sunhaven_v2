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
  ChevronRight,
  Package as PackageIcon,
} from "lucide-react";

interface HeaderProps {
  onOpenTripPlanner?: () => void;
}

interface DynamicHeaderPackage {
  id: string;
  slug: string;
  title: string;
  durationTag: string;
  durationNightsDays?: string;
  subtitle?: string;
  type?: string;
  isFeatured?: boolean;
}

export default function Header({ onOpenTripPlanner }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [packagesDropdownOpen, setPackagesDropdownOpen] = useState(false);
  const [mobilePackagesExpanded, setMobilePackagesExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("HOME");
  const [dbPackages, setDbPackages] = useState<DynamicHeaderPackage[]>([]);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch created packages from database
  useEffect(() => {
    let isMounted = true;

    const fetchHeaderPackages = () => {
      fetch("/api/packages?published=true")
        .then((res) => (res.ok ? res.json() : { packages: [] }))
        .then((data) => {
          if (isMounted && data.packages && Array.isArray(data.packages)) {
            setDbPackages(data.packages);
          }
        })
        .catch((err) => console.error("Header failed to load packages:", err));
    };

    fetchHeaderPackages();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

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
    { name: "GALLERY", href: "/gallery", isPage: true },
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
              (item.name === "EXPERIENCES" && pathname.startsWith("/experiences")) ||
              (item.name === "GALLERY" && pathname === "/gallery") ||
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

                  {/* Packages Dropdown Menu with Created Packages */}
                  {packagesDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="bg-[#071911]/98 backdrop-blur-xl border border-[#cca45b]/30 shadow-[0_16px_40px_rgba(0,0,0,0.7)] rounded-2xl p-2.5 overflow-hidden">
                        {/* Header Link to All Packages */}
                        <Link
                          href="/packages"
                          onClick={(e) => handleNavClick(e, "/packages", "PACKAGES")}
                          className="group flex items-center justify-between p-2.5 rounded-xl bg-[#cca45b]/10 hover:bg-[#cca45b]/20 border border-[#cca45b]/30 transition-all mb-2"
                        >
                          <div className="flex items-center gap-2.5">
                            <Compass className="w-4 h-4 text-[#cca45b]" />
                            <div>
                              <span className="text-xs font-bold text-[#cca45b] tracking-wider uppercase block">
                                ALL TOUR PACKAGES
                              </span>
                              <span className="text-[11px] text-slate-300">
                                View complete collection & excursions
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#cca45b] group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        {/* Dynamic User-Created Packages List from Database */}
                        <div className="px-3 py-1 border-b border-[#cca45b]/15 mb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#cca45b]">
                            CURATED TOURS ({dbPackages.length})
                          </span>
                          <span className="text-[10px] text-slate-400">Private Journeys</span>
                        </div>

                        <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                          {dbPackages.length > 0 ? (
                            dbPackages.map((pkg) => {
                              const PkgIcon = pkg.isFeatured
                                ? Sparkles
                                : pkg.type === "ONE_DAY"
                                ? Clock
                                : PackageIcon;

                              return (
                                <Link
                                  key={pkg.id}
                                  href={`/packages/${pkg.slug}`}
                                  onClick={(e) => handleNavClick(e, `/packages/${pkg.slug}`, "PACKAGES")}
                                  className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#cca45b]/10 hover:border hover:border-[#cca45b]/20 border border-transparent transition-all"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-[#0a2419] border border-[#cca45b]/30 flex items-center justify-center text-[#cca45b] shrink-0 group-hover:bg-[#cca45b] group-hover:text-[#0a2419] transition-colors mt-0.5">
                                    <PkgIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-slate-100 group-hover:text-[#cca45b] transition-colors truncate">
                                        {pkg.title}
                                      </span>
                                      {pkg.durationTag && (
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-[#0a2419] border border-[#cca45b]/30 text-[#cca45b] rounded shrink-0">
                                          {pkg.durationTag}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                      {pkg.durationNightsDays || pkg.subtitle || "Private Sri Lanka Tour"}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })
                          ) : (
                            <Link
                              href="/packages/10-days-relaxed-private-tour"
                              onClick={(e) => handleNavClick(e, "/packages/10-days-relaxed-private-tour", "PACKAGES")}
                              className="group flex items-center gap-3 p-2 rounded-xl hover:bg-[#cca45b]/10 transition-all text-xs text-slate-300"
                            >
                              <Sparkles className="w-4 h-4 text-[#cca45b]" />
                              <span>10-Day Relaxed Tour</span>
                            </Link>
                          )}
                        </div>

                        {/* Bottom Quick Links (Custom & Excursions) */}
                        <div className="pt-2 border-t border-white/10 mt-2 grid grid-cols-2 gap-1.5">
                          <Link
                            href="/packages?tab=one-day"
                            onClick={(e) => handleNavClick(e, "/packages?tab=one-day", "PACKAGES")}
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#cca45b]/15 text-left transition-colors"
                          >
                            <span className="text-[11px] font-bold text-slate-200 block">
                              Day Excursions
                            </span>
                            <span className="text-[10px] text-slate-400">Single-day trips</span>
                          </Link>

                          <Link
                            href="/inquiry"
                            onClick={(e) => handleNavClick(e, "/inquiry", "INQUIRY")}
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#cca45b]/15 text-left transition-colors"
                          >
                            <span className="text-[11px] font-bold text-[#cca45b] block">
                              Custom Tour
                            </span>
                            <span className="text-[10px] text-slate-400">Tailor-made proposal</span>
                          </Link>
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
                (item.name === "EXPERIENCES" && pathname.startsWith("/experiences")) ||
                (item.name === "GALLERY" && pathname === "/gallery") ||
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

                    {/* Expandable Mobile Submenu with Dynamic Created Packages */}
                    {mobilePackagesExpanded && (
                      <div className="pl-4 pb-2 pt-1 space-y-2 border-l border-[#cca45b]/20 ml-2">
                        <Link
                          href="/packages"
                          onClick={(e) => handleNavClick(e, "/packages", "PACKAGES")}
                          className="flex items-center gap-2 py-1 text-xs font-bold text-[#cca45b]"
                        >
                          <Compass className="w-3.5 h-3.5 text-[#cca45b]" />
                          <span>All Tour Packages</span>
                        </Link>

                        {dbPackages.map((pkg) => (
                          <Link
                            key={pkg.id}
                            href={`/packages/${pkg.slug}`}
                            onClick={(e) => handleNavClick(e, `/packages/${pkg.slug}`, "PACKAGES")}
                            className="flex items-center justify-between py-1 text-xs text-slate-300 hover:text-[#cca45b]"
                          >
                            <span className="truncate">{pkg.title}</span>
                            {pkg.durationTag && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#0a2419] border border-[#cca45b]/30 text-[#cca45b] rounded ml-2 shrink-0">
                                {pkg.durationTag}
                              </span>
                            )}
                          </Link>
                        ))}

                        <Link
                          href="/packages?tab=one-day"
                          onClick={(e) => handleNavClick(e, "/packages?tab=one-day", "PACKAGES")}
                          className="flex items-center gap-2 py-1 text-xs text-slate-400 hover:text-[#cca45b]"
                        >
                          <Clock className="w-3 h-3 text-[#cca45b]" />
                          <span>One Day Excursions</span>
                        </Link>

                        <Link
                          href="/inquiry"
                          onClick={(e) => handleNavClick(e, "/inquiry", "INQUIRY")}
                          className="flex items-center gap-2 py-1 text-xs text-slate-400 hover:text-[#cca45b]"
                        >
                          <Calendar className="w-3 h-3 text-[#cca45b]" />
                          <span>Custom Tailor-Made Tour</span>
                        </Link>
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
                className="w-full flex items-center justify-center gap-2 bg-[#cca45b] hover:bg-[#d9b46e] text-[#0d2218] py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg cursor-pointer"
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
