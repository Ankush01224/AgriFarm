import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LaborDispatchView } from "./views/LaborDispatchView";
import { DashboardHarvestView } from "./views/DashboardHarvestView";
import { MarketplaceBidsView } from "./views/MarketplaceBidsView";
import { LogisticsOrdersView } from "./views/LogisticsOrdersView";
import { SpoilageWatchView } from "./views/SpoilageWatchView";
import { SettlementsView } from "./views/SettlementsView";
import { NavSection, UserRole } from "./types";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>("hire-workers");
  const [userRole, setUserRole] = useState<UserRole>("worker");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("agriconnect_dark_mode");
      if (stored !== null) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("agriconnect_dark_mode", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("agriconnect_dark_mode", "false");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const renderCurrentView = () => {
    switch (currentSection) {
      case "hire-workers":
        return (
          <LaborDispatchView
            searchQuery={searchQuery}
            onToast={showToast}
          />
        );
      case "dashboard-and-harvest":
        return (
          <DashboardHarvestView
            onToast={showToast}
            onNavigateToDispatch={() => setCurrentSection("hire-workers")}
          />
        );
      case "marketplace-and-bids":
        return <MarketplaceBidsView onToast={showToast} />;
      case "active-orders":
        return <LogisticsOrdersView onToast={showToast} />;
      case "spoilage-risk-monitor":
        return (
          <SpoilageWatchView
            onToast={showToast}
            onNavigateToDispatch={() => setCurrentSection("hire-workers")}
          />
        );
      case "escrow-and-settlements":
        return <SettlementsView onToast={showToast} />;
      default:
        return (
          <LaborDispatchView
            searchQuery={searchQuery}
            onToast={showToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 dark:bg-[#0b0f17] dark:text-slate-100 relative overflow-hidden transition-colors duration-200 selection:bg-[#008425] selection:text-white font-sans">
      {/* Frosted Glass Background Ambient Blur Spheres */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-100/70 dark:bg-blue-900/15 rounded-full blur-[120px] opacity-70 pointer-events-none -z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/60 dark:bg-purple-900/15 rounded-full blur-[130px] opacity-60 pointer-events-none -z-0" />
      <div className="fixed top-[35%] right-[15%] w-[35%] h-[35%] bg-emerald-100/50 dark:bg-emerald-950/20 rounded-full blur-[140px] opacity-50 pointer-events-none -z-0" />
      <div className="fixed bottom-[20%] left-[8%] w-[40%] h-[40%] bg-indigo-100/40 dark:bg-indigo-950/20 rounded-full blur-[140px] opacity-40 pointer-events-none -z-0" />

      {/* Fixed Header */}
      <Header
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        userRole={userRole}
        onRoleChange={(role) => {
          setUserRole(role);
          if (role === "farmer") {
            showToast("Role switched to Farmer / Producer (Bowles Ranch #4).");
          } else if (role === "buyer") {
            showToast("Role switched to Crop Buyer / Merchant (Apex Produce).");
            setCurrentSection("marketplace-and-bids");
          } else {
            showToast("Role switched to Farm Worker / Laborer (Worker AG-9042).");
            setCurrentSection("hire-workers");
          }
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadAlertCount={2}
      />

      {/* Fixed Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        hoursRemaining={48}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 relative z-10">
        <main className="relative pt-24 md:pt-28 min-h-screen w-full px-4 md:px-10 py-6 md:py-8 max-w-[1440px] mx-auto pb-24 md:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Toast Notifications - Frosted Glass Styled */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-800 dark:text-white rounded-2xl shadow-xl shadow-slate-300/30 dark:shadow-black/60 border border-white/80 dark:border-white/15 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#008425] dark:text-[#8cfb8b] flex-shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white ml-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
