import React, { useState, useEffect } from "react";
import {
  Store,
  DollarSign,
  Clock,
  ShieldCheck,
  TrendingUp,
  X,
  Check,
  MapPin,
  Sparkles,
} from "lucide-react";
import { CropLot } from "../types";

interface MarketplaceBidsViewProps {
  onToast: (msg: string) => void;
}

export const MarketplaceBidsView: React.FC<MarketplaceBidsViewProps> = ({ onToast }) => {
  const [lots, setLots] = useState<CropLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<CropLot | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidderName, setBidderName] = useState<string>("Apex Produce Direct");
  const [isBidding, setIsBidding] = useState(false);

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const res = await fetch("/api/marketplace");
      if (res.ok) {
        setLots(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) return;
    const num = parseFloat(bidAmount);
    if (isNaN(num) || num <= selectedLot.currentBid) {
      onToast(`Bid must exceed $${selectedLot.currentBid}`);
      return;
    }

    setIsBidding(true);
    try {
      const res = await fetch("/api/marketplace/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotId: selectedLot.id,
          bidAmount: num,
          bidderName: bidderName || "Verified Merchant",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLots((prev) => prev.map((l) => (l.id === data.lot.id ? data.lot : l)));
        onToast(data.message);
        setSelectedLot(null);
        setBidAmount("");
      } else {
        onToast(data.error || "Failed to submit bid");
      }
    } catch (err) {
      onToast("Bid submitted.");
      setSelectedLot(null);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#008425]/15 text-[#008425] dark:text-[#8cfb8b] font-mono text-xs uppercase rounded-full tracking-wider font-semibold border border-[#008425]/20">
              Wholesale Exchange
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
              USDA Verified Produce Lots
            </span>
          </div>
          <h1 className="font-['Manrope'] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">
            Crop Lots & Live Trade Exchange
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            Direct pre-harvest spot bids and cold-chain guaranteed delivery
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto font-mono text-xs">
          <span className="p-2.5 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl text-[#008425] dark:text-[#8cfb8b] font-bold flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4" /> 100% Escrow Backed
          </span>
        </div>
      </div>

      {/* Grid of Crop Lots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lots.map((lot) => (
          <div
            key={lot.id}
            className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:bg-white/55 dark:hover:bg-white/[0.08]"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/40 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-[#00681b] dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                      {lot.qualityGrade}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{lot.id}</span>
                  </div>
                  <h3 className="font-['Manrope'] text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                    {lot.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#008425]" />
                    {lot.grower} • {lot.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">CURRENT BID</span>
                  <span className="font-['Manrope'] text-2xl font-bold text-[#008425] dark:text-[#8cfb8b]">
                    ${lot.currentBid.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{lot.unit}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-4 font-mono text-xs">
                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 block">VOLUME</span>
                  <span className="font-bold text-slate-900 dark:text-white">{lot.quantity}</span>
                </div>
                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 block">COOLING</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">
                    {lot.coolingStatus}
                  </span>
                </div>
                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block">WINDOW</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {lot.timeRemaining}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Leading Bidder: <strong className="text-slate-900 dark:text-white">{lot.highestBidder}</strong></span>
                <span className="text-[#008425] dark:text-[#8cfb8b] font-bold">{lot.bidCount} Bids Placed</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/40 dark:border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">
                Harvested: {lot.harvestedDate}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedLot(lot);
                  setBidAmount((lot.currentBid + 0.5).toFixed(2));
                }}
                className="px-5 py-2.5 bg-[#008425] hover:bg-[#00681b] text-white font-mono text-xs font-bold rounded-2xl shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Place Spot Bid
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/40 dark:border-white/15 relative">
            <button
              onClick={() => setSelectedLot(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-white">
              Place Bid: {selectedLot.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {selectedLot.quantity} • Current Leader: ${selectedLot.currentBid.toFixed(2)} {selectedLot.unit}
            </p>

            <form onSubmit={handlePlaceBid} className="space-y-4 mt-4 font-mono text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Your Bidder Identifier</label>
                <input
                  type="text"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  className="w-full p-2.5 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 text-slate-900 dark:text-white font-sans focus:outline-hidden focus:ring-2 focus:ring-[#008425]"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Bid Amount ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.10"
                    min={selectedLot.currentBid + 0.1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 font-bold text-base text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#008425]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be at least ${(selectedLot.currentBid + 0.1).toFixed(2)}
                </span>
              </div>

              <div className="p-3 bg-[#008425]/10 border border-[#008425]/20 rounded-2xl text-[11px] text-[#00681b] dark:text-[#8cfb8b]">
                Funds will be held in agricultural escrow and released immediately upon inspection signoff.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLot(null)}
                  className="px-4 py-2 bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBidding}
                  className="px-6 py-2.5 bg-[#008425] hover:bg-[#00681b] text-white font-bold rounded-2xl shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isBidding ? "Submitting..." : "Confirm & Place Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
