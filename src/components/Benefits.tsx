import React from "react";
import { Check } from "lucide-react";

export const Benefits: React.FC = () => {
  const points = [
    {
      title: "Keeps your cooking going without interruptions",
      desc: "Dual fuel reliability: 4 instant gas burners + 1 radiant ceramic electric zone. If gas finishes, switch to electric. If power is out, use gas. You are never stuck.",
    },
    {
      title: "Digital Countdown Timer with Automatic Power Cutoff",
      desc: "Set your cooking timer between 1 to 99 minutes on the digital touch display. Once time elapses, the hob beeps and automatically cuts power so food never burns.",
    },
    {
      title: "Automatic Off Safety Key & Child Lock",
      desc: "Instant one-touch master shutdown key kills active heating immediately. Built-in child safety lock prevents accidental knob turning by toddlers.",
    },
    {
      title: "10-Second Cleanup with Flip-Up Hinged Burners",
      desc: "No more dismantling rusty burner caps or scrubbing grease traps. Simply tilt the hinged gas burners upward and wipe the smooth glass surface clean.",
    },
    {
      title: "5 Spacious Cooking Zones for Complete Family Feasts",
      desc: "Cook soup, stew, rice, beans, and boil water simultaneously. 900mm wide layout provides ample clearance for large Nigerian pots without overcrowding.",
    },
    {
      title: "Modern Executive Aesthetic — Matches Any Luxury Kitchen",
      desc: "Flush built-in design with 8mm high-grade black tempered glass, brushed metal knobs, and cast iron pan supports that turn your kitchen into a showpiece.",
    },
  ];

  return (
    <section id="benefits" className="py-12 sm:py-16 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8 animate-slide-in-up">
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>✨</span>
            <span>Why You’ll Love It</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered specifically to solve everyday kitchen frustrations in Nigerian homes.
          </p>
        </div>

        {/* Reference Site Direct-Response Checkmark Bullets */}
        <div className="space-y-4">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FBFBFA] border border-slate-200/90 flex items-start gap-3.5 transition-all hover:border-slate-300 shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Proof Cards using User Provided Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs flex flex-col">
            <div className="aspect-[4/3] bg-slate-900 overflow-hidden flex items-center justify-center p-3">
              <img
                src="/H4183961f34a64d47a5f116fa6bfddf7eE.png"
                alt="Flip-Up Hinged Burner Detail"
                className="w-full h-full object-contain animate-zoom-in-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://sc04.alicdn.com/kf/H4183961f34a64d47a5f116fa6bfddf7eE.png";
                }}
              />
            </div>
            <div className="p-4">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                EASY CLEAN MECHANISM
              </span>
              <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                90° Hinged Burners Lift Clean
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solid articulated hinges allow you to lift each burner completely to wipe underneath without dismantling parts.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs flex flex-col">
            <div className="aspect-[4/3] bg-slate-900 overflow-hidden flex items-center justify-center p-3">
              <img
                src="/images.jpeg"
                alt="Modern Built-In Kitchen Countertop Installation"
                className="w-full h-full object-contain animate-zoom-in-out-delayed"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/H6d042f563b4c47b08ba59b298031b8c1A.jpg";
                }}
              />
            </div>
            <div className="p-4">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                FLUSH COUNTERTOP FIT
              </span>
              <h4 className="font-heading font-bold text-sm text-slate-900 mb-1">
                Modern Executive Built-In Profile
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamlessly integrates into standard 900×510mm marble, quartz, or granite kitchen countertops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
