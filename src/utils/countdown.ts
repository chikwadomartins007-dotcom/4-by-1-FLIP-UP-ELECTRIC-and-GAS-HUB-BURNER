import { useState, useEffect } from "react";

const STORAGE_KEY = "promo_countdown_deadline_3days";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function getTargetTimestamp(): number {
  if (typeof window === "undefined") {
    return Date.now() + THREE_DAYS_MS;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
    const newTarget = Date.now() + THREE_DAYS_MS;
    localStorage.setItem(STORAGE_KEY, newTarget.toString());
    return newTarget;
  } catch {
    return Date.now() + THREE_DAYS_MS;
  }
}

export function useCountdown3Days() {
  const [targetTime] = useState<number>(getTargetTimestamp);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>(() => {
    const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
    return {
      days: Math.floor(diff / (3600 * 24)),
      hours: Math.floor((diff % (3600 * 24)) / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let diff = Math.max(0, Math.floor((targetTime - now) / 1000));

      if (diff <= 0) {
        // Reset evergreen 3 days if expired
        const newTarget = now + THREE_DAYS_MS;
        try {
          localStorage.setItem(STORAGE_KEY, newTarget.toString());
        } catch {
          // ignore
        }
        diff = Math.floor(THREE_DAYS_MS / 1000);
      }

      setTimeLeft({
        days: Math.floor(diff / (3600 * 24)),
        hours: Math.floor((diff % (3600 * 24)) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}
