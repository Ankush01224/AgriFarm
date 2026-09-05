import React, { useState, useEffect } from "react";
import {
  Zap,
  MapPin,
  Clock,
  DollarSign,
  Coffee,
  AlertOctagon,
  LogOut,
  Phone,
  MessageSquare,
  ArrowRight,
  CloudRain,
  Bus,
  Wrench,
  Utensils,
  Calendar,
  Navigation,
  Info,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles,
  Plus,
  Car,
  Layers,
  Home,
  Scissors,
  Check,
} from "lucide-react";
import {
  ActiveShift,
  JobRequest,
  WorkScheduleItem,
  EscrowBalance,
  Worker,
} from "../types";
import { CheckoutModal } from "../components/modals/CheckoutModal";
import { HazardModal } from "../components/modals/HazardModal";
import { CashoutModal } from "../components/modals/CashoutModal";
import { SquadModal } from "../components/modals/SquadModal";
import { PreferencesModal } from "../components/modals/PreferencesModal";
import { ChatLeadModal } from "../components/modals/ChatLeadModal";

interface LaborDispatchViewProps {
  searchQuery: string;
  onToast: (msg: string) => void;
}

export const LaborDispatchView: React.FC<LaborDispatchViewProps> = ({
  searchQuery,
  onToast,
}) => {
  // State
  const [shift, setShift] = useState<ActiveShift | null>(null);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [schedule, setSchedule] = useState<WorkScheduleItem[]>([]);
  const [escrow, setEscrow] = useState<EscrowBalance | null>(null);
  const [activeJobCategory, setActiveJobCategory] = useState<"urgent" | "daily" | "contracts">("urgent");

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHazardOpen, setIsHazardOpen] = useState(false);
  const [isCashoutOpen, setIsCashoutOpen] = useState(false);
  const [isSquadOpen, setIsSquadOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Live timer tick for shift
  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(() => {
      setShift((prev) => {
        if (!prev || prev.status === "CHECKED OUT" || prev.isBreakActive) return prev;
        const newHours = Math.round((prev.timeOnFieldHours + 0.005) * 1000) / 1000;
        const newAccrued = Math.round((newHours * prev.baseRate + (prev.quotaPercent * 0.4)) * 100) / 100;
        return {
          ...prev,
          timeOnFieldHours: newHours,
          accruedToday: newAccrued,
        };
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const [shiftRes, jobsRes, schedRes, escrowRes] = await Promise.all([
        fetch("/api/shifts/active"),
        fetch("/api/jobs"),
        fetch("/api/schedule"),
        fetch("/api/settlements"),
      ]);

      if (shiftRes.ok) setShift(await shiftRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (schedRes.ok) setSchedule(await schedRes.json());
      if (escrowRes.ok) setEscrow(await escrowRes.json());
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  // Handlers
  const handleToggleBreak = async () => {
    try {
      const res = await fetch("/api/shifts/toggle-break", { method: "POST" });
      const data = await res.json();
      if (data.success && shift) {
        setShift({
          ...shift,
          isBreakActive: data.isBreakActive,
          status: data.status,
        });
        onToast(data.message);
      }
    } catch (e) {
      onToast("Break toggle recorded offline.");
    }
  };

  const handleConfirmCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/shifts/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setShift(data.shift);
        // Refresh escrow
        const escRes = await fetch("/api/settlements");
        if (escRes.ok) setEscrow(await escRes.json());
        onToast("Shift concluded! Accrued pay deposited into Escrow Ledger.");
      }
    } catch (e) {
      onToast("Checkout complete.");
    } finally {
      setIsCheckingOut(false);
      setIsCheckoutOpen(false);
    }
  };

  const handleReportHazard = async (type: string, notes: string) => {
    try {
      const res = await fetch("/api/shifts/report-hazard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, notes }),
      });
      const data = await res.json();
      onToast(data.message || "Hazard broadcast dispatched.");
    } catch (e) {
      onToast("Hazard reported to supervisor.");
    }
  };

  const handleIncrementYield = async (amount = 1) => {
    try {
      const res = await fetch("/api/shifts/increment-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success && shift) {
        setShift({
          ...shift,
          quotaPercent: data.quotaPercent,
          accruedToday: data.accruedToday,
          crewRoster: data.roster,
        });
        onToast(`+${amount} crate logged for Squad Alpha!`);
      }
    } catch (e) {
      // offline fallback
      if (shift) {
        setShift({
          ...shift,
          quotaPercent: Math.min(100, shift.quotaPercent + amount),
          accruedToday: shift.accruedToday + 1.25,
        });
      }
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/accept`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: "accepted" } : j))
        );
        if (data.schedule) setSchedule(data.schedule);
        onToast(data.message);
      }
    } catch (e) {
      onToast("Job contract accepted and added to schedule!");
    }
  };

  const handleDeclineJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/decline`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: "declined" } : j))
        );
        onToast("Job request declined.");
      }
    } catch (e) {
      onToast("Job marked declined.");
    }
  };

  const handleInstantCashout = async (amount: number) => {
    try {
      const res = await fetch("/api/settlements/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        const escRes = await fetch("/api/settlements");
        if (escRes.ok) setEscrow(await escRes.json());
        onToast(data.message);
      }
    } catch (e) {
      onToast("Instant cash-out dispatched.");
    }
  };

  // Filter jobs based on active tab and search query
  const filteredJobs = jobs.filter((j) => {
    const matchesTab = j.category === activeJobCategory;
    const matchesSearch =
      !searchQuery ||
      j.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (!shift) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#008425] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-neutral-500">Loading Central Valley dispatch ledger...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Top Operational Context Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-black/5 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#008425]/10 text-[#008425] dark:text-[#8cfb8b] font-mono text-xs uppercase rounded tracking-wider font-semibold">
              Labor Dispatch Desk
            </span>
            <span className="text-[#3f4a3c] dark:text-neutral-400 text-xs font-mono">
              • Worker ID: AG-9042
            </span>
          </div>
          <h1 className="font-['Manrope'] text-2xl md:text-3xl lg:text-4xl font-bold text-[#1b1c1c] dark:text-white tracking-tight mt-1">
            Field Crew Operations
          </h1>
          <p className="text-sm md:text-base text-[#3f4a3c] dark:text-neutral-300 font-normal">
            Central Valley Ag Corridor • Spot-calls, rapid weather mobilization & shift logs
          </p>
        </div>

        {/* Rapid Status Metric Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#1a1c1a] p-3 rounded-2xl border border-black/10 dark:border-white/10 shadow-xs self-start lg:self-auto">
          <div className="w-3 h-3 rounded-full bg-[#008425] animate-pulse ml-1 flex-shrink-0" />
          <div className="pr-3">
            <span className="block text-[10px] font-mono text-[#3f4a3c] dark:text-neutral-400 uppercase">
              Mobilization Readiness
            </span>
            <span className="text-xs md:text-sm font-mono text-[#1b1c1c] dark:text-white font-bold">
              READY FOR DEPLOYMENT
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPrefsOpen(true)}
            className="px-3 py-2 bg-[#f5f3f3] dark:bg-[#252825] text-[#1b1c1c] dark:text-neutral-200 hover:bg-[#e4e2e2] dark:hover:bg-[#303530] text-xs font-mono font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            Preferences
          </button>
        </div>
      </div>

      {/* SECTION 2 (Elevated): ACTIVE SHIFT & LIVE YIELD LEDGER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#008425] fill-[#008425]" />
            <h2 className="font-['Manrope'] text-lg md:text-xl font-bold text-[#1b1c1c] dark:text-white">
              Active Shift & Live Yield Ledger
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase bg-[#a9f5a7] dark:bg-[#1f3d23] text-[#1b4d22] dark:text-[#a9f5a7] px-2.5 py-1 rounded-full font-bold">
              Live Shift Sync
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Live Shift Console (7 cols) */}
          <div className="lg:col-span-7 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#008425]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div>
              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/40 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        shift.status === "CHECKED IN"
                          ? "bg-[#008425] text-white"
                          : shift.status === "ON BREAK"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {shift.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      SHIFT #{shift.shiftId}
                    </span>
                  </div>
                  <h3 className="font-['Manrope'] text-xl md:text-2xl text-slate-900 dark:text-white mt-1.5 font-bold">
                    {shift.farmName}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#008425]" />
                    {shift.plot}
                  </p>
                </div>

                {/* Cadence badge */}
                <div className="text-right">
                  <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                    Crew Cadence
                  </span>
                  <span className="font-mono text-base md:text-lg text-[#008425] dark:text-[#8cfb8b] font-bold">
                    {shift.cadence} Crates / Hr
                  </span>
                </div>
              </div>

              {/* Mid Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10">
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    TIME ON FIELD
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-base md:text-lg text-slate-900 dark:text-white font-bold">
                      {shift.timeOnFieldHours.toFixed(1)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">hrs</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#008425] dark:text-[#8cfb8b]">
                    Started {shift.startTime}
                  </span>
                </div>

                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10">
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    BASE RATE
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-base md:text-lg text-slate-900 dark:text-white font-bold">
                      ${shift.baseRate.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/hr</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#008425] dark:text-[#8cfb8b]">
                    + Piece bonus
                  </span>
                </div>

                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10">
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    ACCRUED TODAY
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-['Manrope'] text-lg md:text-xl text-[#008425] dark:text-[#8cfb8b] font-bold">
                      ${shift.accruedToday.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Escrow secured
                  </span>
                </div>

                <div className="p-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10">
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    BREAK ELIGIBILITY
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-base md:text-lg text-slate-900 dark:text-white font-bold">
                      {shift.isBreakActive ? "Active" : shift.breakEligibleIn}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#008425] dark:text-[#8cfb8b]">
                    Paid 15-min rest
                  </span>
                </div>
              </div>

              {/* Live Shift Timeline Indicator */}
              <div className="p-3.5 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 mb-4">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Harvest Shift Quota Progress (Block 12B)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleIncrementYield(1)}
                      className="px-2 py-0.5 bg-[#008425] hover:bg-[#00681b] text-white text-[10px] font-bold rounded flex items-center gap-0.5 transition-colors"
                      title="Quick log 1 crate harvested"
                    >
                      <Plus className="w-3 h-3" /> 1 Box
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {shift.quotaPercent}% Reached
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#008425] dark:bg-[#8cfb8b] h-full rounded-full transition-all duration-500"
                    style={{ width: `${shift.quotaPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-400 mt-1.5">
                  <span>05:30 Check-in</span>
                  <span>10:30 Pallet Transition</span>
                  <span>13:30 Pack-out Target</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-white/40 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={shift.status === "CHECKED OUT"}
                  onClick={handleToggleBreak}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                    shift.isBreakActive
                      ? "bg-amber-500 text-white font-bold"
                      : "bg-white/60 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/20 border border-white/60 dark:border-white/10"
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  {shift.isBreakActive ? "End Rest Break" : "Start Rest Break"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsHazardOpen(true)}
                  className="px-3.5 py-2 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium rounded-xl transition-colors flex items-center gap-1.5 border border-white/60 dark:border-white/10"
                >
                  <AlertOctagon className="w-4 h-4 text-red-500" />
                  Report Field Hazard
                </button>
              </div>

              {shift.status === "CHECKED OUT" ? (
                <button
                  type="button"
                  onClick={() => {
                    fetch("/api/shifts/checkin", { method: "POST" })
                      .then((r) => r.json())
                      .then((d) => {
                        if (d.success) setShift(d.shift);
                        onToast("New shift started!");
                      });
                  }}
                  className="px-4 py-2 bg-[#008425] text-white font-mono text-xs font-bold rounded-xl shadow-xs"
                >
                  Begin Next Field Shift
                </button>
              ) : (
                <button
                  type="button"
                  id="checkout-trigger"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#991414] text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Complete & Check-Out
                </button>
              )}
            </div>
          </div>

          {/* Supervisor & Crew Context (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Supervisor Card */}
            <div className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 border border-white/50 dark:border-white/10 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Field Lead & Foreman
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#008425] dark:text-[#8cfb8b] font-semibold bg-green-100/60 dark:bg-green-950/40 px-2.5 py-1 rounded-full border border-green-200/50 dark:border-green-800/40">
                  <span className="w-2 h-2 rounded-full bg-[#008425] animate-ping" />
                  {shift.foreman.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center font-['Manrope'] font-bold text-base border border-white/60 dark:border-white/15">
                  MR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Manrope'] font-bold text-base text-slate-900 dark:text-white truncate">
                    {shift.foreman.name}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {shift.foreman.role}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${shift.foreman.phone.replace(/[^0-9]/g, "")}`}
                    className="w-9 h-9 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-[#008425] hover:text-white transition-colors border border-white/60 dark:border-white/10"
                    title="Direct Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsChatOpen(true)}
                    className="w-9 h-9 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-[#008425] hover:text-white transition-colors border border-white/60 dark:border-white/10"
                    title="Radio Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs font-mono bg-white/50 dark:bg-white/[0.05] p-3 rounded-2xl border border-white/60 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400">
                  Radio Channel: <strong className="text-slate-900 dark:text-white">{shift.foreman.radio}</strong>
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Muster: <strong className="text-slate-900 dark:text-white">{shift.foreman.muster}</strong>
                </span>
              </div>
            </div>

            {/* Crew on Shift List */}
            <div className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 border border-white/50 dark:border-white/10 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Crew Shift Roster ({shift.crewRoster.length} of 10 Present)
                  </span>
                  <span className="text-xs font-mono text-[#008425] dark:text-[#8cfb8b] font-bold">
                    Squad Alpha
                  </span>
                </div>
                <div className="space-y-2">
                  {shift.crewRoster.slice(0, 3).map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-white/60 dark:border-white/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] text-xs font-mono font-bold flex items-center justify-center border border-green-200/50 dark:border-green-800/40">
                          {w.initials}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-white block leading-tight">
                            {w.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {w.role}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#008425] dark:text-[#8cfb8b] font-bold">
                        {w.boxes} Boxes
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>+ {Math.max(0, shift.crewRoster.length - 3)} other harvesters logged in</span>
                <button
                  type="button"
                  onClick={() => setIsSquadOpen(true)}
                  className="text-[#008425] dark:text-[#8cfb8b] font-bold hover:underline flex items-center gap-1 font-mono text-xs"
                >
                  Full Squad View <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INCOMING FARMER WORK REQUESTS & URGENT HARVEST CALLS */}
      <section className="space-y-4">
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900/50 uppercase">
                Time-Sensitive Opportunities
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                14 Openings In Your Radius
              </span>
            </div>
            <h2 className="font-['Manrope'] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Incoming Farmer Work Requests
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
              Direct contracts from verified agricultural producers across Central Valley
            </p>
          </div>

          {/* Segmented Category Switcher */}
          <div className="inline-flex p-1.5 bg-white/50 dark:bg-white/[0.08] backdrop-blur-xl rounded-2xl self-start md:self-auto overflow-x-auto max-w-full border border-white/60 dark:border-white/10 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveJobCategory("urgent")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                activeJobCategory === "urgent"
                  ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-xs backdrop-blur-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CloudRain className="w-4 h-4 text-red-500" />
              Urgent Weather Harvest (Rain Risk)
            </button>
            <button
              type="button"
              onClick={() => setActiveJobCategory("daily")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeJobCategory === "daily"
                  ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-xs backdrop-blur-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Daily Shifts
            </button>
            <button
              type="button"
              onClick={() => setActiveJobCategory("contracts")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeJobCategory === "contracts"
                  ? "bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-xs backdrop-blur-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Crew Contracts (Weekly)
            </button>
          </div>
        </div>

        {/* Active Weather Alert Banner */}
        <div className="p-4 bg-red-500/10 dark:bg-red-950/40 text-red-900 dark:text-red-200 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-red-400/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wide block">
                Severe Weather Surge Pricing Activated
              </span>
              <p className="text-xs md:text-sm text-red-800/90 dark:text-red-200/90">
                Pacific low-pressure front arriving in 36h. Farmers paying +20% to +40% premium hazard rates for prompt crew dispatch.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-white/80 dark:bg-black/50 backdrop-blur-md text-red-700 dark:text-red-300 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border border-red-300/40 dark:border-red-900/40">
            WINDOW CLOSES: 38h 12m
          </span>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 dark:border-white/10 shadow-xs flex flex-col justify-between hover:border-white/80 hover:shadow-xl transition-all group"
            >
              <div>
                {/* Visual Header with Real Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={job.imageUrl}
                    alt={job.farm}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                  {/* Top tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 bg-red-600/90 text-white text-[10px] font-mono font-bold rounded-full uppercase flex items-center gap-1 shadow-sm backdrop-blur-xs">
                      <Clock className="w-3 h-3" /> {job.alertTag}
                    </span>
                    <span className="px-2.5 py-0.5 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-mono font-bold rounded-full shadow-sm backdrop-blur-xs">
                      {job.workersNeeded} Workers Needed
                    </span>
                  </div>

                  {/* Bottom title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-mono text-[#8cfb8b] block font-bold tracking-wider">
                      CROP: {job.crop}
                    </span>
                    <h3 className="font-['Manrope'] text-base md:text-lg font-bold truncate">
                      {job.farm}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 md:p-5">
                  {/* Rate & Incentive */}
                  <div className="flex items-baseline justify-between pb-3 border-b border-white/40 dark:border-white/10">
                    <div>
                      <span className="font-['Manrope'] text-2xl text-[#008425] dark:text-[#8cfb8b] font-bold">
                        ${job.rate.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-1">
                        {job.rateSuffix}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        job.rateBadgeType === "error"
                          ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                          : "bg-green-100/70 dark:bg-green-950/50 text-[#008425] dark:text-[#8cfb8b] border border-green-200/50 dark:border-green-800/40"
                      }`}
                    >
                      {job.rateBadge}
                    </span>
                  </div>

                  {/* Specifications List */}
                  <div className="space-y-2 py-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-[#008425] flex-shrink-0" />
                      <span>{job.musterTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Bus className="w-4 h-4 text-[#008425] flex-shrink-0" />
                      <span className="truncate">{job.transit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Wrench className="w-4 h-4 text-[#008425] flex-shrink-0" />
                      <span className="truncate">{job.equipment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Utensils className="w-4 h-4 text-[#008425] flex-shrink-0" />
                      <span className="truncate">{job.amenities}</span>
                    </div>
                  </div>

                  {/* Mini Spec Table */}
                  <div className="grid grid-cols-2 gap-2 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md p-2.5 rounded-2xl font-mono text-[11px] border border-white/50 dark:border-white/10">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
                        ESCROW STATUS
                      </span>
                      <span className="text-slate-800 dark:text-white font-bold">
                        {job.escrowStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
                        GROWER RATING
                      </span>
                      <span className="text-[#008425] dark:text-[#8cfb8b] font-bold">
                        ★ {job.growerRating.toFixed(1)} ({job.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 md:p-5 pt-0 flex items-center gap-2">
                {job.status === "accepted" ? (
                  <div className="w-full py-2 bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] border border-green-200/60 dark:border-green-800/40 font-mono text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-xs">
                    <Check className="w-4 h-4" /> Contract Confirmed
                  </div>
                ) : job.status === "declined" ? (
                  <div className="w-full py-2 bg-white/40 dark:bg-white/10 text-slate-400 font-mono text-xs font-bold rounded-xl text-center border border-white/50 dark:border-white/10">
                    Declined
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAcceptJob(job.id)}
                      className="flex-1 py-2.5 bg-[#008425] hover:bg-[#00681b] text-white font-mono text-xs font-bold rounded-xl transition-colors text-center shadow-xs"
                    >
                      Accept Job Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineJob(job.id)}
                      className="px-4 py-2.5 bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/20 border border-white/60 dark:border-white/15 font-mono text-xs rounded-xl transition-colors"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 CONTINUED: UPCOMING SCHEDULE & SETTLEMENT HISTORIC LEDGER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confirmed Work Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-['Manrope'] text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                Upcoming Work Schedule
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Confirmed producer agreements and dispatch windows
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToast("Calendar sync link exported (.ics format)")}
              className="px-3 py-1.5 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors border border-white/60 dark:border-white/10"
            >
              <Calendar className="w-3.5 h-3.5 text-[#008425]" />
              Sync iCal
            </button>
          </div>

          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="p-3.5 md:p-4 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/50 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center shadow-xs border border-white/60 dark:border-white/10 flex-shrink-0">
                    <span className="text-[10px] font-mono text-red-500 font-bold uppercase">
                      {item.day}
                    </span>
                    <span className="font-['Manrope'] text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {item.date}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Manrope'] text-sm md:text-base text-slate-900 dark:text-white font-bold">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          item.status === "CONFIRMED"
                            ? "bg-green-100/80 text-[#008425] dark:bg-green-950/60 dark:text-[#8cfb8b] border border-green-200/50 dark:border-green-800/40"
                            : "bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {item.producer} • {item.hours}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400 dark:text-slate-400">
                      <span>Crew size: {item.crewSize}</span>
                      <span>•</span>
                      <span>{item.rate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onToast(`GPS route to ${item.producer} opened in navigation.`)}
                    title="Get Directions"
                    className="p-2 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-xl text-slate-700 dark:text-slate-300 transition-colors border border-white/60 dark:border-white/10"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChatOpen(true)}
                    title="Contact Dispatch Lead"
                    className="p-2 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-xl text-slate-700 dark:text-slate-300 transition-colors border border-white/60 dark:border-white/10"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History & Instant Direct Deposit (5 cols) */}
        <div className="lg:col-span-5 bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Manrope'] text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                Payouts & Escrow Ledger
              </h3>
              <span className="text-[11px] font-mono text-[#008425] dark:text-[#8cfb8b] flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Deposit Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Payments are held in agricultural escrow and disbursed upon shift signoff.
            </p>

            {/* Balance Card */}
            <div className="p-4 md:p-5 bg-gradient-to-br from-[#008425] to-[#005117] text-white rounded-2xl mb-4 shadow-sm relative overflow-hidden">
              <span className="text-[10px] font-mono text-[#8cfb8b] uppercase tracking-wider block">
                Available for Instant Transfer
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono text-2xl md:text-3xl font-bold leading-none">
                  ${escrow ? escrow.available.toFixed(2) : "1,248.50"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCashoutOpen(true)}
                  className="px-4 py-2 bg-white text-[#008425] hover:bg-[#a9f5a7] font-mono text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Cash Out Now
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-mono text-white/85">
                <span>Direct Deposit: {escrow?.directDepositAccount || "Wells Fargo •••• 4128"}</span>
                <span>Fee: $0.00</span>
              </div>
            </div>

            {/* Recent Settlements List */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Recent Settlements
              </span>
              {(escrow?.recentSettlements || []).slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md rounded-2xl flex items-center justify-between border border-white/50 dark:border-white/10"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#008425] flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-white block leading-tight">
                        {item.farm}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.details}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold ${
                        item.amount > 0 ? "text-slate-900 dark:text-white" : "text-red-600"
                      }`}
                    >
                      {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
                    </span>
                    <span className="text-[10px] font-mono text-[#008425] dark:text-[#8cfb8b] block font-semibold">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onToast("1099-MISC Agricultural Dispatch Ledger downloaded")}
              className="text-xs font-mono text-[#008425] dark:text-[#8cfb8b] font-bold hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> Download 1099 Tax Ledger
            </button>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              YTD Earned: ${escrow ? escrow.ytdEarned.toLocaleString() : "18,420.00"}
            </span>
          </div>
        </div>
      </section>

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleConfirmCheckout}
        shift={shift}
        loading={isCheckingOut}
      />

      <HazardModal
        isOpen={isHazardOpen}
        onClose={() => setIsHazardOpen(false)}
        onSubmit={handleReportHazard}
      />

      <CashoutModal
        isOpen={isCashoutOpen}
        onClose={() => setIsCashoutOpen(false)}
        availableBalance={escrow?.available || 1248.5}
        bankAccount={escrow?.directDepositAccount || "Wells Fargo •••• 4128"}
        onConfirm={handleInstantCashout}
      />

      <SquadModal
        isOpen={isSquadOpen}
        onClose={() => setIsSquadOpen(false)}
        roster={shift.crewRoster}
        onIncrementWorkerYield={() => handleIncrementYield(1)}
      />

      <PreferencesModal
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
        onSave={() => onToast("Mobilization preferences updated.")}
      />

      <ChatLeadModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        foremanName={shift.foreman.name}
        radioChannel={shift.foreman.radio}
      />
    </div>
  );
};
