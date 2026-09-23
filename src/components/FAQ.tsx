import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, CheckCircle2 } from "lucide-react";
import { LivelyOrderButton } from "./LivelyOrderButton";
import { Analytics } from "../utils/analytics";

interface FAQProps {
  onOrderClick?: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOrderClick }) => {
  // All FAQ answers remain hidden by default unless opened
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  useEffect(() => {
    const handleOpenFaqEvent = () => {
      // Expand all FAQs
      setOpenIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      setIsHighlighted(true);
      setTimeout(() => {
        setIsHighlighted(false);
      }, 3500);
    };

    window.addEventListener("open-faq-section", handleOpenFaqEvent);
    return () => window.removeEventListener("open-faq-section", handleOpenFaqEvent);
  }, []);

  const toggleFAQ = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAllFAQs = () => {
    if (openIndices.length === faqs.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(faqs.map((_, i) => i));
    }
  };

  const faqs = [
    {
      q: "Q1: Can I inspect the cooktop before making payment?",
      a: "Yes, 100%! We operate a zero-risk Payment on Delivery policy. When our courier brings the cooker to your doorstep, you are permitted and encouraged to open the heavy-duty packaging, inspect the tempered glass, burners, digital timer, and all accessories before handing over cash or transferring funds.",
    },
    {
      q: "Q2: How does delivery work from order placement to doorstep?",
      a: "Here is exactly how our transparent nationwide delivery works:\n\n1. Fast Confirmation: As soon as you submit the order form, our dispatch manager calls or WhatsApps you within 30 minutes to verify your exact delivery address and phone number.\n\n2. Secure Packaging: Your unit is dispatched from our nearest hub in a shock-absorbent reinforced shipping carton with dense corner guards.\n\n3. Transit Timelines:\n• Lagos, Abuja & Port Harcourt: 24 to 48 Hours\n• Other State Capitals & Towns: 2 to 4 Working Days\n\n4. Doorstep Inspection: Our delivery rider contacts you before arriving. Upon arrival, you unbox and physically inspect the cooktop to verify the tempered glass, burners, digital timer, and accessories.\n\n5. Payment on Delivery: You only make payment (via Cash or Instant Bank Transfer) after you are 100% satisfied. Delivery is 100% FREE with zero hidden fees.",
    },
    {
      q: "Q3: Will I pay for delivery?",
      a: "No! Delivery is 100% FREE nationwide across all 36 states and the FCT. You will not pay any shipping, transit, or logistics fees whatsoever. You only pay the exact promo price for your cooker when it arrives at your doorstep.",
    },
    {
      q: "Q4: Does it have a timer feature and automatic off key?",
      a: "Yes! The cooker features a built-in digital countdown timer (1 to 99 minutes) with automatic power cutoff on the touch display, as well as a dedicated master Automatic Off key and safety child lock for instant 1-touch emergency shutdown.",
    },
    {
      q: "Q5: What are the exact dimensions and countertop cutout size?",
      a: "According to official manufacturer specs (Model Combined Gas-Ceramic Hob):\n• Panel Dimensions: 900 × 510 mm\n• Cutout Dimensions: 870 × 480 mm\n• Package Dimensions: 970 × 570 × 250 mm\nThis fits standard 90cm kitchen cabinets across Nigeria.",
    },
    {
      q: "Q6: What happens if there’s no electricity (NEPA blackout)?",
      a: "The cooktop has 4 high-speed gas burners that operate 100% off-grid with instant battery-less impulse ignition, so cooking never stops even during power blackouts. The 5th ceramic electric plate can be used whenever grid or solar power is available.",
    },
    {
      q: "Q7: How do the flip-up hinged burners work?",
      a: "The gas burners tilt upward on articulated heavy-duty hinges. You can lift each burner 90 degrees to wipe under it in seconds, eliminating baked-on food or grease traps.",
    },
    {
      q: "Q8: What warranty and technical support is included?",
      a: "Every unit comes with a 12-Month Replacement Warranty and dedicated technical customer support across Nigeria. If any factory defect arises, we handle replacement or repairs promptly.",
    },
    {
      q: "Q9: What is the price breakdown?",
      a: "Pricing is transparent with tiered quantity discounts:\n• 1 Unit: ₦280,000\n• 2 Units: ₦550,000 (₦275,000 each — Save ₦10,000)\n• 3 Units: ₦810,000 (₦270,000 each — Save ₦30,000)\n• 4+ Units: ₦1,060,000 (₦265,000 each — Save ₦60,000)",
    },
  ];

  const handleOrderClick = () => {
    Analytics.trackCTAClick("Order Now (FAQ Section)", "#order-form-section");
    if (onOrderClick) {
      onOrderClick();
    } else {
      document.getElementById("order-form-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="faq"
      className={`py-12 sm:py-16 bg-white border-b border-slate-100 overflow-hidden transition-all duration-500 rounded-3xl ${
        isHighlighted
          ? "ring-4 ring-[#C5A059] shadow-2xl bg-amber-50/20"
          : ""
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading with Slide-in Animation */}
        <div className="text-center mb-8 animate-slide-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Buyer Assurance & Answers</span>
          </div>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <p className="text-xs sm:text-sm text-slate-500">
              Click on any question below to reveal the answer.
            </p>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={toggleAllFAQs}
              className="text-xs font-bold text-[#8D6D27] hover:text-[#5E4717] underline cursor-pointer"
            >
              {openIndices.length === faqs.length ? "Collapse All" : "Expand All"}
            </button>
          </div>
        </div>

        {/* Accordion List - Answers hidden until clicked */}
        <div className="space-y-3 mb-10">
          {faqs.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50/90 border-slate-300 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {item.q}
                  </h3>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      isOpen
                        ? "bg-emerald-100 text-emerald-700 rotate-180"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100/80 animate-slide-in-up [animation-duration:200ms]"
                  >
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Second Direct Response CTA Button matching reference site with lively animation */}
        <LivelyOrderButton
          onClick={handleOrderClick}
          subtext="Nationwide Delivery Across Nigeria • Pay on Confirmation / Delivery"
          className="animate-slide-in-up [animation-delay:300ms]"
        />

      </div>
    </section>
  );
};
