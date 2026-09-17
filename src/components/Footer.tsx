import React from "react";
import { Phone, ShieldCheck } from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200">
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <span className="font-heading font-extrabold text-base text-slate-900 tracking-tight block">
              MAX LUXURY BATHROOMS
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Kitchen Fixtures & Home Appliance Division
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={CALL_PHONE_TEL}
              onClick={() => Analytics.trackContact("phone", "footer_call_link")}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-[#8D6D27]" />
              <span>Customer Care Hotline: {WHATSAPP_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left border-b border-slate-200 pb-6 mb-6">
          <p>
            © {new Date().getFullYear()} MAX Luxury Bathrooms. All rights reserved. 5-Burner Built-In Gas + Electric Cooktop with Digital Timer & Automatic Off.
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <a href="#hero" className="hover:text-slate-900 transition-colors">Back to Top</a>
            <span>•</span>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <span>•</span>
            <a href="#specs" className="hover:text-slate-900 transition-colors">Specifications</a>
            <span>•</span>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
          </div>
        </div>

        {/* Facebook / Meta Advertising Disclaimer matching reference site */}
        <div className="text-[10px] text-slate-400 text-center max-w-2xl mx-auto leading-relaxed">
          <p className="mb-1">
            This Site Is Not A Part Of The Facebook Website Or Meta Platforms, Inc. Additionally, This Site Is Not Endorsed By Facebook In Any Way. FACEBOOK Is A Trademark Of META PLATFORMS, INC.
          </p>
          <p>
            © {new Date().getFullYear()} MAX Luxury Bathrooms | Privacy Policy | Terms of Delivery
          </p>
        </div>

      </div>
    </footer>
  );
};
