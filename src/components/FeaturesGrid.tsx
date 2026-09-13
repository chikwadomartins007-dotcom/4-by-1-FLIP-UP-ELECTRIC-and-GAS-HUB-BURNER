import React from "react";
import { Timer, Power, Zap, Flame, Sparkles, Maximize2, ShieldCheck, PhoneCall } from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL } from "../utils/whatsapp";

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="specs" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Technical Blueprint Photo */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            OFFICIAL DIMENSION BLUEPRINT & CUTOUT SPECIFICATIONS
          </span>
          <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <img
              src="/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg"
              alt="Dimensions Spec Sheet 900x510mm"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://sc04.alicdn.com/kf/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg";
              }}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-medium">PANEL SIZE</span>
              <strong className="text-slate-900 font-bold">900 × 510 mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-medium">CUTOUT SIZE</span>
              <strong className="text-slate-900 font-bold">870 × 480 mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-medium">CARTON SIZE</span>
              <strong className="text-slate-900 font-bold">970 × 570 × 250 mm</strong>
            </div>
          </div>
        </div>

        {/* Section Heading matching reference typography with slide-in animation */}
        <div className="mb-6 text-center animate-slide-in-up">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#15803d] mb-1">
            PLUG &amp; COOK CONVENIENCE
          </h3>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
            EASY AND STRAIGHTFORWARD TO USE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
            Everything is clearly labelled so anyone can easily use it on their own. You will also have the direct line of our customer care in case you need our help with anything.
          </p>
        </div>

        {/* Customer Care Box */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs max-w-lg mx-auto mb-8 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[11px] text-slate-500 block font-semibold">
              DIRECT CUSTOMER CARE & WHATSAPP
            </span>
            <a
              href={CALL_PHONE_TEL}
              className="font-heading font-bold text-base text-slate-900 hover:text-emerald-700 transition-colors"
            >
              {WHATSAPP_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* 6 Key Verified Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-amber-700" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Digital Countdown Timer</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Program 1 to 99 minutes with automatic shutoff so your food never overcooks.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Power className="w-4 h-4 text-emerald-700" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Automatic Off Safety Key</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master 1-touch emergency kill switch plus child lock for total kitchen safety.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-red-600" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Central Ceramic Hotplate</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-intensity radiant ceramic plate that delivers instant, intense heat without gas.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Flip-Up Hinged Burners</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Burners tilt upward on articulated hinges for effortless 1-wipe cleanups.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
