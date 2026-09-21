import React from "react";
import { Star, ShieldCheck, ThumbsUp, Heart, CheckCircle2 } from "lucide-react";

export const TrustSection: React.FC = () => {
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
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Heading matching reference typography with slide-in animation */}
        <div className="mb-8 animate-slide-in-up">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#15803d] block mb-1">
            GENUINE NIGERIAN BUYER FEEDBACK
          </span>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
            OUR HAPPY CUSTOMERS REVIEWS
          </h2>
          <div className="inline-flex items-center justify-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-full bg-amber-50/70 border border-amber-200/80 text-amber-500 shadow-2xs group cursor-default transition-all duration-300 hover:bg-amber-100/80 hover:border-amber-300 hover:shadow-xs">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-amber-400 text-amber-400 star-interactive group-hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                  title="5.0 / 5.0 Star Customer Rating"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800 ml-1.5 tracking-tight group-hover:text-amber-900 transition-colors">
              5.0 / 5.0 Rating (2,800+ Orders)
            </span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
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
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Purchase • Delivered in Nigeria</span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Reactions Proof Badge (matching reference Facebook reaction visual) */}
        <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-600 mb-10 shadow-xs">
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
