import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Search,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { NavSection, UserRole } from "../types";

interface HeaderProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  userRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
  unreadAlertCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "Expedited Weather Harvest Alert",
      desc: "Pacific rainstorm arriving in Central Valley in 36h. Shift hazard bonuses active.",
      time: "10m ago",
      type: "urgent",
    },
    {
      id: "n2",
      title: "Escrow Deposit Confirmed",
      desc: "Bowles Farm Co. released $248.00 into instant transfer ledger.",
      time: "1h ago",
      type: "success",
    },
    {
      id: "n3",
      title: "Muster Location Reminder",
      desc: "Mendota Melon Packout starts 06:00 AM at Canal Staging #2.",
      time: "3h ago",
      type: "info",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 dark:bg-[#0b0f17]/40 backdrop-blur-xl border-b border-white/40 dark:border-white/10 transition-colors shadow-xs">
      {/* Weather Emergency Alert Banner */}
      <div className="bg-red-500/10 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-4 md:px-10 py-1.5 flex items-center justify-between text-xs font-mono border-b border-red-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse flex-shrink-0" />
          <span className="truncate">
            Rain forecast in Central Valley: 48h to harvest before spoilage risk
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-bold uppercase tracking-wider text-[10px] bg-red-100/70 dark:bg-red-900/40 px-2.5 py-0.5 rounded-full text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40">
            Expedited Harvest Alert
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-16 md:h-20 max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
        {/* Logo & Role Switcher */}
        <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
          <div
            onClick={() => onNavigate("hire-workers")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#008425] text-white flex items-center justify-center shadow-sm shadow-green-900/20 group-hover:bg-[#00681b] transition-all">
              <span className="text-lg font-black tracking-tighter">AG</span>
            </div>
            <span className="font-['Manrope'] text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              AgriConnect
            </span>
          </div>

          {/* Role Pill Switcher */}
          <div className="hidden xl:flex items-center p-1 bg-slate-200/50 dark:bg-white/10 rounded-full text-xs font-mono border border-white/50 dark:border-white/10 backdrop-blur-md shadow-xs">
            <button
              type="button"
              onClick={() => onRoleChange("farmer")}
              className={`px-3.5 py-1 rounded-full transition-all text-[11px] ${
                userRole === "farmer"
                  ? "bg-white dark:bg-white/20 text-slate-800 dark:text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Farmer / Producer
            </button>
            <button
              type="button"
              onClick={() => onRoleChange("worker")}
              className={`px-3.5 py-1 rounded-full transition-all text-[11px] ${
                userRole === "worker"
                  ? "bg-white dark:bg-white/20 text-slate-800 dark:text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Farm Worker / Laborer
            </button>
            <button
              type="button"
              onClick={() => onRoleChange("buyer")}
              className={`px-3.5 py-1 rounded-full transition-all text-[11px] ${
                userRole === "buyer"
                  ? "bg-white dark:bg-white/20 text-slate-800 dark:text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Crop Buyer / Merchant
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md items-center relative">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Emergency labor, spot crews, immediate dispatch..."
            className="w-full pl-9 pr-3.5 py-2 bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/15 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#008425] focus:bg-white/80 dark:focus:bg-white/20 backdrop-blur-md transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          <button
            type="button"
            onClick={() => onNavigate("dashboard-and-harvest")}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentSection === "dashboard-and-harvest"
                ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
            }`}
          >
            Dashboard & Harvest
          </button>
          <button
            type="button"
            onClick={() => onNavigate("hire-workers")}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentSection === "hire-workers"
                ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
            }`}
          >
            Hire Workers
          </button>
          <button
            type="button"
            onClick={() => onNavigate("marketplace-and-bids")}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentSection === "marketplace-and-bids"
                ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
            }`}
          >
            Marketplace & Bids
          </button>
          <button
            type="button"
            onClick={() => onNavigate("active-orders")}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentSection === "active-orders"
                ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
            }`}
          >
            Active Orders
          </button>
        </nav>

        {/* Right Utility Cluster: Theme Toggle, Notifications, User Badge */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 transition-all border border-white/50 dark:border-white/15 backdrop-blur-md shadow-xs"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Flyout Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 transition-all border border-white/50 dark:border-white/15 backdrop-blur-md shadow-xs"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/85 dark:bg-[#0f141d]/90 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-300/40 dark:shadow-black/70 border border-white/80 dark:border-white/15 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-white/40 dark:border-white/10">
                  <span className="font-['Manrope'] font-bold text-sm text-slate-800 dark:text-white">
                    Emergency Dispatch Notices
                  </span>
                  <span className="text-[11px] font-mono text-[#008425] font-bold bg-green-100/70 dark:bg-green-950/50 px-2.5 py-0.5 rounded-full border border-green-200/50 dark:border-green-800/40">
                    Active Radar
                  </span>
                </div>
                <div className="space-y-2 mt-3 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-left backdrop-blur-xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/50 dark:border-white/15">
            <div className="w-8 h-8 rounded-full bg-[#008425] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden 2xl:flex flex-col text-left leading-tight">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-white">
                {userRole === "farmer"
                  ? "Bowles Ranch #4"
                  : userRole === "buyer"
                  ? "Apex Produce Direct"
                  : "Field Crew #9042"}
              </span>
              <span className="font-mono text-[10px] text-[#008425] flex items-center gap-0.5 font-semibold">
                <ShieldCheck className="w-2.5 h-2.5" />
                Verified Active
              </span>
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/50 dark:border-white/15 transition-colors backdrop-blur-md"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4 pt-2 bg-white/85 dark:bg-[#0b0f17]/90 backdrop-blur-2xl border-b border-white/40 dark:border-white/10 space-y-3">
          {/* Mobile Role Switcher */}
          <div className="flex rounded-full bg-slate-200/50 dark:bg-white/10 p-1 text-xs border border-white/50 dark:border-white/10 backdrop-blur-md">
            <button
              onClick={() => {
                onRoleChange("farmer");
              }}
              className={`flex-1 py-1.5 text-center font-semibold rounded-full transition-all ${
                userRole === "farmer" ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Grower
            </button>
            <button
              onClick={() => {
                onRoleChange("worker");
              }}
              className={`flex-1 py-1.5 text-center font-semibold rounded-full transition-all ${
                userRole === "worker" ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Harvester
            </button>
            <button
              onClick={() => {
                onRoleChange("buyer");
              }}
              className={`flex-1 py-1.5 text-center font-semibold rounded-full transition-all ${
                userRole === "buyer" ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Merchant
            </button>
          </div>

          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search emergency harvest jobs..."
              className="w-full pl-9 pr-3 py-2 bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/15 rounded-xl text-sm text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => {
                onNavigate("hire-workers");
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                currentSection === "hire-workers"
                  ? "bg-white/80 dark:bg-white/20 text-[#008425] font-semibold border border-white/80 dark:border-white/15 shadow-xs"
                  : "bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10"
              }`}
            >
              Labor Dispatch
            </button>
            <button
              onClick={() => {
                onNavigate("dashboard-and-harvest");
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                currentSection === "dashboard-and-harvest"
                  ? "bg-white/80 dark:bg-white/20 text-[#008425] font-semibold border border-white/80 dark:border-white/15 shadow-xs"
                  : "bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10"
              }`}
            >
              Harvest Overview
            </button>
            <button
              onClick={() => {
                onNavigate("marketplace-and-bids");
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                currentSection === "marketplace-and-bids"
                  ? "bg-white/80 dark:bg-white/20 text-[#008425] font-semibold border border-white/80 dark:border-white/15 shadow-xs"
                  : "bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10"
              }`}
            >
              Crop Lots & Bids
            </button>
            <button
              onClick={() => {
                onNavigate("active-orders");
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                currentSection === "active-orders"
                  ? "bg-white/80 dark:bg-white/20 text-[#008425] font-semibold border border-white/80 dark:border-white/15 shadow-xs"
                  : "bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10"
              }`}
            >
              Logistics & Orders
            </button>
            <button
              onClick={() => {
                onNavigate("spoilage-risk-monitor");
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                currentSection === "spoilage-risk-monitor"
                  ? "bg-white/80 dark:bg-white/20 text-red-600 font-semibold border border-white/80 dark:border-white/15 shadow-xs"
                  : "bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10"
              }`}
            >
              Spoilage Watch
            </button>
            <button
              onClick={() => {
                onNavigate("escrow-and-settlements");
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                currentSection === "escrow-and-settlements"
                  ? "bg-white/80 dark:bg-white/20 text-[#008425] font-semibold border border-white/80 dark:border-white/15 shadow-xs"
                  : "bg-white/40 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-white/40 dark:border-white/10"
              }`}
            >
              Escrow Settlements
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
