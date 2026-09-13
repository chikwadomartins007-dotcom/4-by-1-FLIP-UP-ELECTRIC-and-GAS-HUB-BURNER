import React from "react";
import { ArrowDown, Truck, Sparkles, CheckCircle2 } from "lucide-react";

interface LivelyOrderButtonProps {
  onClick: () => void;
  subtext?: string;
  className?: string;
}

export const LivelyOrderButton: React.FC<LivelyOrderButtonProps> = ({
  onClick,
  subtext = "🔥 Special Promo Price: ₦280,000 • Pay on Confirmation / Delivery • Nationwide",
  className = "",
}) => {
  return (
    <div className={`max-w-xl mx-auto text-center ${className}`}>
      {/* Floating Free Delivery Live Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs border border-emerald-300/60">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <Truck className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
        <span>FREE DELIVERY INCLUDED • PAY ON ARRIVAL</span>
      </div>

      {/* Main Animated Lively Button */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Click here to order plus free delivery"
        className="group relative w-full overflow-hidden py-4 sm:py-5 px-6 rounded-2xl font-bold text-base sm:text-lg md:text-xl text-white bg-gradient-to-r from-[#16a085] via-[#1abc9c] to-[#16a085] hover:from-[#138871] hover:to-[#16a085] shadow-[0_10px_25px_rgba(26,188,156,0.4)] animate-lively-btn cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 border-2 border-emerald-300/40 active:scale-[0.98]"
      >
        {/* Shimmer Light Sweeping Effect */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none animate-shimmer-sweep" />

        {/* Left Pulsing Icon */}
        <span className="p-1 rounded-full bg-white/20 text-white shadow-xs shrink-0 group-hover:scale-110 transition-transform">
          <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
        </span>

        {/* Button Text */}
        <span className="relative z-10 font-black tracking-wide drop-shadow-sm text-center">
          CLICK HERE TO ORDER + FREE DELIVERY
        </span>

        {/* Right Animated Down Arrow */}
        <span className="p-1 rounded-full bg-white/20 text-white shadow-xs shrink-0 group-hover:translate-y-1 transition-transform">
          <ArrowDown className="w-5 h-5 text-white animate-bounce" />
        </span>
      </button>

      {/* Subtext info */}
      {subtext && (
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-medium flex items-center justify-center gap-1.5 flex-wrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{subtext}</span>
        </p>
      )}
    </div>
  );
};
