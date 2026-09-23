import { useState, useEffect } from "react";

const STORAGE_KEY = "max_cooktop_stock_state_v2";
const INITIAL_STOCK = 10;
const MIN_STOCK = 3;

export const RECENT_BUYER_CITIES = [
  "Ikeja, Lagos",
  "Maitama, Abuja",
  "GRA Phase 2, Port Harcourt",
  "Bodija, Ibadan",
  "Independence Layout, Enugu",
  "Lekki Phase 1, Lagos",
  "Asaba, Delta",
  "Gwarinpa, Abuja",
];

export interface StockClaimEvent {
  city: string;
  units: number;
  timestamp: number;
}

// Global state variables for multi-component synchronization
let globalStock: number = INITIAL_STOCK;
let globalJustDecreased: boolean = false;
let globalRecentEvent: StockClaimEvent | null = null;
const listeners = new Set<(state: { stock: number; justDecreased: boolean; event: StockClaimEvent | null }) => void>();
let timerInitialized = false;

function loadInitialStock(): number {
  if (typeof window === "undefined") return INITIAL_STOCK;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (typeof data.stock === "number" && data.stock >= MIN_STOCK && data.stock <= INITIAL_STOCK) {
        return data.stock;
      }
    }
  } catch {
    // Ignore storage issues
  }
  return INITIAL_STOCK;
}

function saveStock(stock: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ stock, time: Date.now() }));
  } catch {
    // Ignore storage issues
  }
}

function notifyListeners() {
  listeners.forEach((listener) => {
    listener({
      stock: globalStock,
      justDecreased: globalJustDecreased,
      event: globalRecentEvent,
    });
  });
}

function triggerDecrease() {
  if (globalStock <= MIN_STOCK) return;

  const newStock = Math.max(MIN_STOCK, globalStock - 1);
  globalStock = newStock;
  saveStock(newStock);

  const randomCity = RECENT_BUYER_CITIES[Math.floor(Math.random() * RECENT_BUYER_CITIES.length)];
  globalRecentEvent = {
    city: randomCity,
    units: 1,
    timestamp: Date.now(),
  };
  globalJustDecreased = true;
  notifyListeners();

  // Reset the "justDecreased" flash state after 4.5 seconds
  setTimeout(() => {
    globalJustDecreased = false;
    notifyListeners();
  }, 4500);
}

function initTimer() {
  if (timerInitialized || typeof window === "undefined") return;
  timerInitialized = true;
  globalStock = loadInitialStock();

  // Sequence of realistic interval reductions:
  // First decrease after 22-30 seconds
  // Subsequent decreases every 45-75 seconds
  const scheduleNext = (delayMs: number) => {
    setTimeout(() => {
      triggerDecrease();
      if (globalStock > MIN_STOCK) {
        // Next interval between 45s and 70s
        const nextDelay = Math.floor(Math.random() * 25000) + 45000;
        scheduleNext(nextDelay);
      }
    }, delayMs);
  };

  // Start initial timer: between 22 and 32 seconds
  const firstDelay = Math.floor(Math.random() * 10000) + 22000;
  scheduleNext(firstDelay);
}

/**
 * React hook to access the synchronized real-time stock counter.
 * Starts at a low number (10 units) and decreases slightly to build urgency.
 */
export function useStockCounter() {
  const [stockState, setStockState] = useState<{
    stock: number;
    justDecreased: boolean;
    event: StockClaimEvent | null;
  }>(() => ({
    stock: typeof window !== "undefined" ? globalStock : INITIAL_STOCK,
    justDecreased: globalJustDecreased,
    event: globalRecentEvent,
  }));

  useEffect(() => {
    // Initialize background singleton timer on first mount
    initTimer();

    const listener = (newState: {
      stock: number;
      justDecreased: boolean;
      event: StockClaimEvent | null;
    }) => {
      setStockState(newState);
    };

    listeners.add(listener);
    // Sync current state immediately in case it changed before component mounted
    setStockState({
      stock: globalStock,
      justDecreased: globalJustDecreased,
      event: globalRecentEvent,
    });

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    stock: stockState.stock,
    initialStock: INITIAL_STOCK,
    minStock: MIN_STOCK,
    justDecreased: stockState.justDecreased,
    recentEvent: stockState.event,
    percentageRemaining: Math.round((stockState.stock / INITIAL_STOCK) * 100),
  };
}
