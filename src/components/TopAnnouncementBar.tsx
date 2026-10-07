import React from "react";
import { Flame, Truck, Clock } from "lucide-react";
import { useCountdown3Days } from "../utils/countdown";
import { useStockCounter } from "../hooks/useStockCounter";

export const TopAnnouncementBar: React.FC = () => {
  const timeLeft = useCountdown3Days();
  const { stock } = useStockCounter();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div
      id="promo-top-bar"
      className="bg-[#E8132E] text-white py-2 px-4 shadow-md border-4 border-yellow-400 transition-all duration-200 z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2 font-extrabold tracking-wide text-xs sm:text-sm">
          <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300 shrink-0 animate-pulse" />
          <span>
            LIMITED PROMO:{" "}
            <strong className="text-yellow-300 font-black">₦280,000</strong>{" "}
            — 5-BURNER GAS + ELECTRIC HYBRID COOKTOP
          </span>
          <span className="hidden md:inline-flex items-center gap-1 bg-neutral-950 text-yellow-300 border-2 border-yellow-400 px-2 py-0.5 rounded text-[11px] font-mono">
            <Clock className="w-3 h-3 text-yellow-300" />
            <span>
              {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
            </span>
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
          <span className="bg-neutral-950 text-yellow-300 border-2 border-yellow-400 px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-extrabold tracking-wide flex items-center gap-1.5 shadow-xs">
            <Truck className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span>FREE NATIONWIDE DELIVERY • PAY ON DELIVERY ({stock} LEFT)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
