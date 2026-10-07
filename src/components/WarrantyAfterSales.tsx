import React from "react";
import {
  ShieldCheck,
  PhoneCall,
  Wrench,
  Award,
  CheckCircle2,
  Clock,
  Headphones,
  MessageCircle,
  Sparkles,
  FileCheck,
} from "lucide-react";
import {
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_PHONE_RAW,
  CALL_PHONE_TEL,
} from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

interface WarrantyAfterSalesProps {
  onOrderClick?: () => void;
  hasSubmittedOrder?: boolean;
}

const WARRANTY_COVERAGE_ITEMS = [
  {
    title: "3000W Radiant Ceramic Heating Element",
    desc: "Full 12-month factory replacement coverage on the central infrared electric coil and thermal sensor.",
  },
  {
    title: "Digital Touch Panel & Timer Module",
    desc: "Protected against display glitches, timer micro-controller faults, and 1-touch Automatic Off key issues.",
  },
  {
    title: "Articulated Flip-Up Gas Burners & Ignition",
    desc: "Covers pulse auto-ignition modules, brass burner hinges, and internal gas safety valves.",
  },
  {
    title: "Genuine Spare Parts Availability",
    desc: "We stock 100% original replacement knobs, cast-iron trivets, and burner caps in our Lagos & Abuja service centers.",
  },
];

export const WarrantyAfterSales: React.FC<WarrantyAfterSalesProps> = ({
  onOrderClick,
  hasSubmittedOrder = false,
}) => {
  const supportWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
    "Hello MAX Luxury Bathrooms Technical Support, I have a question regarding the 1-Year Warranty & Installation for the 5-Burner Built-In Cooktop."
  )}`;

  const handleCallSupport = () => {
    Analytics.trackContact("phone", "Warranty & Tech Support Hotline");
  };

  const handleWhatsAppSupport = () => {
    Analytics.trackContact("whatsapp", "Warranty & Tech Support WhatsApp");
  };

  return (
    <section
      id="warranty-support"
      aria-label="1-Year Product Warranty and After-Sales Technical Support"
      className="py-12 sm:py-16 bg-white border-b border-slate-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Luxury Warranty & Support Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-2 border-[#C5A059]/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Ambient Gold & Emerald Glow Accents */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/40 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-sm">
              <Award className="w-4 h-4 text-[#E5C378] shrink-0" />
              <span>Official MAX Luxury Protection Plan</span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight uppercase">
              1-Year Comprehensive Warranty{" "}
              <span className="text-[#E5C378] block sm:inline">
                &amp; Dedicated After-Sales Support
              </span>
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Buy with 100% confidence. Every 5-Burner Hybrid Cooktop is backed by an official{" "}
              <strong className="text-white font-bold">12-Month Manufacturer &amp; Local Service Warranty</strong>{" "}
              plus direct access to our Nigerian engineering support desk.
            </p>
          </div>

          {/* Two-Column Highlight Cards: 1-Year Warranty Seal + Dedicated Technical Support Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative z-10">
            {/* Left Card: 1-Year Official Warranty Seal */}
            <div className="rounded-2xl bg-white/[0.04] border border-[#C5A059]/30 p-5 sm:p-6 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#9A7432] text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-[#C5A059]/20">
                      <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C378] font-bold block">
                        CERTIFIED PROTECTION
                      </span>
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-snug">
                        1-Year Product Warranty
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    Included Free
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Your order includes a stamped warranty certificate inside the box. If any factory electrical or burner defect occurs within 12 months, our technicians repair or replace the faulty module at zero cost to you.
                </p>

                <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <FileCheck className="w-4 h-4 text-[#E5C378] shrink-0" />
                    <span>Stamped Warranty Certificate Included in Box</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Wrench className="w-4 h-4 text-[#E5C378] shrink-0" />
                    <span>Free Factory-Trained Technician Diagnostics</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>48-Hour Inspection Guarantee on Arrival</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Warranty ID tracked via Order Phone Number</span>
                <span className="text-[#E5C378] font-bold">100% Covered</span>
              </div>
            </div>

            {/* Right Card: Dedicated Technical Support Hotline */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-900 border border-emerald-500/40 p-5 sm:p-6 flex flex-col justify-between backdrop-blur-sm">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                        DIRECT ENGINEER ACCESS
                      </span>
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-snug">
                        Dedicated Technical Support Line
                      </h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Desk
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Need guidance for your cabinet installer on the 870×480mm countertop cutout, LPG regulator connection, or 220V plug setup? Call or WhatsApp our in-house technical support line for live step-by-step assistance.
                </p>

                {/* Prominent Direct Hotline Number Box */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/15 mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        TECHNICAL &amp; AFTER-SALES HOTLINE
                      </span>
                      <a
                        href={CALL_PHONE_TEL}
                        onClick={handleCallSupport}
                        className="font-mono font-black text-base sm:text-lg text-white hover:text-emerald-400 transition-colors tracking-wide"
                      >
                        {WHATSAPP_PHONE_DISPLAY}
                      </a>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      Mon – Sat
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      8:00 AM – 7:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Call Support or Post-Order WhatsApp */}
              <div className={`grid grid-cols-1 ${hasSubmittedOrder ? "sm:grid-cols-2" : ""} gap-2.5`}>
                <a
                  href={CALL_PHONE_TEL}
                  onClick={handleCallSupport}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Tech Support</span>
                </a>
                {hasSubmittedOrder && (
                  <a
                    href={supportWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppSupport}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Engineer</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 4-Point Warranty Coverage Breakdown Grid */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-6 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#E5C378]" />
                <h4 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-white">
                  What Your 1-Year Warranty &amp; Support Covers
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fast 24-Hour Support Response</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {WARRANTY_COVERAGE_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block mb-0.5">
                      {item.title}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional Bottom CTA Trigger */}
            {onOrderClick && (
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-[#E5C378] shrink-0" />
                  <span>
                    Every unit is factory-tested before dispatch &amp; includes your{" "}
                    <strong className="text-white">1-Year Warranty Card</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOrderClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-black uppercase tracking-wide bg-gradient-to-r from-[#C5A059] via-[#E5C378] to-[#C5A059] text-slate-950 hover:brightness-105 transition-all shadow-lg cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Claim Cooktop + 1-Year Warranty</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
