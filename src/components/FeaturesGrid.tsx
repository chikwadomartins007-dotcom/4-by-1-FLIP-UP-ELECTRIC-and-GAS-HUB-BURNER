import React, { useState } from "react";
import {
  Timer,
  Power,
  Zap,
  Flame,
  Sparkles,
  PhoneCall,
  Ruler,
  CheckCircle2,
  Wrench,
  Layers,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { WHATSAPP_PHONE_DISPLAY, CALL_PHONE_TEL } from "../utils/whatsapp";

export const FeaturesGrid: React.FC = () => {
  const [unitMode, setUnitMode] = useState<"mm" | "cm" | "in">("mm");
  const [copiedSpecs, setCopiedSpecs] = useState<boolean>(false);

  const formatMeasure = (mmVal: number) => {
    if (unitMode === "cm") return `${(mmVal / 10).toFixed(1)} cm`;
    if (unitMode === "in") return `${(mmVal / 25.4).toFixed(1)}"`;
    return `${mmVal} mm`;
  };

  const handleCopyInstallerSpecs = () => {
    const specText = `MAX 5-Burner Built-In Cooktop Installation Specs:\n• Top Glass Surface: 900mm (W) × 510mm (D)\n• Countertop Aperture (Cutout Hole): 870mm (W) × 480mm (D)\n• Recessed Chassis Depth: 120mm\n• Electrical: Standard 220-240V (13A/15A wall socket)\n• Gas Connection: Standard Nigerian LPG hose & regulator`;
    navigator.clipboard.writeText(specText);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2500);
  };

  return (
    <section id="specs" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Technical Blueprint Photo */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            OFFICIAL DIMENSION BLUEPRINT &amp; CUTOUT SPECIFICATIONS
          </span>
          <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <img
              src="/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg"
              alt="Dimensions Spec Sheet 900x510mm"
              className="w-full h-full object-contain animate-zoom-in-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://sc04.alicdn.com/kf/Hfcba7190a6324ecf8c6f0db5852a902fC.jpg";
              }}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-medium">PANEL SIZE</span>
              <strong className="text-slate-900 font-bold">900 × 510 mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-medium">CUTOUT SIZE</span>
              <strong className="text-slate-900 font-bold">870 × 480 mm</strong>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-500 block font-medium">CARTON SIZE</span>
              <strong className="text-slate-900 font-bold">970 × 570 × 250 mm</strong>
            </div>
          </div>
        </div>

        {/* Section Heading matching reference typography with slide-in animation */}
        <div className="mb-6 text-center animate-slide-in-up">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#15803d] mb-1">
            PLUG &amp; COOK CONVENIENCE
          </h3>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
            EASY AND STRAIGHTFORWARD TO USE
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
            Everything is clearly labelled so anyone can easily use it on their own. You will also have the direct line of our customer care in case you need our help with anything.
          </p>
        </div>

        {/* Customer Care Box */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs max-w-lg mx-auto mb-8 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[11px] text-slate-500 block font-semibold">
              DIRECT CUSTOMER CARE HOTLINE
            </span>
            <a
              href={CALL_PHONE_TEL}
              className="font-heading font-bold text-base text-slate-900 hover:text-emerald-700 transition-colors"
            >
              {WHATSAPP_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* 6 Key Verified Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left mb-10">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 text-amber-700" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Digital Countdown Timer</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Program 1 to 99 minutes with automatic shutoff so your food never overcooks.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Power className="w-4 h-4 text-emerald-700" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Automatic Off Safety Key</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master 1-touch emergency kill switch plus child lock for total kitchen safety.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-red-600" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Central Ceramic Hotplate</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-intensity radiant ceramic plate that delivers instant, intense heat without gas.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="font-heading font-bold text-sm text-slate-900">Flip-Up Hinged Burners</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Burners tilt upward on articulated hinges for effortless 1-wipe cleanups.
            </p>
          </div>
        </div>

        {/* Dedicated Installation Requirements & Aperture Fit Guide */}
        <div
          id="installation-requirements"
          className="rounded-2xl bg-white border-2 border-slate-200 shadow-md overflow-hidden text-left"
        >
          {/* Header Bar */}
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] flex items-center justify-center shrink-0">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C378] font-bold block">
                  PRE-PURCHASE KITCHEN FIT CHECKLIST
                </span>
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white leading-tight">
                  Installation Requirements &amp; Standard Aperture Dimensions
                </h3>
              </div>
            </div>

            {/* Unit Switcher (mm / cm / inches) */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 self-start sm:self-auto">
              {(["mm", "cm", "in"] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setUnitMode(unit)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                    unitMode === unit
                      ? "bg-[#C5A059] text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {unit === "in" ? "Inches" : unit.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              Ensure a seamless drop-in fit before ordering. This cooktop uses the{" "}
              <strong className="text-slate-900">universal 90cm built-in aperture standard</strong>, making it compatible with new countertops or existing 4-burner/5-burner cabinet cutouts across Nigeria.
            </p>

            {/* Primary Aperture vs Top Glass Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* Card 1: Countertop Cutout Aperture (Most Critical) */}
              <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-[#C5A059]/50 relative">
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C5A059] text-slate-950 mb-1.5">
                  COUNTERTOP CUTOUT HOLE
                </span>
                <div className="font-mono font-black text-lg sm:text-xl text-slate-900">
                  {formatMeasure(870)} × {formatMeasure(480)}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">
                  Width × Depth (Aperture)
                </span>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  The hole cut into your granite, quartz, marble, or wood slab.
                </p>
              </div>

              {/* Card 2: Top Tempered Glass Surface */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-200 text-slate-700 mb-1.5">
                  TOP GLASS OVERHANG
                </span>
                <div className="font-mono font-black text-lg sm:text-xl text-slate-900">
                  {formatMeasure(900)} × {formatMeasure(510)}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">
                  Width × Depth (Top Plate)
                </span>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  Rests flush on top of your counter with a 15mm perimeter lip.
                </p>
              </div>

              {/* Card 3: Under-Counter Chassis Depth & Clearance */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-200 text-slate-700 mb-1.5">
                  CHASSIS DEPTH &amp; SPACE
                </span>
                <div className="font-mono font-black text-lg sm:text-xl text-slate-900">
                  {formatMeasure(120)} Depth
                </div>
                <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">
                  Min. 50mm Edge Clearance
                </span>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  Fits above standard under-counter kitchen drawers or cabinets.
                </p>
              </div>
            </div>

            {/* 4 Technical Installation Requirements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                    Compatible Countertop Surfaces
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Safe for Granite, Quartz, Marble, Terrazzo, Ceramic Tile, and Marine-Grade HDF/MDF Wooden Worktops (20mm–50mm slab thickness).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                    Electrical Supply (220V–240V AC)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Plugs into a standard Nigerian 13A or 15A 3-pin wall socket below or beside the cabinet to power the 3000W ceramic burner, timer &amp; auto-ignition.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                    LPG Gas Cylinder Connection
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Equipped with a 360° swivel brass L-nozzle compatible with standard low-pressure LPG hose &amp; regulator (12.5kg, 25kg, or 50kg cylinders).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                    Dual-Use: Built-In or Freestanding
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Includes 4 heavy-duty anti-slip rubber feet underneath so you can also use it directly on top of an existing counter without cutting a hole.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Installer Tip + Copy Specs Button */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-950 leading-snug">
                  <strong>Working with a carpenter or marble installer?</strong> Copy the exact aperture dimensions to send to them on WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyInstallerSpecs}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer shrink-0"
              >
                {copiedSpecs ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Specs Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Installer Specs</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

