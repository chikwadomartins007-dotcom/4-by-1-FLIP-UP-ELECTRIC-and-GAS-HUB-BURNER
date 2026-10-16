import { MetaEventUserData, MetaCustomData } from "../types";
import { getAttribution } from "./attribution";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    ttq?: {
      page: () => void;
      track: (eventName: string, params?: Record<string, any>, options?: Record<string, any>) => void;
      identify: (params: Record<string, any>) => void;
      [key: string]: any;
    };
  }
}

export const META_PIXEL_ID = "1690563088540181";

/**
 * Reconnects and guarantees Meta Pixel fbq is properly mounted, initialized, and active.
 */
export function reconnectMetaPixel(pixelId: string = META_PIXEL_ID) {
  if (typeof window === "undefined") return;

  try {
    if (!window.fbq) {
      const n: any = function (...args: any[]) {
        if (n.callMethod) {
          n.callMethod.apply(n, args);
        } else {
          n.queue.push(args);
        }
      };
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      window.fbq = n;
      window._fbq = n;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }

    // Re-initialize pixel with automatic advanced matching
    if (typeof window.fbq === "function") {
      window.fbq("init", pixelId);
    }
  } catch (e) {
    console.warn("Meta Pixel reconnect notice:", e);
  }
}

/**
 * Safely dispatches standard events to TikTok Pixel (ttq).
 */
export function trackTikTokEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    if (typeof window !== "undefined" && window.ttq && typeof window.ttq.track === "function") {
      window.ttq.track(eventName, params);
    }
  } catch (err) {
    console.warn("TikTok Pixel tracking error:", err);
  }
}

/**
 * Generates a unique event ID for deduplicating browser Meta Pixel and Conversions API events.
 */
