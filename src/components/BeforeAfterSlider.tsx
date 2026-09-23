import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronsLeftRight, Sparkles, X, Check, ArrowRight, Play, Pause } from "lucide-react";
import beforeImg from "../assets/images/old_tabletop_cooker_1790010294841.jpg";
import defaultAfterImg from "../assets/images/exact_kitchen_after_1790091195602.jpg";

interface BeforeAfterSliderProps {
  className?: string;
  onOrderClick?: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  className = "",
  onOrderClick,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentAfterImg, setCurrentAfterImg] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("max_cooktop_exact_after") || defaultAfterImg;
    }
    return defaultAfterImg;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const userInteractionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const statePhaseRef = useRef<"hold-after" | "sweep-to-before" | "hold-before" | "sweep-to-after">("sweep-to-before");
  const phaseElapsedRef = useRef<number>(0);

  // Measure container width for responsive image sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Temporarily pause auto-changing when user interacts, then resume after 4 seconds
  const registerUserInteraction = useCallback(() => {
    if (userInteractionTimerRef.current) {
      clearTimeout(userInteractionTimerRef.current);
    }
    userInteractionTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
      lastTimeRef.current = null;
    }, 4000);
  }, []);

  // Automatic Before / After scanning & alternating animation
  useEffect(() => {
    if (!isAutoPlaying || isDragging) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const HOLD_DURATION = 1400; // ms to pause and display the full view
    const SWEEP_DURATION = 2200; // ms to smoothly glide between views
    const MIN_POS = 15; // reveals mostly the AFTER image
    const MAX_POS = 85; // reveals mostly the BEFORE image

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min(100, timestamp - lastTimeRef.current);
      lastTimeRef.current = timestamp;

      phaseElapsedRef.current += dt;

      if (statePhaseRef.current === "hold-after") {
        setSliderPosition(MIN_POS);
        if (phaseElapsedRef.current >= HOLD_DURATION) {
          statePhaseRef.current = "sweep-to-before";
          phaseElapsedRef.current = 0;
        }
      } else if (statePhaseRef.current === "sweep-to-before") {
        const progress = Math.min(1, phaseElapsedRef.current / SWEEP_DURATION);
        // smooth cosine easing
        const eased = (1 - Math.cos(progress * Math.PI)) / 2;
        const current = MIN_POS + (MAX_POS - MIN_POS) * eased;
        setSliderPosition(current);
        if (progress >= 1) {
          statePhaseRef.current = "hold-before";
          phaseElapsedRef.current = 0;
        }
      } else if (statePhaseRef.current === "hold-before") {
        setSliderPosition(MAX_POS);
        if (phaseElapsedRef.current >= HOLD_DURATION) {
          statePhaseRef.current = "sweep-to-after";
          phaseElapsedRef.current = 0;
        }
      } else if (statePhaseRef.current === "sweep-to-after") {
        const progress = Math.min(1, phaseElapsedRef.current / SWEEP_DURATION);
        const eased = (1 - Math.cos(progress * Math.PI)) / 2;
        const current = MAX_POS - (MAX_POS - MIN_POS) * eased;
        setSliderPosition(current);
        if (progress >= 1) {
          statePhaseRef.current = "hold-after";
          phaseElapsedRef.current = 0;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isAutoPlaying, isDragging]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    registerUserInteraction();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    registerUserInteraction();
    setIsDragging(true);
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      registerUserInteraction();
      updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      registerUserInteraction();
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      registerUserInteraction();
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
      window.addEventListener("touchcancel", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [isDragging, updatePosition, registerUserInteraction]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    registerUserInteraction();
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  const handlePresetSelect = (pos: number) => {
    setSliderPosition(pos);
    registerUserInteraction();
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => {
      const next = !prev;
      if (next) {
        lastTimeRef.current = null;
        phaseElapsedRef.current = 0;
        statePhaseRef.current = "sweep-to-before";
      }
      return next;
    });
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden ${className}`}
      id="kitchen-before-after-slider"
    >
      {/* Top Header Controls Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#E5C378]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
              <span>Kitchen Counter Transformation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059] text-slate-950 font-black uppercase tracking-wider hidden sm:inline-block">
                Auto-Comparing
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Watch the automatic comparison or drag manually to reveal the 5-burner upgrade
            </p>
          </div>
        </div>

        {/* Controls: Auto-play toggle & Preset buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={toggleAutoPlay}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm ${
              isAutoPlaying
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title={isAutoPlaying ? "Pause automatic slide animation" : "Resume automatic slide animation"}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Auto-Changing</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Resume Auto</span>
              </>
            )}
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={() => handlePresetSelect(85)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              sliderPosition > 70
                ? "bg-red-600 text-white shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            }`}
            title="View Old Tabletop Cooker"
          >
            Old Tabletop
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(50)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              sliderPosition >= 40 && sliderPosition <= 60
                ? "bg-[#C5A059] text-slate-950 shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            }`}
            title="View 50/50 Split View"
          >
            50/50 Split
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(15)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              sliderPosition < 30
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            }`}
            title="View 5-Burner Built-In Upgrade"
          >
            Built-In Upgrade
          </button>
        </div>
      </div>

      {/* Interactive Visual Comparison Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and After Kitchen Counter Comparison Slider"
        className="relative w-full aspect-[4/3] sm:aspect-[1200/896] bg-slate-950 overflow-hidden select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
      >
        {/* AFTER IMAGE (Underneath layer - Modern Built-In Cooktop Renovation) */}
        <div
          className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden isolate z-0 pointer-events-none"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
            WebkitClipPath: `inset(0 0 0 ${sliderPosition}%)`,
          }}
        >
          <img
            src={currentAfterImg}
            onError={() => {
              if (currentAfterImg !== defaultAfterImg) {
                setCurrentAfterImg(defaultAfterImg);
              }
            }}
            alt="After: 5-Burner Built-In Gas and Electric Hybrid Cooktop installed flush into luxury quartz kitchen countertop island"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* After Tag / Annotation (Right Side) — strictly clipped and hidden when Before view is active */}
          <div
            className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col items-end gap-1.5 pointer-events-none"
            style={{
              opacity: sliderPosition >= 65 ? 0 : 1,
              transition: isDragging ? "none" : "opacity 0.2s ease-in-out",
            }}
          >
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs tracking-wide uppercase shadow-lg border border-emerald-400/40">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              AFTER: 5-Burner Built-In Upgrade
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-900/90 text-emerald-300 text-[11px] font-semibold backdrop-blur-md border border-emerald-500/30 shadow">
              ✓ Flush 900×510mm recessed glass • Dual Gas + Electric • Digital Timer
            </span>
          </div>
        </div>

        {/* BEFORE IMAGE (Clipped overlay layer - Old Tabletop Cooker) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none z-10 isolate"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Inner container sized to the full parent width so image does not stretch */}
          <div
            className="relative h-full"
            style={{ width: containerWidth > 0 ? `${containerWidth}px` : (containerRef.current ? `${containerRef.current.clientWidth}px` : "100%") }}
          >
            <img
              src={beforeImg}
              alt="Before: Old tabletop 2-burner metal stove sitting on counter with exposed gas hose and oil stains"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Before Tag / Annotation (Left Side) — hidden when After view is active */}
            <div
              className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col items-start gap-1.5"
              style={{
                opacity: sliderPosition <= 35 ? 0 : 1,
                transition: isDragging ? "none" : "opacity 0.2s ease-in-out",
              }}
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-xs tracking-wide uppercase shadow-lg border border-red-400/40">
                <X className="w-3.5 h-3.5 stroke-[3]" />
                BEFORE: Old Tabletop Cooker
              </span>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-black/85 text-red-300 text-[11px] font-semibold backdrop-blur-md border border-red-500/30 shadow">
                ✗ Bulky tabletop box • Exposed rubber hose • No timer or shutoff
              </span>
            </div>
          </div>
        </div>

        {/* DRAGGABLE DIVIDER LINE & HANDLE */}
        <div
          className="absolute inset-y-0 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Vertical Glowing Divider Line */}
          <div className="absolute inset-y-0 -left-px w-0.5 bg-gradient-to-b from-amber-300 via-white to-amber-300 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

          {/* Center Circular Grabber Handle */}
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-300 shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform duration-150">
            <ChevronsLeftRight className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
        </div>

        {/* Tap / Drag Helper Hint Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-3 py-1 rounded-full bg-black/70 text-white/90 text-[11px] font-medium backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5">
          <ChevronsLeftRight className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAutoPlaying ? "Auto-changing • Drag anytime to inspect" : "Drag left or right to inspect"}</span>
        </div>
      </div>

      {/* Feature Transformation Summary Below Slider */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-red-50/80 border border-red-200/80 rounded-xl p-3.5 text-red-900">
            <strong className="block font-bold text-xs uppercase tracking-wider text-red-800 mb-1 flex items-center gap-1">
              <X className="w-3.5 h-3.5 text-red-600 stroke-[3]" />
              The Old Tabletop Experience
            </strong>
            <p className="text-red-700 leading-relaxed text-[11px]">
              Takes up valuable counter room, leaves unsightly oil spills underneath that rust the metal frame, exposes rubber gas hose, and risks burnt pots due to zero timer or shutoff safety.
            </p>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 text-emerald-950">
            <strong className="block font-bold text-xs uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              The 5-Burner Built-In Experience
            </strong>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Sits flush into your countertop creating an executive kitchen finish, cook simultaneously on 5 burners, flip burners upward to wipe spills in 2 seconds, and relax knowing the digital timer turns off automatically.
            </p>
          </div>
        </div>

        {onOrderClick && (
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-600 text-center sm:text-left">
              Ready to elevate your kitchen with executive built-in luxury?
            </span>
            <button
              onClick={onOrderClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-black text-xs bg-[#0F172A] hover:bg-slate-800 text-white transition-all shadow-md cursor-pointer uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Upgrade My Kitchen Today</span>
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
