import React from "react";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Building2,
  Navigation,
  Sparkles,
  PhoneCall,
} from "lucide-react";
import { CALL_PHONE_TEL, WHATSAPP_PHONE_DISPLAY } from "../utils/whatsapp";

interface DeliveryHub {
  city: string;
  state: string;
  eta: string;
  badge: string;
  coverage: string;
}

const NIGERIAN_CITIES: DeliveryHub[] = [
  {
    city: "Lagos",
    state: "Island & Mainland",
    eta: "24 Hours (Same/Next Day)",
    badge: "Express Priority",
    coverage: "Ikeja, Lekki, Victoria Island, Surulere, Ajah, Ikorodu",
  },
  {
    city: "Abuja (FCT)",
    state: "Federal Capital Territory",
    eta: "24 - 48 Hours",
    badge: "Express Priority",
    coverage: "Maitama, Garki, Wuse 2, Asokoro, Gwarinpa, Kubwa",
  },
  {
    city: "Port Harcourt",
    state: "Rivers State",
    eta: "24 - 48 Hours",
    badge: "Direct Courier",
    coverage: "GRA Phase 1-3, Peter Odili, Trans-Amadi, Ada George",
  },
  {
    city: "Ibadan",
    state: "Oyo State",
    eta: "24 - 48 Hours",
    badge: "Direct Courier",
    coverage: "Bodija, Oluyole, Ring Road, Akobo, Samonda",
  },
  {
    city: "Benin City",
    state: "Edo State",
    eta: "24 - 48 Hours",
    badge: "Regional Hub",
    coverage: "GRA, Airport Road, Ugbowo, Sapele Road",
  },
  {
    city: "Enugu & Asaba",
    state: "Enugu / Delta State",
    eta: "24 - 48 Hours",
    badge: "Regional Hub",
    coverage: "Independence Layout, GRA, Asaba Metropolis, Okpanam",
  },
  {
    city: "Kano & Kaduna",
    state: "Northern Hubs",
    eta: "48 Hours",
    badge: "Secured Transit",
    coverage: "Nassarawa, Bompai, Barnawa, Kaduna South",
  },
  {
    city: "Other States",
    state: "All 36 States Covered",
    eta: "48 - 72 Hours",
    badge: "Full Nationwide",
    coverage: "Doorstep delivery to every state capital & major towns",
  },
];

interface NationwideDeliverySectionProps {
  onOrderClick?: () => void;
}

export const NationwideDeliverySection: React.FC<NationwideDeliverySectionProps> = ({ onOrderClick }) => {
  return (
    <section
      id="nationwide-delivery"
      aria-label="Nationwide Delivery Information"
      className="py-12 sm:py-16 bg-gradient-to-b from-[#FAFAFA] via-white to-slate-50 border-b border-slate-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Trust-Inspiring Delivery Card Container */}
        <div className="relative rounded-3xl bg-white border-2 border-emerald-500/30 p-6 sm:p-10 shadow-xl shadow-emerald-950/5 overflow-hidden">
          
          {/* Subtle Ambient Background Watermark Accent */}
          <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-8 -translate-x-8 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header with Trust Badges */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            
            {/* Top Eyebrow Badge with Map Pin & Nigerian Flag Tone */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Free Nationwide Delivery</span>
            </div>

            {/* Prominent Headline */}
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight uppercase">
              Nationwide Delivery:{" "}
              <span className="text-emerald-700 block sm:inline">
                24–48 Hours to Major Nigerian Cities
              </span>
            </h2>

            {/* Trust Subtitle */}
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
              We operate dedicated dispatch centers and vetted courier partnerships across Nigeria. Your cooktop is professionally boxed in heavy-duty styrofoam and delivered directly to your doorstep.
            </p>
          </div>

          {/* 3 Core Trust Badges Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 sm:mb-10">
            
            {/* Badge 1: 24-48 Hours Express */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 hover:border-emerald-300 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 tracking-wider block">
                  SPEED GUARANTEE
                </span>
                <strong className="text-xs sm:text-sm font-heading font-bold text-slate-900 block leading-snug">
                  24–48 Hours Fast Delivery
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">
                  Same-day or next-day dispatch from our central logistics warehouses.
                </span>
              </div>
            </div>

            {/* Badge 2: Pay on Delivery */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 hover:border-emerald-300 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-700 tracking-wider block">
                  ZERO RISK
                </span>
                <strong className="text-xs sm:text-sm font-heading font-bold text-slate-900 block leading-snug">
                  Pay On Delivery (POD)
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">
                  No upfront online card payments. Inspect your package thoroughly before paying.
                </span>
              </div>
            </div>

            {/* Badge 3: Shockproof Protective Packaging */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 hover:border-emerald-300 hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-inner">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-blue-700 tracking-wider block">
                  SECURE PACKING
                </span>
                <strong className="text-xs sm:text-sm font-heading font-bold text-slate-900 block leading-snug">
                  Shock-Absorbent Crate
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">
                  Reinforced double-wall carton with molded high-density foam padding.
                </span>
              </div>
            </div>

          </div>

          {/* Major Cities Dispatch Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs mb-8">
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wide">
                  Active Dispatch Hubs &amp; Estimated Delivery Timelines
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                ● Live Dispatching Across Nigeria
              </span>
            </div>

            {/* Hubs Grid */}
            <div className="divide-y divide-slate-100">
              {NIGERIAN_CITIES.map((hub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-emerald-200">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {hub.city}
                        </strong>
                        <span className="text-[10px] font-semibold text-slate-500">
                          ({hub.state})
                        </span>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {hub.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">Coverage: </span>
                        {hub.coverage}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Timeline Pill */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-11 sm:pl-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{hub.eta}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Reassurance Bottom Bar with Direct Dispatcher Contact */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                  Have Special Delivery Requests or Rural Address?
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Our dispatch logistics desk is on standby to coordinate your delivery schedule.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href={CALL_PHONE_TEL}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Dispatch: {WHATSAPP_PHONE_DISPLAY}</span>
              </a>

              {onOrderClick && (
                <button
                  type="button"
                  onClick={onOrderClick}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-heading font-black bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>ORDER WITH FREE DELIVERY</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
