import React, { useState } from "react";
import { Users, X, Plus, ShieldCheck } from "lucide-react";
import { Worker } from "../../types";

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: Worker[];
  onIncrementWorkerYield: (workerId: string) => void;
}

export const SquadModal: React.FC<SquadModalProps> = ({
  isOpen,
  onClose,
  roster,
  onIncrementWorkerYield,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/85 dark:bg-[#0f141d]/90 backdrop-blur-2xl max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-white/80 dark:border-white/15 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] border border-green-200/60 dark:border-green-800/40 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] text-lg font-bold text-slate-800 dark:text-white">
              Full Squad Alpha Roster
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {roster.length} Harvesters Logged In • Block 12B Romaine
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {roster.map((worker) => (
            <div
              key={worker.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-white/60 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] font-mono text-xs font-bold flex items-center justify-center border border-green-200/50 dark:border-green-800/40">
                  {worker.initials}
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white block leading-tight">
                    {worker.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {worker.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-[#008425] dark:text-[#8cfb8b]">
                  {worker.boxes} Boxes
                </span>
                <button
                  type="button"
                  onClick={() => onIncrementWorkerYield(worker.id)}
                  title="Add 1 Box"
                  className="p-1.5 rounded-lg bg-[#008425] text-white hover:bg-[#00681b] transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Squad Lead: Eduardo Reyes</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#008425] hover:bg-[#00681b] text-white font-bold rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
