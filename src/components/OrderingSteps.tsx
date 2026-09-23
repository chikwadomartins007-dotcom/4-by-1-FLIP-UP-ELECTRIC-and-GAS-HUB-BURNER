import React, { useState } from "react";
import {
  Sliders,
  Send,
  PhoneCall,
  Truck,
  CheckCircle2,
  ClipboardCheck,
  PackageCheck,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WHATSAPP_PHONE_DISPLAY } from "../utils/whatsapp";

interface TimelineStage {
  id: string;
  name: string;
  shortDesc: string;
  duration: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const OrderingSteps: React.FC = () => {
  // Hidden by default, expands only when tapped by the user
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(3); // Defaults to showing the full delivery flow

  const timelineStages: TimelineStage[] = [
    {
      id: "confirmed",
      name: "Order Confirmed",
      shortDesc: "Phone verification & address review",
      duration: "Within 15–30 Mins",
      details:
        "Our dedicated support team calls to verify your delivery address, unit count, and schedule your preferred drop-off date.",
      icon: CheckCircle2,
    },
    {
      id: "qc",
      name: "Quality Check",
      shortDesc: "Ignition, timer & glass inspection",
      duration: "Same-Day QC",
      details:
        "Every cooktop is bench-tested at our warehouse: ignition spark, electric plate heating, digital timer, and tempered glass integrity.",
      icon: ClipboardCheck,
    },
    {
      id: "dispatch",
      name: "Dispatch",
      shortDesc: "Protective boxing & courier handover",
      duration: "Within 24 Hours",
      details:
        "Safely padded in heavy-duty foam shock-absorbers with tracking notification sent directly to your phone via SMS and WhatsApp.",
      icon: PackageCheck,
    },
    {
      id: "delivery",
      name: "Delivery",
      shortDesc: "Doorstep arrival & inspection before payment",
      duration: "1–2 Days (Lagos/Abuja) • 2–4 Days (States)",
      details:
        "Our courier delivers straight to your doorstep. You inspect the unit and accessories first, then complete Payment on Delivery.",
      icon: Truck,
    },
  ];

  const steps = [
    {
      num: "1",
      title: "CHOOSE YOUR QUANTITY",
      description:
        "Select 1, 2, 3, or more units. Our dynamic pricing engine automatically applies your instant volume discount.",
      icon: Sliders,
    },
    {
      num: "2",
      title: "PLACE YOUR ORDER",
      description:
        "Enter your name, phone number, and delivery address into the secure order form below to place your order with 100% Payment on Delivery.",
      icon: Send,
    },
    {
      num: "3",
      title: "ORDER CONFIRMATION",
      description: `A MAX Luxury Bathrooms representative will promptly call you on ${WHATSAPP_PHONE_DISPLAY} to confirm your order details and delivery timetable.`,
      icon: PhoneCall,
    },
    {
      num: "4",
      title: "NATIONWIDE DELIVERY",
      description:
        "Your 5-burner cooker is carefully bubble-wrapped, boxed, and dispatched safely to your home, site, or project address across Nigeria.",
      icon: Truck,
    },
  ];

  // Calculate progress percentage based on activeStageIndex
  const progressPercent = (activeStageIndex / (timelineStages.length - 1)) * 100;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200" id="ordering-process">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 animate-slide-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8D6D27] mb-2 block">
            Simple &amp; Transparent
          </span>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
            How Ordering Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Zero complicated checkout gateways or confusing accounts. Just clear, honest service from a registered Nigerian business.
          </p>
        </div>

        {/* Prominent Tap Trigger Button: Keeps ordering steps hidden unless explicitly tapped */}
        <div className="max-w-md mx-auto mb-6">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="ordering-steps-content"
            className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-xs ${
              isOpen
                ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-[#C5A059]"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isOpen
                    ? "bg-[#C5A059] text-slate-950 font-black"
                    : "bg-white text-slate-700 border border-slate-200 shadow-2xs"
                }`}
              >
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className={`font-heading font-extrabold text-xs sm:text-sm leading-snug ${
                    isOpen ? "text-white" : "text-slate-900"
                  }`}
                >
                  {isOpen ? "How Ordering Works (Expanded)" : "Tap to View How Ordering Works"}
                </h3>
                <p className={`text-[11px] ${isOpen ? "text-slate-300" : "text-slate-500"}`}>
                  {isOpen
                    ? "Tap to collapse ordering steps & timeline"
                    : "See 4 simple steps • 100% Payment on Delivery"}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
                isOpen
                  ? "bg-slate-800 text-slate-200 border-slate-700"
                  : "bg-white text-slate-800 border-slate-200 shadow-2xs"
              }`}
            >
              <span>{isOpen ? "Hide" : "View Steps"}</span>
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>
        </div>

        {/* Collapsible Content Area */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="ordering-steps-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2">
                {/* 4 Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative mb-10 sm:mb-14">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={idx}
                        className="relative rounded-2xl p-5 sm:p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs hover:bg-white hover:border-[#C5A059]/50 transition-all duration-200"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center font-heading font-extrabold text-sm text-slate-900 shadow-xs">
                              {step.num}
                            </span>
                            <Icon className="w-5 h-5 text-slate-500" />
                          </div>
                          <h3 className="font-heading font-bold text-sm text-slate-900 mb-2 tracking-wide">
                            {step.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Timeline Visualization with Progress Bar */}
                <div
                  className="rounded-2xl bg-slate-900 text-white p-5 sm:p-8 border border-slate-800 shadow-xl overflow-hidden mb-6"
                  id="delivery-timeline"
                >
                  {/* Timeline Title & Subtitle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-[11px] font-extrabold uppercase tracking-wider border border-[#C5A059]/40">
                          <Clock className="w-3 h-3" />
                          Order Fulfillment
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          • 100% Inspected &amp; Tracked
                        </span>
                      </div>
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight">
                        Delivery Timeline
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 self-start sm:self-auto">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Payment only when cooker arrives safely at your door</span>
                    </div>
                  </div>

                  {/* Progress Bar Track & Stage Checkpoints */}
                  <div className="py-8 sm:py-10">
                    {/* Desktop / Tablet Horizontal Timeline */}
                    <div className="relative">
                      {/* Background Connecting Bar */}
                      <div className="absolute top-5 left-8 right-8 h-1.5 bg-slate-800 rounded-full -translate-y-1/2 z-0 hidden sm:block" />

                      {/* Active Filled Progress Bar */}
                      <div
                        className="absolute top-5 left-8 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-full -translate-y-1/2 z-0 hidden sm:block transition-all duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                        style={{ width: `calc(${progressPercent}% * 0.88)` }}
                      />

                      {/* 4 Stage Nodes */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                        {timelineStages.map((stage, idx) => {
                          const Icon = stage.icon;
                          const isCompleted = idx <= activeStageIndex;
                          const isCurrent = idx === activeStageIndex;

                          return (
                            <button
                              key={stage.id}
                              type="button"
                              onClick={() => setActiveStageIndex(idx)}
                              className="group text-left sm:text-center flex sm:flex-col items-start sm:items-center gap-3.5 sm:gap-3 cursor-pointer focus:outline-none"
                            >
                              {/* Node Icon Circle */}
                              <div
                                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300 border-2 ${
                                  isCompleted
                                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.6)]"
                                    : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"
                                } ${isCurrent ? "ring-4 ring-amber-400/30 scale-110" : ""}`}
                              >
                                <Icon className="w-5 h-5" />
                                
                                {/* Milestone Step Number Pill */}
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-950 text-white border border-slate-700 text-[9px] font-black flex items-center justify-center">
                                  {idx + 1}
                                </span>
                              </div>

                              {/* Stage Labels & Descriptions */}
                              <div className="flex-1 sm:w-full">
                                <div className="flex items-center sm:justify-center gap-1.5 mb-0.5">
                                  <h4
                                    className={`font-heading font-extrabold text-xs sm:text-sm tracking-tight transition-colors ${
                                      isCompleted
                                        ? "text-amber-300"
                                        : "text-slate-300 group-hover:text-white"
                                    }`}
                                  >
                                    {stage.name}
                                  </h4>
                                </div>
                                <p className="text-[11px] font-semibold text-emerald-400 mb-1">
                                  {stage.duration}
                                </p>
                                <p className="text-[11px] text-slate-400 leading-snug sm:max-w-[190px] sm:mx-auto">
                                  {stage.shortDesc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Active Stage Detailed Spotlight Box */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-800/70 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
                        {React.createElement(timelineStages[activeStageIndex].icon, {
                          className: "w-5 h-5",
                        })}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Stage {activeStageIndex + 1} of 4:
                          </span>
                          <span className="font-heading font-extrabold text-sm text-white">
                            {timelineStages[activeStageIndex].name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            {timelineStages[activeStageIndex].duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {timelineStages[activeStageIndex].details}
                        </p>
                      </div>
                    </div>

                    {/* Quick interactive jump buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {timelineStages.map((stage, i) => (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => setActiveStageIndex(i)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            activeStageIndex === i
                              ? "bg-amber-400 text-slate-950 shadow-xs"
                              : "bg-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700"
                          }`}
                        >
                          Step {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom collapse button */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Tap to Collapse Ordering Steps</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
