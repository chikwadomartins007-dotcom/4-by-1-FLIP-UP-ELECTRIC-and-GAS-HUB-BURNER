import { PricingBreakdown } from "../types";

export const BASE_SINGLE_PRICE = 280000;

/**
 * Centralized dynamic pricing calculator for the 5-Burner Built-In Cooktop.
 * 1 piece: ₦280,000
 * 2 pieces: ₦275,000 each
 * 3 pieces: ₦270,000 each
 * 4+ pieces: ₦265,000 each
 * 
 * Works dynamically for any quantity >= 1.
 */
export function calculatePricing(quantity: number): PricingBreakdown {
  const qty = Math.max(1, Math.floor(quantity || 1));
  let unitPrice = BASE_SINGLE_PRICE;

  if (qty === 2) {
    unitPrice = 275000;
  } else if (qty === 3) {
    unitPrice = 270000;
  } else if (qty >= 4) {
    unitPrice = 265000;
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
