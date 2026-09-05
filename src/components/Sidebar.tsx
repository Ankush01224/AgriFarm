import React from "react";
import {
  Tractor,
  Users,
  Store,
  Truck,
  Timer,
  Wallet,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { NavSection } from "../types";

interface SidebarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  hoursRemaining?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  hoursRemaining = 48,
}) => {
  return (
    <>
      {/* Desktop Persistent Sidebar - Frosted Glass Styled */}
      <aside className="fixed left-0 top-24 md:top-28 bottom-0 w-64 bg-white/30 dark:bg-[#0b0f17]/40 backdrop-blur-xl border-r border-white/40 dark:border-white/10 z-40 hidden md:flex flex-col justify-between py-6 px-4 transition-colors">
        <div className="space-y-6">
          {/* Operations Core Section */}
          <div>
            <p className="px-3 mb-3 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-400 font-bold">
              Operations Core
            </p>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => onNavigate("dashboard-and-harvest")}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentSection === "dashboard-and-harvest"
                    ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                <Tractor className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Harvest Overview</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("hire-workers")}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentSection === "hire-workers"
                    ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Labor Dispatch</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("marketplace-and-bids")}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentSection === "marketplace-and-bids"
                    ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                <Store className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Crop Lots & Bids</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("active-orders")}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentSection === "active-orders"
                    ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                <Truck className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Logistics & Orders</span>
              </button>
            </nav>
          </div>

          {/* Field Intel Section */}
          <div>
            <p className="px-3 mb-3 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-400 font-bold">
              Field Intel
            </p>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => onNavigate("spoilage-risk-monitor")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentSection === "spoilage-risk-monitor"
                    ? "bg-white/70 dark:bg-white/15 text-red-600 dark:text-red-400 font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                <div className="flex items-center">
                  <Timer className="w-5 h-5 mr-3 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span>Spoilage Watch</span>
                </div>
                <span className="text-[10px] font-mono bg-red-100/70 dark:bg-red-950/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full font-bold border border-red-200/50 dark:border-red-800/40">
                  SURGE
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("escrow-and-settlements")}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm transition-all ${
                  currentSection === "escrow-and-settlements"
                    ? "bg-white/70 dark:bg-white/15 text-[#008425] dark:text-[#8cfb8b] font-semibold shadow-xs border border-white/60 dark:border-white/15 backdrop-blur-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10"
                }`}
              >
                <Wallet className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Settlements</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Harvest Window Metric Card - Frosted Glass */}
        <div className="pt-4 border-t border-white/40 dark:border-white/10">
          <div className="p-3.5 bg-white/50 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#008425]" />
                Harvest Window
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold">
                {hoursRemaining}h REMAINING
              </span>
            </div>
            <div className="w-full bg-slate-200/60 dark:bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: "75%" }}
              />
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Pacific Low Front</span>
              <span className="text-red-600 dark:text-red-400 font-semibold">Rain risk</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Quick Action Dock - Frosted Glass */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/75 dark:bg-[#0b0f17]/80 backdrop-blur-xl border-t border-white/40 dark:border-white/10 px-2 py-1.5 flex items-center justify-around text-[10px] font-mono">
        <button
          onClick={() => onNavigate("hire-workers")}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${
            currentSection === "hire-workers"
              ? "bg-white/80 dark:bg-white/20 text-[#008425] font-bold shadow-xs border border-white/60 dark:border-white/15"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Dispatch</span>
        </button>

        <button
          onClick={() => onNavigate("dashboard-and-harvest")}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${
            currentSection === "dashboard-and-harvest"
              ? "bg-white/80 dark:bg-white/20 text-[#008425] font-bold shadow-xs border border-white/60 dark:border-white/15"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Tractor className="w-5 h-5" />
          <span>Harvest</span>
        </button>

        <button
          onClick={() => onNavigate("marketplace-and-bids")}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${
            currentSection === "marketplace-and-bids"
              ? "bg-white/80 dark:bg-white/20 text-[#008425] font-bold shadow-xs border border-white/60 dark:border-white/15"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Lots & Bids</span>
        </button>

        <button
          onClick={() => onNavigate("spoilage-risk-monitor")}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${
            currentSection === "spoilage-risk-monitor"
              ? "bg-white/80 dark:bg-white/20 text-red-600 font-bold shadow-xs border border-white/60 dark:border-white/15"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Timer className="w-5 h-5" />
          <span>Spoilage</span>
        </button>

        <button
          onClick={() => onNavigate("escrow-and-settlements")}
          className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${
            currentSection === "escrow-and-settlements"
              ? "bg-white/80 dark:bg-white/20 text-[#008425] font-bold shadow-xs border border-white/60 dark:border-white/15"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Escrow</span>
        </button>
      </nav>
    </>
  );
};
