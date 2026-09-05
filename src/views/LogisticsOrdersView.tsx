import React from "react";
import { Truck, MapPin, CheckCircle2, Clock, Thermometer, ShieldCheck } from "lucide-react";

interface LogisticsOrdersViewProps {
  onToast: (msg: string) => void;
}

export const LogisticsOrdersView: React.FC<LogisticsOrdersViewProps> = ({ onToast }) => {
  const shipments = [
    {
      id: "BOL-9902",
      cargo: "Organic Romaine Hearts (800 Crates)",
      origin: "Firebaugh Packing Shed #2",
      destination: "Golden State Cold Storage (Fresno)",
      driver: "Hector Morales (Rig #402)",
      tempF: "34.2°F (Continuous Cold Chain)",
      status: "IN TRANSIT",
      eta: "Today 01:15 PM",
      progress: 72,
    },
    {
      id: "BOL-9884",
      cargo: "Bing Cherries (1,200 Flats)",
      origin: "Linden Ridge Facility",
      destination: "SF Wholesale Produce Market",
      driver: "Marco Gutierrez (Reefer 18)",
      tempF: "32.8°F (Controlled Atmosphere)",
      status: "IN TRANSIT",
      eta: "Today 03:45 PM",
      progress: 48,
    },
    {
      id: "BOL-9750",
      cargo: "Delano Table Grapes (1,400 Lugs)",
      origin: "SunHarvest Loading Bay",
      destination: "LA Regional Distribution Hub",
      driver: "David Chen (Fleet Truck 09)",
      tempF: "33.5°F (Verified)",
      status: "DELIVERED & INSPECTED",
      eta: "Completed 09:30 AM",
      progress: 100,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/40 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#008425]/15 text-[#008425] dark:text-[#8cfb8b] font-mono text-xs uppercase rounded-full tracking-wider font-semibold border border-[#008425]/20">
              Cold Chain Logistics
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
              Reefer Telemetry & Bill of Lading
            </span>
          </div>
          <h1 className="font-['Manrope'] text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1.5">
            Logistics & Reefer Transport
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            Real-time GPS dispatch, pulp temperature monitoring, and signed e-BOL records
          </p>
        </div>

        <button
          type="button"
          onClick={() => onToast("Dispatch manifests exported to CSV")}
          className="px-4 py-2.5 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-xs font-mono font-bold rounded-2xl self-start lg:self-auto hover:bg-white/80 dark:hover:bg-white/20 transition-colors text-slate-800 dark:text-slate-200 shadow-xs"
        >
          Export Freight Manifest
        </button>
      </div>

      <div className="space-y-4">
        {shipments.map((s) => (
          <div
            key={s.id}
            className="bg-white/40 dark:bg-white/[0.05] backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-white/50 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden transition-all duration-200 hover:bg-white/55 dark:hover:bg-white/[0.08]"
          >
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#008425] dark:text-[#8cfb8b]">{s.id}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    s.status === "DELIVERED & INSPECTED"
                      ? "bg-emerald-100 text-[#00681b] dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <h3 className="font-['Manrope'] text-base md:text-lg font-bold text-slate-900 dark:text-white">
                {s.cargo}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#008425] shrink-0" />
                  <span>Origin: {s.origin}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Dest: {s.destination}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.driver}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#008425] dark:text-[#8cfb8b] font-bold">
                  <Thermometer className="w-3.5 h-3.5 shrink-0" />
                  <span>{s.tempF}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                  <span>Transit ETA: {s.eta}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{s.progress}%</span>
                </div>
                <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#008425] dark:bg-[#8cfb8b] h-full rounded-full transition-all duration-500"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => onToast(`Carrier ${s.driver} contacted via satellite comms.`)}
                className="px-4 py-2 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-white/60 dark:border-white/10 rounded-2xl text-xs font-mono font-medium text-slate-800 dark:text-slate-200 transition-colors"
              >
                Call Driver
              </button>
              <button
                type="button"
                onClick={() => onToast(`Signed Bill of Lading for ${s.id} downloaded.`)}
                className="px-4 py-2 bg-[#008425] hover:bg-[#00681b] text-white rounded-2xl text-xs font-mono font-bold shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                View e-BOL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
