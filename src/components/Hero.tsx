import React from "react";
import {
  Flame,
  Zap,
  Timer,
  ShieldCheck,
  Truck,
  PackageCheck,
  ArrowRight,
  CheckCircle2,
  Eye,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ProductImage } from "./ProductImage";
import { Analytics } from "../utils/analytics";

interface HeroProps {
  onOrderClick: () => void;
  onQuickOrderClick?: () => void;
  currentQuantity: number;
}

const MARQUEE_HIGHLIGHTS = [
  {
    badge: "HYBRID 2-IN-1 SYSTEM",
    badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    title: "4 Blue-Flame Gas Burners + 1 Radiant Ceramic Electric Zone (90×51cm)",
    highlight: "Never get stranded when gas runs out or power fluctuates",
    price: "₦280,000",
    targetId: "#specs",
  },
  {
    badge: "SMART DIGITAL SAFETY",
    badgeColor: "bg-red-500/25 text-red-200 border-red-500/40",
    title: "1–99 Min Digital Timer + 1-Touch Automatic Off Safety Key",
    highlight: "Auto power & flame shutoff prevents burnt food and kitchen hazards",
    price: "Save ₦70,000",
    targetId: "#safety",
  },
  {
    badge: "EASY 10-SEC CLEANING",
    badgeColor: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    title: "90° Flip-Up Articulated Hinged Burners + 8mm Tempered Black Glass",
    highlight: "Tilt burners up to wipe spills effortlessly • Pay On Delivery Nationwide",
    price: "Free Delivery",
    targetId: "#installation-requirements",
  },
];

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

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 1. STICKY JET-BLACK MARQUEE TICKER BAR UNDER HEADER (Red, Black & Yellow palette) */}
      <div
        className="sticky top-16 sm:top-20 z-30 bg-neutral-950 text-white border-b border-neutral-800 shadow-lg overflow-hidden select-none"
        role="region"
        aria-label="Cooktop Key Highlights Marquee"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 pointer-events-none" />

        {/* Left Fixed Label Badge in Red & Yellow */}
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-2.5 sm:px-3.5 bg-gradient-to-r from-neutral-950 via-neutral-950 to-transparent pointer-events-none">
          <div className="flex items-center gap-1.5 bg-[#E8132E] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm pointer-events-auto shrink-0 border border-red-400/50">
            <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
            <span className="hidden sm:inline">Key Highlights</span>
            <span className="sm:hidden">Highlights</span>
          </div>
        </div>

        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 z-20 w-12 sm:w-20 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />

        {/* Sliding Marquee Track */}
        <div className="py-2.5 sm:py-3 pl-28 sm:pl-44 overflow-hidden">
          <div className="animate-marquee-slide flex items-center gap-6 sm:gap-10 cursor-pointer">
            {[...MARQUEE_HIGHLIGHTS, ...MARQUEE_HIGHLIGHTS].map((item, idx) => (
              <div
                key={idx}
                onClick={() => scrollToSection(item.targetId)}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0 py-0.5 px-2 rounded-xl transition-colors hover:bg-white/5 group"
              >
                <span
                  className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${item.badgeColor}`}
                >
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  <span>{item.badge}</span>
                </span>

                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="font-extrabold text-white group-hover:text-yellow-300 transition-colors whitespace-nowrap">
                    {item.title}
                  </span>
                  <span className="hidden md:inline text-neutral-400 font-normal whitespace-nowrap">
                    — {item.highlight}
                  </span>
                  <span className="font-mono font-bold text-yellow-300 bg-yellow-500/15 px-2 py-0.5 rounded border border-yellow-400/40 whitespace-nowrap text-xs">
                    {item.price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToSection("#specs");
                  }}
                  className="inline-flex items-center gap-1 bg-gradient-to-r from-[#E8132E] to-red-600 hover:from-red-600 hover:to-red-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-sm border border-red-400/40 transition-all shrink-0 cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-yellow-300" />
                  <span>Specs</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickOrderPopup();
                  }}
                  className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-[11px] px-2.5 py-1 rounded-full shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-neutral-950" />
                  <span>Quick Order</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SPLIT 12-COLUMN HERO SECTION ON CLEAN WHITE BACKGROUND (Red, Black & Yellow accents) */}
      <section
        id="hero"
        className="relative pt-4 pb-8 sm:py-12 overflow-hidden bg-white border-b border-slate-200/80"
      >
        {/* Subtle Warm Red & Yellow Ambient Glows on White Background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-yellow-50/80 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-start">
            {/* MOBILE VIDEO + PRODUCT GALLERY (Shown on top for mobile screens) */}
            <div className="block lg:hidden order-1">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                <ProductImage priority={true} />
                <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                  <span className="font-bold text-neutral-950 flex items-center gap-1.5 text-[11px]">
                    <Flame className="w-3.5 h-3.5 text-[#E8132E] fill-[#E8132E]" />
                    5-Burner Gas + Electric Cooktop (90×51cm)
                  </span>
                  <span className="text-[10px] text-neutral-950 font-extrabold bg-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400">
                    1-Yr Warranty Included
                  </span>
                </div>
              </div>
            </div>

            {/* LEFT 6 COLUMNS: VALUE PROPOSITION, 2x2 PILLS, PRICE CARD & DUAL CTAs */}
            <div className="lg:col-span-6 xl:col-span-6 order-2 lg:order-1 flex flex-col justify-center text-left">
              {/* Top Pill Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-neutral-950 text-[11px] font-extrabold tracking-wide uppercase mb-2.5 w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E8132E] animate-pulse" />
                <span>Factory Direct • Premium Quality</span>
              </div>

              {/* Main Display Headline (Black + Red & Yellow Underline) */}
              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-neutral-950 tracking-tight leading-[1.15] mb-2.5 font-display">
                UPGRADE YOUR KITCHEN WITH A{" "}
                <span className="text-[#E8132E] underline decoration-yellow-400 decoration-4 underline-offset-4">
                  5-BURNER HYBRID COOKTOP
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base font-semibold text-neutral-700 mb-4 max-w-xl leading-relaxed">
                4 high-efficiency blue-flame gas burners + 1 central 3000W radiant ceramic electric hotplate, programmable digital timer with auto-shutoff, and 90° flip-up burners for 10-second cleaning.
              </p>

              {/* 2x2 Feature Checkmark Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4 bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="truncate">4 Gas + 1 Electric Zone</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="truncate">Digital Timer &amp; Auto-Off</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="truncate">90° Flip-Up Easy Clean</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="truncate">8mm Tempered Black Glass</span>
                </div>
              </div>

              {/* White Bordered Promo Price Card (Red, Black & Yellow accents) */}
              <div className="bg-white border-2 border-red-200 rounded-xl p-3.5 sm:p-4 mb-4 shadow-xs relative overflow-hidden">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <div className="text-neutral-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                    Regular Price:{" "}
                    <span className="line-through text-neutral-400 font-semibold">
                      ₦350,000
                    </span>
                  </div>
                  <div className="bg-yellow-100 text-neutral-950 border border-yellow-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>YOU SAVE ₦70,000</span>
                    <span className="bg-[#E8132E] text-white px-1.5 py-0.5 rounded-full text-[9px] font-black">
                      {discountPercent}% OFF
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[11px] text-neutral-600 font-extrabold uppercase tracking-wider">
                    Promo Price:
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight font-mono">
                    ₦280,000
                  </span>
                  <span className="text-[11px] text-neutral-950 font-extrabold bg-yellow-300 px-2 py-0.5 rounded border border-yellow-400">
                    Complete Set + 1-Yr Warranty
                  </span>
                </div>
              </div>

              {/* Dual Stacked Action Buttons (Vibrant Red Main Button + Yellow Quick Order Pop-Up) */}
              <div className="mb-5 space-y-2.5">
                <button
                  type="button"
                  id="hero-order-btn"
                  onClick={handleOrderScroll}
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#E8132E] hover:bg-red-700 text-white font-extrabold text-sm sm:text-base py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl shadow-red-600/25 hover:shadow-red-600/35 transform active:scale-[0.98] transition-all cursor-pointer tracking-wide uppercase animate-action-blink"
                >
                  <div className="flex flex-col items-center">
                    <span>ORDER NOW — PAYMENT ON DELIVERY</span>
                    <span className="text-[11px] font-bold text-yellow-300 normal-case tracking-normal">
                      ₦280,000 • Inspect at your doorstep before paying
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-yellow-300 shrink-0" />
                </button>

                <button
                  type="button"
                  id="hero-quick-order-btn"
                  onClick={handleQuickOrderPopup}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-300 hover:to-yellow-200 text-neutral-950 font-black text-xs sm:text-sm py-3 px-6 rounded-xl border border-yellow-500/40 shadow-md shadow-yellow-400/20 transform active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider"
                >
                  <Zap className="w-4 h-4 fill-neutral-950" />
                  <span>⚡ 1-Click Quick Order Form (Pop-Up)</span>
                </button>
              </div>

              {/* 3-Column Trust Row Below Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200 text-neutral-700 text-xs">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
                  <Truck className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="font-bold truncate">Free Nationwide Delivery</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
                  <PackageCheck className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="font-bold truncate">Shockproof Packaging</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
                  <ShieldCheck className="w-4 h-4 text-[#E8132E] shrink-0" />
                  <span className="font-bold truncate">Pay on Delivery</span>
                </div>
              </div>
            </div>

            {/* RIGHT 6 COLUMNS: DESKTOP LIVE VIDEO + INTERACTIVE PRODUCT CARD SHOWCASE */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 order-2">
              <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-200 shadow-xl bg-white">
                <ProductImage priority={true} />
                <div className="p-4 bg-white border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs text-neutral-700 mb-1">
                    <span className="font-extrabold text-neutral-950 text-sm flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#E8132E] fill-[#E8132E]" />
                      5-Burner Gas + Electric Built-In Workstation
                    </span>
                    <span className="text-neutral-950 font-extrabold flex items-center gap-1.5 bg-yellow-300 border border-yellow-400 px-2.5 py-0.5 rounded-full text-[11px]">
                      In Stock • Ships Nationwide
                    </span>
                  </div>
                  <p className="text-neutral-600 text-xs">
                    Includes 4 Brass Blue-Flame Gas Burners, 3000W Central Ceramic Electric Zone, Digital Touch Timer (1–99 Min), Automatic Off Key &amp; Heavy-Duty Cast Iron Supports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACTORY-DIRECT SPECIAL OFFER CARD SECTION ON WHITE BACKGROUND (Red, Black & Yellow) */}
      <section id="offer-section" className="py-8 sm:py-12 bg-white relative border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-white border-2 border-neutral-900/15 p-5 sm:p-8 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-red-50/70 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-yellow-50/70 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-300 border border-yellow-400 text-neutral-950 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E8132E]" />
                FACTORY-DIRECT SPECIAL OFFER
              </span>
            </div>

            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mb-1 font-display">
                COMPLETE 5-BURNER HYBRID BUILT-IN COOKTOP (90×51CM)
              </h2>
              <p className="text-neutral-600 text-xs sm:text-sm max-w-lg mx-auto">
                Everything in one box: 4 flip-up gas burners, central 3000W ceramic electric zone, digital countdown timer, cast-iron pan supports, and 1-year warranty.
              </p>
            </div>

            {/* Inner Price Box */}
            <div className="bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200 text-center mb-5 relative">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-neutral-500 text-xs uppercase font-bold">Regular:</span>
                <span className="text-base sm:text-lg font-bold text-neutral-400 line-through">
                  ₦350,000
                </span>
                <span className="bg-[#E8132E] text-white font-extrabold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                  SAVE ₦70,000 ({discountPercent}% OFF)
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-0.5 mb-3">
                <span className="text-neutral-950 font-extrabold text-[10px] sm:text-xs tracking-widest uppercase bg-yellow-300 px-2.5 py-0.5 rounded-full border border-yellow-400">
                  TODAY'S PROMO PRICE
                </span>
                <span className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight font-display mt-1">
                  ₦280,000
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-bold text-neutral-800">
                <span className="flex items-center gap-1 text-neutral-950">
                  <Sparkles className="w-3 h-3 text-[#E8132E]" />
                  Factory Direct Discount
                </span>
                <span className="text-neutral-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-neutral-800">
                  <Truck className="w-3 h-3 text-[#E8132E]" />
                  Free Nationwide Delivery
                </span>
                <span className="text-neutral-300 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-[#E8132E] font-extrabold">
                  <ShieldCheck className="w-3 h-3 text-[#E8132E]" />
                  Payment on Delivery Available
                </span>
              </div>
            </div>

            {/* 2x2 Checklist inside Offer Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs text-neutral-800 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>Digital Timer (1–99 Min) &amp; Auto-Shutoff</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>3000W Central Radiant Electric Hotplate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>90° Flip-Up Hinged Burners for Easy Cleaning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8132E] shrink-0" />
                <span>8mm Explosion-Proof Tempered Black Glass</span>
              </div>
            </div>

            {/* Side-by-Side CTA Buttons (Red + Yellow) */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                type="button"
                onClick={handleOrderScroll}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E8132E] hover:bg-red-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 transition-all cursor-pointer uppercase tracking-wider"
              >
                <span>CLAIM PROMO &amp; ORDER</span>
                <ArrowRight className="w-4 h-4 text-yellow-300 shrink-0" />
              </button>

              <button
                type="button"
                onClick={handleQuickOrderPopup}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-neutral-950 font-black text-xs sm:text-sm py-3.5 px-5 rounded-2xl border border-yellow-500/40 shadow-md transition-all cursor-pointer uppercase tracking-wider whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-neutral-950" />
                <span>⚡ Quick Order Pop-Up</span>
              </button>
            </div>

            {/* Bottom Reassurance Bar */}
            <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-800">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#E8132E]" />
                Inspection on Delivery
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1.5 font-bold">
                <Truck className="w-4 h-4 text-[#E8132E]" />
                Free Nationwide Dispatch
              </span>
              <span className="text-neutral-300">•</span>
              <span className="flex items-center gap-1.5 font-extrabold text-[#E8132E]">
                <Wrench className="w-4 h-4 text-[#E8132E]" />
                1-Year Official Warranty
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLACK & RED/YELLOW KITCHEN CHALLENGE SECTION */}
      <section className="py-10 sm:py-14 bg-neutral-950 border-b border-neutral-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-yellow-300 font-extrabold text-[11px] uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30 mb-2.5 inline-block">
              The Everyday Nigerian Kitchen Challenge
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight font-display">
              YOUR KITCHEN DESERVES MORE THAN AN ORDINARY TABLETOP STOVE.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2">
              Why struggle with sudden gas run-outs, burnt pots, and stubborn grease traps when your cooktop can work smarter for you?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-neutral-900/90 border border-neutral-800 hover:border-red-500/50 rounded-2xl p-5 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider">
                  Fuel Interruption
                </span>
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
                GAS RUNS OUT MID-COOKING AT NIGHT?
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                With a single-fuel stove, an empty gas cylinder leaves your family stranded. This hybrid cooktop switches seamlessly to the 3000W central electric hotplate so dinner finishes on time.
              </p>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 hover:border-red-500/50 rounded-2xl p-5 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider">
                  Kitchen Safety Risk
                </span>
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400">
                  <Timer className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
                TIRED OF BURNT POTS &amp; FORGOTTEN FLAMES?
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Ordinary stoves have zero timer control. Set our 1–99 minute digital countdown timer and walk away—the cooktop automatically shuts off when your food is ready.
              </p>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 hover:border-red-500/50 rounded-2xl p-5 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider">
                  Stubborn Grease Traps
                </span>
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
                HATE SCRUBBING AROUND FIXED BURNERS?
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Traditional burners trap oil and soup spills underneath. Our 90° articulated flip-up burners tilt upward so you can wipe the entire tempered glass surface clean in 10 seconds.
              </p>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 hover:border-red-500/50 rounded-2xl p-5 shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider">
                  Outdated Aesthetics
                </span>
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 tracking-tight">
                WANT A MODERN LUXURY KITCHEN CENTERPIECE?
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Bulky metal stoves cheapen granite or marble countertops. The mirror-polished 8mm black tempered glass sits flush in your slab for a 5-star showroom finish.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
