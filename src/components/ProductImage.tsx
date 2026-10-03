import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Zap,
  Shield,
  Sparkles,
  Timer,
  Power,
  Lock,
  Check,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Info,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";
import { Analytics } from "../utils/analytics";
import { useImageStore } from "../context/ImageContext";

interface ProductImageProps {
  className?: string;
  alt?: string;
  priority?: boolean;
}

export interface GalleryAsset {
  id: string;
  title: string;
  angleLabel: string;
  tag: string;
  src: string;
  fallbackPaths: string[];
  description: string;
  badge: string;
  badgeColor: string;
  closeUpNotes: string[];
  hotspots?: {
    id: string;
    label: string;
    desc: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
  }[];
}

export const PRODUCT_GALLERY_ASSETS: GalleryAsset[] = [
  {
    id: "studio-top",
    title: "5-Zone Hybrid Cooktop: Overhead Studio Angle",
    angleLabel: "Studio Overhead",
    tag: "Primary View",
    src: "/exact-cooktop-top.png",
    fallbackPaths: [
      "/exact-cooktop-top.png",
      "/Hd84f5f7654644224945b4ea055aa07a1Y.png",
      "/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png",
      "/cooktop-clean.webp",
    ],
    description: "4 Articulated Flip-Up Gas Burners + 1 Center Radiant Ceramic Electric Burner on Deep Polished Black Tempered Glass with Digital Timer.",
    badge: "5-in-1 Hybrid Hob",
    badgeColor: "bg-amber-500/15 text-amber-800 border-amber-500/30",
    closeUpNotes: [
      "Heavy-duty cast iron pan trivets for rock-solid pot stability",
      "Central 3000W red ceramic radiant heating zone with no open flame",
      "Red 7-segment digital timer display with automatic cutoff",
      "4 ergonomic rotary flame control knobs with impulse auto-ignition",
    ],
    hotspots: [
      {
        id: "h1",
        label: "Flip Gas Burners (x4)",
        desc: "High-power blue flame gas burners tilt 90° for 1-wipe cleaning",
        x: 18,
        y: 35,
      },
      {
        id: "h2",
        label: "Radiant Ceramic Zone",
        desc: "Vibrant glowing electric coil with instant 3000W heat",
        x: 50,
        y: 36,
      },
      {
        id: "h3",
        label: "Digital Timer & Touch Panel",
        desc: "LED countdown display with 1-touch Automatic Off Key & Child Lock",
        x: 50,
        y: 62,
      },
      {
        id: "h4",
        label: "Rotary Flame Controls",
        desc: "Smooth micro-adjustment knobs with electric spark ignition",
        x: 48,
        y: 72,
      },
    ],
  },
  {
    id: "kitchen-install",
    title: "Built-In Kitchen Countertop Installation",
    angleLabel: "Countertop Fit",
    tag: "Real Kitchen Fit",
    src: "/kitchen-counter-view.jpg",
    fallbackPaths: [
      "/kitchen-counter-view.jpg",
      "/assets/images.jpeg",
      "/images.jpeg",
      "/exact-cooktop-top.png",
    ],
    description: "Flush recessed installation into polished quartz and marble kitchen island, blending seamlessly with contemporary cabinetry.",
    badge: "Seamless Flush Fit",
    badgeColor: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30",
    closeUpNotes: [
      "Beveled edge tempered glass sits flush against stone counters",
      "Eliminates bulky tabletop box and dangling rubber hoses",
      "Wide 900mm layout allows cooking with 5 large pots simultaneously",
      "Heat-resistant silicone perimeter seal blocks grease infiltration",
    ],
  },
  {
    id: "active-ceramic",
    title: "Active Radiant Heat & Digital Display",
    angleLabel: "Ceramic Hotplate",
    tag: "Live Performance",
    src: "/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
    fallbackPaths: [
      "/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
      "/showroom-demo.jpg",
      "/assets/showroom-demo.jpg",
      "/exact-cooktop-top.png",
    ],
    description: "Close-up perspective of glowing infrared ceramic coil delivering rapid 3000W boiling heat alongside tactile control knobs.",
    badge: "3000W Radiant Heat",
    badgeColor: "bg-red-500/15 text-red-800 border-red-500/30",
    closeUpNotes: [
      "Uniform infrared heat distribution ensures no hot spots",
      "Compatible with all cookware types (stainless steel, cast iron, ceramic, clay, and glass pots)",
      "High-contrast red LED display shows wattage and remaining timer minutes",
      "Residual heat indicator warns you while glass is still cooling down",
    ],
  },
  {
    id: "flip-burner",
    title: "Patented Flip-Up Hinged Burners (Easy Clean)",
    angleLabel: "Flip-Up Cleaning",
    tag: "Easy-Clean Detail",
    src: "/cooktop-clean.webp",
    fallbackPaths: [
      "/cooktop-clean.webp",
      "/H4183961f34a64d47a5f116fa6bfddf7eE.png",
      "/assets/cooktop-clean.webp",
      "/exact-cooktop-top.png",
    ],
    description: "Dual-hinge articulated burner design allows each gas burner to be lifted 90 degrees for effortless 1-wipe spill cleaning underneath.",
    badge: "1-Wipe Cleaning",
    badgeColor: "bg-blue-500/15 text-blue-800 border-blue-500/30",
    closeUpNotes: [
      "No need to disassemble burner heads or unscrew parts to clean food spills",
      "Heavy-duty brass pivot mechanism tested for over 10,000 hinge lifts",
      "Smooth mirror-finished tempered glass cleans with a damp microfiber cloth",
      "Permanent sealed pan prevents soup or oil from leaking into cabinetry below",
    ],
  },
  {
    id: "blueprint-specs",
    title: "Official Cutout Dimensions & Technical Blueprint",
    angleLabel: "Cutout Specs",
    tag: "Dimensions",
    src: "/cooktop-diagram.png",
    fallbackPaths: [
      "/cooktop-diagram.png",
      "/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg",
      "/assets/cooktop-diagram.png",
      "/exact-cooktop-top.png",
    ],
    description: "Exact dimensions: 900 × 510mm top surface, 870 × 480mm countertop cutout. Standard fit for 90cm Nigerian kitchen cabinets.",
    badge: "870 × 480mm Cutout",
    badgeColor: "bg-purple-500/15 text-purple-800 border-purple-500/30",
    closeUpNotes: [
      "Hob Dimensions: 900mm Width × 510mm Depth × 120mm Height",
      "Standard Counter Cutout: 870mm Width × 480mm Depth",
      "Pre-wired with standard 220-240V Nigerian 3-pin plug for ceramic zone",
      "Includes brass L-bracket gas hose nozzle compatible with standard 12.5kg / 25kg / 50kg Nigerian LPG cylinders",
    ],
  },
  {
    id: "interactive-sim",
    title: "Interactive Digital Timer & Automatic Off Simulator",
    angleLabel: "Live Simulator",
    tag: "Interactive Demo",
    src: "/exact-cooktop-top.png",
    fallbackPaths: ["/exact-cooktop-top.png"],
    description: "Test the digital touch controls in real time: adjust wattage (800W - 3000W), set countdown timer (1 - 99m), and test the emergency Automatic Off Key.",
    badge: "Interactive Controls",
    badgeColor: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30",
    closeUpNotes: [
      "Click '+' or '-' to adjust heating power levels or countdown minutes",
      "Click 'TIMER' to switch between power mode and auto-shutoff countdown",
      "Click the Red Power button to test 1-touch Emergency Automatic Shutdown",
      "Click the Lock button to test Child Safety Lock",
    ],
  },
];

