import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { formatNaira } from "../utils/pricing";
import { Analytics } from "../utils/analytics";

interface MobileStickyBarProps {
  quantity: number;
  total: number;
  onOrderClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  quantity,
  total,
  onOrderClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormInView, setIsFormInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button once user scrolls past top header
      const shouldShow = window.scrollY > 80;
      setIsVisible(shouldShow);

      const formEl = document.getElementById("order-form-section");
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        // Only hide if the form inputs are currently directly in the screen
        const isInView = rect.top < 120 && rect.bottom > 250;
        setIsFormInView(isInView);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || isFormInView) {
    return null;
  }

  const handleOrderClick = () => {
    Analytics.trackCTAClick("Order Now (Floating Order Button)", "#order-form-section");
    onOrderClick();
  };

  return (
    <div
      className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 max-w-sm sm:max-w-none mx-auto sm:mx-0 transition-all duration-300 animate-slide-in-up"
      aria-label="Floating quick order button"
    >
      <button
        type="button"
        onClick={handleOrderClick}
        aria-label="Floating Order Now button"
        className="w-full sm:w-auto h-13 sm:h-14 px-4 sm:px-6 rounded-2xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-between sm:justify-center gap-3 border-2 border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer animate-shift-black-red shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        
        <div className="text-left flex-1 sm:flex-initial">
          <div className="leading-tight tracking-wider uppercase font-black text-xs sm:text-sm flex items-center gap-1.5">
            <span>ORDER NOW</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-bold sm:hidden">
              PROMO
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-white/90 font-medium">
            {formatNaira(total)} • Free Delivery
          </div>
        </div>

        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 animate-bounce" />
      </button>
    </div>
  );
};
