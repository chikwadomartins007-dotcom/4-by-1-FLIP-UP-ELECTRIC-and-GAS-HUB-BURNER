import { useEffect, useRef, useCallback } from "react";

interface UseExitIntentOptions {
  onExitIntent: () => void;
  enabled?: boolean;
  threshold?: number; // Distance in pixels from the top edge (e.g. 35px)
  dwellTimeMs?: number; // Delay after page load before arming (e.g. 2000ms)
}

/**
 * Detects exit intent when a user's cursor moves towards the top edge of the browser window
 * (e.g. moving towards the URL bar, bookmarks, or closing tabs).
 */
export function useExitIntent({
  onExitIntent,
  enabled = true,
  threshold = 35,
  dwellTimeMs = 2000,
}: UseExitIntentOptions) {
  const hasTriggeredRef = useRef<boolean>(false);
  const isArmedRef = useRef<boolean>(false);
  const lastYRef = useRef<number | null>(null);

  const trigger = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    onExitIntent();
  }, [onExitIntent]);

  useEffect(() => {
    if (!enabled) return;

    // Minimum dwell time to prevent premature triggering on initial page entry
    const timer = setTimeout(() => {
      isArmedRef.current = true;
    }, dwellTimeMs);

    // 1. Mouse move: detect rapid upward motion towards the top edge of the viewport
    const handleMouseMove = (e: MouseEvent) => {
      if (!isArmedRef.current || hasTriggeredRef.current) return;

      const currentY = e.clientY;
      const prevY = lastYRef.current;
      lastYRef.current = currentY;

      // If cursor is within the top threshold and moving upwards
      if (currentY <= threshold) {
        if (prevY !== null && prevY > currentY) {
          trigger();
        }
      }
    };

    // 2. Mouse leave: user cursor completely crosses the top boundary of the viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (!isArmedRef.current || hasTriggeredRef.current) return;

      // Mouse left through the top edge (clientY <= threshold or exiting towards chrome/tabs)
      if (e.clientY <= threshold || !e.relatedTarget) {
        trigger();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, threshold, dwellTimeMs, trigger]);

  const reset = useCallback(() => {
    hasTriggeredRef.current = false;
  }, []);

  return { reset };
}
