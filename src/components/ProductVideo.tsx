import React from "react";
import { Zap, Timer, Power, Flame, ArrowDown, ExternalLink } from "lucide-react";
import { Analytics } from "../utils/analytics";

interface ProductVideoProps {
  onOrderClick?: () => void;
}

export const ProductVideo: React.FC<ProductVideoProps> = ({ onOrderClick }) => {
  const videoEmbedUrl = "https://www.youtube.com/embed/V5kzO0CiMeI?rel=0&modestbranding=1&controls=1&showinfo=1&fs=1&wmode=transparent";
  const videoDirectUrl = "https://youtube.com/shorts/V5kzO0CiMeI?feature=share";

  const handleOrderClick = () => {
    Analytics.trackCTAClick("Order Now (Showroom Video Section)", "#order-form-section");
    if (onOrderClick) {
      onOrderClick();
    } else {
      document.getElementById("order-form-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="product-video" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Heading matching reference typography with slide-in animation */}
        <div className="mb-6 animate-slide-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>LIVE SHOWROOM DEMONSTRATION</span>
          </div>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase leading-snug">
            WATCH THE 5-BURNER COOKTOP IN ACTION
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
            Real physical footage showing the central radiant ceramic electric hotplate glowing red, the digital touch timer display with 2000W power reading, and the heavy-duty hinged flip-up burners.
          </p>
        </div>

        {/* Exact YouTube Showroom Video Embed */}
        <div className="relative w-full aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black border-2 border-slate-900 shadow-2xl mb-4">
          <iframe
            title="5-Burner Cooktop Showroom Demonstration Video"
            src={videoEmbedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Direct Link to YouTube Shorts */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <a
            href={videoDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors"
          >
            <span>Watch directly on YouTube (Shorts)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Feature Callouts under video matching physical demonstration */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-left mb-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mb-0.5">
              <Zap className="w-4 h-4 shrink-0" />
              <span>Glowing Ceramic Zone</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Instant radiant circular electric heating rings under glass.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-0.5">
              <Timer className="w-4 h-4 shrink-0" />
              <span>Digital 2000W Display</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Bright red LED countdown timer & touch wattage controls.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-0.5">
              <Power className="w-4 h-4 shrink-0" />
              <span>Auto-Off & Child Lock</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Master emergency touch switch & automatic overheat cutoff.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-0.5">
              <Flame className="w-4 h-4 shrink-0 text-amber-500" />
              <span>4 Hinged Gas Burners</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Lift up on heavy-duty hinges for 10-second grease wipe-downs.
            </p>
          </div>
        </div>

        {/* Quick Order CTA Link under Video */}
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleOrderClick}
            className="w-full py-3 px-5 rounded-xl font-heading font-extrabold text-sm sm:text-base bg-[#1abc9c] hover:bg-[#16a288] text-white shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>ORDER THIS EXACT 5-BURNER UNIT — ₦280,000</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};


