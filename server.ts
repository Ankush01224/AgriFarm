import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Worker {
  id: string;
  name: string;
  initials: string;
  role: string;
  boxes: number;
}

interface ActiveShift {
  shiftId: string;
  farmName: string;
  plot: string;
  status: "CHECKED IN" | "ON BREAK" | "CHECKED OUT";
  cadence: number;
  startTime: string;
  timeOnFieldHours: number;
  baseRate: number;
  pieceRateBonus: number;
  accruedToday: number;
  quotaPercent: number;
  breakEligibleIn: string;
  isBreakActive: boolean;
  foreman: {
    name: string;
    role: string;
    status: string;
    phone: string;
    radio: string;
    muster: string;
  };
  crewRoster: Worker[];
}

// In-memory persistent database for the MERN application
let activeShift: ActiveShift = {
  shiftId: "892-ROM",
  farmName: "Valley Green Farm",
  plot: "Plot 12B - Romaine Heart Harvest, Firebaugh CA",
  status: "CHECKED IN",
  cadence: 142,
  startTime: "05:30 AM",
  timeOnFieldHours: 3.5,
  baseRate: 28.0,
  pieceRateBonus: 0.75,
  accruedToday: 98.0,
  quotaPercent: 68,
  breakEligibleIn: "In 30m",
  isBreakActive: false,
  foreman: {
    name: "Manuel Ramirez",
    role: "Bowles Ranch Logistics Lead",
    status: "On Site",
    phone: "(555) 019-2831",
    radio: "VHF 08",
    muster: "Canal Staging #2",
  },
  crewRoster: [
    { id: "w-1", name: "Eduardo Reyes", initials: "ER", role: "Cutter / Lead", boxes: 156 },
    { id: "w-2", name: "Sofia Garza", initials: "SG", role: "Inspector / Packer", boxes: 148 },
    { id: "w-3", name: "Tomas Chavez", initials: "TC", role: "Stacker", boxes: 140 },
    { id: "w-4", name: "Mateo Silva", initials: "MS", role: "Harvester", boxes: 135 },
    { id: "w-5", name: "Rosa Mendez", initials: "RM", role: "Cutter", boxes: 132 },
    { id: "w-6", name: "Carlos Diaz", initials: "CD", role: "Runner", boxes: 128 },
    { id: "w-7", name: "Lucita Perez", initials: "LP", role: "Inspector", boxes: 125 },
    { id: "w-8", name: "Javier Ortiz", initials: "JO", role: "Loader", boxes: 120 },
  ],
};

let hazardReports: Array<{ id: string; type: string; notes: string; timestamp: string }> = [];

