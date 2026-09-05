import React, { useState } from "react";
import { DollarSign, Check, X, Building2, Zap } from "lucide-react";

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  bankAccount: string;
  onConfirm: (amount: number) => void;
}

export const CashoutModal: React.FC<CashoutModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  bankAccount,
  onConfirm,
}) => {
  const [amount, setAmount] = useState(availableBalance.toFixed(2));
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0 && val <= availableBalance) {
      onConfirm(val);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }
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
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] text-lg font-bold text-slate-800 dark:text-white">
              Instant Payout Transfer
            </h3>
            <span className="text-xs font-mono text-[#008425] dark:text-[#8cfb8b] font-semibold">
              RTP / FedNow 24/7 Escrow Settlement
            </span>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] border border-green-200/60 dark:border-green-800/40 flex items-center justify-center mb-3 shadow-inner">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-['Manrope'] font-bold text-lg text-slate-800 dark:text-white">
              Transfer Dispatched!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              ${parseFloat(amount).toFixed(2)} sent directly to {bankAccount}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-white/60 dark:border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Available Escrow Balance</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  ${availableBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Direct Deposit Destination</span>
                <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#008425]" />
                  {bankAccount}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Transfer Processing Fee</span>
                <span className="text-[#008425] dark:text-[#8cfb8b] font-bold">$0.00 (AgriConnect Subsidized)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                Transfer Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  max={availableBalance}
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-16 py-2.5 bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/15 rounded-xl font-mono text-base font-bold text-slate-800 dark:text-white focus:ring-1 focus:ring-[#008425] backdrop-blur-md"
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance.toFixed(2))}
                  className="absolute right-2.5 top-2 text-[11px] font-mono font-bold text-[#008425] dark:text-[#8cfb8b] bg-green-100/70 dark:bg-green-950/50 px-2 py-1 rounded-lg border border-green-200/50 dark:border-green-800/40"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/15 rounded-xl text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#008425] hover:bg-[#00681b] text-white rounded-xl text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                Disburse ${parseFloat(amount || "0").toFixed(2)} Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
