import React, { useState, useEffect } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Phone,
  Truck,
  Sparkles,
  Plus,
  Minus,
  Clock,
  Check,
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

interface OrderFormProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ quantity, onQuantityChange }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: "",
    phone: "",
    email: "",
    state: "Lagos",
    deliveryAddress: "",
    quantity: quantity,
    paymentPreference: "Payment on Delivery (Subject to Location)",
    additionalMessage: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderReference, setOrderReference] = useState<string>("");

  useEffect(() => {
    setFormData((prev) => ({ ...prev, quantity }));
  }, [quantity]);

  const pricing = calculatePricing(formData.quantity);
  const selectedStateObj = NIGERIAN_STATES.find((s) => s.value === formData.state) || NIGERIAN_STATES[0];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Active phone number is required so we can call to confirm delivery";
    } else if (cleanPhone.length < 10 || cleanPhone.length > 14) {
      newErrors.phone = "Please enter a valid phone number (e.g. 08012345678)";
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Please enter your delivery street address and town/city";
    }

    // Email is OPTIONAL — only validate if user actually entered something
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address or leave it blank";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldFocus = () => {
    Analytics.trackInitiateCheckout(pricing.quantity, pricing.total);
  };

  const handleSelectPackage = (qty: number) => {
    setFormData((prev) => ({ ...prev, quantity: qty }));
    onQuantityChange(qty);
    const newPricing = calculatePricing(qty);
    Analytics.trackAddToCart(qty, newPricing.total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      setSubmitError("Please fill in your name, phone number, and delivery street address above.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const attribution = getAttribution();
      const currentPricing = calculatePricing(formData.quantity);
      const submissionTimestamp = new Date().toISOString();
      const generatedOrderRef = `MAX-${Date.now().toString().slice(-6)}`;

      const payload = {
        product: "Premium 5-Burner Built-In Gas + Electric Cooktop (Timer & Auto-Off Key)",
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
        order_reference: generatedOrderRef,
        utm_source: attribution.utm_source || "direct",
        utm_medium: attribution.utm_medium || "",
        utm_campaign: attribution.utm_campaign || "",
        utm_content: attribution.utm_content || "",
        utm_term: attribution.utm_term || "",
        fbclid: attribution.fbclid || "",
        fbp: attribution.fbp || "",
        fbc: attribution.fbc || "",
        landing_page: attribution.landing_page || window.location.href,
        referrer: attribution.referrer || document.referrer || "",
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
        setOrderReference(generatedOrderRef);

        Analytics.trackLead({
          email: formData.email,
          phone: formData.phone,
          name: formData.fullName,
          quantity: currentPricing.quantity,
          total: currentPricing.total,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(
          errorData?.error || "We could not submit your order online right now. Please check your details or call our hotline directly."
        );
      }
    } catch (err: any) {
      setSubmitError(
        "Network connection delay. Please try submitting again or call our hotline directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppInstant = () => {
    Analytics.trackContact(
      "whatsapp",
      "order_form_success_whatsapp",
      formData.quantity,
      pricing.total
    );
    window.open(
      getWhatsAppConfirmationUrl(orderReference, formData.quantity, {
        name: formData.fullName,
        phone: formData.phone,
        state: formData.state,
        address: formData.deliveryAddress,
      }),
      "_blank"
    );
  };

  return (
    <section id="order-form-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 animate-slide-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-300">
            <Clock className="w-3.5 h-3.5" />
            <span>Fast 30-Second Express Checkout</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight uppercase mb-2">
            FILL THE FORM BELOW TO PLACE ORDER
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Zero complicated accounts. Just your active phone number and delivery location. Pay on delivery available nationwide!
          </p>
        </div>

        {/* Direct Order Form Flow */}
        {/* Success State */}
        {isSuccess ? (
              <div className="rounded-3xl p-8 sm:p-10 bg-white border-2 border-emerald-500 shadow-xl text-center animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-1">
                  Submission Successful
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mb-2">
                  ORDER REQUEST RECEIVED!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4">
                  Order Reference: <strong className="text-slate-900">{orderReference}</strong>
                </p>
                
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Your order has been registered in our dispatch system. A representative will call you on <strong className="text-slate-900">{formData.phone}</strong> shortly to verify your location and dispatch your cooktop.
                </p>

                {/* Order Summary Recap Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 max-w-md mx-auto text-left text-xs text-slate-700 space-y-2">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Selected Model:</span>
                    <span className="font-bold text-slate-900">5-Burner Built-In Cooktop (Timer & Auto-Off)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-bold text-slate-900">{pricing.quantity} Unit(s)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Destination:</span>
                    <span className="font-bold text-slate-900">{formData.state} — {selectedStateObj.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Total Payable:</span>
                    <span className="font-black text-slate-900 text-sm">{formatNaira(pricing.total)}</span>
                  </div>
                  {pricing.savings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Instant Savings:</span>
                      <span>{formatNaira(pricing.savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-bold pt-1">
                    <span>Delivery Fee:</span>
                    <span>₦0 (100% FREE NATIONWIDE)</span>
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-2xl p-5 mb-6 max-w-md mx-auto text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <span>Track or Speed Up Dispatch on WhatsApp</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Have questions about your delivery schedule or want to send a live location pin? Connect with our dispatch team on WhatsApp:
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppInstant}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-heading font-black text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl transition-all cursor-pointer active:scale-98 animate-action-blink"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>CHAT ON WHATSAPP (ORDER REF: {orderReference})</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 mt-4">
                  Need immediate response? Call our Lagos office directly on {WHATSAPP_PHONE_DISPLAY}.
                </p>
              </div>
            ) : (
              /* High-Converting Streamlined Form Card */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-3xl p-6 sm:p-10 bg-white border border-slate-200 shadow-md space-y-6"
              >
                
                {/* 1-Tap Quantity Selection Packages */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      <span>STEP 1: SELECT YOUR QUANTITY PACKAGE</span>
                    </label>
                    <span className="text-xs text-emerald-700 font-bold">
                      ✓ Free Delivery Included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* 1 Unit Card */}
                    <div
                      onClick={() => handleSelectPackage(1)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                        formData.quantity === 1
                          ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wide">
                          1 Cooktop
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.quantity === 1 ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-300"
                        }`}>
                          {formData.quantity === 1 && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className={`font-heading font-black text-xl mb-1 ${formData.quantity === 1 ? "text-yellow-300" : "text-slate-900"}`}>
                        ₦280,000
                      </div>
                      <span className={`text-[11px] block ${formData.quantity === 1 ? "text-slate-300" : "text-slate-500"}`}>
                        Normal: <s className="text-red-400">₦350,000</s>
                      </span>
                      <span className={`text-[10px] font-bold block mt-1 ${formData.quantity === 1 ? "text-emerald-300" : "text-emerald-700"}`}>
                        Standard Single Home
                      </span>
                    </div>

                    {/* 2 Units Card (Special Builder Deal) */}
                    <div
                      onClick={() => handleSelectPackage(2)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative overflow-hidden ${
                        formData.quantity === 2
                          ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl">
                        SAVE ₦10,000
                      </span>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wide">
                          2 Cooktops
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.quantity === 2 ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-300"
                        }`}>
                          {formData.quantity === 2 && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className={`font-heading font-black text-xl mb-1 ${formData.quantity === 2 ? "text-yellow-300" : "text-slate-900"}`}>
                        ₦550,000
                      </div>
                      <span className={`text-[11px] block ${formData.quantity === 2 ? "text-slate-300" : "text-slate-500"}`}>
                        (₦275,000 each)
                      </span>
                      <span className={`text-[10px] font-bold block mt-1 ${formData.quantity === 2 ? "text-emerald-300" : "text-emerald-700"}`}>
                        Duplex / Main + Wet Kitchen
                      </span>
                    </div>

                    {/* 3 Units Card (Contractor / Bulk Deal) */}
                    <div
                      onClick={() => handleSelectPackage(3)}
                      className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative overflow-hidden ${
                        formData.quantity === 3
                          ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                      }`}
                    >
                      <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl">
                        SAVE ₦30,000
                      </span>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wide">
                          3 Cooktops
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          formData.quantity === 3 ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-300"
                        }`}>
                          {formData.quantity === 3 && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className={`font-heading font-black text-xl mb-1 ${formData.quantity === 3 ? "text-yellow-300" : "text-slate-900"}`}>
                        ₦810,000
                      </div>
                      <span className={`text-[11px] block ${formData.quantity === 3 ? "text-slate-300" : "text-slate-500"}`}>
                        (₦270,000 each)
                      </span>
                      <span className={`text-[10px] font-bold block mt-1 ${formData.quantity === 3 ? "text-emerald-300" : "text-emerald-700"}`}>
                        Estate / Contractor Deal
                      </span>
                    </div>

                  </div>

                  {/* Quantity Stepper Adjuster */}
                  <div className="mt-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <span className="text-xs text-slate-600 font-medium">
                      Ordering custom units? Use buttons to adjust:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectPackage(Math.max(1, formData.quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-extrabold text-slate-900">
                        {formData.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectPackage(formData.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields Header */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-4">
                    STEP 2: ENTER YOUR CONTACT &amp; DELIVERY LOCATION
                  </span>

                  <div className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Martins Chukwu / Engr. Adeleke"
                        value={formData.fullName}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                        }}
                        className={`w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                          errors.fullName ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-slate-900"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Phone & State Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Active Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="e.g. 08147778029"
                          value={formData.phone}
                          onFocus={handleFieldFocus}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          className={`w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                            errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-slate-900"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          We will call this number to confirm before riders dispatch.
                        </span>
                      </div>

                      {/* Nigerian State Picker with Live Delivery Turnaround */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Delivery State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:bg-white focus:border-slate-900"
                        >
                          {NIGERIAN_STATES.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label} ({st.deliveryTime})
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
                          ● Estimated delivery: {selectedStateObj.deliveryTime}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Street Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Street Address / Landmark / Town <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. House 14, Admiralty Way, Lekki Phase 1, near Ebeano Supermarket"
                        value={formData.deliveryAddress}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setFormData({ ...formData, deliveryAddress: e.target.value });
                          if (errors.deliveryAddress) setErrors({ ...errors, deliveryAddress: undefined });
                        }}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50/50 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                          errors.deliveryAddress ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-slate-900"
                        }`}
                      />
                      {errors.deliveryAddress && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.deliveryAddress}</span>
                        </p>
                      )}
                    </div>

                    {/* Email (Optional) & Kitchen Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email Address <span className="text-slate-400 text-[11px] font-normal">(Optional — for invoice)</span>
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. you@example.com (Optional)"
                          value={formData.email || ""}
                          onFocus={handleFieldFocus}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          className={`w-full px-4 py-3 rounded-xl bg-slate-50/50 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                            errors.email ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-slate-900"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Special Instructions <span className="text-slate-400 text-[11px] font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Call before dispatch, site engineer on site"
                          value={formData.additionalMessage}
                          onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Clear Dynamic Price Banner */}
                <div className="bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                        TOTAL AMOUNT PAYABLE:
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                          {formatNaira(pricing.total)}
                        </span>
                        {pricing.savings > 0 && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Save {formatNaira(pricing.savings)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-600 block mt-1">
                        Payment Method: <strong>Payment on Delivery / Verification</strong>
                      </span>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-emerald-200 text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 justify-end">
                        <Truck className="w-4 h-4" />
                        <span>FREE NATIONWIDE DELIVERY</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {formData.state}: {selectedStateObj.deliveryTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submission Error Banner */}
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Submission Alert:</span>
                      <span>{submitError}</span>
                    </div>
                  </div>
                )}

            {/* STEP 3: ALL ORDER MODES (Comes after filling Personal Info & Address) */}
            <div className="pt-2 border-t border-slate-200 space-y-4">
              <div className="text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>CHOOSE YOUR PREFERRED ORDER MODE:</span>
                </label>
                <p className="text-xs text-slate-600">
                  Your delivery address is ready. Select how you would like to finalize and place this order:
                </p>
              </div>

              {/* Submission Error Banner */}
              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Please Complete Required Details:</span>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* ORDER MODE 1: Direct Online Form Submission (Pay on Delivery) */}
                <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 text-white shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                      MODE 1: FASTEST &amp; RECOMMENDED
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      Pay on Delivery
                    </span>
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-base sm:text-lg text-white">
                      Confirm &amp; Submit Order Online
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Transmits your delivery address directly to our dispatch database. Our representative will call you to confirm before riders dispatch.
                    </p>
                  </div>
                  <button
                    type="submit"
                    id="submit-order-form-btn"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-heading font-black text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 animate-action-blink"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>TRANSMITTING ORDER DETAILS...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-slate-950" />
                        <span>SUBMIT ORDER ONLINE — {formatNaira(pricing.total)} (FREE DELIVERY)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option to Call Hotline Directly */}
                <div className="rounded-2xl p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-[#8D6D27] inline-block mb-1">
                      QUESTIONS BEFORE ORDERING?
                    </span>
                    <h4 className="font-heading font-black text-sm sm:text-base text-slate-900">
                      Call Customer Care Hotline
                    </h4>
                    <p className="text-xs text-slate-600">
                      Prefer speaking with an agent before ordering? Call our Lagos office directly.
                    </p>
                  </div>
                  <a
                    href={CALL_PHONE_TEL}
                    onClick={() => Analytics.trackContact("phone", "order_form_after_address_call")}
                    className="shrink-0 py-3.5 px-6 rounded-xl font-heading font-black text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-yellow-400" />
                    <span>CALL {WHATSAPP_PHONE_DISPLAY}</span>
                  </a>
                </div>

              </div>

              {/* Trust Guarantees */}
              <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
                <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero Risk • Pay upon Delivery / Verification • Inspection Allowed</span>
                </div>
              </div>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
