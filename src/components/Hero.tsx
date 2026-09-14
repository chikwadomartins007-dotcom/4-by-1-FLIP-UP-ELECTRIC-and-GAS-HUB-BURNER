import React from "react";
import { ArrowDown, MessageCircle, Flame, Zap, Timer, Power, Check, Phone, Clock } from "lucide-react";
import { motion } from "motion/react";
import { ProductImage } from "./ProductImage";
import { LivelyOrderButton } from "./LivelyOrderButton";
import { getWhatsAppOrderUrl, WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";
import { useCountdown3Days } from "../utils/countdown";

interface HeroProps {
  onOrderClick: () => void;
  currentQuantity: number;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, currentQuantity }) => {
  const timeLeft = useCountdown3Days();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleOrderClick = () => {
    Analytics.trackCTAClick("Order Now (Hero Main Button)", "#order-form-section");
    onOrderClick();
  };

  const handleWhatsAppClick = () => {
    Analytics.trackContact("whatsapp", "hero_whatsapp_btn", currentQuantity);
  };

  return (
    <section id="hero" className="pt-6 pb-12 sm:pt-10 sm:pb-16 bg-white text-slate-900 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Main Sales Headline */}
        <h1 className="font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight uppercase mb-4 animate-slide-in-up">
          Modern 5-Burner Built-In Gas + Electric Cooktop{" "}
          <span className="text-[#15803d] block sm:inline">
            (with Digital Timer & Automatic Off)
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto mb-8 font-normal animate-slide-in-up [animation-delay:150ms]">
          This Luxury Built-In Cooktop is designed to bring speed, elegance, and peace of mind right into your kitchen. Now you can enjoy 4 high-efficiency gas burners, 1 central radiant ceramic electric hotplate, digital countdown timer with auto-cutoff, and instant 1-touch automatic off safety key.
        </p>

        {/* Hero Product Image (Centered, Large, Clean Border & Shadow) */}
        <div className="w-full max-w-2xl mx-auto mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 p-2 sm:p-4 animate-slide-in-up [animation-delay:250ms]">
          <ProductImage priority={true} />
        </div>

        {/* Hero Instant Quick Order Box (Order in 30 Seconds) */}
        <div className="w-full max-w-2xl mx-auto mb-10 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border-2 border-emerald-500/40 shadow-xl text-center animate-slide-in-up [animation-delay:300ms]">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-sm border border-red-400">
              <Clock className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
              <span>3-DAY PROMO: {pad(timeLeft.days)}D : {pad(timeLeft.hours)}H : {pad(timeLeft.minutes)}M : {pad(timeLeft.seconds)}S</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              ✓ Free Nationwide Delivery
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              ✓ Pay on Delivery
            </span>
          </div>

          <div className="my-2">
            <span className="text-xs text-slate-400 block font-semibold">TODAY'S PROMO PRICE:</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-heading font-black text-yellow-300 tracking-tight">
                ₦280,000
              </span>
              <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                ₦350,000
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                SAVE ₦70,000
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 mb-4 max-w-md mx-auto">
            No upfront card payment required. Inspect your unit on arrival before paying!
          </p>

          {/* Dual Action Buttons for Ultra-Easy Ordering */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            <button
              type="button"
              onClick={handleOrderClick}
              className="w-full py-3.5 px-4 rounded-xl font-heading font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>⚡ ORDER NOW (30 SECONDS)</span>
            </button>

            <a
              href={getWhatsAppOrderUrl(currentQuantity)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>1-CLICK WHATSAPP ORDER</span>
            </a>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <span>Prefer voice? Call customer care:</span>
            <a href={CALL_PHONE_TEL} className="font-bold text-white hover:text-yellow-300 underline flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#B8860B]" />
              <span>{WHATSAPP_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* 4 Feature Highlights with Emojis & Bold Titles */}
        <div className="text-left space-y-4 max-w-2xl mx-auto mb-8">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="text-2xl shrink-0">🔥</span>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 mb-0.5">
                Dual Fuel Independence
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                4 high-speed gas burners plus 1 central radiant ceramic electric hotplate so cooking never stops, even during gas cylinder run-out or power fluctuations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="text-2xl shrink-0">⏱️</span>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 mb-0.5">
                Smart Touch Control Panel & Digital Timer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Easily set your cooking countdown timer (1 to 99 minutes) with automatic safety shutoff on the sleek digital touch display so meals never burn.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="text-2xl shrink-0">🛡️</span>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 mb-0.5">
                Automatic Off Safety Key & Child Lock
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Master 1-touch emergency cutoff switch and built-in child lock provide total peace of mind for you and your family.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="text-2xl shrink-0">🧼</span>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 mb-0.5">
                Flip-Up Hinged Burners for 10-Second Cleaning
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Articulated heavy-duty hinges allow each burner to tilt upward so you can wipe underneath in seconds with zero grease traps.
              </p>
            </div>
          </div>
        </div>

        {/* High-Contrast Bold Callout Quote */}
        <div className="my-8 py-4 px-6 rounded-xl bg-slate-900 text-white max-w-2xl mx-auto shadow-md">
          <p className="font-heading font-extrabold text-sm sm:text-base tracking-wide uppercase leading-snug">
            NOT JUST A COOKTOP, BUT A LIFESTYLE: LUXURIOUS, SAFE, AND DESIGNED TO ELEVATE YOUR KITCHEN.
          </p>
        </div>

        {/* 3 Photos Grid Showcase (Top-Down, Kitchen Install, Hinged Burners) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs flex flex-col">
            <div className="aspect-[4/3] bg-white relative overflow-hidden flex items-center justify-center p-2">
              <motion.img
                initial={{ opacity: 0, x: -35, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                src="/Hd84f5f7654644224945b4ea055aa07a1Y.png"
                alt="5-Burner Cooktop Layout Diagram"
                className="w-full h-full object-contain animate-image-slide-in"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png";
                }}
              />
            </div>
            <div className="p-3">
              <span className="font-heading font-bold text-xs text-slate-900 block mb-1">
                5 Cooking Zones
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                4 Gas Burners + 1 Central Radiant Ceramic Zone.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs flex flex-col">
            <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden flex items-center justify-center p-3">
              <img
                src="/H6d042f563b4c47b08ba59b298031b8c1A.jpg"
                alt="Physical Cooktop 2000W Active Burner"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://sc04.alicdn.com/kf/H6d042f563b4c47b08ba59b298031b8c1A.jpg";
                }}
              />
            </div>
            <div className="p-3">
              <span className="font-heading font-bold text-xs text-slate-900 block mb-1">
                2000W LED & Touch Timer
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Digital display with automatic safety power cutoff.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs flex flex-col">
            <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden flex items-center justify-center p-3">
              <img
                src="/H4183961f34a64d47a5f116fa6bfddf7eE.png"
                alt="Flip-Up Hinged Burner Detail"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://sc04.alicdn.com/kf/H4183961f34a64d47a5f116fa6bfddf7eE.png";
                }}
              />
            </div>
            <div className="p-3">
              <span className="font-heading font-bold text-xs text-slate-900 block mb-1">
                Hinged Flip-Up Design
              </span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Tilt burners upward for effortless 1-wipe clean.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Direct Response CTA Button with Lively Animation */}
        <LivelyOrderButton
          onClick={handleOrderClick}
          className="mb-6 animate-slide-in-up [animation-delay:450ms]"
        />

      </div>
    </section>
  );
};
