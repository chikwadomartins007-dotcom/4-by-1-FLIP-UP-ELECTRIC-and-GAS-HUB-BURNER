import React from "react";
import { Sliders, Send, PhoneCall, Truck } from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY } from "../utils/whatsapp";

export const OrderingSteps: React.FC = () => {
  const steps = [
    {
      num: "1",
      title: "CHOOSE YOUR QUANTITY",
      description: "Select 1, 2, 3, or more units. Our dynamic pricing engine automatically applies your instant volume discount.",
      icon: Sliders,
    },
    {
      num: "2",
      title: "PLACE YOUR ORDER",
      description: "Enter your name, phone number, and delivery address into the secure order form below to place your order with 100% Payment on Delivery.",
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
      description: "Your 5-burner cooker is carefully bubble-wrapped, boxed, and dispatched safely to your home, site, or project address across Nigeria.",
      icon: Truck,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 animate-slide-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8D6D27] mb-2 block">
            Simple & Transparent
          </span>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-3">
            How Ordering Works
          </h2>
          <p className="text-slate-600 text-sm">
            Zero complicated checkout gateways or confusing accounts. Just clear, honest service from a registered Nigerian business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
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

      </div>
    </section>
  );
};
