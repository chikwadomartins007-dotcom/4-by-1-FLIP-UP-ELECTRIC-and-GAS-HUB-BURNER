import fs from "fs";
import path from "path";
import sharp from "sharp";

async function generateExactDiagram() {
  const WIDTH = 1800;
  const HEIGHT = 1200;

  // 1. Read base clean cooktop image and crop exactly to cooktop boundaries
  const cooktopBuffer = fs.readFileSync("public/cooktop-clean.webp");

  // Cooktop bounds in cooktop-clean.webp: minX: 79, maxX: 1535, minY: 396, maxY: 1220
  const COOKTOP_W = 1060;
  const COOKTOP_H = 600;
  const COOKTOP_LEFT = 175;
  const COOKTOP_TOP = 175;

  const croppedCooktop = await sharp(cooktopBuffer)
    .extract({ left: 79, top: 396, width: 1456, height: 824 })
    .resize(COOKTOP_W, COOKTOP_H, { fit: "fill" })
    .png()
    .toBuffer();

  // SVG overlay with transparent canvas background
  const svgOverlay = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&amp;display=swap');
        text { font-family: 'Roboto', -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
        .red-bg { fill: #E11D48; }
        .dark-card { fill: #181F2A; }
        .pin-c { fill: #E11D48; }
        .pin-t { fill: #FFFFFF; font-size: 16px; font-weight: 900; text-anchor: middle; dominant-baseline: central; }
        .callout-title { fill: #0F172A; font-size: 16px; font-weight: 800; }
        .callout-sub { fill: #475569; font-size: 14px; font-weight: 600; }
        .lead-line { stroke: #E11D48; stroke-width: 2.2; fill: none; }
        .lead-dot { fill: #E11D48; }
      </style>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.12"/>
      </filter>
    </defs>

    <!-- ==================== 1. TOP HEADER ==================== -->
    <!-- Top Left: Red Pill + Subtitle -->
    <g transform="translate(50, 26)">
      <rect width="440" height="56" rx="14" class="red-bg" />
      <text x="220" y="37" fill="#FFFFFF" font-size="25" font-weight="900" letter-spacing="1" text-anchor="middle">PRODUCT SKELETON LABEL</text>
      <text x="220" y="86" fill="#0F172A" font-size="16" font-weight="800" letter-spacing="6" text-anchor="middle">K N O W   Y O U R   C O O K T O P</text>
    </g>

    <!-- Top Right: Dark Header Box -->
    <g transform="translate(${WIDTH - 760}, 22)">
      <rect width="710" height="92" rx="16" class="dark-card" />
      <!-- Line 1: 5-ZONE (Yellow) + HYBRID COOKTOP (White) -->
      <text x="355" y="44" text-anchor="middle">
        <tspan fill="#FBBF24" font-size="32" font-weight="900" letter-spacing="1">5-ZONE </tspan>
        <tspan fill="#FFFFFF" font-size="32" font-weight="900" letter-spacing="1">HYBRID COOKTOP</tspan>
      </text>
      <!-- Subtitle pill: 4 GAS BURNERS + 1 ELECTRIC ZONE -->
      <g transform="translate(145, 56)">
        <rect width="420" height="26" rx="13" fill="#0B111A" stroke="#334155" stroke-width="1" />
        <text x="210" y="18" fill="#FFFFFF" font-size="13.5" font-weight="800" letter-spacing="1.2" text-anchor="middle">4 GAS BURNERS + 1 ELECTRIC ZONE</text>
      </g>
    </g>

    <!-- ==================== 2. COOKTOP CALLOUT LINES & LABELS ==================== -->
    <!-- Pin 1: Left Rear Gas Burner (Burner center at x: 380, y: 310) -->
    <g transform="translate(35, 230)">
      <circle cx="20" cy="20" r="18" class="pin-c" filter="url(#shadow)" />
      <text x="20" y="20" class="pin-t">1</text>
      <text x="46" y="16" class="callout-title">Gas Burner 1</text>
      <text x="46" y="34" class="callout-sub">(Left Rear)</text>
    </g>
    <path d="M 185,250 L 375,310" class="lead-line" />
    <circle cx="375" cy="310" r="5" class="lead-dot" />

    <!-- Pin 2: Left Front Gas Burner (Burner center at x: 380, y: 550) -->
    <g transform="translate(35, 540)">
      <circle cx="20" cy="20" r="18" class="pin-c" filter="url(#shadow)" />
      <text x="20" y="20" class="pin-t">2</text>
      <text x="46" y="16" class="callout-title">Gas Burner 2</text>
      <text x="46" y="34" class="callout-sub">(Left Front)</text>
    </g>
    <path d="M 185,560 L 375,550" class="lead-line" />
    <circle cx="375" cy="550" r="5" class="lead-dot" />

    <!-- Pin 3: Electric Heating Zone (Center at x: 705, y: 340) -->
    <g transform="translate(630, 120)">
      <circle cx="20" cy="20" r="18" class="pin-c" filter="url(#shadow)" />
      <text x="20" y="20" class="pin-t">3</text>
      <text x="48" y="16" class="callout-title">Electric Heating Zone</text>
      <text x="48" y="34" class="callout-sub">(Center)</text>
    </g>
    <path d="M 705,165 L 705,275" class="lead-line" />
    <circle cx="705" cy="275" r="5" class="lead-dot" />

    <!-- Pin 4: Right Rear Gas Burner (Burner center at x: 1030, y: 310) -->
    <g transform="translate(1245, 230)">
      <circle cx="20" cy="20" r="18" class="pin-c" filter="url(#shadow)" />
      <text x="20" y="20" class="pin-t">4</text>
      <text x="46" y="16" class="callout-title">Gas Burner 3</text>
      <text x="46" y="34" class="callout-sub">(Right Rear)</text>
    </g>
    <path d="M 1240,250 L 1035,310" class="lead-line" />
    <circle cx="1035" cy="310" r="5" class="lead-dot" />

    <!-- Pin 5: Right Front Gas Burner (Burner center at x: 1030, y: 550) -->
    <g transform="translate(1245, 540)">
      <circle cx="20" cy="20" r="18" class="pin-c" filter="url(#shadow)" />
      <text x="20" y="20" class="pin-t">5</text>
      <text x="46" y="16" class="callout-title">Gas Burner 4</text>
      <text x="46" y="34" class="callout-sub">(Right Front)</text>
    </g>
    <path d="M 1240,560 L 1035,550" class="lead-line" />
    <circle cx="1035" cy="550" r="5" class="lead-dot" />

    <!-- Touch Controls Badges (6 to 11) directly above the touch buttons:
         Centered at x: 705. Display 3000 is at x: 705.
         Buttons span from x: 575 to x: 835, around y: 565 -->
    <!-- 6: Child Lock -->
    <g transform="translate(565, 545)">
      <circle cx="12" cy="12" r="12" class="pin-c" />
      <text x="12" y="12" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle" dominant-baseline="central">6</text>
      <path d="M 12,24 L 12,32" stroke="#E11D48" stroke-width="1.8" />
      <polygon points="9,32 15,32 12,36" fill="#E11D48" />
    </g>

    <!-- 7: Timer Function -->
    <g transform="translate(615, 545)">
      <circle cx="12" cy="12" r="12" class="pin-c" />
      <text x="12" y="12" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle" dominant-baseline="central">7</text>
      <path d="M 12,24 L 12,32" stroke="#E11D48" stroke-width="1.8" />
      <polygon points="9,32 15,32 12,36" fill="#E11D48" />
    </g>

    <!-- 8: Power Reduce -->
    <g transform="translate(660, 545)">
      <circle cx="12" cy="12" r="12" class="pin-c" />
      <text x="12" y="12" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle" dominant-baseline="central">8</text>
      <path d="M 12,24 L 12,32" stroke="#E11D48" stroke-width="1.8" />
      <polygon points="9,32 15,32 12,36" fill="#E11D48" />
    </g>

    <!-- 9: Digital Display -->
    <g transform="translate(705, 545)">
      <circle cx="12" cy="12" r="12" class="pin-c" />
      <text x="12" y="12" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle" dominant-baseline="central">9</text>
      <path d="M 12,24 L 12,32" stroke="#E11D48" stroke-width="1.8" />
      <polygon points="9,32 15,32 12,36" fill="#E11D48" />
    </g>

    <!-- 10: Power Increase -->
    <g transform="translate(750, 545)">
      <circle cx="12" cy="12" r="12" class="pin-c" />
      <text x="12" y="12" fill="#FFFFFF" font-size="11" font-weight="900" text-anchor="middle" dominant-baseline="central">10</text>
      <path d="M 12,24 L 12,32" stroke="#E11D48" stroke-width="1.8" />
      <polygon points="9,32 15,32 12,36" fill="#E11D48" />
    </g>

    <!-- 11: Function Selection -->
    <g transform="translate(800, 545)">
      <circle cx="12" cy="12" r="12" class="pin-c" />
      <text x="12" y="12" fill="#FFFFFF" font-size="11" font-weight="900" text-anchor="middle" dominant-baseline="central">11</text>
      <path d="M 12,24 L 12,32" stroke="#E11D48" stroke-width="1.8" />
      <polygon points="9,32 15,32 12,36" fill="#E11D48" />
    </g>

    <!-- Pin 12: Rotary Knobs Bracket (Underneath 4 gas knobs) -->
    <!-- Knobs span from x: 500 to x: 910 at bottom of cooktop (y: 725) -->
    <path d="M 500,725 L 500,735 L 695,735 L 705,745 L 715,735 L 910,735 L 910,725" fill="none" stroke="#E11D48" stroke-width="2.5" />
    <g transform="translate(565, 755)">
      <circle cx="20" cy="16" r="18" class="pin-c" filter="url(#shadow)" />
      <text x="20" y="16" class="pin-t">12</text>
      <text x="48" y="22" class="callout-title" font-size="18">Control Knobs (4 Gas Burners)</text>
    </g>

    <!-- ==================== 3. RIGHT SIDE LEGEND CARD (1 to 12) ==================== -->
    <g transform="translate(1420, 135)" filter="url(#shadow)">
      <rect width="345" height="540" rx="18" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
      
      <!-- List Items 1 to 12 -->
      <!-- Item 1 -->
      <circle cx="36" cy="38" r="14" class="pin-c" />
      <text x="36" y="38" class="pin-t" font-size="13">1</text>
      <text x="62" y="43" fill="#1E293B" font-size="15" font-weight="700">Gas Burner 1 (Left Rear)</text>

      <!-- Item 2 -->
      <circle cx="36" cy="81" r="14" class="pin-c" />
      <text x="36" y="81" class="pin-t" font-size="13">2</text>
      <text x="62" y="86" fill="#1E293B" font-size="15" font-weight="700">Gas Burner 2 (Left Front)</text>

      <!-- Item 3 -->
      <circle cx="36" cy="124" r="14" class="pin-c" />
      <text x="36" y="124" class="pin-t" font-size="13">3</text>
      <text x="62" y="129" fill="#1E293B" font-size="15" font-weight="700">Electric Heating Zone (Center)</text>

      <!-- Item 4 -->
      <circle cx="36" cy="167" r="14" class="pin-c" />
      <text x="36" y="167" class="pin-t" font-size="13">4</text>
      <text x="62" y="172" fill="#1E293B" font-size="15" font-weight="700">Gas Burner 3 (Right Rear)</text>

      <!-- Item 5 -->
      <circle cx="36" cy="210" r="14" class="pin-c" />
      <text x="36" y="210" class="pin-t" font-size="13">5</text>
      <text x="62" y="215" fill="#1E293B" font-size="15" font-weight="700">Gas Burner 4 (Right Front)</text>

      <!-- Item 6 -->
      <circle cx="36" cy="253" r="14" class="pin-c" />
      <text x="36" y="253" class="pin-t" font-size="13">6</text>
      <text x="62" y="258" fill="#1E293B" font-size="15" font-weight="700">Child Lock (Lock)</text>

      <!-- Item 7 -->
      <circle cx="36" cy="296" r="14" class="pin-c" />
      <text x="36" y="296" class="pin-t" font-size="13">7</text>
      <text x="62" y="301" fill="#1E293B" font-size="15" font-weight="700">Timer Function (Timer)</text>

      <!-- Item 8 -->
      <circle cx="36" cy="339" r="14" class="pin-c" />
      <text x="36" y="339" class="pin-t" font-size="13">8</text>
      <text x="62" y="344" fill="#1E293B" font-size="15" font-weight="700">Power Reduce (Reduce)</text>

      <!-- Item 9 -->
      <circle cx="36" cy="382" r="14" class="pin-c" />
      <text x="36" y="382" class="pin-t" font-size="13">9</text>
      <text x="62" y="387" fill="#1E293B" font-size="15" font-weight="700">Digital Display</text>

      <!-- Item 10 -->
      <circle cx="36" cy="425" r="14" class="pin-c" />
      <text x="36" y="425" class="pin-t" font-size="11">10</text>
      <text x="62" y="430" fill="#1E293B" font-size="15" font-weight="700">Power Increase (Increase)</text>

      <!-- Item 11 -->
      <circle cx="36" cy="468" r="14" class="pin-c" />
      <text x="36" y="468" class="pin-t" font-size="11">11</text>
      <text x="62" y="473" fill="#1E293B" font-size="15" font-weight="700">Function Selection (Function)</text>

      <!-- Item 12 -->
      <circle cx="36" cy="511" r="14" class="pin-c" />
      <text x="36" y="511" class="pin-t" font-size="11">12</text>
      <text x="62" y="516" fill="#1E293B" font-size="15" font-weight="700">Control Knobs (4 Gas Burners)</text>
    </g>

    <!-- ==================== 4. HORIZONTAL SEPARATOR LINE ==================== -->
    <line x1="45" y1="800" x2="${WIDTH - 45}" y2="800" stroke="#E2E8F0" stroke-width="2" />

    <!-- ==================== 5. BOTTOM FEATURES (6 COLUMNS) ==================== -->
    <!-- Feature 1: 4 Gas Burners -->
    <g transform="translate(60, 815)">
      <circle cx="40" cy="40" r="30" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" />
      <!-- Flame icon -->
      <path d="M 40,22 C 43,29 50,35 50,42 C 50,48 45,53 40,53 C 35,53 30,48 30,42 C 30,37 35,31 40,22 Z" fill="#0F172A" />
      <text x="40" y="90" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">4 GAS</text>
      <text x="40" y="108" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">BURNERS</text>
      <text x="40" y="128" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">FAST &amp; POWERFUL</text>
      <text x="40" y="143" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">COOKING</text>
    </g>

    <!-- Feature 2: 1 Electric Heating Zone -->
    <g transform="translate(265, 815)">
      <circle cx="40" cy="40" r="30" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" />
      <!-- Lightning icon -->
      <polygon points="42,20 28,38 37,38 34,56 50,35 41,35" fill="#0F172A" />
      <text x="40" y="90" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">1 ELECTRIC</text>
      <text x="40" y="108" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">HEATING ZONE</text>
      <text x="40" y="128" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">EXTRA COOKING</text>
      <text x="40" y="143" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">FLEXIBILITY</text>
    </g>

    <!-- Feature 3: Premium Glass Surface -->
    <g transform="translate(470, 815)">
      <circle cx="40" cy="40" r="30" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" />
      <!-- Stacked layers icon -->
      <polygon points="40,24 55,32 40,40 25,32" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linejoin="round" />
      <path d="M 25,39 L 40,47 L 55,39" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linejoin="round" />
      <path d="M 25,46 L 40,54 L 55,46" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linejoin="round" />
      <text x="40" y="90" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">PREMIUM</text>
      <text x="40" y="108" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">GLASS SURFACE</text>
      <text x="40" y="128" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">STYLISH &amp;</text>
      <text x="40" y="143" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">EASY TO CLEAN</text>
    </g>

    <!-- Feature 4: Digital Display & Controls -->
    <g transform="translate(680, 815)">
      <circle cx="40" cy="40" r="30" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" />
      <!-- Touch Hand icon -->
      <path d="M 36,34 L 36,23 C 36,21 38,19 40,19 C 42,19 44,21 44,23 L 44,34 C 44,32 46,30 48,30 C 50,30 51,31 51,33 L 51,38 C 51,46 47,53 41,54 C 34,54 28,47 28,41 L 32,36 Z" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linejoin="round" />
      <path d="M 40,14 L 40,10 M 30,16 L 27,13 M 50,16 L 53,13" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round" />
      <text x="40" y="90" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">DIGITAL DISPLAY</text>
      <text x="40" y="108" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">&amp; CONTROLS</text>
      <text x="40" y="128" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">SIMPLE &amp;</text>
      <text x="40" y="143" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">CONVENIENT</text>
    </g>

    <!-- Feature 5: Safety Features -->
    <g transform="translate(890, 815)">
      <circle cx="40" cy="40" r="30" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" />
      <!-- Shield check icon -->
      <path d="M 40,21 L 52,27 C 52,39 48,48 40,53 C 32,48 28,39 28,27 Z" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linejoin="round" />
      <polyline points="35,36 38,39 46,31" fill="none" stroke="#0F172A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
      <text x="40" y="90" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">SAFETY</text>
      <text x="40" y="108" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">FEATURES</text>
      <text x="40" y="128" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">BUILT FOR</text>
      <text x="40" y="143" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">PEACE OF MIND</text>
    </g>

    <!-- Feature 6: Built-in Design -->
    <g transform="translate(1095, 815)">
      <circle cx="40" cy="40" r="30" fill="#F8FAFC" stroke="#0F172A" stroke-width="2.5" />
      <!-- Built-in gear / hob in countertop icon -->
      <circle cx="40" cy="38" r="9" fill="none" stroke="#0F172A" stroke-width="2.4" />
      <path d="M 40,22 L 40,26 M 40,50 L 40,54 M 24,38 L 28,38 M 52,38 L 56,38 M 28,27 L 31,30 M 49,46 L 52,49 M 28,49 L 31,46 M 49,30 L 52,27" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round" />
      <text x="40" y="90" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">BUILT-IN</text>
      <text x="40" y="108" fill="#0F172A" font-size="16" font-weight="900" text-anchor="middle">DESIGN</text>
      <text x="40" y="128" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">PERFECT FOR</text>
      <text x="40" y="143" fill="#64748B" font-size="12" font-weight="700" text-anchor="middle">MODERN KITCHENS</text>
    </g>

    <!-- ==================== 6. WHAT'S IN THE BOX? ==================== -->
    <g transform="translate(1295, 808)">
      <!-- Outer Border Card -->
      <rect width="465" height="152" rx="12" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.8" />
      <!-- Top Dark Header -->
      <path d="M 0,12 Q 0,0 12,0 L 453,0 Q 465,0 465,12 L 465,36 L 0,36 Z" fill="#334155" />
      <text x="232" y="24" fill="#FFFFFF" font-size="15" font-weight="800" letter-spacing="1.2" text-anchor="middle">WHAT’S IN THE BOX?</text>

      <!-- 3 Items Inside Box -->
      <!-- 1: Cooktop -->
      <g transform="translate(25, 56)">
        <rect width="90" height="52" rx="4" fill="none" stroke="#0F172A" stroke-width="2" />
        <circle cx="26" cy="20" r="7" fill="none" stroke="#0F172A" stroke-width="1.6" />
        <circle cx="64" cy="20" r="7" fill="none" stroke="#0F172A" stroke-width="1.6" />
        <circle cx="45" cy="26" r="9" fill="none" stroke="#0F172A" stroke-width="1.6" />
        <circle cx="26" cy="38" r="7" fill="none" stroke="#0F172A" stroke-width="1.6" />
        <circle cx="64" cy="38" r="7" fill="none" stroke="#0F172A" stroke-width="1.6" />
        <text x="45" y="76" fill="#0F172A" font-size="13" font-weight="800" text-anchor="middle">Cooktop</text>
      </g>

      <!-- 2: User Manual -->
      <g transform="translate(180, 56)">
        <rect width="45" height="52" rx="3" fill="none" stroke="#0F172A" stroke-width="2" />
        <line x1="8" y1="12" x2="37" y2="12" stroke="#0F172A" stroke-width="2" />
        <line x1="8" y1="20" x2="37" y2="20" stroke="#0F172A" stroke-width="2" />
        <line x1="8" y1="28" x2="37" y2="28" stroke="#0F172A" stroke-width="2" />
        <line x1="8" y1="36" x2="25" y2="36" stroke="#0F172A" stroke-width="2" />
        <text x="22" y="76" fill="#0F172A" font-size="13" font-weight="800" text-anchor="middle">User Manual</text>
      </g>

      <!-- 3: Installation Kit -->
      <g transform="translate(305, 56)">
        <!-- Bracket -->
        <path d="M 20,10 L 10,10 L 10,40 L 20,40" fill="none" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" />
        <!-- Two screws -->
        <line x1="38" y1="12" x2="38" y2="38" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
        <line x1="33" y1="12" x2="43" y2="12" stroke="#0F172A" stroke-width="3" stroke-linecap="round" />
        <line x1="52" y1="12" x2="52" y2="38" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round" />
        <line x1="47" y1="12" x2="57" y2="12" stroke="#0F172A" stroke-width="3" stroke-linecap="round" />
        <text x="40" y="74" fill="#0F172A" font-size="13" font-weight="800" text-anchor="middle">Installation Kit</text>
        <text x="40" y="88" fill="#64748B" font-size="11" font-weight="600" text-anchor="middle">(Brackets &amp; Screws)</text>
      </g>
    </g>

    <!-- ==================== 7. FOOTER TAGLINE ==================== -->
    <text x="${WIDTH / 2}" y="1175" fill="#64748B" font-size="16" font-weight="700" letter-spacing="8" text-anchor="middle">C O O K   M O R E .   L I V E   B E T T E R .</text>

  </svg>
  `;

  // Step 1: Base white canvas with cropped cooktop, overlaid with SVG annotations
  const baseWithCooktop = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: croppedCooktop,
        top: COOKTOP_TOP,
        left: COOKTOP_LEFT,
      },
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 100, compressionLevel: 8 })
    .toBuffer();

  // Write the resulting high-res PNG to all target file locations
  const targets = [
    "public/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    "public/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    "public/cooktop-diagram.png",
    "public/assets/cooktop-diagram.png",
    "dist/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    "dist/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png",
    "dist/cooktop-diagram.png",
    "dist/assets/cooktop-diagram.png",
  ];

  for (const target of targets) {
    const dir = path.dirname(target);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(target, baseWithCooktop);
    console.log(`Saved: ${target}`);
  }

  console.log("Successfully generated high-fidelity product skeleton image!");
}

generateExactDiagram().catch(console.error);