export function generateEventId(eventName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${eventName.toLowerCase()}_${timestamp}_${random}`;
}

/**
 * Asynchronously dispatches event payload to server-side Meta Conversions API (CAPI) proxy.
 * Non-blocking: analytics errors will never affect user ordering or site functionality.
 */
async function sendServerCapi(
  eventName: string,
  eventId: string,
  userData: MetaEventUserData = {},
  customData: MetaCustomData = {}
) {
  try {
    const attribution = getAttribution();
    const payload = {
      event_name: eventName,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      user_data: {
        ...userData,
        country: userData.country || "ng",
        fbp: userData.fbp || attribution.fbp,
        fbc: userData.fbc || attribution.fbc,
      },
      custom_data: {
        currency: "NGN",
        ...customData,
      },
    };

    // Use fetch with keepalive as primary reliable POST, fallback to sendBeacon
    fetch("/api/track/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
          navigator.sendBeacon("/api/track/capi", blob);
        } catch {
          // safe
        }
      }
    });
  } catch {
    // Non-blocking: analytics errors will never affect user checkout
  }
}

/**
 * Standard Dual-Tracking Dispatcher:
 * Fires browser Meta Pixel fbq() with eventID AND dispatches to server-side CAPI with the exact same eventID.
 */
export function trackMetaEvent(
  eventName: string,
  customData: MetaCustomData = {},
  userData: MetaEventUserData = {},
  explicitEventId?: string
): string {
  const eventId = explicitEventId || generateEventId(eventName);

  // 1. Browser Meta Pixel
  try {
    if (typeof window !== "undefined") {
      if (typeof window.fbq !== "function") {
        reconnectMetaPixel();
      }
      if (typeof window.fbq === "function") {
        if (userData && (userData.email || userData.phone || userData.first_name)) {
          const am: Record<string, string> = {};
          if (userData.email) am.em = userData.email.trim().toLowerCase();
          const p = formatPhoneForPixel(userData.phone);
          if (p) am.ph = p;
          if (userData.first_name) am.fn = userData.first_name.trim().toLowerCase();
          if (userData.last_name) am.ln = userData.last_name.trim().toLowerCase();
          if (userData.city) am.ct = userData.city.trim().toLowerCase();
          if (userData.state) am.st = userData.state.trim().toLowerCase();
          am.country = "ng";
          try {
            window.fbq("init", META_PIXEL_ID, am);
          } catch {
            // safe
          }
        }
        window.fbq("track", eventName, customData, { eventID: eventId });
      }
    }
  } catch (err) {
    console.warn("Browser Meta Pixel tracking error:", err);
  }

  // 2. Server-side Conversions API (CAPI)
  sendServerCapi(eventName, eventId, userData, customData);

  return eventId;
}

export function formatPhoneForPixel(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const cleaned = phone.trim();
  if (/^[a-f0-9]{64}$/i.test(cleaned)) {
    return cleaned;
  }
  let digits = cleaned.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("00234")) {
    digits = digits.substring(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = "234" + digits.substring(1);
  } else if (digits.length === 10) {
    digits = "234" + digits;
  }
  return digits;
}

// Session flags to prevent spamming duplicate events during same interaction
let hasInitiatedCheckoutFired = false;
let hasViewContentFired = false;

export const Analytics = {
  trackPageView: () => {
    try {
      if (typeof window !== "undefined") {
        if (typeof window.fbq !== "function") {
          reconnectMetaPixel();
        }
        if (typeof window.fbq === "function") {
          window.fbq("track", "PageView");
        }
        if (window.ttq && typeof window.ttq.page === "function") {
          window.ttq.page();
        }
      }
    } catch {
      // safe
    }
  },

  trackViewContent: (price: number = 280000) => {
    if (hasViewContentFired) return;
    hasViewContentFired = true;

    const val = Number(price) || 280000;

    trackTikTokEvent("ViewContent", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: 1,
      price: val,
      value: val,
      currency: "NGN",
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: 1,
          price: val,
        },
      ],
    });

    return trackMetaEvent("ViewContent", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      contents: [
        {
          id: "MAX-COOKTOP-5B",
          quantity: 1,
          item_price: val,
        },
      ],
      value: val,
      currency: "NGN",
    });
  },

  trackAddToCart: (quantity: number, total: number) => {
    const qty = Math.max(1, Number(quantity) || 1);
    const totalVal = Number(total) || 280000;
    const unitPrice = Math.round(totalVal / qty);

    trackTikTokEvent("AddToCart", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: qty,
      price: unitPrice,
      value: totalVal,
      currency: "NGN",
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: qty,
          price: unitPrice,
        },
      ],
    });

    return trackMetaEvent("AddToCart", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      contents: [
        {
          id: "MAX-COOKTOP-5B",
          quantity: qty,
          item_price: unitPrice,
        },
      ],
      quantity: qty,
      num_items: qty,
      value: totalVal,
      currency: "NGN",
    });
  },

  trackInitiateCheckout: (quantity: number, total: number) => {
    if (hasInitiatedCheckoutFired) return;
    hasInitiatedCheckoutFired = true;
    const qty = Math.max(1, Number(quantity) || 1);
    const totalVal = Number(total) || 280000;
    const unitPrice = Math.round(totalVal / qty);

    trackTikTokEvent("InitiateCheckout", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: qty,
      price: unitPrice,
      value: totalVal,
      currency: "NGN",
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: qty,
          price: unitPrice,
        },
      ],
    });

    return trackMetaEvent("InitiateCheckout", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      contents: [
        {
          id: "MAX-COOKTOP-5B",
          quantity: qty,
          item_price: unitPrice,
        },
      ],
      num_items: qty,
      value: totalVal,
      currency: "NGN",
    });
  },

  trackAddPaymentInfo: (quantity: number, total: number, paymentType: string = "Payment on Delivery") => {
    const qty = Math.max(1, Number(quantity) || 1);
    const totalVal = Number(total) || 280000;
    const unitPrice = Math.round(totalVal / qty);

    trackTikTokEvent("AddPaymentInfo", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: qty,
      price: unitPrice,
      value: totalVal,
      currency: "NGN",
      description: paymentType,
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: qty,
          price: unitPrice,
        },
      ],
    });

    return trackMetaEvent("AddPaymentInfo", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      contents: [
        {
          id: "MAX-COOKTOP-5B",
          quantity: qty,
          item_price: unitPrice,
        },
      ],
      num_items: qty,
      value: totalVal,
      currency: "NGN",
    });
  },

  trackLead: (formData: {
    email?: string;
    phone: string;
    name?: string;
    state?: string;
    quantity: number;
    total: number;
    eventId?: string;
  }) => {
    const qty = Math.max(1, Number(formData.quantity) || 1);
    const totalVal = Number(formData.total) || 280000;
    const unitPrice = Math.round(totalVal / qty);
    const names = (formData.name || "").trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";
    const normalizedPhone = formatPhoneForPixel(formData.phone);
    const cleanEmail =
      formData.email && formData.email.includes("@")
        ? formData.email.trim().toLowerCase()
        : undefined;

    // TikTok user identification & comprehensive conversion tracking
    try {
      if (typeof window !== "undefined" && window.ttq) {
        if (typeof window.ttq.identify === "function") {
          window.ttq.identify({
            email: cleanEmail,
            phone_number: normalizedPhone,
            external_id: normalizedPhone || formData.phone,
          });
        }

        const tikTokConversionData = {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: qty,
          price: unitPrice,
          value: totalVal,
          currency: "NGN",
          contents: [
            {
              content_id: "MAX-COOKTOP-5B",
              content_type: "product",
              content_name: "5-Burner Built-In Gas + Electric Cooktop",
              content_category: "Kitchen Appliances",
              quantity: qty,
              price: unitPrice,
            },
          ],
        };

        if (typeof window.ttq.track === "function") {
          window.ttq.track("SubmitForm", {
            ...tikTokConversionData,
            content_name: "Cooktop Order Form Submission",
          }, { event_id: formData.eventId });
        }
      }
    } catch {
      // safe
    }

    return trackMetaEvent(
      "Lead",
      {
        content_name: "5-Burner Built-In Gas + Electric Cooktop",
        content_ids: ["MAX-COOKTOP-5B"],
        content_type: "product",
        contents: [
          {
            id: "MAX-COOKTOP-5B",
            quantity: qty,
            item_price: unitPrice,
          },
        ],
        content_category: "Kitchen Appliances",
        currency: "NGN",
        value: totalVal,
        num_items: qty,
      },
      {
        email: cleanEmail,
        phone: normalizedPhone,
        first_name: firstName,
        last_name: lastName,
        city: formData.state,
        state: formData.state,
        country: "ng",
      },
      formData.eventId
    );
  },

  trackPurchase: (orderData: {
    orderId: string;
    total: number;
    quantity: number;
    email?: string;
    phone?: string;
    name?: string;
    state?: string;
    deliveryAddress?: string;
    eventId?: string;
  }) => {
    const qty = Math.max(1, Number(orderData.quantity || 1));
    const totalVal = Math.max(0, Number(orderData.total || 280000));
    const unitPrice = Math.round(totalVal / qty);
    const names = (orderData.name || "").trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";
    const resolvedEventId = orderData.eventId || `purchase_${orderData.orderId}_${Date.now()}`;
    const normalizedPhone = formatPhoneForPixel(orderData.phone);
    const cleanEmail =
      orderData.email && orderData.email.includes("@")
        ? orderData.email.trim().toLowerCase()
        : undefined;

    // 1. TikTok Pixel: User Identification & Purchase Events (CompletePayment + PlaceAnOrder)
    try {
      if (typeof window !== "undefined" && window.ttq) {
        if (typeof window.ttq.identify === "function") {
          window.ttq.identify({
            email: cleanEmail,
            phone_number: normalizedPhone,
            external_id: normalizedPhone || orderData.orderId,
          });
        }

        const tikTokPurchaseData = {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: qty,
          price: unitPrice,
          value: totalVal,
          currency: "NGN",
          contents: [
            {
              content_id: "MAX-COOKTOP-5B",
              content_type: "product",
              content_name: "5-Burner Built-In Gas + Electric Cooktop",
              content_category: "Kitchen Appliances",
              quantity: qty,
              price: unitPrice,
            },
          ],
        };

        if (typeof window.ttq.track === "function") {
          // Standard TikTok purchase optimization goal
          window.ttq.track("CompletePayment", tikTokPurchaseData, {
            event_id: resolvedEventId,
          });
          // Standard TikTok e-commerce order goal
          window.ttq.track("PlaceAnOrder", tikTokPurchaseData, {
            event_id: resolvedEventId,
          });
        }
      }
    } catch (ttErr) {
      console.warn("TikTok Pixel purchase tracking error:", ttErr);
    }

    // 2. Google Analytics (gtag) / GTM DataLayer
    try {
      if (typeof window !== "undefined") {
        const win = window as any;
        if (typeof win.gtag === "function") {
          win.gtag("event", "purchase", {
            transaction_id: orderData.orderId,
            value: totalVal,
            currency: "NGN",
            items: [
              {
                item_id: "MAX-COOKTOP-5B",
                item_name: "5-Burner Built-In Gas + Electric Cooktop",
                quantity: qty,
                price: unitPrice,
              },
            ],
          });
        }
        if (Array.isArray(win.dataLayer)) {
          win.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id: orderData.orderId,
              value: totalVal,
              currency: "NGN",
              items: [
                {
                  item_id: "MAX-COOKTOP-5B",
                  item_name: "5-Burner Built-In Gas + Electric Cooktop",
                  quantity: qty,
                  price: unitPrice,
                },
              ],
            },
          });
        }
        if (typeof win.snaptr === "function") {
          win.snaptr("track", "PURCHASE", {
            currency: "NGN",
            price: totalVal,
            item_ids: ["MAX-COOKTOP-5B"],
            number_items: qty,
            transaction_id: orderData.orderId,
          });
        }
        if (typeof win.pintrk === "function") {
          win.pintrk("track", "checkout", {
            value: totalVal,
            order_quantity: qty,
            currency: "NGN",
            order_id: orderData.orderId,
          });
        }
      }
    } catch {
      // safe
    }

    // 3. Meta Pixel (Browser fbq) + Conversions API (Server CAPI)
    // Passes exact Meta schema: value, currency, contents array, content_ids, content_type, num_items, order_id
    const metaCustomData = {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      contents: [
        {
          id: "MAX-COOKTOP-5B",
          quantity: qty,
          item_price: unitPrice,
        },
      ],
      value: totalVal,
      currency: "NGN",
      num_items: qty,
      order_id: orderData.orderId,
    };

    const metaUserData = {
      email: cleanEmail,
      phone: normalizedPhone,
      first_name: firstName,
      last_name: lastName,
      city: orderData.state,
      state: orderData.state,
      country: "ng",
    };

    return trackMetaEvent(
      "Purchase",
      metaCustomData,
      metaUserData,
      resolvedEventId
    );
  },

  trackContact: (channel: "whatsapp" | "phone", label: string, quantity: number = 1, total?: number) => {
    trackTikTokEvent("Contact", {
      content_name: `Contact via ${channel.toUpperCase()} - ${label}`,
      value: total ? Number(total) : undefined,
      currency: "NGN",
    });

    return trackMetaEvent("Contact", {
      content_name: `Contact via ${channel.toUpperCase()} - ${label}`,
      channel,
      currency: "NGN",
      value: total ? Number(total) : undefined,
      num_items: Number(quantity),
    });
  },

  trackCTAClick: (label: string, destination: string) => {
    trackTikTokEvent("ClickButton", {
      button_name: label,
      destination,
    });

    try {
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("trackCustom", "CTAClick", {
          cta_label: label,
          destination,
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      // safe
    }
  },
};