export const ASSET_ID_TO_SLOT: Record<string, string> = {
  "studio-top": "hero-main",
  "kitchen-install": "kitchen-install",
  "active-ceramic": "active-ceramic",
  "flip-burner": "flip-burner",
  "blueprint-specs": "blueprint-specs",
  "interactive-sim": "hero-main",
};

export const ProductImage: React.FC<ProductImageProps> = ({
  className = "",
  alt = "5-Burner Built-In Gas & Electric Cooktop with Black Glass, Timer, and Automatic Off Key",
  priority = false,
}) => {
  const { getImageUrl, isCustomized } = useImageStore();
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [fallbackIndices, setFallbackIndices] = useState<Record<string, number>>({});

  // Carousel & Autoplay
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Close-up & Hotspots feature toggle
  const [showHotspots, setShowHotspots] = useState<boolean>(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Lightbox & Zoom inspection state
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Burner Simulator States
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [wattage, setWattage] = useState<number>(3000);
  const [timerMinutes, setTimerMinutes] = useState<number>(30);
  const [isTimerMode, setIsTimerMode] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [customKitchenImg, setCustomKitchenImg] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("max_cooktop_exact_after") || "/exact_kitchen_after.jpg";
    }
    return "/exact_kitchen_after.jpg";
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setCustomKitchenImg(e.detail);
    };
    window.addEventListener("exact-after-image-updated", handler);
    return () => window.removeEventListener("exact-after-image-updated", handler);
  }, []);

  const currentAsset = PRODUCT_GALLERY_ASSETS[selectedAssetIndex];
  const activeSlotKey = ASSET_ID_TO_SLOT[currentAsset.id] || "hero-main";
  const isCustom = isCustomized(activeSlotKey);
  const hasError = imgErrors[currentAsset.id];
  const currentPathIdx = fallbackIndices[currentAsset.id] || 0;
  const rawSrc = currentAsset.fallbackPaths[Math.min(currentPathIdx, currentAsset.fallbackPaths.length - 1)];
  const currentSrc = isCustom
    ? getImageUrl(activeSlotKey)
    : (currentAsset.id === "kitchen-install" && customKitchenImg)
    ? customKitchenImg
    : rawSrc;

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlay || isHovered || isLightboxOpen) return;

    const interval = setInterval(() => {
      setSlideDirection(1);
      setSelectedAssetIndex((prev) => (prev + 1) % PRODUCT_GALLERY_ASSETS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, isLightboxOpen]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      } else if (isLightboxOpen) {
        if (e.key === "ArrowRight") {
          handleNext();
        } else if (e.key === "ArrowLeft") {
          handlePrev();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(-1);
    setSelectedAssetIndex((prev) => (prev === 0 ? PRODUCT_GALLERY_ASSETS.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(1);
    setSelectedAssetIndex((prev) => (prev + 1) % PRODUCT_GALLERY_ASSETS.length);
  };

  // Touch & Swipe gestures for mobile carousel
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    if (e.touches && e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      isSwipingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    // If horizontal swipe is more pronounced than vertical scroll
    if (Math.abs(deltaX) > 15 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHovered(false);
    if (touchStartXRef.current !== null && isSwipingRef.current) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const minSwipeDistance = 40;

      if (deltaX > minSwipeDistance) {
        // Swiped right -> go to previous photo
        handlePrev();
      } else if (deltaX < -minSwipeDistance) {
        // Swiped left -> go to next photo
        handleNext();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    // reset swiping flag on a tick so click handlers know if it was a swipe
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 50);
  };

  const handleSelectAsset = (idx: number) => {
    setSlideDirection(idx >= selectedAssetIndex ? 1 : -1);
    setSelectedAssetIndex(idx);
    Analytics.trackCTAClick(`Gallery: ${PRODUCT_GALLERY_ASSETS[idx].angleLabel}`, "#product-gallery-frame");
  };

  const handleImageError = (id: string, totalFallbacks: number) => {
    setFallbackIndices((prev) => {
      const nextIdx = (prev[id] || 0) + 1;
      if (nextIdx < totalFallbacks) {
        return { ...prev, [id]: nextIdx };
      }
      setImgErrors((errs) => ({ ...errs, [id]: true }));
      return prev;
    });
  };

  // Open Lightbox
  const openLightbox = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLightboxOpen(true);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    Analytics.trackCTAClick("Gallery Lightbox Zoom", "#product-lightbox-modal");
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(3, +(prev + 0.5).toFixed(1)));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(1, +(prev - 0.5).toFixed(1));
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Dragging while zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Simulator controls
  const handlePowerToggle = () => {
    if (isLocked) return;
    setPowerOn((prev) => !prev);
    setIsTimerMode(false);
  };

  const handleTimerToggle = () => {
    if (!powerOn || isLocked) return;
    setIsTimerMode((prev) => !prev);
  };

  const handleIncrease = () => {
    if (!powerOn || isLocked) return;
    if (isTimerMode) {
      setTimerMinutes((prev) => Math.min(180, prev + 5));
    } else {
      setWattage((prev) => Math.min(3000, prev + 200));
    }
  };

  const handleDecrease = () => {
    if (!powerOn || isLocked) return;
    if (isTimerMode) {
      setTimerMinutes((prev) => Math.max(1, prev - 5));
    } else {
      setWattage((prev) => Math.max(800, prev - 200));
    }
  };

  const handleLockToggle = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <div
      id="product-gallery-frame"
      className={`relative w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/60 ${className}`}
    >
      {/* 1. TOP HEADER & ANGLE BAR */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="truncate">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {currentAsset.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-semibold text-slate-500">
                Angle {selectedAssetIndex + 1} of {PRODUCT_GALLERY_ASSETS.length}
              </span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${currentAsset.badgeColor}`}>
                {currentAsset.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Hotspots, Auto-Slide & Zoom button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {currentAsset.hotspots && (
            <button
              type="button"
              onClick={() => setShowHotspots((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                showHotspots
                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
              title="Show interactive feature hotspots"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHotspots ? "Hide Pins" : "Key Details"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAutoPlay((prev) => !prev)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
              isAutoPlay
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
            title={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlay ? <Pause className="w-3 h-3 text-emerald-600" /> : <Play className="w-3 h-3 text-slate-500" />}
            <span className="hidden sm:inline">{isAutoPlay ? "Auto" : "Paused"}</span>
          </button>

          <button
            type="button"
            onClick={openLightbox}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold bg-[#0F172A] hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer"
            title="Inspect Close-Up Details in High Definition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Zoom</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN IMAGE DISPLAY STAGE */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          // If user was swiping, don't open the lightbox modal
          if (isSwipingRef.current) return;
          openLightbox(e);
        }}
        className="relative bg-slate-950 min-h-[320px] sm:min-h-[420px] flex items-center justify-center p-3 sm:p-6 overflow-hidden group select-none cursor-zoom-in touch-pan-y"
      >
        {/* Subtle radial warmth for glowing ceramic effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Previous and Next Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Angle"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="Previous Angle (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Angle"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="Next Angle (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Feature Tags */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#C5A059] via-[#E5C378] to-[#C5A059] text-slate-950 border border-white/40 shadow-[0_4px_15px_rgba(197,160,89,0.5)]">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950/20" />
            Premium Design
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-black/80 text-[#E5C378] border border-[#C5A059]/40 backdrop-blur-md shadow">
            <Timer className="w-3 h-3 text-[#E5C378]" />
            Digital Timer
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-black/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow">
            <Power className="w-3 h-3" />
            Automatic Off
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/80 text-white border border-white/20 backdrop-blur-md shadow">
            <Shield className="w-3 h-3 text-[#E5C378]" />
            Luxury Tempered Black Glass
          </span>
        </div>

        {/* Floating Bottom-Left Luxury Aesthetic Label */}
        <div className="hidden sm:flex absolute bottom-3.5 left-3.5 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-[#C5A059]/40 backdrop-blur-md shadow-xl pointer-events-none">
          <div className="w-6 h-6 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
          </div>
          <div className="text-left leading-tight">
            <span className="block text-[9px] font-mono uppercase tracking-widest text-[#E5C378] font-bold">
              MODERN AESTHETIC
            </span>
            <span className="block text-[11px] font-extrabold text-white">
              Mirror-Polished Luxury Finish
            </span>
          </div>
        </div>

        {/* Mobile Swipe Hint Badge & Click to Zoom Hint */}
        <div className="absolute bottom-4 right-3 z-20 flex items-center gap-1.5 pointer-events-none">
          <span className="sm:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow">
            ⇄ Swipe
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/75 text-slate-200 border border-white/20 backdrop-blur-md shadow">
            <Eye className="w-3 h-3 text-[#C5A059]" />
            Click to Enlarge
          </span>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          {PRODUCT_GALLERY_ASSETS.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAsset(dotIdx);
              }}
              aria-label={`Go to photo ${dotIdx + 1}`}
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                selectedAssetIndex === dotIdx
                  ? "w-5 h-2 bg-[#C5A059] shadow-sm"
                  : "w-2 h-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Active Stage Content (Image or Simulator) */}
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={currentAsset.id + "-" + currentSrc}
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection > 0 ? 40 : -40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: slideDirection > 0 ? -40 : 40, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center relative"
          >
            {currentAsset.id !== "interactive-sim" && !hasError ? (
              <div className="relative max-h-[380px] w-full flex items-center justify-center">
                <img
                  src={currentSrc}
                  alt={`${currentAsset.title} - ${alt}`}
                  loading={priority ? "eager" : "lazy"}
                  decoding={priority ? "sync" : "async"}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(currentAsset.id, currentAsset.fallbackPaths.length)}
                  className="max-h-[360px] sm:max-h-[380px] w-auto max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Hotspot Pins on the main image */}
                {showHotspots && currentAsset.hotspots?.map((pin) => (
                  <div
                    key={pin.id}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotId(activeHotspotId === pin.id ? null : pin.id);
                    }}
                  >
                    <button
                      type="button"
                      className="relative w-6 h-6 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-black text-xs shadow-lg hover:scale-125 transition-transform cursor-pointer ring-2 ring-white"
                      title={pin.label}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping absolute inset-2" />
                      <span>+</span>
                    </button>

                    {activeHotspotId === pin.id && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 w-56 p-2.5 rounded-xl bg-slate-900 text-white text-xs border border-[#C5A059] shadow-2xl animate-slide-in-up">
                        <strong className="text-[#E5C378] block font-bold mb-0.5">{pin.label}</strong>
                        <p className="text-slate-300 text-[11px] leading-tight">{pin.desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* High-Fidelity Interactive Burner & Touch Control Simulator */
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#0D0F14] border-2 border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-center"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 text-left">
                  <div>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Digital Control Simulator
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      Test Ceramic Zone, Timer & Emergency Off
                    </h4>
                  </div>
                  <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
                    Interactive
                  </span>
                </div>

                {/* Cooktop Layout Graphic */}
                <div className="grid grid-cols-3 items-center gap-3 sm:gap-4 mb-5">
                  {/* Left 2 Gas Burners */}
                  <div className="flex flex-col gap-4 items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-slate-700 bg-[#161922] flex items-center justify-center relative">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span className="absolute -bottom-1.5 text-[8px] font-bold text-slate-400 bg-slate-900 px-1 rounded">Gas</span>
                    </div>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-slate-700 bg-[#161922] flex items-center justify-center relative">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span className="absolute -bottom-1.5 text-[8px] font-bold text-slate-400 bg-slate-900 px-1 rounded">Gas</span>
                    </div>
                  </div>

                  {/* Center: Radiant Ceramic Electric Burner */}
                  <div className="flex flex-col items-center justify-center">
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 ${powerOn ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]" : "border-slate-800"} bg-[#12141C] flex items-center justify-center relative transition-all duration-300`}>
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 ${powerOn ? "border-red-600 animate-pulse bg-red-950/60" : "border-slate-800 bg-slate-900"} flex items-center justify-center`}>
                        <Zap className={`w-6 h-6 ${powerOn ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" : "text-slate-600"}`} />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-red-400 mt-1.5">
                      {powerOn ? "Ceramic Zone (Active)" : "Ceramic Zone (Off)"}
                    </span>
                  </div>

                  {/* Right 2 Gas Burners */}
                  <div className="flex flex-col gap-4 items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-slate-700 bg-[#161922] flex items-center justify-center relative">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span className="absolute -bottom-1.5 text-[8px] font-bold text-slate-400 bg-slate-900 px-1 rounded">Gas</span>
                    </div>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-slate-700 bg-[#161922] flex items-center justify-center relative">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span className="absolute -bottom-1.5 text-[8px] font-bold text-slate-400 bg-slate-900 px-1 rounded">Gas</span>
                    </div>
                  </div>
                </div>

                {/* Digital Touch Control Panel */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between px-3 text-xs mb-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleLockToggle}
                      className={`p-1.5 rounded border transition-colors cursor-pointer ${isLocked ? "bg-amber-500/20 border-amber-500 text-amber-400" : "border-slate-700 text-slate-400 hover:text-white"}`}
                      title="Child Safety Lock"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleTimerToggle}
                      className={`px-2 py-1 rounded font-bold border transition-colors cursor-pointer text-[10px] ${isTimerMode ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-slate-700 text-slate-400 hover:text-white"}`}
                    >
                      TIMER
                    </button>
                    <button
                      type="button"
                      onClick={handleDecrease}
                      className="px-2 py-1 rounded font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer"
                    >
                      -
                    </button>
                  </div>

                  {/* Red 7-Segment LED Display */}
                  <div className="bg-black border-2 border-red-950 px-3 py-1 rounded font-mono font-black text-red-500 tracking-widest text-sm shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
                    {!powerOn ? "OFF" : isLocked ? "LOC" : isTimerMode ? `${timerMinutes}m` : `${wattage}`}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="px-2 py-1 rounded font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={handlePowerToggle}
                      className={`p-1.5 rounded-full border transition-colors cursor-pointer ${powerOn ? "bg-red-500 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                      title="Master Automatic Off Key"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Tap <span className="text-white font-bold">TIMER</span> to test countdown or <span className="text-red-400 font-bold">POWER</span> to test 1-touch shutdown.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Auto-Slide Progress Bar */}
        {isAutoPlay && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
            <motion.div
              key={`progress-${selectedAssetIndex}-${isHovered}`}
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "0%" : "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-amber-400 via-[#C5A059] to-emerald-400"
            />
          </div>
        )}
      </div>

      {/* 3. THUMBNAIL PREVIEWS GALLERY STRIP (Requested feature) */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-[#8D6D27]" />
            <span>Select Angle to Inspect:</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {selectedAssetIndex + 1} / {PRODUCT_GALLERY_ASSETS.length} Angles
          </span>
        </div>

        {/* Scrollable / Responsive Thumbnail Previews Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRODUCT_GALLERY_ASSETS.map((asset, idx) => {
            const isSelected = selectedAssetIndex === idx;
            const thumbSrc = asset.fallbackPaths[0];

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleSelectAsset(idx)}
                className={`relative flex flex-col items-center rounded-xl p-1.5 text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "bg-white ring-2 ring-[#C5A059] shadow-md border-transparent scale-[1.02]"
                    : "bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                }`}
              >
                {/* Thumbnail Preview Image Container */}
                <div className="w-full aspect-[4/3] rounded-lg bg-slate-950 flex items-center justify-center overflow-hidden relative mb-1.5">
                  {asset.id !== "interactive-sim" ? (
                    <img
                      src={thumbSrc}
                      alt={asset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-red-400">
                      <Zap className="w-4 h-4 mb-0.5 animate-pulse" />
                      <span className="text-[8px] font-mono font-bold text-white">3000W</span>
                    </div>
                  )}

                  {/* Active Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-bold text-[9px] shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Caption */}
                <span className={`text-[10px] font-bold leading-tight truncate w-full text-center ${
                  isSelected ? "text-slate-900" : "text-slate-600"
                }`}>
                  {idx + 1}. {asset.angleLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ANGLE CAPTION & ENGINEERING CLOSE-UP BULLETS */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-slate-900 font-extrabold text-sm">
                {currentAsset.title}
              </strong>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              {currentAsset.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openLightbox}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#8D6D27] bg-[#C5A059]/15 hover:bg-[#C5A059]/25 border border-[#C5A059]/40 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Inspect Close-Up</span>
            </button>
          </div>
        </div>

        {/* Close-Up Technical Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-700">
          {currentAsset.closeUpNotes.map((note, nIdx) => (
            <div key={nIdx} className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FULL-SCREEN LIGHTBOX MODAL WITH ZOOM & PAN CONTROLS */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div
            id="product-lightbox-modal"
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-hidden"
            onClick={closeLightbox}
          >
            {/* Modal Header Bar */}
            <div
              className="bg-black/70 border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-white z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059] text-black">
                  Angle {selectedAssetIndex + 1}/{PRODUCT_GALLERY_ASSETS.length}
                </span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                    {currentAsset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Use mouse drag to pan when zoomed in. Click Escape or Close to exit.
                  </p>
                </div>
              </div>

              {/* Zoom Controls & Close Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/10 rounded-lg p-1 border border-white/15">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <span className="px-2 text-xs font-mono font-bold text-amber-300">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="p-1.5 rounded text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/15 border-l border-white/10 ml-1 cursor-pointer"
                    title="Reset Zoom (100%)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close Lightbox (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Stage: Interactive Pan & Zoom Area */}
            <div
              className="flex-1 relative flex items-center justify-center p-4 overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous & Next Floating Buttons in Modal */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 shadow-2xl transition-all cursor-pointer"
                title="Previous Angle"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 shadow-2xl transition-all cursor-pointer"
                title="Next Angle"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main Zoomable Image Canvas */}
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                  cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                }}
                className="transition-transform duration-100 ease-out max-w-full max-h-full flex items-center justify-center"
                onClick={() => {
                  if (zoomLevel === 1) handleZoomIn();
                }}
              >
                <img
                  src={currentSrc}
                  alt={currentAsset.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto max-w-[90vw] object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Modal Footer: Thumbnails Bar inside Lightbox for Rapid Switching */}
            <div
              className="bg-black/80 border-t border-white/10 px-4 py-3 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 overflow-x-auto pb-1">
                {PRODUCT_GALLERY_ASSETS.map((asset, idx) => {
                  const isSelected = selectedAssetIndex === idx;
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        handleSelectAsset(idx);
                        setZoomLevel(1);
                        setPanOffset({ x: 0, y: 0 });
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? "bg-[#C5A059] text-black ring-2 ring-white shadow-lg"
                          : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      <span>{idx + 1}. {asset.angleLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
