import React, { useState, useEffect } from "react";
import {
  Tractor,
  CloudRain,
  Wind,
  Thermometer,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

interface DashboardHarvestViewProps {
  onToast: (msg: string) => void;
  onNavigateToDispatch: () => void;
}

export const DashboardHarvestView: React.FC<DashboardHarvestViewProps> = ({
  onToast,
  onNavigateToDispatch,
}) => {
  const fields = [
    {
      id: "f1",
      plot: "Block 12B - Organic Romaine",
      farm: "Valley Green Farm (Firebaugh)",
      acres: 120,
      harvestedPct: 68,
      status: "Harvest in progress",
      urgency: "HIGH",
      rainEta: "34 Hours",
      workersOnField: 10,
    },
    {
      id: "f2",
      plot: "Orchard Block 4 - Bing Cherries",
      farm: "Linden Ridge Orchards (Linden)",
      acres: 85,
      harvestedPct: 32,
      status: "Emergency crew requested",
      urgency: "CRITICAL",
      rainEta: "24 Hours",
      workersOnField: 6,
    },
    {
      id: "f3",
      plot: "Block 9 - Autumn Royal Grapes",
      farm: "SunHarvest Vineyards (Delano)",
      acres: 210,
      harvestedPct: 45,
      status: "Pack-out in progress",
      urgency: "MEDIUM",
      rainEta: "42 Hours",
      workersOnField: 15,
    },
    {
      id: "f4",
      plot: "Lot 03 - Pima Cotton",
      farm: "Bowles Farm Co. (Los Banos)",
      acres: 340,
      harvestedPct: 15,
      status: "Muster scheduled 06:00 AM",
      urgency: "HIGH",
      rainEta: "38 Hours",
      workersOnField: 10,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#008425]/15 text-[#008425] dark:text-[#8cfb8b] font-mono text-xs uppercase rounded-full tracking-wider font-semibold border border-[#008425]/20">
              Regional Harvest Monitor
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
              Central Valley Weather Corridor
            </span>
          </div>
          <h1 className="font-['Manrope'] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">
            Harvest Overview & Readiness Radar
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            Real-time crop maturity indices, field telemetry, and storm risk response
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToDispatch}
          className="px-5 py-2.5 bg-[#008425] hover:bg-[#00681b] text-white font-mono text-xs font-bold rounded-2xl shadow-xs self-start lg:self-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Open Labor Dispatch Desk
        </button>
      </div>

      {/* Atmospheric Risk Radar Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>STORM ARRIVAL</span>
            <CloudRain className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-['Manrope'] text-2xl font-bold text-red-600 dark:text-red-400">
            36 Hours
          </span>
          <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
            Pacific low-pressure front
          </span>
        </div>

        <div className="p-4 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>AVG FIELD TEMP</span>
            <Thermometer className="w-4 h-4 text-[#008425]" />
          </div>
          <span className="font-['Manrope'] text-2xl font-bold text-slate-900 dark:text-white">
            84°F / 29°C
          </span>
          <span className="block text-[11px] font-mono text-[#008425] dark:text-[#8cfb8b] mt-1">
            Optimal morning picking
          </span>
        </div>

        <div className="p-4 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>RELATIVE HUMIDITY</span>
            <Wind className="w-4 h-4 text-blue-500" />
          </div>
          <span className="font-['Manrope'] text-2xl font-bold text-slate-900 dark:text-white">
            74% RH
          </span>
          <span className="block text-[11px] font-mono text-amber-600 dark:text-amber-400 mt-1">
            Elevated mold split hazard
          </span>
        </div>

        <div className="p-4 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>ACTIVE HARVESTERS</span>
            <Tractor className="w-4 h-4 text-[#008425]" />
          </div>
          <span className="font-['Manrope'] text-2xl font-bold text-[#008425] dark:text-[#8cfb8b]">
            41 Workers
          </span>
          <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
            Deployed across 4 plots
          </span>
        </div>
      </div>

      {/* Field Acreage Progress List */}
      <div className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs">
        <h3 className="font-['Manrope'] text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
          Active Field Blocks Under Harvest Protocol
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
          Progress tracked via GPS transponders and live crate scales
        </p>

        <div className="space-y-3">
          {fields.map((f) => (
            <div
              key={f.id}
              className="p-4 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:bg-white/75 dark:hover:bg-white/[0.09]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['Manrope'] font-bold text-base text-slate-900 dark:text-white">
                    {f.plot}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      f.urgency === "CRITICAL"
                        ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                        : "bg-emerald-100 text-[#00681b] dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                    }`}
                  >
                    {f.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {f.farm} • {f.acres} Total Acres • Rain arrival in {f.rainEta}
                </p>

                <div className="mt-3">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Harvest Quota Completed</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {f.harvestedPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#008425] dark:bg-[#8cfb8b] h-full rounded-full transition-all duration-500"
                      style={{ width: `${f.harvestedPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => onToast(`GPS route to ${f.plot} sent to phone.`)}
                  className="px-3.5 py-2 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 rounded-xl text-xs font-mono font-medium text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-white/20 transition-colors"
                >
                  Inspect Plot
                </button>
                <button
                  type="button"
                  onClick={onNavigateToDispatch}
                  className="px-4 py-2 bg-[#008425] hover:bg-[#00681b] text-white rounded-xl text-xs font-mono font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Deploy Spot Crew
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
