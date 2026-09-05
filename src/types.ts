export type UserRole = "farmer" | "worker" | "buyer";

export type NavSection =
  | "hire-workers"
  | "dashboard-and-harvest"
  | "marketplace-and-bids"
  | "active-orders"
  | "spoilage-risk-monitor"
  | "escrow-and-settlements";

export interface Worker {
  id: string;
  name: string;
  initials: string;
  role: string;
  boxes: number;
}

export interface ActiveShift {
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

export interface JobRequest {
  id: string;
  category: "urgent" | "daily" | "contracts";
  crop: string;
  farm: string;
  location: string;
  imageUrl: string;
  rate: number;
  rateSuffix: string;
  rateBadge: string;
  rateBadgeType: "secondary" | "error" | "primary";
  workersNeeded: number;
  alertTag: string;
  alertType: "error" | "neutral";
  musterTime: string;
  transit: string;
  equipment: string;
  amenities: string;
  escrowStatus: string;
  growerRating: number;
  reviewsCount: number;
  status: "available" | "accepted" | "declined";
}

export interface WorkScheduleItem {
  id: string;
  day: string;
  date: string;
  title: string;
  producer: string;
  hours: string;
  station?: string;
  crewSize: number;
  rate: string;
  status: "CONFIRMED" | "DISPATCH PENDING";
  location?: string;
}

export interface SettlementRecord {
  id: string;
  farm: string;
  details: string;
  amount: number;
  status: string;
  date: string;
}

export interface EscrowBalance {
  available: number;
  directDepositAccount: string;
  autoDepositActive: boolean;
  ytdEarned: number;
  recentSettlements: SettlementRecord[];
}

export interface CropLot {
  id: string;
  title: string;
  grower: string;
  location: string;
  quantity: string;
  currentBid: number;
  unit: string;
  bidCount: number;
  highestBidder: string;
  timeRemaining: string;
  spoilageHours: number;
  qualityGrade: string;
  harvestedDate: string;
  coolingStatus: string;
  escrowGuaranteed: boolean;
}
