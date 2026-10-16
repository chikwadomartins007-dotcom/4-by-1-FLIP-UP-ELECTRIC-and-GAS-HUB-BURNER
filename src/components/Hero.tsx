import React from "react";
import {
  Flame,
  Zap,
  ShieldCheck,
  Truck,
  PackageCheck,
  ArrowRight,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { ProductImage } from "./ProductImage";
import { Analytics } from "../utils/analytics";

interface HeroProps {
  onOrderClick: () => void;
  onQuickOrderClick?: () => void;
  currentQuantity: number;
}

export const Hero: React.FC<HeroProps> = ({
  onOrderClick,
  onQuickOrderClick,
}) => {
  const normalPrice = 350000;
  const promoPrice = 280000;
  const savings = normalPrice - promoPrice;
  const discountPercent = Math.round((savings / normalPrice) * 100);

  const handleOrderScroll = () => {
    Analytics.trackCTAClick("Order Now (Hero Main Button)", "#order-form-section");
    const formEl = document.getElementById("order-form-section");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    } else {
      onOrderClick();
    }
  };

  const handleQuickOrderPopup = () => {
    Analytics.trackCTAClick("1-Click Quick Order Form (Hero Pop-Up)", "#quick-order-modal");
    if (onQuickOrderClick) {
      onQuickOrderClick();
    } else {
      onOrderClick();
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-6 pb-12 sm:py-16 overflow-hidden bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* MOBILE PRODUCT SHOWCASE (Shown first on small screens) */}
          <div className="block lg:hidden">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <ProductImage priority={true} />
              <div className="p-3 bg-neutral-950 text-white flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-xs text-yellow-300">
                  <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  5-Burner Gas + Electric Workstation
                </span>
                <span className="text-[10px] text-neutral-950 font-black bg-yellow-400 px-2 py-0.5 rounded-full">
                  1-Yr Warranty
                </span>
              </div>
            </div>
          </div>

          {/* LEFT 6-7 COLUMNS: CLEAN VALUE PROPOSITION & ACTION */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-neutral-950 text-xs font-extrabold uppercase tracking-wide mb-3 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#E8132E] animate-pulse" />
              <span>5-IN-1 HYBRID COOKTOP • NATIONWIDE DELIVERY</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-neutral-950 tracking-tight leading-[1.15] mb-3 font-display">
              UPGRADE YOUR KITCHEN WITH A{" "}
              <span className="text-[#E8132E] underline decoration-yellow-400 decoration-4 underline-offset-4">
                5-BURNER HYBRID COOKTOP
              </span>
            </h1>

            {/* Clean Subtitle */}
            <p className="text-sm sm:text-base font-medium text-neutral-700 mb-5 leading-relaxed">
              4 high-efficiency blue flame gas burners + 1 central 3000W rapid ceramic electric hotplate. Built with 8mm explosion-proof tempered black glass, digital timer with auto-off, and 90° flip-up burners for effortless 10-second cleaning.
            </p>

            {/* 4 Core Features Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>4 Gas + 1 Electric Zone</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>Digital Timer &amp; Auto-Off</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>90° Flip-Up Easy Clean</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>8mm Tempered Glass</span>
              </div>
            </div>

            {/* Simple Price Card */}
            <div className="bg-white border-2 border-neutral-900 rounded-xl p-4 mb-5 shadow-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <div className="text-neutral-500 text-xs font-bold uppercase tracking-wider">
                  Regular Price:{" "}
                  <span className="line-through text-neutral-400 font-semibold">
                    ₦350,000
                  </span>
                </div>
                <div className="bg-[#E8132E] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span>SAVE ₦70,000</span>
                  <span>({discountPercent}% OFF)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight font-mono">
                  ₦280,000
                </span>
                <span className="text-xs text-neutral-950 font-extrabold bg-yellow-300 px-2.5 py-1 rounded border border-yellow-400">
                  FREE NATIONWIDE DELIVERY • PAY ON DELIVERY
                </span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                type="button"
                id="hero-order-btn"
                onClick={handleOrderScroll}
                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-[#E8132E] hover:bg-red-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-red-600/25 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>ORDER NOW — PAY ON DELIVERY</span>
                <ArrowRight className="w-4 h-4 text-yellow-300 shrink-0" />
              </button>

              <button
                type="button"
                id="hero-quick-order-btn"
                onClick={handleQuickOrderPopup}
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl border border-yellow-500/40 shadow-sm active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-neutral-950" />
                <span>⚡ 1-Click Quick Order</span>
              </button>
            </div>

            {/* Trust Footer */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200 text-neutral-700 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <Truck className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <PackageCheck className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>Inspect First</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>Pay on Delivery</span>
              </div>
            </div>
          </div>

          {/* DESKTOP PRODUCT SHOWCASE */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-200 shadow-xl bg-white">
              <ProductImage priority={true} />
              <div className="p-4 bg-neutral-950 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span className="font-extrabold text-sm text-white">
                    5-Burner Built-In Gas + Electric Cooktop
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-300 bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded-full font-bold text-[11px]">
                  <Wrench className="w-3 h-3" />
                  <span>1-Year Official Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
