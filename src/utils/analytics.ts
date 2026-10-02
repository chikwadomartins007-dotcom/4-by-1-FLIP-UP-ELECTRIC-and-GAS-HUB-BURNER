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

export const META_PIXEL_ID = "1730802201545460";

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

    trackTikTokEvent("ViewContent", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: 1,
      price: Number(price),
      value: Number(price),
      currency: "NGN",
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: 1,
          price: Number(price),
        },
      ],
    });

    return trackMetaEvent("ViewContent", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      value: Number(price),
      currency: "NGN",
    });
  },

  trackAddToCart: (quantity: number, total: number) => {
    const unitPrice = Number(total) / Math.max(1, Number(quantity));

    trackTikTokEvent("AddToCart", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: Number(quantity),
      price: unitPrice,
      value: Number(total),
      currency: "NGN",
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: Number(quantity),
          price: unitPrice,
        },
      ],
    });

    return trackMetaEvent("AddToCart", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      quantity: Number(quantity),
      num_items: Number(quantity),
      value: Number(total),
      currency: "NGN",
    });
  },

  trackInitiateCheckout: (quantity: number, total: number) => {
    if (hasInitiatedCheckoutFired) return;
    hasInitiatedCheckoutFired = true;
    const unitPrice = Number(total) / Math.max(1, Number(quantity));

    trackTikTokEvent("InitiateCheckout", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: Number(quantity),
      price: unitPrice,
      value: Number(total),
      currency: "NGN",
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: Number(quantity),
          price: unitPrice,
        },
      ],
    });

    return trackMetaEvent("InitiateCheckout", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      num_items: Number(quantity),
      value: Number(total),
      currency: "NGN",
    });
  },

  trackAddPaymentInfo: (quantity: number, total: number, paymentType: string = "Payment on Delivery") => {
    const unitPrice = Number(total) / Math.max(1, Number(quantity));

    trackTikTokEvent("AddPaymentInfo", {
      content_id: "MAX-COOKTOP-5B",
      content_type: "product",
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_category: "Kitchen Appliances",
      quantity: Number(quantity),
      price: unitPrice,
      value: Number(total),
      currency: "NGN",
      description: paymentType,
      contents: [
        {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: Number(quantity),
          price: unitPrice,
        },
      ],
    });

    return trackMetaEvent("AddPaymentInfo", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      num_items: Number(quantity),
      value: Number(total),
      currency: "NGN",
    });
  },

  trackLead: (formData: {
    email?: string;
    phone: string;
    name?: string;
    quantity: number;
    total: number;
    eventId?: string;
  }) => {
    const names = (formData.name || "").trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";
    const unitPrice = Number(formData.total) / Math.max(1, Number(formData.quantity));

    // TikTok user identification & comprehensive conversion tracking
    try {
      if (typeof window !== "undefined" && window.ttq) {
        if (typeof window.ttq.identify === "function") {
          window.ttq.identify({
            email: formData.email,
            phone_number: formData.phone,
            external_id: formData.phone,
          });
        }

        const tikTokConversionData = {
          content_id: "MAX-COOKTOP-5B",
          content_type: "product",
          content_name: "5-Burner Built-In Gas + Electric Cooktop",
          content_category: "Kitchen Appliances",
          quantity: Number(formData.quantity),
          price: unitPrice,
          value: Number(formData.total),
          currency: "NGN",
          contents: [
            {
              content_id: "MAX-COOKTOP-5B",
              content_type: "product",
              content_name: "5-Burner Built-In Gas + Electric Cooktop",
              content_category: "Kitchen Appliances",
              quantity: Number(formData.quantity),
              price: unitPrice,
            },
          ],
        };

        if (typeof window.ttq.track === "function") {
          // Standard E-commerce conversion: PlaceAnOrder
          window.ttq.track("PlaceAnOrder", tikTokConversionData);
          // Standard Purchase optimization goal: CompletePayment
          window.ttq.track("CompletePayment", tikTokConversionData);
          // Standard Form conversion goal: SubmitForm
          window.ttq.track("SubmitForm", {
            ...tikTokConversionData,
            content_name: "Cooktop Order Form Submission",
          });
        }
      }
    } catch {
      // safe
    }

    return trackMetaEvent(
      "Lead",
      {
        content_name: "5-Burner Built-In Gas + Electric Cooktop",
        content_category: "Kitchen Appliances",
        currency: "NGN",
        value: Number(formData.total),
        num_items: Number(formData.quantity),
      },
      {
        email: formData.email,
        phone: formData.phone,
        first_name: firstName,
        last_name: lastName,
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
    eventId?: string;
  }) => {
    const names = (orderData.name || "").trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";
    const resolvedEventId = orderData.eventId || `purchase_${orderData.orderId}`;

    return trackMetaEvent(
      "Purchase",
      {
        content_name: "5-Burner Built-In Gas + Electric Cooktop",
        content_ids: ["MAX-COOKTOP-5B"],
        content_type: "product",
        value: Number(orderData.total),
        currency: "NGN",
        num_items: Number(orderData.quantity),
        order_id: orderData.orderId,
      },
      {
        email: orderData.email,
        phone: orderData.phone,
        first_name: firstName,
        last_name: lastName,
      },
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
