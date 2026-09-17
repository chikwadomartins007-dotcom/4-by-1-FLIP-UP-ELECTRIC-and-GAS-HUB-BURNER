import React from "react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { Analytics } from "../utils/analytics";

interface UpgradeComparisonProps {
  onOrderClick: () => void;
}

export const UpgradeComparison: React.FC<UpgradeComparisonProps> = ({ onOrderClick }) => {
  const comparisonItems = [
    {
      feature: "Timer & Auto Safety",
      ordinary: "No timer or shutoff; if you get distracted, food burns and pots get ruined",
      upgrade: "Integrated Digital Countdown Timer with automatic shutoff and 1-touch Automatic Off key",
    },
    {
      feature: "Cleaning Under Burners",
      ordinary: "Fixed burners where soup spills bake into crevices, rust, and attract pests",
      upgrade: "Innovative flip-up hinged burners lift upward for 1-wipe cleaning on tempered glass",
    },
    {
      feature: "Countertop Integration",
      ordinary: "Bulky tabletop box sitting on a counter with exposed rubber hose & cords",
      upgrade: "Seamless built-in recessed fitment (900×510mm) sitting flush with your countertop",
    },
    {
      feature: "Cooking Versatility",
      ordinary: "Gas only or electric only; if gas runs out or lights trip, cooking completely stops",
      upgrade: "Gas + Electric dual fuel (4 Gas + 1 Ceramic Electric Zone) for uninterrupted cooking",
    },
    {
      feature: "Cooking Capacity",
      ordinary: "Usually 2 to 3 burners where pots knock against each other and boil over",
      upgrade: "5 well-spaced cooking stations allowing simultaneous multi-dish family meals",
    },
    {
      feature: "Kitchen Aesthetics",
      ordinary: "Utilitarian appearance that lowers the visual appeal of modern cabinets",
      upgrade: "Executive high-gloss black tempered glass with touch controls & chrome dials",
    },
  ];

  const handleCta = () => {
    Analytics.trackCTAClick("Order Now (Comparison Section)", "#order-form-section");
    onOrderClick();
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 animate-slide-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8D6D27] mb-2 block">
            The Difference is Obvious
          </span>
          <h2 className="font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight mb-4">
            Ordinary Stoves vs. Built-In Luxury Upgrade
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            See how upgrading to this 5-burner gas + electric cooktop with digital timer transforms everyday kitchen safety, convenience, and home value.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Ordinary Cooking Setup Card */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-red-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Ordinary Tabletop Stove</h3>
                  <span className="text-xs text-slate-500">Standard portable / rusty metal cookers</span>
                </div>
              </div>

              <div className="space-y-4">
                {comparisonItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {item.feature}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">{item.ordinary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 italic">
              Result: Constant worry about food burning, difficult cleaning, and dated kitchen appearance.
            </div>
          </div>

          {/* Modern Kitchen Upgrade Card */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border-2 border-[#C5A059] shadow-xl shadow-[#C5A059]/10 flex flex-col justify-between relative">
            
            {/* Value Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#0F172A] text-white text-[11px] font-bold tracking-wide uppercase shadow">
              The Smart Upgrade
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#8D6D27]">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">5-Burner Built-In Upgrade</h3>
                  <span className="text-xs text-[#8D6D27] font-bold">Digital Timer & Auto-Off Safety</span>
                </div>
              </div>

              <div className="space-y-4">
                {comparisonItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {item.feature}
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">{item.upgrade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={handleCta}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-heading font-black text-sm bg-[#0F172A] hover:bg-slate-800 text-white transition-all cursor-pointer shadow-xl animate-action-blink"
              >
                <span>CLAIM YOUR KITCHEN UPGRADE</span>
                <ArrowRight className="w-4 h-4 text-yellow-400" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
