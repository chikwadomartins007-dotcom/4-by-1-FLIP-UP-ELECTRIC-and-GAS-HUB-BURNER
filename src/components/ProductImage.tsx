import React, { useState, useEffect } from "react";
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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

interface ProductImageProps {
  className?: string;
  alt?: string;
  priority?: boolean;
}

interface ProductAsset {
  id: string;
  title: string;
  tag: string;
  filename: string;
  fallbackPaths: string[];
  description: string;
}

const PRODUCT_ASSETS: ProductAsset[] = [
  {
    id: "main-top",
    title: "5-Zone Hybrid Cooktop (Skeleton Blueprint)",
    tag: "Primary Diagram",
    filename: "Hd84f5f7654644224945b4ea055aa07a1Y.png",
    fallbackPaths: [
      "/Hd84f5f7654644224945b4ea055aa07a1Y.png",
      "/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png",
      "/cooktop-clean.webp",
    ],
    description: "4 Gas Burners + 1 Central Radiant Ceramic Electric Burner with Digital Timer & Touch Controls on Deep Black Glass",
  },
  {
    id: "live-unit",
    title: "Physical Showroom Unit (2000W LED & RIDA Logo)",
    tag: "Live Model",
    filename: "H6d042f563b4c47b08ba59b298031b8c1A.jpg",
    fallbackPaths: [
      "/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
      "/assets/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
      "https://sc04.alicdn.com/kf/H6d042f563b4c47b08ba59b298031b8c1A.jpg",
    ],
    description: "Authentic physical unit featuring central glowing radiant zone, 2000W digital display, and robust rotary control knobs",
  },
  {
    id: "hinged-burner",
    title: "Innovative Flip-Up Hinged Burners",
    tag: "Easy-Clean Detail",
    filename: "H4183961f34a64d47a5f116fa6bfddf7eE.png",
    fallbackPaths: [
      "/H4183961f34a64d47a5f116fa6bfddf7eE.png",
      "/assets/H4183961f34a64d47a5f116fa6bfddf7eE.png",
      "https://sc04.alicdn.com/kf/H4183961f34a64d47a5f116fa6bfddf7eE.png",
    ],
    description: "Heavy-duty dual-hinge design allows burners to tilt upward for effortless 1-wipe cleaning of spills underneath",
  },
  {
    id: "dimensions-spec",
    title: "Official Dimensions & Cutout Spec Sheet",
    tag: "Technical Blueprint",
    filename: "Hfcba7190a6324ecf8c6f0db5852a902fC.jpg",
    fallbackPaths: [
      "/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg",
      "/assets/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg",
      "https://sc04.alicdn.com/kf/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg",
    ],
    description: "Panel: 900 × 510mm • Cutout: 870 × 480mm • Package: 970 × 570 × 250mm",
  },
  {
    id: "kitchen-install",
    title: "Real Kitchen Countertop Installation",
    tag: "Built-In Finish",
    filename: "images.jpeg",
    fallbackPaths: [
      "/images.jpeg",
      "/assets/images.jpeg",
      "/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    ],
    description: "Flush built-in recessed installation on white quartz countertop matching contemporary luxury kitchen cabinetry",
  },
];

export const ProductImage: React.FC<ProductImageProps> = ({
  className = "",
  alt = "5-Burner Built-In Gas & Electric Cooktop with Black Glass, Timer, and Automatic Off Key",
  priority = false,
}) => {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [fallbackIndices, setFallbackIndices] = useState<Record<string, number>>({});

  // Auto-slide state
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<number>(1); // 1 for next, -1 for prev

  // Interactive Digital Burner Simulator States (Demonstrating Timer & Automatic Off Key)
  const [powerOn, setPowerOn] = useState<boolean>(true);
  const [wattage, setWattage] = useState<number>(3000);
  const [timerMinutes, setTimerMinutes] = useState<number>(30);
  const [isTimerMode, setIsTimerMode] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const currentAsset = PRODUCT_ASSETS[selectedAssetIndex];
  const hasError = imgErrors[currentAsset.id];
  const currentPathIdx = fallbackIndices[currentAsset.id] || 0;
  const currentSrc = currentAsset.fallbackPaths[Math.min(currentPathIdx, currentAsset.fallbackPaths.length - 1)];

  // Continuous auto-slide timer (cycles every 4 seconds unless hovered or paused)
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    const interval = setInterval(() => {
      setSlideDirection(1);
      setSelectedAssetIndex((prev) => (prev + 1) % PRODUCT_ASSETS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(-1);
    setSelectedAssetIndex((prev) => (prev === 0 ? PRODUCT_ASSETS.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(1);
    setSelectedAssetIndex((prev) => (prev + 1) % PRODUCT_ASSETS.length);
  };

  const handleSelectAsset = (idx: number) => {
    setSlideDirection(idx >= selectedAssetIndex ? 1 : -1);
    setSelectedAssetIndex(idx);
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

  // Touch control interactions
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
      id="product-display-frame"
      className={`relative w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/60 ${className}`}
    >
      {/* Top Header Strip with View Selector Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoPlay((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
              isAutoPlay
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
            }`}
            title={isAutoPlay ? "Click to pause auto-slide" : "Click to resume auto-slide"}
          >
            <span className={`w-2 h-2 rounded-full ${isAutoPlay ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span>{isAutoPlay ? "Auto-Slide ON" : "Auto-Slide Paused"}</span>
          </button>
          <span className="text-xs font-bold text-slate-800 tracking-wide">
            {currentAsset.title}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5A059]/15 text-[#8D6D27] border border-[#C5A059]/30">
            {currentAsset.tag}
          </span>
        </div>

        {/* Multi-Angle Image Navigation Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {PRODUCT_ASSETS.map((asset, idx) => (
            <button
              key={asset.id}
              onClick={() => handleSelectAsset(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedAssetIndex === idx
                  ? "bg-[#0F172A] text-white shadow-sm ring-1 ring-slate-800"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {idx === 0
                ? "1. Studio Top"
                : idx === 1
                ? "2. Live Unit"
                : idx === 2
                ? "3. Flip Burner"
                : idx === 3
                ? "4. Blueprint Specs"
                : "5. Countertop"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Image Display Area */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="relative bg-slate-950 min-h-[340px] sm:min-h-[440px] flex items-center justify-center p-4 sm:p-8 overflow-hidden group select-none"
      >
        {/* Subtle radial glow representing the central electric burner */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Previous and Next Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Feature Badges floating on image */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-[#E5C378] border border-[#C5A059]/40 backdrop-blur-md shadow">
            <Timer className="w-3.5 h-3.5 text-[#E5C378]" />
            Digital Timer
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow">
            <Power className="w-3.5 h-3.5" />
            Automatic Off Key
          </span>
        </div>

        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/80 text-white border border-white/20 backdrop-blur-md shadow">
            <Shield className="w-3.5 h-3.5 text-slate-300" />
            Tempered Black Glass
          </span>
        </div>

        {/* Direct Image Rendering with AnimatePresence slide transition */}
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={currentAsset.id + "-" + currentSrc}
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection > 0 ? 50 : -50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: slideDirection > 0 ? -50 : 50, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex items-center justify-center"
          >
            {!hasError ? (
              <img
                src={currentSrc}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                onError={() => handleImageError(currentAsset.id, currentAsset.fallbackPaths.length)}
                className="max-h-[380px] w-auto max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-[1.02]"
              />
            ) : (
          /* High-Fidelity Technical Visualization of the exact product view */
          <div className="w-full max-w-2xl py-4 flex flex-col items-center justify-center text-center">
            {selectedAssetIndex === 0 ? (
              /* View 1: Top-down Cooktop with Glowing Ceramic Zone & Controls */
              <div className="w-full bg-[#0D0F14] border-2 border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative">
                <div className="grid grid-cols-3 items-center gap-4 sm:gap-6 mb-6">
                  {/* Left 2 Gas Burners */}
                  <div className="flex flex-col gap-6 items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-600 bg-[#161922] flex items-center justify-center shadow-inner relative">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="absolute -bottom-2 text-[9px] font-bold text-slate-400 bg-slate-900 px-1.5 rounded">Gas</span>
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-600 bg-[#161922] flex items-center justify-center shadow-inner relative">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="absolute -bottom-2 text-[9px] font-bold text-slate-400 bg-slate-900 px-1.5 rounded">Gas</span>
                    </div>
                  </div>

                  {/* Center: Radiant Ceramic Electric Burner with Red Coils */}
                  <div className="flex flex-col items-center justify-center">
                    <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 ${powerOn ? "border-red-500/80 shadow-[0_0_35px_rgba(239,68,68,0.4)]" : "border-slate-700"} bg-[#12141C] flex flex-col items-center justify-center relative transition-all duration-300`}>
                      {/* Concentric red ceramic heating rings */}
                      <div className={`w-20 h-20 sm:w-26 sm:h-26 rounded-full border-2 ${powerOn ? "border-red-600 animate-pulse bg-gradient-to-br from-red-600/30 via-red-900/40 to-black" : "border-slate-800 bg-slate-900"} flex items-center justify-center`}>
                        <Zap className={`w-8 h-8 ${powerOn ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" : "text-slate-600"}`} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-red-400 mt-2">
                      {powerOn ? "Electric Ceramic Zone (Active)" : "Electric Zone (Off)"}
                    </span>
                  </div>

                  {/* Right 2 Gas Burners */}
                  <div className="flex flex-col gap-6 items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-600 bg-[#161922] flex items-center justify-center shadow-inner relative">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="absolute -bottom-2 text-[9px] font-bold text-slate-400 bg-slate-900 px-1.5 rounded">Gas</span>
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-600 bg-[#161922] flex items-center justify-center shadow-inner relative">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="absolute -bottom-2 text-[9px] font-bold text-slate-400 bg-slate-900 px-1.5 rounded">Gas</span>
                    </div>
                  </div>
                </div>

                {/* Digital Touch Control Panel matching user product */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 max-w-md mx-auto mb-4 flex items-center justify-between px-4 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLockToggle}
                      className={`p-1.5 rounded border transition-colors ${isLocked ? "bg-amber-500/20 border-amber-500 text-amber-400" : "border-slate-700 text-slate-400"}`}
                      title="Child Safety Lock"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleTimerToggle}
                      className={`px-2 py-1 rounded font-bold border transition-colors ${isTimerMode ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-slate-700 text-slate-400"}`}
                      title="Digital Timer"
                    >
                      TIMER
                    </button>
                    <button
                      onClick={handleDecrease}
                      className="px-2 py-1 rounded font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                    >
                      -
                    </button>
                  </div>

                  {/* Red 7-Segment LED Display */}
                  <div className="bg-black border-2 border-red-950 px-3 py-1 rounded font-mono font-black text-red-500 tracking-widest text-sm shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
                    {!powerOn ? "OFF" : isLocked ? "LOC" : isTimerMode ? `${timerMinutes}m` : `${wattage}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleIncrease}
                      className="px-2 py-1 rounded font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                    >
                      +
                    </button>
                    <button
                      onClick={handlePowerToggle}
                      className={`p-1.5 rounded-full border transition-colors ${powerOn ? "bg-red-500 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                      title="Automatic Off / Master Power Key"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4 Rotary Gas Knobs */}
                <div className="flex justify-center gap-5 pt-2 border-t border-slate-800">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 border border-slate-500 shadow flex items-center justify-center">
                        <div className="w-0.5 h-3 bg-red-500 rounded-full" />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">OFF</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedAssetIndex === 1 ? (
              /* View 2: Kitchen Countertop Installation */
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white max-w-lg text-left">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                  <Check className="w-4 h-4" />
                  <span>Real Countertop Fitment (From images.jpeg)</span>
                </div>
                <h4 className="font-heading font-extrabold text-base mb-2">
                  Seamless Built-In Countertop Integration
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Recesses perfectly flush into granite, quartz, or marble countertops. The 900 × 510mm tempered glass surface sits level with your workspace, transforming cooking into an effortless luxury experience.
                </p>
                <div className="bg-black/50 rounded-lg p-3 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <p>• <strong>Top Glass:</strong> 900mm Width × 510mm Depth</p>
                  <p>• <strong>Cutout Required:</strong> 870mm Width × 480mm Depth</p>
                  <p>• <strong>Edge Profile:</strong> Polished bevelled safety glass edge</p>
                </div>
              </div>
            ) : selectedAssetIndex === 2 ? (
              /* View 3: Hinged Burner Easy-Clean Mechanism */
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white max-w-lg text-left">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Innovative Burner Hinge (From H4183961f34a64d47a5f116fa6bfddf7eE.png)</span>
                </div>
                <h4 className="font-heading font-extrabold text-base mb-2">
                  Flip-Up Burners for 100% Spill Access
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Never scrub around tight burner bases again. The entire heavy-duty burner and pan support lifts upward on an engineered dual hinge, allowing you to wipe boiled-over soup or oil in 2 seconds.
                </p>
                <div className="bg-black/50 rounded-lg p-3 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <p>• <strong>Hinge:</strong> Cast metal articulated tilt hinge</p>
                  <p>• <strong>Nozzles:</strong> Solid dual brass gas injectors</p>
                  <p>• <strong>Cleaning:</strong> Flat tempered glass cleans with one damp microfiber wipe</p>
                </div>
              </div>
            ) : (
              /* View 4: Dimensions & Cutout Specifications */
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white max-w-lg text-left">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
                  <Maximize2 className="w-4 h-4" />
                  <span>Verified Blueprint (From Hfcba7190a6324ecf8c6f0db5852a902fC.jpg)</span>
                </div>
                <h4 className="font-heading font-extrabold text-base mb-3">
                  Combined Gas-Ceramic Hob Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="bg-black/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Panel Dimensions</span>
                    <strong className="text-white text-sm">900 × 510 mm</strong>
                  </div>
                  <div className="bg-black/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Cutout Dimensions</span>
                    <strong className="text-emerald-400 text-sm">870 × 480 mm</strong>
                  </div>
                  <div className="col-span-2 bg-black/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Package Dimensions</span>
                    <strong className="text-white text-sm">970 × 570 × 250 mm</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Fits standard 90cm kitchen cabinets across Nigeria. Compatible with marble, granite, quartz, Corian, and tiled surfaces.
                </p>
              </div>
            )}
          </div>
        )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Floating Auto-slide Control Bar */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-white/20 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => setIsAutoPlay((prev) => !prev)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title={isAutoPlay ? "Pause Auto-Slide" : "Resume Auto-Slide"}
            aria-label={isAutoPlay ? "Pause Auto-Slide" : "Resume Auto-Slide"}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <span className="w-px h-3 bg-white/20" />

          {/* Slide indicator dots */}
          <div className="flex items-center gap-1.5">
            {PRODUCT_ASSETS.map((asset, idx) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleSelectAsset(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  selectedAssetIndex === idx
                    ? "w-6 h-2 bg-[#E5C378] shadow-xs"
                    : "w-2 h-2 bg-white/40 hover:bg-white/75"
                }`}
                title={asset.title}
              />
            ))}
          </div>

          <span className="text-[10px] font-mono text-slate-300 pl-1 font-bold">
            {selectedAssetIndex + 1}/{PRODUCT_ASSETS.length}
          </span>
        </div>

        {/* Auto-Slide Progress Bar line at the bottom */}
        {isAutoPlay && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
            <motion.div
              key={`progress-${selectedAssetIndex}-${isHovered}`}
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "0%" : "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-full bg-gradient-to-r from-amber-400 via-[#C5A059] to-emerald-400"
            />
          </div>
        )}
      </div>

      {/* Caption Bar with Information & Feature Badges */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-slate-900 font-bold block sm:inline">
              {currentAsset.title}:
            </strong>{" "}
            <span className="text-slate-600">{currentAsset.description}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8D6D27] bg-[#C5A059]/15 px-2.5 py-1 rounded-full border border-[#C5A059]/30">
              <Timer className="w-3 h-3" />
              Digital Timer
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Power className="w-3 h-3" />
              Automatic Off Key
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
