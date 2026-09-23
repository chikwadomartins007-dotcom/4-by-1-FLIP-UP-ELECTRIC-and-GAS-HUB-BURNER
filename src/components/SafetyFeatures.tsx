import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  PowerOff,
  Lock,
  Timer,
  Thermometer,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Check,
  Wind,
  Zap,
  Activity,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { Analytics } from "../utils/analytics";

interface SafetyFeaturesProps {
  onOrderClick?: () => void;
}

export const SafetyFeatures: React.FC<SafetyFeaturesProps> = ({ onOrderClick }) => {
  const [activeTab, setActiveTab] = useState<"leakage" | "shutoff">("leakage");

  const handleOrderClick = () => {
    Analytics.trackCTAClick("Order Now (Safety Features Section)", "#order-form-section");
    if (onOrderClick) {
      onOrderClick();
    } else {
      document.getElementById("order-form-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const supportingFeatures = [
    {
      icon: Lock,
      title: "Child Safety Lockout Key",
      description:
        "One-touch digital control lock prevents toddlers and children from accidentally turning on burners or tampering with heat settings.",
      tag: "Childproof",
    },
    {
      icon: Thermometer,
      title: "Overheat & Dry-Burn Protection",
      description:
        "Internal thermal sensors monitor the 2000W radiant ceramic zone. If a pot boils completely dry, power is automatically lowered or cut.",
      tag: "Thermal Guard",
    },
    {
      icon: Layers,
      title: "8mm Explosion-Proof Tempered Glass",
      description:
        "Engineered with aerospace-grade thermal shock resistance tested up to 800°C. Resists heavy cookware impacts and rapid temperature swings.",
      tag: "800°C Tested",
    },
    {
      icon: ShieldCheck,
      title: "Heavy-Duty Anti-Tip Cast Iron Grates",
      description:
        "Interlocking solid cast-iron pot supports with non-slip silicone feet firmly anchor heavy soup pots, iron pots, and pressure cookers without tilting.",
      tag: "Anti-Spill",
    },
  ];

  return (
    <section
      id="safety-features"
      className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 animate-slide-in-up">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>CERTIFIED KITCHEN SAFETY STANDARD</span>
          </div>
          
          <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight uppercase leading-tight">
            ZERO GAS LEAKS. ZERO BURNT FOOD. <br className="hidden sm:inline" />
            <span className="text-emerald-700">100% MAXIMUM SAFETY.</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
            Protect your family and home with European-certified safety engineering. Equipped with real-time Flame Failure Devices (FFD) on every gas burner and automatic electric power cutoff.
          </p>
        </div>

        {/* Dual Primary Hero Cards: Auto-Shutoff & Gas Leakage Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* Card 1: Gas Leakage Protection & Flame Failure Device (FFD) */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border-2 border-emerald-500/40 shadow-md relative overflow-hidden flex flex-col justify-between hover:border-emerald-600 transition-all group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Flame className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Flame Failure Device (FFD)
                </span>
              </div>

              <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 mb-2">
                Instant Gas Leakage Protection
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Every single gas burner is fitted with an ultra-responsive thermoelectric thermocouple. If a draft of wind or boiling soup suddenly extinguishes the flame, the sensor reacts in <strong>under 2 seconds</strong>.
              </p>

              {/* Step-by-Step Mechanism */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 mb-4 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>Flame Blow-Out:</strong> Soup boils over or window breeze blows out the active flame.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Sensor Reacts:</strong> Thermocouple probe cools instantly (&lt; 2s).</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>Gas Cut Off:</strong> Solenoid valve seals tight. No gas escapes into your kitchen.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prevents kitchen fires &amp; gas inhalation</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                100% Tested
              </span>
            </div>
          </div>

          {/* Card 2: Automatic Shutoff & Digital Timer Cutoff */}
          <div className="rounded-3xl p-6 sm:p-7 bg-white border-2 border-slate-900 shadow-md relative overflow-hidden flex flex-col justify-between hover:border-slate-800 transition-all group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-slate-900/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Timer className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-yellow-400 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Smart Auto-Shutoff
                </span>
              </div>

              <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 mb-2">
                Digital Timer &amp; Auto-Cutoff
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Cook with complete peace of mind. Set cooking durations from <strong>1 to 99 minutes</strong> on the LED digital touch screen. When time is up, the system sounds a warning chime and terminates heating instantly.
              </p>

              {/* Step-by-Step Mechanism */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 mb-4 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>Touch Digital Timer:</strong> Select cooking time (e.g., 25 mins for Jollof Rice).</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-900 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Automatic Countdown:</strong> Precision microchip monitors heat level &amp; time.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>Power Cut Off:</strong> Automatic shutdown prevents burnt food &amp; pot damage.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-900 font-bold">
              <span className="flex items-center gap-1.5">
                <PowerOff className="w-4 h-4 text-emerald-600" />
                <span>Zero burnt pots • Leave it safely</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                1–99 Min Timer
              </span>
            </div>
          </div>

        </div>

        {/* 4 Supplementary Safety Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {supportingFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-800" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="font-heading font-black text-sm text-slate-900 mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Factory Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Peace of Mind Callout Box */}
        <div className="rounded-2xl p-5 bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm sm:text-base text-slate-900 uppercase">
                Cook with Complete Peace of Mind
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Inspect the auto-shutoff sensor and gas flame failure device yourself upon doorstep delivery before paying.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOrderClick}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Order With Peace of Mind</span>
            <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
