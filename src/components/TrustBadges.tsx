import React from "react";
import { ShieldCheck, Truck, Banknote, CheckCircle2 } from "lucide-react";

interface TrustBadgesProps {
  className?: string;
  variant?: "light" | "dark";
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  className = "",
  variant = "light",
}) => {
  const isDark = variant === "dark";

  const badges = [
    {
      icon: ShieldCheck,
      title: "12-Month Warranty",
      description: "Full replacement guarantee & technical support",
      highlight: "100% Genuine",
      accentBg: isDark ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: isDark ? "text-emerald-400" : "text-emerald-600",
    },
    {
      icon: Truck,
      title: "Nationwide Delivery",
      description: "Doorstep dispatch across Lagos, Abuja & all states",
      highlight: "Fast & Free",
      accentBg: isDark ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: isDark ? "text-blue-400" : "text-blue-600",
    },
    {
      icon: Banknote,
      title: "Payment on Delivery",
      description: "Zero upfront risk — inspect item before you pay",
      highlight: "Risk-Free",
      accentBg: isDark ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: isDark ? "text-amber-400" : "text-amber-600",
    },
  ];

  return (
    <div
      className={`w-full max-w-2xl mx-auto rounded-2xl ${
        isDark
          ? "bg-slate-900/90 border border-slate-800 text-white shadow-lg p-4 sm:p-5"
          : "bg-slate-50/90 border border-slate-200/90 text-slate-900 shadow-xs p-4 sm:p-5"
      } ${className}`}
      id="hero-trust-badges"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2.5 p-3 rounded-xl transition-all duration-200 ${
                isDark
                  ? "bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50"
                  : "bg-white hover:bg-slate-50/80 border border-slate-200/70 shadow-2xs"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border ${badge.accentBg}`}
              >
                <Icon className={`w-6 h-6 ${badge.iconColor}`} />
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center sm:justify-center gap-1.5 mb-0.5">
                  <h4 className="font-heading font-extrabold text-xs sm:text-sm tracking-tight text-inherit whitespace-nowrap">
                    {badge.title}
                  </h4>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${badge.iconColor}`} />
                </div>
                <p
                  className={`text-[11px] leading-tight ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
