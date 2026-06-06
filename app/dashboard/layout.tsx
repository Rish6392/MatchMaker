"use client";

import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Heart,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard", label: "Clients", icon: Users },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-stone-200/80
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-stone-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-primary to-rose-500 flex items-center justify-center shadow-md shadow-rose-primary/20">
              <Heart className="h-4.5 w-4.5 text-white fill-white" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-stone-800">
                TDC
              </span>
              <span className="text-[10px] text-stone-400 block -mt-1 font-medium tracking-wider uppercase">
                Matchmaker
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-3 mb-2 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-rose-lightest text-rose-primary shadow-sm"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                  }
                `}
              >
                <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-rose-primary" : "text-stone-400"}`} />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-rose-primary/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-stone-50">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-rose-soft to-gold-light flex items-center justify-center text-xs font-bold text-rose-primary flex-shrink-0">
              TM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-700 truncate">Matchmaker</p>
              <p className="text-[11px] text-stone-400 truncate">Admin Panel</p>
            </div>
          </div>
          <div className="mt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-bg flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-stone-200/60 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-stone-100 text-stone-500 mr-3"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Link href="/dashboard" className="hover:text-rose-primary transition-colors">
              Dashboard
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
