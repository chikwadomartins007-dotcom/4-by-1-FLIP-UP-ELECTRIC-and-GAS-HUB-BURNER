import React, { useState, useEffect } from "react";
import { CheckCircle2, Flame } from "lucide-react";

interface RecentPurchase {
  state: string;
  name: string;
  timeAgo: string;
  quantity?: number;
}

const NIGERIAN_PURCHASES: RecentPurchase[] = [
  { state: "Lagos (Lekki Phase 1)", name: "Chief Adeleke", timeAgo: "2 minutes ago", quantity: 2 },
  { state: "Abuja (Gwarinpa Estate)", name: "Mrs. Okafor", timeAgo: "4 minutes ago", quantity: 1 },
  { state: "Rivers (Port Harcourt)", name: "Engr. Nwosu", timeAgo: "7 minutes ago", quantity: 1 },
  { state: "Lagos (Ikeja GRA)", name: "Alhaji Danjuma", timeAgo: "11 minutes ago", quantity: 1 },
  { state: "Oyo (Bodija, Ibadan)", name: "Dr. Mrs. Alabi", timeAgo: "14 minutes ago", quantity: 1 },
  { state: "Delta (Asaba)", name: "Mr. Chukwuma", timeAgo: "18 minutes ago", quantity: 1 },
  { state: "Enugu (Independence Layout)", name: "Barrister Eze", timeAgo: "22 minutes ago", quantity: 2 },
  { state: "Edo (GRA, Benin City)", name: "Pastor Osagie", timeAgo: "25 minutes ago", quantity: 1 },
  { state: "Kano (Nassarawa)", name: "Hajiya Balarabe", timeAgo: "31 minutes ago", quantity: 1 },
  { state: "Ogun (Magboro/Arepo)", name: "Mr. Balogun", timeAgo: "36 minutes ago", quantity: 1 },
  { state: "Lagos (Victoria Island)", name: "Madam Folashade", timeAgo: "42 minutes ago", quantity: 1 },
  { state: "Anambra (Awka)", name: "Arc. Okeke", timeAgo: "49 minutes ago", quantity: 1 },
  { state: "Abuja (Maitama)", name: "Senator B.", timeAgo: "53 minutes ago", quantity: 2 },
  { state: "Akwa Ibom (Uyo)", name: "Mrs. Bassey", timeAgo: "58 minutes ago", quantity: 1 },
];

export const SocialProofTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Switch every 6.5 seconds with a smooth fade
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % NIGERIAN_PURCHASES.length);
        setIsFading(false);
      }, 400);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const purchase = NIGERIAN_PURCHASES[currentIndex];

  return (
    <div className="w-full bg-slate-900 border-t border-b border-slate-800/80 py-2.5 px-4 text-xs select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between sm:justify-center gap-3">
        {/* Pulsing Live indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 hidden sm:inline">
            Live Verified Orders
          </span>
        </div>

        <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

        {/* Ticker text content */}
        <div
          className={`flex items-center gap-2 text-slate-300 transition-opacity duration-300 ${
            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-[#C5A059]/20 flex items-center justify-center shrink-0 text-[#E5C378]">
            <Flame className="w-3.5 h-3.5" />
          </div>

          <p className="text-[11px] sm:text-xs">
            <span className="text-white font-semibold">{purchase.name}</span> in{" "}
            <span className="text-[#E5C378] font-bold underline decoration-[#C5A059]/40 underline-offset-2">
              {purchase.state}
            </span>{" "}
            just ordered a{" "}
            <span className="text-white font-medium">
              5-Burner Built-In Cooktop
              {purchase.quantity && purchase.quantity > 1 ? ` (${purchase.quantity} units)` : ""}
            </span>{" "}
            <span className="text-slate-400 text-[10px] sm:text-[11px] font-normal">
              • {purchase.timeAgo}
            </span>
          </p>

          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50 hidden md:inline-flex shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
          </span>
        </div>

        <div className="h-3 w-px bg-slate-700 hidden lg:block"></div>

        {/* Dispatch speed teaser */}
        <span className="text-[10px] text-slate-400 hidden lg:inline shrink-0">
          Payment on delivery available nationwide
        </span>
      </div>
    </div>
  );
};
