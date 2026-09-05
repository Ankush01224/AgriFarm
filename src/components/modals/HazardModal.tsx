import React, { useState } from "react";
import { AlertOctagon, X, ShieldAlert, Check } from "lucide-react";

interface HazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: string, notes: string) => void;
}

export const HazardModal: React.FC<HazardModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedType, setSelectedType] = useState("Irrigation Ditch Leak");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const hazardOptions = [
    { id: "h1", name: "Irrigation Ditch Leak", severity: "Medium" },
    { id: "h2", name: "Slippery Mud / Tractor Rut", severity: "Low" },
    { id: "h3", name: "Wasps / Hornet Swarm in Canopy", severity: "High" },
    { id: "h4", name: "Trailer Conveyor Jam", severity: "Medium" },
    { id: "h5", name: "Extreme Heat / Hydration Depleted", severity: "High" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedType, notes);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNotes("");
      onClose();
    }, 1200);
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

        <div className="flex items-center gap-3 mb-3 text-red-600 dark:text-red-400">
          <div className="w-10 h-10 rounded-2xl bg-red-100/70 dark:bg-red-950/50 border border-red-200/60 dark:border-red-800/40 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] text-lg font-bold text-slate-800 dark:text-white">
              Report Field Hazard
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Immediate Safety Dispatch Alert
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] border border-green-200/60 dark:border-green-800/40 flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-['Manrope'] font-bold text-slate-900 dark:text-white">
              Hazard Broadcast Sent!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Foreman Manuel Ramirez and crew leads notified on VHF 08.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Select Incident Category
              </label>
              <div className="space-y-1.5">
                {hazardOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.name)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedType === opt.name
                        ? "border-red-500/60 bg-red-500/10 text-red-900 dark:text-red-200 font-bold backdrop-blur-xs"
                        : "border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:bg-white/80"
                    }`}
                  >
                    <span>{opt.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        opt.severity === "High"
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                          : "bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {opt.severity}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                Plot Notes & Coordinates (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Near row 44 next to irrigation canal turnoff..."
                rows={3}
                className="w-full p-3 bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/15 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500 backdrop-blur-md"
              />
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
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-sm"
              >
                Broadcast Hazard Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
