import React from "react";
import { Flame, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStockCounter } from "../hooks/useStockCounter";

interface StockUrgencyWidgetProps {
  variant?: "card" | "compact" | "pill";
  className?: string;
}

export const StockUrgencyWidget: React.FC<StockUrgencyWidgetProps> = ({
  variant = "card",
  className = "",
}) => {
  const { stock, initialStock, justDecreased, recentEvent, percentageRemaining } = useStockCounter();

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide border transition-all duration-300 ${
          justDecreased
            ? "bg-red-600 text-white border-red-400 scale-105 shadow-md animate-pulse"
            : stock <= 5
            ? "bg-red-500/20 text-red-300 border-red-500/40"
            : "bg-amber-500/20 text-yellow-300 border-amber-500/40"
        } ${className}`}
      >
        <Flame className="w-3.5 h-3.5 text-yellow-400 animate-pulse shrink-0" />
        <span>
          Only <strong className="font-mono text-sm underline">{stock}</strong> Units Left in Stock
        </span>
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300 ${
          justDecreased
            ? "bg-red-600 text-white border-red-500 shadow-md"
            : "bg-red-950/80 text-white border-red-700/70"
        } ${className}`}
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span>
          HURRY: <strong className="text-yellow-300 font-mono text-sm">{stock}</strong> Cooktops Remaining Today
        </span>
      </div>
    );
  }

  // Default "card" variant with progress indicator and live social proof alert
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 relative overflow-hidden ${
        justDecreased
          ? "bg-gradient-to-r from-red-900/90 to-amber-900/90 border-red-500 text-white shadow-lg ring-2 ring-red-500/50"
          : "bg-slate-900/95 border-amber-500/40 text-white shadow-md"
      } ${className}`}
    >
      {/* Top Scarcity Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Flame className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-heading font-black tracking-wide uppercase text-white">
            Limited Stock Available
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 font-mono">
          <span className="text-xs text-slate-300 font-sans font-semibold">Remaining:</span>
          <motion.span
            key={stock}
            initial={{ scale: 1.4, color: "#f87171" }}
            animate={{ scale: 1, color: "#fde047" }}
            transition={{ duration: 0.4 }}
            className="text-base sm:text-lg font-black text-yellow-300"
          >
            {stock}
          </motion.span>
          <span className="text-[11px] text-slate-400 font-sans">/ {initialStock}</span>
        </div>
      </div>

      {/* Progress Bar of Stock Depletion */}
      <div className="space-y-1.5 mb-2">
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
          <motion.div
            className={`h-full rounded-full transition-all duration-700 ${
              stock <= 4
                ? "bg-gradient-to-r from-red-600 to-red-400"
                : "bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400"
            }`}
            initial={false}
            animate={{ width: `${percentageRemaining}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Active warehouse dispatch
          </span>
          <span className="font-bold text-amber-300">
            {100 - percentageRemaining}% Claimed Today
          </span>
        </div>
      </div>

      {/* Real-time Order Decrement Toast / Flash Notification */}
      <AnimatePresence>
        {justDecreased && recentEvent && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 pt-2 border-t border-red-400/30 flex items-center gap-2 text-xs text-yellow-200 font-medium bg-red-950/60 p-2 rounded-lg"
          >
            <TrendingDown className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
            <span>
              ⚡ <strong>Just now:</strong> 1 unit was ordered from <span className="underline font-bold text-white">{recentEvent.city}</span>! Only {stock} units left.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {!justDecreased && (
        <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span>
            Once this shipment runs out, price reverts to regular <strong>₦350,000</strong>.
          </span>
        </p>
      )}
    </div>
  );
};
