import { calculatePricing, formatNaira } from "./pricing";

export const WHATSAPP_PHONE_DISPLAY = "08147778029";
export const WHATSAPP_PHONE_RAW = "2348147778029";
export const CALL_PHONE_TEL = "tel:+2348147778029";

/**
 * Builds a dynamically prefilled, properly encoded WhatsApp ordering URL.
 */
export function getWhatsAppOrderUrl(
  quantity: number = 1,
  details?: { name?: string; phone?: string; state?: string; address?: string }
): string {
  const pricing = calculatePricing(quantity);
  const formattedTotal = formatNaira(pricing.total);

  let message = "";
  if (details?.name || details?.address || details?.state) {
    message = `Hello MAX Luxury Bathrooms, I would like to place an order for the 5-Burner Built-In Gas + Electric Cooktop:
- Quantity: ${pricing.quantity} unit(s)
- Total: ${formattedTotal} (${formatNaira(pricing.unitPrice)} each)
- Name: ${details.name || "Not provided"}
- Phone: ${details.phone || "Not provided"}
- State: ${details.state || "Not provided"}
- Delivery Address: ${details.address || "Not provided"}
- Payment: Pay on Delivery / Verification

Please confirm my order and dispatch timeline.`;
  } else {
    message =
      pricing.quantity === 1
        ? `Hello MAX Luxury Bathrooms, I'm interested in the 5-Burner Built-In Gas + Electric Cooker. Quantity: 1 (₦280,000). Please confirm availability and delivery details.`
        : `Hello MAX Luxury Bathrooms, I want to order the 5-Burner Built-In Gas + Electric Cooker. Quantity: ${pricing.quantity}. Total: ${formattedTotal} (${formatNaira(pricing.unitPrice)} each). Please confirm availability and delivery details.`;
  }

  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp confirmation URL for placed orders.
 */
export function getWhatsAppConfirmationUrl(
  orderRef: string,
  quantity: number = 1,
  details?: { name?: string; phone?: string; state?: string; address?: string }
): string {
  const pricing = calculatePricing(quantity);
  const formattedTotal = formatNaira(pricing.total);
  const message = `Hello MAX Luxury Bathrooms, I just placed an order on your website!

📦 ORDER VERIFICATION:
• Order Ref: ${orderRef}
• Product: 5-Burner Built-In Gas + Electric Cooktop
• Quantity: ${quantity} unit(s)
• Total Payable: ${formattedTotal} (Payment on Delivery)
• Customer Name: ${details?.name || "Valued Customer"}
• Phone: ${details?.phone || "Not provided"}
• Delivery Address: ${details?.address || ""}, ${details?.state || ""}

Please confirm my order and let me know when it will be dispatched. Thank you!`;

  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(message)}`;
}

