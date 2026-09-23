import React, { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, Heart, CheckCircle2, ChevronDown, ChevronUp, MessageSquareQuote, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const TrustSection: React.FC = () => {
  const [isReviewsOpen, setIsReviewsOpen] = useState<boolean>(false);

  const reviews = [
    {
      name: "CHUKWU GABRIEL",
      location: "IKEJA, LAGOS STATE",
      review:
        "This is the best investment I’ve made for my kitchen — beautiful, functional, and very fast. The dual fuel feature is a lifesaver whenever gas finishes on a Sunday.",
      initials: "CG",
    },
    {
      name: "ENGR. CHRIS",
      location: "ZARIA, KADUNA",
      review:
        "My wife loves the hinged flip-up burners! Cleaning underneath takes less than 10 seconds. The automatic off key gives me peace of mind with the kids around.",
      initials: "EC",
    },
    {
      name: "DR. TUNDE ABIOLA",
      location: "ABUJA, FCT",
      review:
        "The delivery was swift to Abuja, and I paid after inspecting it. The digital timer on the ceramic hotplate is pure perfection for boiling without burning.",
      initials: "TA",
    },
    {
      name: "MRS. NGOZI ADELEKE",
      location: "PORT HARCOURT, RIVERS STATE",
      review:
        "Top quality 90cm tempered glass cooktop. Looks like an imported ₦600k hob. Genuine supplier and direct WhatsApp support was very helpful.",
      initials: "NA",
    },
  ];

  return (
    <section id="customer-reviews" className="py-12 sm:py-16 bg-white border-b border-slate-100 relative overflow-hidden">
      
      {/* Floating 'Verified Buyer' Corner Badge (Desktop / Tablet View) */}
      <div className="hidden lg:block absolute top-6 right-8 z-10 animate-float-subtle pointer-events-none select-none">
        <div className="p-3 px-3.5 rounded-2xl bg-white/95 backdrop-blur-xs border-2 border-emerald-500/70 shadow-lg text-left max-w-[215px] animate-trust-pulse">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-black text-xs text-slate-900 block leading-tight">
                Verified Buyer
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                2,821+ Inspected
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            All reviews verified after doorstep delivery across Nigeria.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Heading */}
        <div className="mb-6 animate-slide-in-up">
          
          {/* Floating 'Verified Buyer' Badge Element that pulses slightly */}
          <div className="inline-flex mb-3.5 animate-float-subtle">
            <div
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border-2 border-emerald-500/80 text-slate-800 shadow-md animate-trust-pulse cursor-default select-none"
              title="Verified Buyer Guarantee: 100% Genuine Nigerian Customer Reviews"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>

              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <BadgeCheck className="w-3.5 h-3.5" />
              </div>

              <span className="font-heading font-black text-xs uppercase tracking-wide text-slate-900">
                Verified Buyer
              </span>

              <span className="text-slate-300 font-bold">•</span>

              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>100% Doorstep Inspected</span>
              </span>
            </div>
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#15803d] block mb-1">
            GENUINE NIGERIAN BUYER FEEDBACK
          </span>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
            OUR HAPPY CUSTOMERS REVIEWS
          </h2>

          {/* Interactive Rating Badge that also toggles reviews on tap */}
          <button
            type="button"
            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
            className="inline-flex items-center justify-center gap-1.5 mt-2.5 px-3.5 py-1.5 rounded-full bg-amber-50/90 hover:bg-amber-100 border border-amber-200 text-amber-600 shadow-2xs cursor-pointer transition-all duration-200 active:scale-95"
            title={isReviewsOpen ? "Tap to hide reviews" : "Tap to view verified customer reviews"}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800 ml-1 tracking-tight">
              5.0 / 5.0 Rating (2,800+ Orders)
            </span>
            <span className="text-[10px] font-semibold text-amber-800 underline ml-1 hidden sm:inline">
              {isReviewsOpen ? "• Tap to Hide" : "• Tap to View"}
            </span>
          </button>
        </div>

        {/* Prominent Tap Trigger Button: Keeps reviews hidden unless explicitly tapped */}
        <div className="mb-8 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setIsReviewsOpen((prev) => !prev)}
            aria-expanded={isReviewsOpen}
            aria-controls="customer-reviews-panel"
            className={`w-full p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-xs ${
              isReviewsOpen
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-amber-400/80"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isReviewsOpen
                    ? "bg-amber-400/20 text-amber-300"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}
              >
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-heading font-bold text-xs sm:text-sm leading-snug ${isReviewsOpen ? "text-white" : "text-slate-900"}`}>
                  {isReviewsOpen ? "Customer Reviews (Active)" : "Tap to View Customer Reviews"}
                </h3>
                <p className={`text-[11px] ${isReviewsOpen ? "text-slate-300" : "text-slate-500"}`}>
                  {isReviewsOpen
                    ? "Tap again to hide reviews"
                    : "Click or tap to read 4 verified Nigerian buyer experiences"}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                isReviewsOpen
                  ? "bg-slate-800 text-slate-200 border-slate-700"
                  : "bg-white text-slate-800 border-slate-200 shadow-2xs"
              }`}
            >
              <span>{isReviewsOpen ? "Hide" : "Show"}</span>
              {isReviewsOpen ? (
                <ChevronUp className="w-4 h-4 text-amber-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>
        </div>

        {/* Collapsible Customer Reviews Content (Hidden unless isReviewsOpen === true) */}
        <AnimatePresence>
          {isReviewsOpen && (
            <motion.div
              id="customer-reviews-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mb-8"
            >
              {/* Testimonial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6 pt-1">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="group p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-300/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-heading font-bold text-xs flex items-center justify-center">
                            {rev.initials}
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-xs text-slate-900 leading-tight">
                              {rev.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 block">
                              {rev.location}
                            </span>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-0.5 text-amber-400 p-1 -m-1 rounded-md transition-all group-hover:drop-shadow-[0_0_4px_rgba(251,191,36,0.7)]"
                          title="Verified 5-Star Customer"
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-amber-400 star-interactive"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.review}"
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Delivered &amp; Inspected in Nigeria</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-300 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <BadgeCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Reactions Proof Badge (matching reference Facebook reaction visual) */}
              <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-600 mb-6 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                      <ThumbsUp className="w-3 h-3 fill-white" />
                    </span>
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                      <Heart className="w-3 h-3 fill-white" />
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800">142 Likes • 38 Comments</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Like • Reply • 10h</span>
              </div>

              {/* Quick Close Button at bottom of expanded list */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsReviewsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Collapse Reviews</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 100% Satisfaction-Guarantee Callout Box with Gold Badge */}
        <div className="p-6 rounded-2xl bg-[#FEF9E7] border-2 border-[#D4AF37] text-center max-w-xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#7D6608] uppercase mb-1">
            JOIN OUR 2,821 HAPPY NIGERIAN CUSTOMERS TODAY!
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
            <strong>100% Satisfaction Guarantee.</strong> If for any reason your item does not match our verified specifications or arrives with any defect, we will exchange it or arrange an immediate refund. We stand firmly behind every unit we supply.
          </p>
        </div>

      </div>
    </section>
  );
};
