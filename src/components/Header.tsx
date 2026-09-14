import React from "react";
import { Phone, ArrowRight } from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

interface HeaderProps {
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const handlePhoneClick = () => {
    Analytics.trackContact("phone", "header_call_button");
  };

  const handleOrderClick = () => {
    Analytics.trackCTAClick("Order Now (Header)", "#order-form-section");
    onOrderClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Name - Kitchen Luxury Appliance Division */}
        <a href="#hero" className="flex flex-col group">
          <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-[#B8860B] transition-colors">
            MAX LUXURY BATHROOMS
          </span>
          <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
            Kitchen & Home Appliance Collection
          </span>
        </a>

        {/* Contact & CTA Buttons */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Phone Quick Contact */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <a
              href={CALL_PHONE_TEL}
              onClick={handlePhoneClick}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{WHATSAPP_PHONE_DISPLAY}</span>
            </a>
          </div>

          {/* Primary Header CTA */}
          <button
            id="header-order-btn"
            onClick={handleOrderClick}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#0F172A] hover:bg-slate-800 text-white shadow-md transition-all cursor-pointer"
          >
            <span>ORDER NOW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
