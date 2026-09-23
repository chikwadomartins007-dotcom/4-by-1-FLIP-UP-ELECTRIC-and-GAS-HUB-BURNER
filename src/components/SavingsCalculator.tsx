import React from "react";
import { Calculator, Sparkles, TrendingDown, Check, ArrowDown, Plus, Minus, ShieldCheck, Tag } from "lucide-react";
import { calculatePricing, formatNaira, BASE_SINGLE_PRICE } from "../utils/pricing";
import { Analytics } from "../utils/analytics";
import { StockUrgencyWidget } from "./StockUrgencyWidget";

interface SavingsCalculatorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  quantity,
  onQuantityChange,
}) => {
  const pricing = calculatePricing(quantity);

  const tiers = [
    {
      qty: 1,
      label: "1 Unit",
      title: "Single Unit",
      unitPrice: 280000,
      total: 280000,
      normalTotal: 280000,
      savings: 0,
      unitSavings: 0,
      badge: "Standard Price",
      tagline: "Single kitchen remodel",
    },
    {
      qty: 2,
      label: "2 Units",
      title: "Buy 2 Units",
      unitPrice: 275000,
      total: 550000,
      normalTotal: 560000,
      savings: 10000,
      unitSavings: 5000,
      badge: "SAVE ₦10,000",
      tagline: "Duplex or Main + Dirty Kitchen",
    },
    {
      qty: 3,
      label: "3 Units",
      title: "Buy 3 Units",
      unitPrice: 270000,
      total: 810000,
      normalTotal: 840000,
      savings: 30000,
      unitSavings: 10000,
      badge: "SAVE ₦30,000",
      tagline: "Rental flats / Gifting parents",
    },
    {
      qty: 4,
      label: "4+ Units",
      title: "Buy 4+ Units",
      unitPrice: 265000,
      total: 1060000,
      normalTotal: 1120000,
      savings: 60000,
      unitSavings: 15000,
      badge: "SAVE ₦60,000+",
      tagline: "Estate developer / Bulk deal",
    },
  ];

  const handleSelectTier = (qty: number) => {
    onQuantityChange(qty);
    const newPricing = calculatePricing(qty);
    Analytics.trackAddToCart(qty, newPricing.total);
  };

  const handleAdjustQty = (delta: number) => {
    const nextQty = Math.max(1, Math.min(20, quantity + delta));
    onQuantityChange(nextQty);
    const newPricing = calculatePricing(nextQty);
    Analytics.trackAddToCart(nextQty, newPricing.total);
  };

  const scrollToOrderForm = () => {
    const formElem = document.getElementById("order-form-section");
    if (formElem) {
      formElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="savings-calculator"
      className="py-10 sm:py-14 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Widget Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider mb-2.5 border border-emerald-300">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>Multi-Unit Wholesale Savings Calculator</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase">
            HOW MUCH DO YOU SAVE BUYING MULTIPLE UNITS?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-3">
            See your exact cash discount when purchasing 2, 3, or 4+ units compared to standard single-unit pricing (₦280,000/pc).
          </p>
          <StockUrgencyWidget variant="pill" className="shadow-xs" />
        </div>

        {/* 4 Interactive Tier Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {tiers.map((tier) => {
            const isSelected =
              tier.qty === 4 ? quantity >= 4 : quantity === tier.qty;

            return (
              <div
                key={tier.qty}
                onClick={() => handleSelectTier(tier.qty)}
                className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? "bg-slate-950 text-white border-[#C5A059] shadow-lg ring-2 ring-[#C5A059]/40 transform -translate-y-1"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300"
                }`}
              >
                {/* Savings Pill for 2, 3, 4+ */}
                {tier.savings > 0 && (
                  <span className="absolute -top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow border border-emerald-400/40 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {tier.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? "text-amber-400" : "text-slate-700"}`}>
                      {tier.title}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Unit Rate */}
                  <div className="mb-1">
                    <span className={`text-2xl font-black font-heading ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {formatNaira(tier.unitPrice)}
                    </span>
                    <span className={`text-[11px] ml-1 font-semibold ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                      / unit
                    </span>
                  </div>

                  {/* Package Total */}
                  <p className={`text-xs font-bold mb-3 ${isSelected ? "text-slate-300" : "text-slate-600"}`}>
                    Total: {formatNaira(tier.total)}
                  </p>

                  {/* Single Unit Baseline Comparison */}
                  <div className={`text-[11px] p-2 rounded-lg border mb-3 ${
                    isSelected ? "bg-slate-900/80 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"
                  }`}>
                    {tier.savings > 0 ? (
                      <>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span>Standard 1-unit rate:</span>
                          <s className="text-red-400 font-semibold">{formatNaira(tier.normalTotal)}</s>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-400">
                          <span>Your Cash Savings:</span>
                          <span>+{formatNaira(tier.savings)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-[10px] font-medium text-slate-500">
                        Baseline Single Cooktop Price
                      </div>
                    )}
                  </div>
                </div>

                <div className={`text-[10px] pt-2 border-t font-semibold ${
                  isSelected ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
                }`}>
                  {tier.tagline}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Calculation Display Box */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white border-2 border-slate-900 shadow-xl max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            
            {/* Quantity Controls */}
            <div className="w-full md:w-auto text-center md:text-left">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                Selected Units to Purchase:
              </label>
              <div className="inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => handleAdjustQty(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs transition-all active:scale-95"
                  title="Decrease Quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="px-4 text-center">
                  <span className="font-heading font-black text-2xl text-slate-900 block leading-tight">
                    {quantity}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {quantity === 1 ? "Cooktop" : "Cooktops"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdjustQty(1)}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-all active:scale-95"
                  title="Increase Quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price vs Savings Summary Cards */}
            <div className="w-full md:w-auto flex-1 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Discounted Unit Price
                </span>
                <span className="font-heading font-black text-xl text-slate-900">
                  {formatNaira(pricing.unitPrice)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  per cooktop
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border text-center transition-all ${
                pricing.savings > 0
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <span className="text-[11px] font-bold uppercase tracking-wider block mb-1">
                  {pricing.savings > 0 ? "You Save In Cash" : "Single Unit Savings"}
                </span>
                <span className={`font-heading font-black text-xl ${
                  pricing.savings > 0 ? "text-emerald-700" : "text-slate-400"
                }`}>
                  {pricing.savings > 0 ? `+${formatNaira(pricing.savings)}` : "₦0"}
                </span>
                <span className="text-[10px] font-bold block mt-0.5">
                  {pricing.savings > 0 ? "Instant Cash Kept" : "Buy 2+ to Save"}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Savings Bar Comparison */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium">
                Standard cost if bought individually ({quantity} × {formatNaira(BASE_SINGLE_PRICE)}):
              </span>
              <span className="font-mono font-bold text-slate-500 line-through text-sm">
                {formatNaira(pricing.normalTotal)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-900 font-bold flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Your Multi-Unit Package Total:</span>
              </span>
              <span className="font-heading font-black text-2xl text-slate-900">
                {formatNaira(pricing.total)}
              </span>
            </div>

            {/* Savings Highlight Alert */}
            {pricing.savings > 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm uppercase tracking-wide">
                      TOTAL SAVINGS: {formatNaira(pricing.savings)} OFF!
                    </h4>
                    <p className="text-xs text-emerald-100">
                      You are getting {quantity} cooktops at {formatNaira(pricing.unitPrice)} each instead of {formatNaira(BASE_SINGLE_PRICE)}.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollToOrderForm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-heading font-black text-xs bg-white text-slate-950 hover:bg-yellow-300 transition-all cursor-pointer uppercase tracking-wider shrink-0 flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Apply &amp; Fill Form</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <span>
                  💡 <strong>Pro Tip:</strong> Buy 2 units for your duplex or an extra kitchen to immediately save <strong>₦10,000</strong>!
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectTier(2)}
                  className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 cursor-pointer shrink-0 ml-2"
                >
                  Select 2 &amp; Save
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
