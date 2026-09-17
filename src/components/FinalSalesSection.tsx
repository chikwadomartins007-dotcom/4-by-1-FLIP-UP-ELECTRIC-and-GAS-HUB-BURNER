import React from "react";
import { ArrowDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";
import { WHATSAPP_PHONE_DISPLAY } from "../utils/whatsapp";
import { useCountdown3Days } from "../utils/countdown";

interface FinalSalesSectionProps {
  quantity: number;
  onOrderClick: () => void;
}

export const FinalSalesSection: React.FC<FinalSalesSectionProps> = ({ onOrderClick }) => {
  const timeLeft = useCountdown3Days();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-100 text-center overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading matching reference website with slide-in animation */}
        <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight mb-4 animate-slide-in-up">
          SPECIAL INFORMATION BEFORE YOU ORDER
        </h2>

        {/* Normal vs Promo Price Callout with 3-Day Countdown */}
        <div className="mb-6 space-y-3 animate-slide-in-up [animation-delay:150ms]">
          <p className="font-bold text-base sm:text-lg text-red-600 line-through">
            COST FOR ONE IS ₦350,000
          </p>
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 max-w-xl mx-auto shadow-xs">
            <p className="font-extrabold text-base sm:text-xl text-emerald-800 uppercase tracking-tight leading-snug">
              ORDER HERE AND NOW FOR ₦280,000 (PROMO PRICE) INSTEAD OF ₦350,000 (NORMAL PRICE) + FREE DELIVERY &amp; PAY ON DELIVERY
            </p>

            {/* 3-Day Countdown Badge */}
            <div className="mt-3 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1 text-red-600 uppercase font-black">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>3-DAY PROMO COUNTDOWN:</span>
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-xs bg-slate-900 text-white px-2.5 py-1 rounded-md">
                <span className="text-yellow-300">{pad(timeLeft.days)}D</span>
                <span>:</span>
                <span>{pad(timeLeft.hours)}H</span>
                <span>:</span>
                <span>{pad(timeLeft.minutes)}M</span>
                <span>:</span>
                <span className="text-yellow-300">{pad(timeLeft.seconds)}S</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Photo Box with Specs Banner */}
        <div className="max-w-lg mx-auto mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 shadow-xs animate-slide-in-up [animation-delay:250ms]">
          <div className="aspect-[16/10] bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 mb-3">
            <img
              src="/Hd84f5f7654644224945b4ea055aa07a1Y.png"
              alt="5-Burner Cooktop Promo Diagram"
              className="w-full h-full object-contain animate-zoom-in-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png";
              }}
            />
          </div>
          <div className="text-center font-bold text-xs sm:text-sm text-slate-900">
            <p className="text-emerald-700 font-extrabold">
              5-BURNER BUILT-IN COOKTOP WITH TIMER &amp; AUTO-OFF — ₦280,000
            </p>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              PREMIUM BLACK TEMPERED GLASS • 4 GAS + 1 CERAMIC ELECTRIC
            </p>
          </div>
        </div>

        {/* Strict Nigerian Direct-Response Order Policy Warning Box (Dashed Red Border) */}
        <div className="p-6 rounded-2xl bg-red-50/60 border-2 border-dashed border-red-600 max-w-xl mx-auto text-left shadow-sm space-y-3 mb-8">
          <div className="flex items-center gap-2 text-red-700 font-heading font-black text-sm uppercase">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>CRITICAL ORDER NOTICE:</span>
          </div>

          <p className="font-heading font-extrabold text-xs sm:text-sm text-red-700 uppercase leading-snug">
            PLEASE DO NOT FILL THIS FORM BELOW IF YOUR MONEY IS NOT READILY AVAILABLE.
          </p>

          <p className="font-heading font-bold text-xs sm:text-sm text-slate-900 leading-snug">
            FILL THE FORM ONLY IF YOU ARE READY TO PAY AND COLLECT ON DELIVERY!
          </p>

          <p className="text-xs text-slate-700 leading-relaxed">
            We have <strong>strictly limited stock</strong>. Please don't order if you are currently travelling or don't have funds ready, rather save our customer care number (<strong>{WHATSAPP_PHONE_DISPLAY}</strong>) and contact us when you are ready.
          </p>

          <div className="pt-2 border-t border-red-200 flex items-center gap-2 text-xs font-extrabold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>NATIONWIDE PAYMENT ON DELIVERY AVAILABLE.</span>
          </div>
        </div>

        {/* Animated Arrow Pointing Down */}
        <div className="flex flex-col items-center justify-center gap-1 text-slate-900 mb-2">
          <span className="font-heading font-extrabold text-sm uppercase tracking-wide">
            FILL THE FORM BELOW TO PLACE ORDER
          </span>
          <ArrowDown className="w-6 h-6 text-emerald-600 animate-bounce mt-1" />
        </div>

      </div>
    </section>
  );
};
