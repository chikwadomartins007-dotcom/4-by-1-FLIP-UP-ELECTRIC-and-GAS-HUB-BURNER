import { PricingBreakdown } from "../types";

export const BASE_SINGLE_PRICE = 260000;

/**
 * Centralized dynamic pricing calculator for the 5-Burner Built-In Cooktop.
 * 1 piece: ₦260,000
 * 2 pieces: ₦255,000 each (Save ₦10,000)
 * 3 pieces: ₦250,000 each (Save ₦30,000)
 * 4+ pieces: ₦245,000 each (Save ₦60,000+)
 * 
 * Works dynamically for any quantity >= 1.
 */
export function calculatePricing(quantity: number): PricingBreakdown {
  const qty = Math.max(1, Math.floor(quantity || 1));
  let unitPrice = BASE_SINGLE_PRICE;

  if (qty === 2) {
    unitPrice = 255000;
  } else if (qty === 3) {
    unitPrice = 250000;
  } else if (qty >= 4) {
    unitPrice = 245000;
  }

  const total = qty * unitPrice;
  const normalTotal = qty * BASE_SINGLE_PRICE;
  const savings = normalTotal - total;

  return {
    quantity: qty,
    unitPrice,
    total,
    normalTotal,
    savings,
  };
}

/**
 * Format a number into standard Nigerian Naira representation (e.g., ₦280,000).
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount).replace("NGN", "₦").trim();
}