let jobs = [
  {
    id: "job-1",
    category: "urgent",
    crop: "PIMA COTTON LOT 03",
    farm: "Bowles Farm Co. - Field 3",
    location: "Los Banos, CA",
    imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
    rate: 28.0,
    rateSuffix: "/ hour",
    rateBadge: "+ Overtime Guarantee",
    rateBadgeType: "secondary",
    workersNeeded: 10,
    alertTag: "Rain Risk: 18h Left",
    alertType: "error",
    musterTime: "Tomorrow 06:00 AM sharp muster",
    transit: "Transportation provided from Fresno Hub #1",
    equipment: "Gloves & picking sacks provided on site",
    amenities: "Hot lunch & hydration stations included",
    escrowStatus: "100% Pre-funded",
    growerRating: 4.9,
    reviewsCount: 124,
    status: "available",
  },
  {
    id: "job-2",
    category: "urgent",
    crop: "BING CHERRIES",
    farm: "Linden Ridge Orchards",
    location: "Linden, CA",
    imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
    rate: 30.5,
    rateSuffix: "/ hour",
    rateBadge: "Emergency Harvest Rate",
    rateBadgeType: "error",
    workersNeeded: 6,
    alertTag: "Rain Split Hazard: 24h",
    alertType: "error",
    musterTime: "Tomorrow 05:30 AM start",
    transit: "Carpool fuel stipend ($25) or Shuttle",
    equipment: "Orchard ladder experience required",
    amenities: "Lunch box & electrolyte coolers on field",
    escrowStatus: "$244 Guaranteed",
    growerRating: 4.8,
    reviewsCount: 89,
    status: "available",
  },
  {
    id: "job-3",
    category: "urgent",
    crop: "AUTUMN ROYAL GRAPES",
    farm: "SunHarvest Vineyards Block 9",
    location: "Delano, CA",
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
    rate: 26.5,
    rateSuffix: "/ hr + $0.80/box",
    rateBadge: "High Piece Incentive",
    rateBadgeType: "primary",
    workersNeeded: 15,
    alertTag: "Fast Spoilage Alert",
    alertType: "error",
    musterTime: "Tomorrow 06:30 AM start",
    transit: "Self-transport (Bakersfield / Delano corridor)",
    equipment: "Clippers & packing cartons ready on rig",
    amenities: "Overnight bunk available for multi-day crew",
    escrowStatus: "2 Consecutive Days",
    growerRating: 5.0,
    reviewsCount: 201,
    status: "available",
  },
  {
    id: "job-4",
    category: "daily",
    crop: "HEIRLOOM TOMATOES",
    farm: "San Joaquin Organic Co.",
    location: "Stockton, CA",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    rate: 27.0,
    rateSuffix: "/ hour",
    rateBadge: "Standard Day Shift",
    rateBadgeType: "secondary",
    workersNeeded: 8,
    alertTag: "Regular Harvest",
    alertType: "neutral",
    musterTime: "Thursday 06:00 AM muster",
    transit: "Meet at Stockton Station Yard",
    equipment: "Packing trays provided",
    amenities: "Cold water stations & shade trailers",
    escrowStatus: "100% Pre-funded",
    growerRating: 4.7,
    reviewsCount: 65,
    status: "available",
  },
  {
    id: "job-5",
    category: "contracts",
    crop: "VALENCIA ORANGES",
    farm: "Citrus Belt Groves",
    location: "Visalia, CA",
    imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80",
    rate: 29.5,
    rateSuffix: "/ hr guaranteed",
    rateBadge: "2-Week Contract",
    rateBadgeType: "primary",
    workersNeeded: 20,
    alertTag: "Full Crew Requisition",
    alertType: "neutral",
    musterTime: "Next Monday 05:45 AM start",
    transit: "Crew vans provided from Porterville Hub",
    equipment: "Full picking bags and ladders supplied",
    amenities: "On-site kitchen and camp facilities",
    escrowStatus: "100% Pre-funded Escrow",
    growerRating: 4.9,
    reviewsCount: 154,
    status: "available",
  },
];

let workSchedule = [
  {
    id: "sched-1",
    day: "THU",
    date: "18",
    title: "Mendota Melon Packout",
    producer: "Silva Family Farms",
    hours: "06:00 AM - 02:30 PM",
    crewSize: 12,
    rate: "$27.00/hr ($216 est.)",
    status: "CONFIRMED",
    location: "Silva Staging Dock 4, Mendota CA",
  },
  {
    id: "sched-2",
    day: "FRI",
    date: "19",
    title: "San Joaquin Sweet Corn Sorting",
    producer: "Delta Agronomics",
    hours: "07:00 AM - 03:30 PM",
    station: "Hydro-cooler Line 2",
    crewSize: 10,
    rate: "$26.00/hr ($208 est.)",
    status: "CONFIRMED",
    location: "Hydro-cooler Facility B, Stockton CA",
  },
  {
    id: "sched-3",
    day: "SAT",
    date: "20",
    title: "Almond Orchard Shaker Prep",
    producer: "Harris Ranch Ag",
    hours: "Standby Alert",
    station: "Machinery Assist",
    crewSize: 6,
    rate: "$29.00/hr",
    status: "DISPATCH PENDING",
    location: "Plot 8 North, Coalinga CA",
  },
  {
    id: "sched-4",
    day: "MON",
    date: "22",
    title: "Kings County Canning Tomato Rig",
    producer: "SunPacific Growers",
    hours: "05:00 AM - 01:30 PM",
    station: "Mobile Sorter Deck",
    crewSize: 14,
    rate: "$28.50/hr ($228 est.)",
    status: "CONFIRMED",
    location: "Hanford Gate 3, Hanford CA",
  },
];

