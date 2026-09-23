import React from "react";
import { Clock, Flame } from "lucide-react";
import { useCountdown3Days } from "../utils/countdown";
import { useStockCounter } from "../hooks/useStockCounter";

export const TopAnnouncementBar: React.FC = () => {
  const timeLeft = useCountdown3Days();
  const { stock, justDecreased } = useStockCounter();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="w-full bg-[#E8132E] text-white py-2 sm:py-2.5 px-3 sm:px-4 text-center select-none z-50 shadow-xs">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-heading font-bold uppercase tracking-wide">
        <span className="flex items-center gap-1.5 text-center">
          <Clock className="w-4 h-4 shrink-0 text-white animate-pulse" />
          <span>3-DAY PROMO EXPIRES IN:</span>
        </span>
        <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm bg-black/35 px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/20 shadow-inner">
          <span className="bg-black/40 px-1.5 py-0.5 rounded text-white">
            {pad(timeLeft.days)}<span className="text-[10px] font-sans font-bold text-slate-300 ml-0.5">D</span>
          </span>
          <span className="text-white/60">:</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded text-white">
            {pad(timeLeft.hours)}<span className="text-[10px] font-sans font-bold text-slate-300 ml-0.5">H</span>
          </span>
          <span className="text-white/60">:</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded text-white">
            {pad(timeLeft.minutes)}<span className="text-[10px] font-sans font-bold text-slate-300 ml-0.5">M</span>
          </span>
          <span className="text-white/60">:</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded text-yellow-300">
            {pad(timeLeft.seconds)}<span className="text-[10px] font-sans font-bold text-yellow-200 ml-0.5">S</span>
          </span>
        </div>

        {/* Real-time Units Remaining in Stock Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide border transition-all duration-300 ${
            justDecreased
              ? "bg-yellow-400 text-slate-950 border-yellow-300 scale-105 shadow-md animate-pulse"
              : "bg-black/40 text-yellow-300 border-white/20"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>ONLY {stock} UNITS LEFT</span>
        </span>
      </div>
    </div>
  );
};

