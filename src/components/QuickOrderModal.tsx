import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Phone,
  Truck,
  Sparkles,
  Zap,
  Tag,
  Plus,
  Minus,
  HelpCircle,
} from "lucide-react";
import { OrderFormData } from "../types";
import { calculatePricing, formatNaira } from "../utils/pricing";
import { getAttribution } from "../utils/attribution";
import { Analytics } from "../utils/analytics";
import {
  getWhatsAppConfirmationUrl,
  WHATSAPP_PHONE_DISPLAY,
  CALL_PHONE_TEL,
} from "../utils/whatsapp";
import { NIGERIAN_STATES } from "../data/states";

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  isExitIntent?: boolean;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  quantity,
  onQuantityChange,
  isExitIntent = false,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: "",
    phone: "",
    email: "",
    state: "Lagos",
    deliveryAddress: "",
    quantity: quantity,
    paymentPreference: "Payment on Delivery / Confirmation",
    additionalMessage: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string>("");

  useEffect(() => {
    setFormData((prev) => ({ ...prev, quantity }));
  }, [quantity]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      Analytics.trackInitiateCheckout(quantity, calculatePricing(quantity).total);
    } else {
      document.body.style.overflow = "unset";
      setIsSuccess(false);
      setSubmitError(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, quantity]);

  if (!isOpen) return null;

  const pricing = calculatePricing(formData.quantity);
  const selectedStateObj = NIGERIAN_STATES.find((s) => s.value === formData.state) || NIGERIAN_STATES[0];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required for delivery verification";
    } else if (cleanPhone.length < 10 || cleanPhone.length > 14) {
      newErrors.phone = "Please enter a valid phone number (e.g. 08012345678)";
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Please enter your street address and town/city";
    }

    // Email is OPTIONAL; only validate if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email format or leave blank";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectQuantity = (qty: number) => {
    setFormData((prev) => ({ ...prev, quantity: qty }));
    onQuantityChange(qty);
    const newPricing = calculatePricing(qty);
    Analytics.trackAddToCart(qty, newPricing.total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const attribution = getAttribution();
      const currentPricing = calculatePricing(formData.quantity);
      const submissionTimestamp = new Date().toISOString();
      const generatedRef = `MAX-${Date.now().toString().slice(-6)}`;

      // Track Payment Info selection in TikTok & Meta funnel
      Analytics.trackAddPaymentInfo(
        currentPricing.quantity,
        currentPricing.total,
        formData.paymentPreference || "Payment on Delivery"
      );

      const payload = {
        order_source: "Quick Order Popup (Express Checkout)",
        product: "Premium 5-Burner Built-In Gas + Electric Cooktop (Timer & Auto-Off)",
        product_code: "MAX-COOKTOP-5B",
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email?.trim() || "Not provided",
        state: formData.state,
        delivery_address: formData.deliveryAddress.trim(),
        quantity: currentPricing.quantity,
        unit_price_formatted: formatNaira(currentPricing.unitPrice),
        total_amount_formatted: formatNaira(currentPricing.total),
        total_savings_formatted: formatNaira(currentPricing.savings),
        payment_preference: formData.paymentPreference,
        additional_instructions: formData.additionalMessage?.trim() || "None",
        delivery_estimate: selectedStateObj.deliveryTime,
        order_reference: generatedRef,
        utm_source: attribution.utm_source || "direct",
        utm_medium: attribution.utm_medium || "",
        utm_campaign: attribution.utm_campaign || "",
        landing_page: attribution.landing_page || window.location.href,
        submission_time: submissionTimestamp,
      };

      const response = await fetch("https://formspree.io/f/xaeyaklo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        setOrderRef(generatedRef);
        Analytics.trackLead({
          email: formData.email,
          phone: formData.phone,
          name: formData.fullName,
          quantity: currentPricing.quantity,
          total: currentPricing.total,
        });
      } else {
        const err = await response.json().catch(() => ({}));
        setSubmitError(
          err?.error || "Unable to submit online right now. Please check your network or call our customer hotline directly."
        );
      }
    } catch (err: any) {
      setSubmitError(
        "Network delay. Please try submitting again or call our customer hotline directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppInstantOrder = () => {
    Analytics.trackContact(
      "whatsapp",
      "quick_modal_success_whatsapp_click",
      formData.quantity,
      pricing.total
    );
    window.open(
      getWhatsAppConfirmationUrl(orderRef, formData.quantity, {
        name: formData.fullName,
        phone: formData.phone,
        state: formData.state,
        address: formData.deliveryAddress,
      }),
      "_blank"
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-order-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Special Exit-Intent Urgency Bar */}
        {isExitIntent && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between gap-2 border-b border-amber-600 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">⏳</span>
              <span>WAIT! Before You Leave — Lock in Today's ₦280,000 Special &amp; Free Delivery!</span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-950 text-yellow-300 text-[10px] font-extrabold uppercase tracking-wide shrink-0">
              Exit Special
            </span>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-yellow-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Instant Order Desk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  Pay on Delivery
                </span>
              </div>
              <h2 id="quick-order-title" className="font-heading font-black text-base sm:text-lg text-white">
                5-Burner Built-In Cooktop Order
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {isSuccess ? (
                /* Success Screen inside Modal */
                <div className="text-center py-6 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
                      Order Placed Successfully!
                    </span>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mt-1">
                      WE HAVE RECEIVED YOUR ORDER
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Order Reference: <strong className="text-slate-900">{orderRef}</strong>
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recipient:</span>
                      <strong className="text-slate-900">{formData.fullName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <strong className="text-slate-900">{formData.phone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantity:</span>
                      <strong className="text-slate-900">{pricing.quantity} unit(s)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Amount:</span>
                      <strong className="text-slate-900 font-bold">{formatNaira(pricing.total)}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-emerald-700">
                      <span>Delivery Timetable:</span>
                      <span className="font-bold">{selectedStateObj.deliveryTime}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Our dispatch team will call you on <strong className="text-slate-900">{formData.phone}</strong> shortly to confirm and dispatch your cooktop.
                  </p>

                  <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={handleWhatsAppInstantOrder}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-colors active:scale-98 animate-action-blink"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp (Order #{orderRef})</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Visual Quantity Selection Cards */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        1. Select Quantity Package:
                      </label>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        ✓ Free Delivery on All
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* 1 Unit */}
                      <button
                        type="button"
                        onClick={() => handleSelectQuantity(1)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                          formData.quantity === 1
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                        }`}
                      >
                        <span className="text-xs font-bold block">1 Cooktop</span>
                        <span className={`text-xs font-extrabold block mt-0.5 ${formData.quantity === 1 ? "text-yellow-300" : "text-slate-900"}`}>
                          ₦280,000
                        </span>
                        <span className={`text-[10px] block mt-1 ${formData.quantity === 1 ? "text-slate-300" : "text-slate-500"}`}>
                          Single Home
                        </span>
                      </button>

                      {/* 2 Units */}
                      <button
                        type="button"
                        onClick={() => handleSelectQuantity(2)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative overflow-hidden ${
                          formData.quantity === 2
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-emerald-500"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                        }`}
                      >
                        <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-1.5 rounded-bl">
                          SAVE ₦10k
                        </span>
                        <span className="text-xs font-bold block">2 Cooktops</span>
                        <span className={`text-xs font-extrabold block mt-0.5 ${formData.quantity === 2 ? "text-yellow-300" : "text-slate-900"}`}>
                          ₦550,000
                        </span>
                        <span className={`text-[10px] block mt-1 ${formData.quantity === 2 ? "text-emerald-300" : "text-emerald-700 font-bold"}`}>
                          Save ₦10,000
                        </span>
                      </button>

                      {/* 3 Units */}
                      <button
                        type="button"
                        onClick={() => handleSelectQuantity(3)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative overflow-hidden ${
                          formData.quantity === 3
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-emerald-500"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                        }`}
                      >
                        <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-1.5 rounded-bl">
                          SAVE ₦30k
                        </span>
                        <span className="text-xs font-bold block">3 Cooktops</span>
                        <span className={`text-xs font-extrabold block mt-0.5 ${formData.quantity === 3 ? "text-yellow-300" : "text-slate-900"}`}>
                          ₦810,000
                        </span>
                        <span className={`text-[10px] block mt-1 ${formData.quantity === 3 ? "text-emerald-300" : "text-emerald-700 font-bold"}`}>
                          Save ₦30,000
                        </span>
                      </button>
                    </div>

                    {/* Quantity Stepper for other numbers */}
                    <div className="mt-2 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                      <span className="text-xs text-slate-600">Need more? Adjust quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectQuantity(Math.max(1, formData.quantity - 1))}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {formData.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectQuantity(formData.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs: Name & Phone */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chief Emeka Adeleke"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                          errors.fullName ? "border-red-500" : "border-slate-300 focus:border-slate-900"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Phone Number (Active) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="e.g. 08012345678"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                            errors.phone ? "border-red-500" : "border-slate-300 focus:border-slate-900"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>

                      {/* State Selector */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Delivery State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900 font-semibold"
                        >
                          {NIGERIAN_STATES.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label} ({st.deliveryTime})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Delivery Street Address & City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. No 12 Admiralty Way, Lekki Phase 1"
                        value={formData.deliveryAddress}
                        onChange={(e) => {
                          setFormData({ ...formData, deliveryAddress: e.target.value });
                          if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: undefined });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
                          errors.deliveryAddress ? "border-red-500" : "border-slate-300 focus:border-slate-900"
                        }`}
                      />
                      {errors.deliveryAddress && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.deliveryAddress}</span>
                        </p>
                      )}
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address <span className="text-slate-400 font-normal text-[11px]">(Optional — for receipt)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="you@gmail.com (Optional)"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  {/* Pricing Summary Box */}
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-emerald-800 font-bold block">
                        Total Amount Payable on Delivery:
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {formatNaira(pricing.total)}
                      </span>
                      {pricing.savings > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          You save {formatNaira(pricing.savings)}!
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                        <Truck className="w-3 h-3" />
                        <span>FREE DELIVERY</span>
                      </span>
                      <span className="text-[10px] text-slate-600 block mt-0.5">
                        {selectedStateObj.deliveryTime}
                      </span>
                    </div>
                  </div>

                  {/* Submission Error Banner */}
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Notice:</span>
                        <span>{submitError}</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ALL ORDER MODES (Comes after filling Personal Info & Address) */}
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block mb-0.5">
                        Choose Your Order Mode:
                      </span>
                      <p className="text-[11px] text-slate-500">
                        All details filled above will be dispatched. Select your submission method:
                      </p>
                    </div>

                    {/* Mode 1: Submit Online */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl font-heading font-black text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 animate-action-blink"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>PROCESSING YOUR ORDER...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-yellow-400" />
                          <span>SUBMIT ORDER ONLINE — {formatNaira(pricing.total)} (FREE DELIVERY)</span>
                        </>
                      )}
                    </button>

                    {/* Mode 2: Call Hotline */}
                    <a
                      href={CALL_PHONE_TEL}
                      onClick={() => Analytics.trackContact("phone", "quick_modal_call_after_address")}
                      className="w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8D6D27]" />
                      <span>OR CALL HOTLINE DIRECTLY: {WHATSAPP_PHONE_DISPLAY}</span>
                    </a>
                  </div>

                </form>
              )}
            </div>

        {/* Footer Trust Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pay on Delivery • 100% Free Nationwide Delivery</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-faq-section"));
                }
                setTimeout(() => {
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                }, 150);
              }}
              className="text-[#8D6D27] hover:text-[#5E4717] font-bold flex items-center gap-1 cursor-pointer underline"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Questions? View FAQs</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
