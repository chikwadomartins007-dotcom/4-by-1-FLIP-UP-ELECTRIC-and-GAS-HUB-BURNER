import React, { useState, useEffect, useMemo } from "react";
import {
  HelpCircle,
  X,
  ChevronDown,
  Search,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL, getWhatsAppOrderUrl } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

interface FAQItem {
  id: string;
  category: "all" | "delivery" | "specs" | "safety";
  question: string;
  answer: string;
  badge?: string;
}

interface FloatingSupportButtonProps {
  hasSubmittedOrder?: boolean;
}

export const FloatingSupportButton: React.FC<FloatingSupportButtonProps> = ({
  hasSubmittedOrder = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "delivery" | "specs" | "safety">("all");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      category: "delivery",
      question: "Can I inspect the cooktop before paying?",
      answer:
        "Yes, 100%! We operate a zero-risk Payment on Delivery policy. When our courier brings the cooker to your doorstep, you are encouraged to open the heavy-duty packaging, inspect the glass surface, burners, and accessories before you pay.",
      badge: "Zero Risk",
    },
    {
      id: "faq-2",
      category: "delivery",
      question: "Will I pay for delivery to my state?",
      answer:
        "Delivery is 100% Free Nationwide. Whether you are in Lagos, Abuja, Port Harcourt, Kano, Ibadan, or any of the 36 states, we cover all shipping charges. You only pay the exact promo price of your cooker upon arrival.",
      badge: "Free Shipping",
    },
    {
      id: "faq-3",
      category: "specs",
      question: "What are the exact dimensions & countertop cutout size?",
      answer:
        "Official specifications fit standard 90cm Nigerian kitchen cabinets:\n• Panel Surface: 900 × 510 mm\n• Countertop Cutout: 870 × 480 mm\n• Depth: 250 mm package depth\nAny standard granite, quartz, marble, or tile counter fabricator can easily drop it in.",
      badge: "Dimensions",
    },
    {
      id: "faq-4",
      category: "safety",
      question: "Does it have a timer feature and automatic off key?",
      answer:
        "Yes! The cooktop features a digital countdown touch timer (1 to 99 minutes) that automatically turns off the power when done, plus a master Automatic Off key and child lock for immediate emergency shutoff.",
      badge: "Safety",
    },
    {
      id: "faq-5",
      category: "safety",
      question: "What happens if there is no electricity (NEPA blackout)?",
      answer:
        "You will never get stranded. The cooktop has 4 rapid gas burners that run 100% off-grid with automatic impulse spark ignition. The 5th zone is a high-power radiant electric ceramic plate you can switch to whenever you have grid or solar power.",
      badge: "Dual Fuel",
    },
    {
      id: "faq-6",
      category: "specs",
      question: "How do the flip-up hinged burners work?",
      answer:
        "Each gas burner is mounted on an articulated heavy-duty hinge. Instead of struggling with tight crevices, you simply flip each burner up 90 degrees to wipe grease spills off the smooth tempered glass in 2 seconds.",
      badge: "Easy Clean",
    },
    {
      id: "faq-7",
      category: "delivery",
      question: "What warranty and replacement guarantee do I get?",
      answer:
        "Every order includes a full 12-Month Genuine Warranty with replacement coverage. If there are any manufacturing defects or technical issues, our Nigerian customer care team replaces or repairs it promptly.",
      badge: "12-Month Warranty",
    },
  ];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [faqs, activeCategory, searchQuery]);

  const handleOpenFaqDrawer = () => {
    setIsOpen(true);
    Analytics.trackCTAClick("Floating Support Button", "#faq-drawer");
  };

  const handleScrollToInPageFaq = () => {
    setIsOpen(false);
    Analytics.trackCTAClick("Scroll to Full FAQ (From Support Drawer)", "#faq");
    
    // Dispatch event to open all accordion items in FAQ component
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-faq-section"));
    }

    setTimeout(() => {
      const faqEl = document.getElementById("faq");
      if (faqEl) {
        faqEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleWhatsAppChat = () => {
    Analytics.trackContact("whatsapp", "Floating Support Drawer");
    window.open(getWhatsAppOrderUrl(1), "_blank");
  };

  const handlePhoneCall = () => {
    Analytics.trackContact("phone", "Floating Support Drawer");
    window.location.href = CALL_PHONE_TEL;
  };

  return (
    <>
      {/* Persistent Floating Support Button */}
      <div
        className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 animate-slide-in-up"
        id="floating-support-container"
      >
        <button
          type="button"
          onClick={handleOpenFaqDrawer}
          aria-label="Open Customer Support & FAQ"
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-slate-950 text-white border border-[#C5A059]/70 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-slate-900 hover:border-[#C5A059] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {/* Pulsing indicator light */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>

          <HelpCircle className="w-5 h-5 text-[#E5C378] group-hover:rotate-12 transition-transform duration-300 shrink-0" />

          <div className="flex flex-col text-left">
            <span className="font-heading font-extrabold text-xs sm:text-sm tracking-wide text-white leading-tight flex items-center gap-1.5">
              <span>Support</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#C5A059]/20 text-[#E5C378] font-bold border border-[#C5A059]/30">
                FAQ
              </span>
            </span>
            <span className="text-[10px] text-slate-300 font-medium hidden sm:inline-block leading-none mt-0.5">
              Instant Answers
            </span>
          </div>
        </button>
      </div>

      {/* Interactive Support & FAQ Drawer / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-xs transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-drawer-title"
        >
          {/* Backdrop Click */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="relative w-full max-w-xl max-h-[88vh] sm:max-h-[85vh] bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden border border-slate-200 animate-slide-in-up"
            id="support-drawer-panel"
          >
            {/* Header */}
            <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C378]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    id="support-drawer-title"
                    className="font-heading font-black text-sm sm:text-base text-white tracking-tight flex items-center gap-2"
                  >
                    <span>Customer Support & FAQs</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Live Answers
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Quick answers to resolve any hesitation before ordering
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Support Drawer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Trust Bar */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Free Nationwide Delivery</span>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>12-Month Warranty</span>
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <span>Pay on Delivery</span>
              </span>
            </div>

            {/* Search Bar */}
            <div className="p-4 pb-2 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g., dimensions, timer, delivery, payment)..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { id: "all", label: "All Questions" },
                  { id: "delivery", label: "Payment & Delivery" },
                  { id: "specs", label: "Specs & Dimensions" },
                  { id: "safety", label: "Safety & Blackouts" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory === cat.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Questions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 px-4 text-slate-500 text-xs">
                  <p className="font-semibold text-slate-700 mb-1">No matching answers found</p>
                  <p>Try searching for "delivery", "dimensions", "timer", or ask us directly below.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? "bg-white border-[#C5A059]/60 shadow-xs"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                        className="w-full text-left p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-heading font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                            {faq.question}
                          </span>
                          {faq.badge && (
                            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 shrink-0">
                              {faq.badge}
                            </span>
                          )}
                        </div>
                        <span
                          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 ${
                            isExpanded ? "bg-amber-100 text-amber-800 rotate-180" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line bg-slate-50/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2.5">
              {/* Primary: Jump to In-Page FAQ Section */}
              <button
                type="button"
                onClick={handleScrollToInPageFaq}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>View All Questions in FAQ Section</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              {/* Direct Voice & Chat Hotline */}
              <div className={`grid ${hasSubmittedOrder ? "grid-cols-2" : "grid-cols-1"} gap-2 text-xs`}>
                {hasSubmittedOrder && (
                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Support</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePhoneCall}
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-700" />
                  <span>Call {WHATSAPP_PHONE_DISPLAY}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
