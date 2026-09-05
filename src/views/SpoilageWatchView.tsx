import React, { useState } from "react";
import { Timer, AlertTriangle, CloudRain, Flame, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";

interface SpoilageWatchViewProps {
  onToast: (msg: string) => void;
  onNavigateToDispatch: () => void;
}

export const SpoilageWatchView: React.FC<SpoilageWatchViewProps> = ({
  onToast,
  onNavigateToDispatch,
}) => {
  const [countdown, setCountdown] = useState({ hours: 47, minutes: 48 });

  const vulnerableLots = [
    {
      id: "SPL-1",
      crop: "Bing Sweet Cherries",
      grower: "Linden Ridge Orchards",
      hazard: "Rain skin rupture & brown rot",
      hoursToCritical: 24,
      lossValue: "$62,500",
      recommendedAction: "Complete mechanical shaking and hand-picking before rain front",
      urgency: "CRITICAL",
    },
    {
      id: "SPL-2",
      crop: "Romaine Heart Lettuce",
      grower: "Valley Green Farm (Plot 12B)",
      hazard: "Tipburn and bacterial leaf blight from humidity surge",
      hoursToCritical: 36,
      lossValue: "$48,000",
      recommendedAction: "Accelerate field pack-out into cold hydro-vac trailers",
      urgency: "HIGH",
    },
    {
      id: "SPL-3",
      crop: "Autumn Royal Seedless Grapes",
      grower: "SunHarvest Vineyards Block 9",
      hazard: "Berry shatter & bunch rot risk",
      hoursToCritical: 48,
      lossValue: "$84,000",
      recommendedAction: "Apply sulfur dioxide pads and expedite packing rig muster",
      urgency: "HIGH",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-red-500/15 text-red-600 dark:text-red-400 font-mono text-xs uppercase rounded-full tracking-wider font-bold border border-red-500/20">
              Critical Weather Window
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
              Pacific Low Pressure Alert
            </span>
          </div>
          <h1 className="font-['Manrope'] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">
            Spoilage Risk Monitor & Crop Rescue
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            Automated shelf-life degradation tracking and emergency harvest dispatch
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToDispatch}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold rounded-2xl shadow-xs self-start lg:self-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
        >
          <Timer className="w-4 h-4" /> Mobilize Emergency Harvesters
        </button>
      </div>

      {/* Main Countdown Gauge Banner */}
      <div className="p-6 bg-gradient-to-r from-red-600/90 to-red-800/90 backdrop-blur-xl text-white rounded-3xl shadow-lg border border-red-400/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-100 block mb-1">
              Rain Arrival Timeline • Central Valley Ag Corridor
            </span>
            <h2 className="font-['Manrope'] text-3xl md:text-5xl font-extrabold tracking-tight">
              {countdown.hours}h {countdown.minutes}m Until Rain Front
            </h2>
            <p className="text-xs md:text-sm text-white/90 max-w-xl mt-2 font-mono">
              Precipitation will cause immediate fruit splitting and mold expansion. All harvest operations must achieve pack-out threshold before rainfall commences.
            </p>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/20 backdrop-blur-md text-center shrink-0">
            <span className="text-[10px] font-mono uppercase text-red-200 block">
              ESTIMATED CROP CAPITAL AT RISK
            </span>
            <span className="font-['Manrope'] text-2xl md:text-3xl font-extrabold text-white block mt-1">
              $194,500.00
            </span>
            <span className="text-[11px] font-mono text-[#8cfb8b] font-bold mt-1 block">
              3 Lots Protected by Escrow
            </span>
          </div>
        </div>

        {/* Degradation Timeline Bar from specifications */}
        <div className="mt-6 pt-5 border-t border-white/20">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-[#8cfb8b] font-bold">Field Harvest (#008425)</span>
            <span className="text-amber-300 font-bold">Grade-B Transition (#D97706)</span>
            <span className="text-red-200 font-bold">Spoilage Hazard (#C93B2B)</span>
          </div>
          <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden flex">
            <div className="bg-[#008425] h-full" style={{ width: "35%" }} />
            <div className="bg-[#d97706] h-full" style={{ width: "40%" }} />
            <div className="bg-red-600 h-full" style={{ width: "25%" }} />
          </div>
        </div>
      </div>

      {/* Vulnerable Crop Lots */}
      <div className="space-y-4">
        <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-white">
          Active Lots Under Spoilage Watch
        </h3>

        {vulnerableLots.map((lot) => (
          <div
            key={lot.id}
            className="p-5 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:bg-white/55 dark:hover:bg-white/[0.08]"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-['Manrope'] font-bold text-base text-slate-900 dark:text-white">
                  {lot.crop}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• {lot.grower}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    lot.urgency === "CRITICAL"
                      ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
                  }`}
                >
                  {lot.hoursToCritical}h to Critical
                </span>
              </div>

              <div className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Hazard: {lot.hazard}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                Mitigation Protocol: {lot.recommendedAction}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center">
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">VALUE AT RISK</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {lot.lossValue}
                </span>
              </div>

              <button
                type="button"
                onClick={onNavigateToDispatch}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold rounded-2xl shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
              >
                Send Crew <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
