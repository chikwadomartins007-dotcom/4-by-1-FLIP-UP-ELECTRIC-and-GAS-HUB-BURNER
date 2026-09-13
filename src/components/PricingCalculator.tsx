import React from "react";
import { Plus, Minus, Check, ArrowRight, MessageCircle, Sparkles, Tag } from "lucide-react";
import { calculatePricing, formatNaira } from "../utils/pricing";
import { getWhatsAppOrderUrl } from "../utils/whatsapp";
import { Analytics } from "../utils/analytics";

interface PricingCalculatorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onOrderClick: () => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  quantity,
  onQuantityChange,
  onOrderClick,
}) => {
  const pricing = calculatePricing(quantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      onQuantityChange(newQty);
      const newPricing = calculatePricing(newQty);
      Analytics.trackAddToCart(newQty, newPricing.total);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    onQuantityChange(newQty);
    const newPricing = calculatePricing(newQty);
    Analytics.trackAddToCart(newQty, newPricing.total);
  };

  const handleSetPreset = (qty: number) => {
    onQuantityChange(qty);
    const newPricing = calculatePricing(qty);
    Analytics.trackAddToCart(qty, newPricing.total);
  };

  const handleOrderNow = () => {
    Analytics.trackCTAClick(`Order Now (Pricing Calculator - Qty ${quantity})`, "#order-form-section");
    Analytics.trackInitiateCheckout(quantity, pricing.total);
    onOrderClick();
  };

  const handleWhatsApp = () => {
    Analytics.trackContact("whatsapp", `pricing_calculator_whatsapp_qty_${quantity}`, quantity, pricing.total);
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8D6D27] mb-2 block">
            Direct Transparent Pricing
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight mb-4">
            THE MORE YOU BUY, THE MORE YOU SAVE
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Equipping your primary home, an Airbnb, or a development project? Enjoy verified tiered savings starting from just 2 units.
          </p>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          {/* Tier 1 */}
          <div
            onClick={() => handleSetPreset(1)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
              quantity === 1
                ? "bg-white border-2 border-slate-900 shadow-md ring-1 ring-slate-900"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Single Unit
                </span>
                {quantity === 1 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                )}
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900 mb-1">
                ₦280,000
              </h3>
              <p className="text-xs text-slate-500">1 Piece Standard Price</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              Ideal for single kitchen upgrade
            </div>
          </div>

          {/* Tier 2 */}
          <div
            onClick={() => handleSetPreset(2)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
              quantity === 2
                ? "bg-white border-2 border-slate-900 shadow-md ring-1 ring-slate-900"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  BUY 2 PIECES
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  SAVE ₦10,000
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900 mb-1">
                ₦275,000
                <span className="text-xs font-semibold text-slate-500 ml-1">EACH</span>
              </h3>
              <p className="text-xs text-slate-500">Total: ₦550,000</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-emerald-700 font-bold">
              Save ₦5,000 per unit
            </div>
          </div>

          {/* Tier 3 */}
          <div
            onClick={() => handleSetPreset(3)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
              quantity === 3
                ? "bg-white border-2 border-slate-900 shadow-md ring-1 ring-slate-900"
                : "bg-slate-50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  BUY 3 PIECES
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  SAVE ₦30,000
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900 mb-1">
                ₦270,000
                <span className="text-xs font-semibold text-slate-500 ml-1">EACH</span>
              </h3>
              <p className="text-xs text-slate-500">Total: ₦810,000</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-emerald-700 font-bold">
              Save ₦10,000 per unit
            </div>
          </div>

          {/* Tier 4+ (Best Value) */}
          <div
            onClick={() => handleSetPreset(4)}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between relative ${
              quantity >= 4
                ? "bg-amber-50/50 border-2 border-amber-600 shadow-md ring-1 ring-amber-600"
                : "bg-amber-50/30 border-amber-300 hover:border-amber-400"
            }`}
          >
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-amber-600 text-white text-[9px] font-extrabold tracking-wider uppercase rounded shadow">
              BEST VALUE
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  BUY 4+ PIECES
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  SAVE ₦15,000/ea
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-amber-950 mb-1">
                ₦265,000
                <span className="text-xs font-semibold text-slate-600 ml-1">EACH</span>
              </h3>
              <p className="text-xs text-slate-600">4 units = ₦1,060,000</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] text-emerald-800 font-bold">
              Save ₦60,000 on 4 units
            </div>
          </div>

        </div>

        {/* Dynamic Quantity Calculator Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Quantity Counter */}
            <div className="md:col-span-5 flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 block">
                Adjust Selected Quantity
              </label>
              
              <div className="flex items-center gap-4 bg-white border border-slate-300 rounded-2xl p-2 w-full max-w-xs shadow-xs">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex-1 text-center">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) {
                        onQuantityChange(val);
                      }
                    }}
                    className="w-full text-center font-heading font-black text-2xl text-slate-900 bg-transparent border-0 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Units</span>
                </div>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={handleIncrease}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2 mt-4 text-xs text-slate-600">
                <span className="text-[11px] font-semibold">Quick Select:</span>
                {[1, 2, 3, 4, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSetPreset(num)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      quantity === num
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle / Right: Real-time Calculation Breakdown */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">QUANTITY</span>
                  <span className="font-heading font-black text-xl text-slate-900">
                    {pricing.quantity} {pricing.quantity === 1 ? "Cooktop" : "Cooktops"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block mb-1">UNIT PRICE</span>
                  <span className="font-heading font-black text-xl text-slate-900">
                    {formatNaira(pricing.unitPrice)}
                    <span className="text-xs font-medium text-slate-500 ml-1">each</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    TOTAL AMOUNT
                  </span>
                  <span className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                    {formatNaira(pricing.total)}
                  </span>
                </div>

                {pricing.savings > 0 && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block">
                      YOU SAVE
                    </span>
                    <span className="inline-block px-3 py-1 rounded-lg text-sm font-black bg-emerald-100 border border-emerald-300 text-emerald-800">
                      {formatNaira(pricing.savings)} OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-heading font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all cursor-pointer"
                >
                  <span>PROCEED WITH {pricing.quantity} {pricing.quantity === 1 ? "UNIT" : "UNITS"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppOrderUrl(pricing.quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-heading font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>ORDER {pricing.quantity} ON WHATSAPP</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
