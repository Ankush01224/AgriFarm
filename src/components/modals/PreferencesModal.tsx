import React, { useState } from "react";
import { Sliders, X, Radio, Check } from "lucide-react";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prefs: any) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [radius, setRadius] = useState(35);
  const [minRate, setMinRate] = useState(27.0);
  const [transitRequired, setTransitRequired] = useState(true);
  const [rainHazardAlerts, setRainHazardAlerts] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ radius, minRate, transitRequired, rainHazardAlerts });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/85 dark:bg-[#0f141d]/90 backdrop-blur-2xl max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/80 dark:border-white/15 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] border border-green-200/60 dark:border-green-800/40 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] text-lg font-bold text-slate-800 dark:text-white">
              Mobilization Preferences
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Central Valley Labor Dispatch Filters
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Dispatch Radius
              </span>
              <span className="text-[#008425] dark:text-[#8cfb8b] font-bold">{radius} miles</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-[#008425]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Local (10mi)</span>
              <span>All Central Valley (100mi)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Minimum Hourly Base Rate
              </span>
              <span className="text-[#008425] dark:text-[#8cfb8b] font-bold">${minRate.toFixed(2)} / hr</span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              step="0.5"
              value={minRate}
              onChange={(e) => setMinRate(Number(e.target.value))}
              className="w-full accent-[#008425]"
            />
          </div>

          <div className="pt-2 space-y-2 border-t border-white/40 dark:border-white/10">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.05] border border-white/60 dark:border-white/10 cursor-pointer">
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                Prioritize Provider Transportation
              </span>
              <input
                type="checkbox"
                checked={transitRequired}
                onChange={(e) => setTransitRequired(e.target.checked)}
                className="w-4 h-4 accent-[#008425] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.05] border border-white/60 dark:border-white/10 cursor-pointer">
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                Severe Weather Emergency Alerts
              </span>
              <input
                type="checkbox"
                checked={rainHazardAlerts}
                onChange={(e) => setRainHazardAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#008425] rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/40 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/15 rounded-xl text-xs font-mono"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#008425] hover:bg-[#00681b] text-white rounded-xl text-xs font-mono font-bold transition-all shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
