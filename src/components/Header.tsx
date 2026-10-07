import React from "react";
import { Flame, Zap, ShieldCheck, Phone, MessageCircle } from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL, getWhatsAppOrderUrl } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

interface HeaderProps {
  onOrderClick: () => void;
  onQuickOrderClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick, onQuickOrderClick }) => {
  const handlePhoneClick = () => {
    Analytics.trackContact("phone", "header_call_button");
  };

  const handleWhatsAppClick = () => {
    Analytics.trackContact("whatsapp", "header_whatsapp_button");
  };

  const handleQuickOrder = () => {
    Analytics.trackCTAClick("Quick Order (Header)", "#quick-order-modal");
    if (onQuickOrderClick) {
      onQuickOrderClick();
    } else {
      onOrderClick();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Icon & Title (Black, Red & Yellow accents) */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white font-extrabold shadow-sm group-hover:bg-[#E8132E] transition-colors">
            <Flame className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <span className="font-extrabold text-neutral-950 text-base sm:text-lg tracking-tight font-display block leading-tight">
              MAX LUXURY BATHROOMS
            </span>
            <span className="text-[10px] text-[#E8132E] font-extrabold tracking-wider uppercase block">
              5-Burner Hybrid Workstation
            </span>
          </div>
        </a>

        {/* Right: Action Buttons & Pay on Delivery Pill */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Call Button on larger screens */}
          <a
            href={CALL_PHONE_TEL}
            onClick={handlePhoneClick}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs text-white font-extrabold bg-neutral-950 hover:bg-neutral-800 px-3 py-2 rounded-xl transition-all shadow-sm"
            title="Call Customer Care"
          >
            <Phone className="w-3.5 h-3.5 text-yellow-400" />
            <span>Call: {WHATSAPP_PHONE_DISPLAY}</span>
          </a>

          {/* WhatsApp Button on medium+ screens */}
          <a
            href={getWhatsAppOrderUrl(1)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-3 py-2 rounded-xl transition-all shadow-sm"
            title="Order or Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-yellow-400" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Quick Order Button (Vibrant Red + Yellow Bolt) */}
          <button
            type="button"
            id="header-order-btn"
            onClick={handleQuickOrder}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E8132E] to-red-600 hover:from-red-600 hover:to-red-500 text-white font-black text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl shadow-md shadow-red-600/30 transition-all cursor-pointer animate-action-blink"
            title="Open Quick Order Pop Up"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>⚡ Quick Order</span>
          </button>

          {/* Pay on Delivery Trust Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-yellow-50 border border-yellow-400/60 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-[#E8132E]" />
            <span>Pay on Delivery</span>
          </div>
        </div>
      </div>
    </header>
  );
};
