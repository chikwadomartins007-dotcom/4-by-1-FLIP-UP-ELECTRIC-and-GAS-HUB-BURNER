import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppOrderUrl, WHATSAPP_PHONE_DISPLAY } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

interface FloatingWhatsAppProps {
  quantity: number;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ quantity }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    Analytics.trackContact("whatsapp", "floating_whatsapp_button", quantity);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Tooltip on hover/click */}
      {isOpen && (
        <div className="mb-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs text-slate-700 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
            <span className="font-bold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              MAX Luxury Bathrooms
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Need fast answers about the 5-Burner Cooktop, delivery, or custom quantity? Chat directly with us on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getWhatsAppOrderUrl(quantity)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsOpen(true)}
        aria-label="Chat with MAX Luxury Bathrooms on WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_6px_25px_rgba(37,211,102,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group cursor-pointer"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        <span className="sr-only">Chat on WhatsApp: {WHATSAPP_PHONE_DISPLAY}</span>
      </a>
    </div>
  );
};