let escrowBalance = {
  available: 1248.5,
  directDepositAccount: "Wells Fargo •••• 4128",
  autoDepositActive: true,
  ytdEarned: 18420.0,
  recentSettlements: [
    {
      id: "settle-1",
      farm: "Bowles Farm Co. (Shift 12)",
      details: "May 15 • 8.0 hrs + piece pay",
      amount: 248.0,
      status: "DEPOSITED",
      date: "May 15",
    },
    {
      id: "settle-2",
      farm: "Firebaugh Melon Producers",
      details: "May 14 • 7.5 hrs regular",
      amount: 195.0,
      status: "DEPOSITED",
      date: "May 14",
    },
    {
      id: "settle-3",
      farm: "Tri-Valley Garlic Squad",
      details: "May 12 • Rain Hazard Emergency",
      amount: 310.5,
      status: "DEPOSITED",
      date: "May 12",
    },
    {
      id: "settle-4",
      farm: "Westlands Pistachio Processing",
      details: "May 9 • 8.0 hrs evening shift",
      amount: 256.0,
      status: "DEPOSITED",
      date: "May 9",
    },
  ],
};

let cropLots = [
  {
    id: "lot-rom-4412",
    title: "Organic Romaine Hearts",
    grower: "Valley Green Farm",
    location: "Firebaugh, CA",
    quantity: "4,200 Crates",
    currentBid: 18.5,
    unit: "/ crate",
    bidCount: 4,
    highestBidder: "Organic Harvest Direct",
    timeRemaining: "14h 20m",
    spoilageHours: 36,
    qualityGrade: "USDA Grade No. 1",
    harvestedDate: "Today 05:30 AM",
    coolingStatus: "Hydro-cooled to 34°F",
    escrowGuaranteed: true,
  },
  {
    id: "lot-chr-0921",
    title: "Bing Cherries (28mm+ Caliber)",
    grower: "Linden Ridge Orchards",
    location: "Linden, CA",
    quantity: "1,850 Flats (18 lb)",
    currentBid: 34.0,
    unit: "/ flat",
    bidCount: 7,
    highestBidder: "Pacific Rim Exporters",
    timeRemaining: "8h 15m",
    spoilageHours: 24,
    qualityGrade: "Export Premium",
    harvestedDate: "Yesterday 04:00 PM",
    coolingStatus: "Forced-air Pre-cooled",
    escrowGuaranteed: true,
  },
  {
    id: "lot-grp-8810",
    title: "Autumn Royal Seedless Grapes",
    grower: "SunHarvest Vineyards",
    location: "Delano, CA",
    quantity: "2,400 Lugs (19 lb)",
    currentBid: 22.0,
    unit: "/ lug",
    bidCount: 5,
    highestBidder: "FreshChoice Supermarkets",
    timeRemaining: "22h 45m",
    spoilageHours: 48,
    qualityGrade: "Table Premium",
    harvestedDate: "Today 06:15 AM",
    coolingStatus: "Sulfur Padded Cold Chain",
    escrowGuaranteed: true,
  },
  {
    id: "lot-cot-2041",
    title: "Pima Extra Long Staple Cotton",
    grower: "Bowles Farm Co.",
    location: "Los Banos, CA",
    quantity: "120 Bales (500 lb ea)",
    currentBid: 1.18,
    unit: "/ lb",
    bidCount: 3,
    highestBidder: "Apex Fiber Merchants",
    timeRemaining: "42h 10m",
    spoilageHours: 240,
    qualityGrade: "Grade 2 Staple 46",
    harvestedDate: "Two Days Ago",
    coolingStatus: "Dry Covered Storage",
    escrowGuaranteed: true,
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === REST API ENDPOINTS ===

  // 1. Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "AgriConnect Full-Stack API", timestamp: new Date().toISOString() });
  });

  // 2. Active Shift endpoints
  app.get("/api/shifts/active", (_req, res) => {
    res.json(activeShift);
  });

  app.post("/api/shifts/checkout", (_req, res) => {
    const finalAccrued = activeShift.accruedToday;
    activeShift.status = "CHECKED OUT";
    activeShift.isBreakActive = false;
    
    // Add settlement record to escrow
    escrowBalance.available += finalAccrued;
    escrowBalance.recentSettlements.unshift({
      id: `settle-${Date.now()}`,
      farm: activeShift.farmName,
      details: `Today • ${activeShift.timeOnFieldHours} hrs + piece rate`,
      amount: finalAccrued,
      status: "DEPOSITED",
      date: "Today",
    });

    res.json({
      success: true,
      message: "Shift concluded and signed off by supervisor Manuel Ramirez.",
      totalAccrued: finalAccrued,
      hours: activeShift.timeOnFieldHours,
      shift: activeShift,
    });
  });

  app.post("/api/shifts/checkin", (_req, res) => {
    activeShift.status = "CHECKED IN";
    activeShift.isBreakActive = false;
    activeShift.timeOnFieldHours = 0.5;
    activeShift.accruedToday = 14.0;
    activeShift.quotaPercent = 12;
    res.json({ success: true, shift: activeShift });
  });

  app.post("/api/shifts/toggle-break", (_req, res) => {
    activeShift.isBreakActive = !activeShift.isBreakActive;
    activeShift.status = activeShift.isBreakActive ? "ON BREAK" : "CHECKED IN";
    res.json({
      success: true,
      isBreakActive: activeShift.isBreakActive,
      status: activeShift.status,
      message: activeShift.isBreakActive ? "Paid 15-minute rest break timer started." : "Break ended, returned to field duty.",
    });
  });

  app.post("/api/shifts/report-hazard", (req, res) => {
    const { type, notes } = req.body;
    const report = {
      id: `hz-${Date.now()}`,
      type: type || "Field Condition",
      notes: notes || "Caution flagged in field",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    hazardReports.push(report);
    res.json({
      success: true,
      message: "Hazard reported to Foreman Manuel Ramirez and Central Safety Dispatch.",
      report,
    });
  });

  app.post("/api/shifts/increment-yield", (req, res) => {
    const amount = Number(req.body.amount || 1);
    activeShift.quotaPercent = Math.min(100, activeShift.quotaPercent + amount);
    activeShift.accruedToday = Math.round((activeShift.accruedToday + amount * 0.85) * 100) / 100;
    // update worker 1
    if (activeShift.crewRoster[0]) {
      activeShift.crewRoster[0].boxes += amount;
    }
    res.json({
      success: true,
      quotaPercent: activeShift.quotaPercent,
      accruedToday: activeShift.accruedToday,
      roster: activeShift.crewRoster,
    });
  });

  // 3. Farmer Work Requests (Jobs)
  app.get("/api/jobs", (req, res) => {
    const category = req.query.category as string | undefined;
    if (category && category !== "all") {
      return res.json(jobs.filter((j) => j.category === category));
    }
    res.json(jobs);
  });

  app.post("/api/jobs/:id/accept", (req, res) => {
    const job = jobs.find((j) => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    job.status = "accepted";
    
    // Add to schedule
    const nextItem = {
      id: `sched-${Date.now()}`,
      day: "TOM",
      date: new Date().getDate() + 1 + "",
      title: job.farm,
      producer: job.farm.split("-")[0].trim(),
      hours: job.musterTime.split("sharp")[0].trim(),
      crewSize: job.workersNeeded,
      rate: `$${job.rate.toFixed(2)}/hr (${job.rateBadge})`,
      status: "CONFIRMED",
      location: job.location,
    };
    workSchedule.unshift(nextItem);

    res.json({
      success: true,
      message: `Job at ${job.farm} accepted! Muster coordinates synchronized to dispatch schedule.`,
      job,
      schedule: workSchedule,
    });
  });

  app.post("/api/jobs/:id/decline", (req, res) => {
    const job = jobs.find((j) => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    job.status = "declined";
    res.json({ success: true, message: `Job request declined. Dispatch will route to next crew in radius.`, job });
  });

  app.post("/api/jobs", (req, res) => {
    const newJob = {
      id: `job-${Date.now()}`,
      category: req.body.category || "urgent",
      crop: req.body.crop || "CITRUS ORCHARDS",
      farm: req.body.farm || "New Producer Contract",
      location: req.body.location || "Fresno County, CA",
      imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
      rate: Number(req.body.rate || 28.0),
      rateSuffix: "/ hour",
      rateBadge: req.body.rateBadge || "Standard Rate",
      rateBadgeType: "secondary",
      workersNeeded: Number(req.body.workersNeeded || 8),
      alertTag: req.body.alertTag || "Expedited Dispatch",
      alertType: "error",
      musterTime: req.body.musterTime || "Tomorrow 06:00 AM",
      transit: req.body.transit || "Staging point provided",
      equipment: req.body.equipment || "Tools provided on site",
      amenities: req.body.amenities || "Water and hydration stations",
      escrowStatus: "100% Pre-funded",
      growerRating: 5.0,
      reviewsCount: 1,
      status: "available",
    };
    jobs.unshift(newJob);
    res.status(201).json({ success: true, job: newJob });
  });

  // 4. Upcoming Work Schedule
  app.get("/api/schedule", (_req, res) => {
    res.json(workSchedule);
  });

  // 5. Escrow & Settlements
  app.get("/api/settlements", (_req, res) => {
    res.json(escrowBalance);
  });

  app.post("/api/settlements/cashout", (req, res) => {
    const amount = Number(req.body.amount || escrowBalance.available);
    if (amount <= 0 || amount > escrowBalance.available) {
      return res.status(400).json({ error: "Invalid transfer amount" });
    }
    escrowBalance.available -= amount;
    const transferRecord = {
      id: `settle-tr-${Date.now()}`,
      farm: "Instant Payout to Wells Fargo •••• 4128",
      details: `${new Date().toLocaleDateString()} • Instant ACH Transfer`,
      amount: -amount,
      status: "TRANSFER PROCESSED",
      date: "Just now",
    };
    escrowBalance.recentSettlements.unshift(transferRecord);
    res.json({
      success: true,
      message: `$${amount.toFixed(2)} transferred to ${escrowBalance.directDepositAccount}. Arrival within seconds via FedNow/RTP.`,
      remainingBalance: escrowBalance.available,
    });
  });

  // 6. Crop Lots & Marketplace Bids
  app.get("/api/marketplace", (_req, res) => {
    res.json(cropLots);
  });

  app.post("/api/marketplace/bid", (req, res) => {
    const { lotId, bidAmount, bidderName } = req.body;
    const lot = cropLots.find((l) => l.id === lotId);
    if (!lot) {
      return res.status(404).json({ error: "Crop lot not found" });
    }
    const numBid = Number(bidAmount);
    if (numBid <= lot.currentBid) {
      return res.status(400).json({ error: `Bid must be higher than current bid ($${lot.currentBid})` });
    }
    lot.currentBid = numBid;
    lot.bidCount += 1;
    lot.highestBidder = bidderName || "Verified Merchant";
    res.json({
      success: true,
      message: `Your bid of $${numBid.toFixed(2)} for ${lot.title} is now leading!`,
      lot,
    });
  });

  // 7. Spoilage risk data
  app.get("/api/spoilage", (_req, res) => {
    res.json({
      windowHoursRemaining: 48,
      weatherRisk: "Rain forecast Central Valley: 48h to harvest before spoilage risk",
      temperatureAvgF: 84,
      relativeHumidity: "72%",
      lotsUnderWatch: cropLots.map((l) => ({
        id: l.id,
        title: l.title,
        grower: l.grower,
        hoursToSpoil: l.spoilageHours,
        status: l.spoilageHours <= 24 ? "CRITICAL" : l.spoilageHours <= 48 ? "HIGH ALERT" : "MONITORED",
        actionPlan:
          l.spoilageHours <= 24
            ? "Rapid pack-out & vacuum cooler transfer"
            : "Complete picking before Pacific storm front arrives",
      })),
    });
  });

  // 8. Crew Roster endpoint
  app.get("/api/crew", (_req, res) => {
    res.json(activeShift.crewRoster);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
