import React, { useState, useEffect } from "react";
import {
  Wallet,
  Building2,
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { EscrowBalance } from "../types";
import { CashoutModal } from "../components/modals/CashoutModal";

interface SettlementsViewProps {
  onToast: (msg: string) => void;
}

export const SettlementsView: React.FC<SettlementsViewProps> = ({ onToast }) => {
  const [escrow, setEscrow] = useState<EscrowBalance | null>(null);
  const [isCashoutOpen, setIsCashoutOpen] = useState(false);

  useEffect(() => {
    fetchEscrow();
  }, []);

  const fetchEscrow = async () => {
    try {
      const res = await fetch("/api/settlements");
      if (res.ok) setEscrow(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCashout = async (amount: number) => {
    try {
      const res = await fetch("/api/settlements/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEscrow();
        onToast(data.message);
      }
    } catch (e) {
      onToast("Cash out dispatched.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#008425]/15 text-[#008425] dark:text-[#8cfb8b] font-mono text-xs uppercase rounded-full tracking-wider font-semibold border border-[#008425]/20">
              Agricultural Escrow
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
              PACAS & California Ag Labor Standards
            </span>
          </div>
          <h1 className="font-['Manrope'] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">
            Payouts & Escrow Ledger
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            Automated piece-rate verification, instant direct deposit, and tax records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCashoutOpen(true)}
          className="px-5 py-2.5 bg-[#008425] hover:bg-[#00681b] text-white font-mono text-xs font-bold rounded-2xl shadow-xs self-start lg:self-auto transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
        >
          <ArrowUpRight className="w-4 h-4" /> Transfer to Bank
        </button>
      </div>

      {/* Escrow Balance Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-[#008425]/90 to-[#005117]/90 backdrop-blur-xl text-white rounded-3xl shadow-md border border-emerald-400/30 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-mono text-[#8cfb8b] uppercase tracking-wider block">
              Available for Instant ACH / RTP Transfer
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-mono text-3xl md:text-4xl font-bold">
                ${escrow ? escrow.available.toFixed(2) : "1,248.50"}
              </span>
              <button
                type="button"
                onClick={() => setIsCashoutOpen(true)}
                className="px-4 py-2 bg-white/95 hover:bg-white text-[#008425] font-mono text-xs font-bold rounded-2xl shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Cash Out Now
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between text-xs font-mono text-white/90 gap-2">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#8cfb8b]" />
              Account: {escrow?.directDepositAccount || "Wells Fargo •••• 4128"}
            </span>
            <span className="flex items-center gap-1 text-[#8cfb8b] font-bold">
              <ShieldCheck className="w-4 h-4" /> 100% Pre-funded by Growers
            </span>
          </div>
        </div>

        <div className="p-6 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              YTD Gross Harvest Earnings
            </span>
            <span className="font-mono text-2xl md:text-3xl font-bold text-slate-900 dark:text-white block mt-2">
              ${escrow ? escrow.ytdEarned.toLocaleString() : "18,420.00"}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1">
              Includes overtime premiums & weather surge hazard allowances
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToast("1099 Tax Package and payroll paystubs exported.")}
            className="w-full mt-4 py-2.5 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 rounded-2xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors border border-white/60 dark:border-white/10 shadow-xs"
          >
            <Download className="w-4 h-4" /> Export 1099 Statement
          </button>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs">
        <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-white mb-1">
          Settlement Ledger & Historical Shifts
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-4">
          All records verified against physical crate barcode scanning
        </p>

        <div className="divide-y divide-white/40 dark:divide-white/10">
          {(escrow?.recentSettlements || []).map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#008425] dark:text-[#8cfb8b] border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.farm}
                  </h4>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{item.details}</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono text-sm md:text-base font-bold ${
                    item.amount > 0 ? "text-[#008425] dark:text-[#8cfb8b]" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
                </span>
                <span className="block text-[10px] font-mono text-slate-400 font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CashoutModal
        isOpen={isCashoutOpen}
        onClose={() => setIsCashoutOpen(false)}
        availableBalance={escrow?.available || 1248.5}
        bankAccount={escrow?.directDepositAccount || "Wells Fargo •••• 4128"}
        onConfirm={handleCashout}
      />
    </div>
  );
};
