import { MetaEventUserData, MetaCustomData } from "../types";
import { getAttribution } from "./attribution";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
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
        fbp: userData.fbp || attribution.fbp,
        fbc: userData.fbc || attribution.fbc,
      },
      custom_data: {
        currency: "NGN",
        ...customData,
      },
    };

    // Use sendBeacon if available, or fetch in background
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/track/capi", blob);
    } else {
      fetch("/api/track/capi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Safe silence: tracking never blocks conversion
      });
    }
  } catch {
    // Non-blocking
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
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", eventName, customData, { eventID: eventId });
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
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    } catch {
      // safe
    }
  },

  trackViewContent: (price: number = 280000) => {
    if (hasViewContentFired) return;
    hasViewContentFired = true;
    return trackMetaEvent("ViewContent", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      value: Number(price),
      currency: "NGN",
    });
  },

  trackAddToCart: (quantity: number, total: number) => {
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
    return trackMetaEvent("InitiateCheckout", {
      content_name: "5-Burner Built-In Gas + Electric Cooktop",
      content_ids: ["MAX-COOKTOP-5B"],
      content_type: "product",
      num_items: Number(quantity),
      value: Number(total),
      currency: "NGN",
    });
  },

  trackLead: (formData: { email: string; phone: string; name?: string; quantity: number; total: number }) => {
    const names = (formData.name || "").trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

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
      }
    );
  },

  trackContact: (channel: "whatsapp" | "phone", label: string, quantity: number = 1, total?: number) => {
    return trackMetaEvent("Contact", {
      content_name: `Contact via ${channel.toUpperCase()} - ${label}`,
      channel,
      currency: "NGN",
      value: total ? Number(total) : undefined,
      num_items: Number(quantity),
    });
  },

  trackCTAClick: (label: string, destination: string) => {
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
