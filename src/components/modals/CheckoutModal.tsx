import React from "react";
import { LogOut, CheckCircle2, X } from "lucide-react";
import { ActiveShift } from "../../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shift: ActiveShift;
  loading?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  shift,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/85 dark:bg-[#0f141d]/90 backdrop-blur-2xl max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/80 dark:border-white/15 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
          <div className="w-10 h-10 rounded-2xl bg-red-100/70 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/40 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] text-lg font-bold text-slate-800 dark:text-white">
              End Shift Confirmation
            </h3>
            <span className="text-xs font-mono text-slate-400">SHIFT #{shift.shiftId}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          You are clocking out from{" "}
          <strong className="text-slate-900 dark:text-white font-semibold">
            {shift.farmName} (Organic Romaine)
          </strong>
          .
        </p>

        <div className="bg-white/60 dark:bg-white/[0.06] backdrop-blur-md p-4 rounded-2xl mb-5 space-y-2.5 text-xs font-mono border border-white/60 dark:border-white/10 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Total Duration:</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {Math.floor(shift.timeOnFieldHours)} Hours {Math.round((shift.timeOnFieldHours % 1) * 60)} Mins
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Standard Rate ($28/hr):</span>
            <span className="text-slate-900 dark:text-white font-bold">
              ${(shift.timeOnFieldHours * shift.baseRate).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Piece Rate Accrued:</span>
            <span className="text-[#008425] dark:text-[#8cfb8b] font-bold">
              ${(shift.accruedToday - shift.timeOnFieldHours * shift.baseRate).toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-white/80 dark:bg-white/10 my-1" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-800 dark:text-slate-200 font-bold">Total Shift Escrow:</span>
            <span className="text-[#008425] dark:text-[#8cfb8b] font-bold text-base">
              ${shift.accruedToday.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Foreman Verification:</span>
            <span className="text-[#008425] dark:text-[#8cfb8b] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {shift.foreman.name} (Signed)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/15 rounded-xl text-xs font-mono font-medium transition-all"
          >
            Return to Shift
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-2"
          >
            {loading ? "Processing..." : "Confirm Check-Out"}
          </button>
        </div>
      </div>
    </div>
  );
};
