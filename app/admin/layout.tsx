"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Package,
  Truck,
  Images,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  User,
  Users,
  Search,
} from "lucide-react";

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Vehicles", href: "/admin/vehicles", icon: Truck },
  { name: "Media", href: "/admin/media", icon: Images },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);

  const isLoginPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login/");

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#07160f]">
        <div className="fixed inset-0 bg-[#07160f] z-50 flex items-center justify-center">
          <div className="text-[#cca45b] font-cinzel text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#07160f] text-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0a2118] border-r border-[#cca45b]/20 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#cca45b]/20">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#cca45b] rounded-xl flex items-center justify-center">
                <span className="text-[#07160f] font-bold text-lg">SH</span>
              </div>
              <div>
                <p className="font-cinzel text-xl font-bold text-white">SunHaven</p>
                <p className="text-xs text-[#cca45b] uppercase tracking-wider">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#cca45b]/20 text-[#cca45b] border border-[#cca45b]/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#cca45b]/20">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
              <div className="w-9 h-9 bg-[#cca45b]/20 border border-[#cca45b]/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#cca45b]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                <p className="text-xs text-slate-400 truncate">admin@sunhavenlanka.com</p>
              </div>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-slate-400 hover:text-[#cca45b] transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {userMenuOpen && (
              <div className="mt-2 py-2 bg-white/5 rounded-xl border border-white/10">
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <form
                  action="/api/admin/logout"
                  method="POST"
                  onSubmit={handleLogout}
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a2118]/95 backdrop-blur-xl border-b border-[#cca45b]/20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search packages, inquiries..."
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 rounded-lg transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}