import fs from "fs";
import path from "path";
import sharp from "sharp";

async function generateDiagram() {
  const WIDTH = 1800;
  const HEIGHT = 1125; // 16:10 aspect ratio matching user diagram

  // Read base cooktop clean image
  const cooktopBuffer = fs.readFileSync("public/cooktop-clean.webp");

  // Resize cooktop photo to fit nicely in center-left area
  // Cooktop will be placed around x: 80, y: 190, width: 1100, height: 680
  const COOKTOP_W = 1080;
  const COOKTOP_H = 680;
  const resizedCooktop = await sharp(cooktopBuffer)
    .resize(COOKTOP_W, COOKTOP_H, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  // Define the SVG overlay with vector crispness
  const svgOverlay = `
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&amp;display=swap');
        text { font-family: 'Roboto', Arial, sans-serif; }
        .red-badge { fill: #E53935; }
        .dark-badge { fill: #111827; }
        .pin-circle { fill: #E53935; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        .pin-num { fill: #FFFFFF; font-size: 15px; font-weight: 800; text-anchor: middle; dominant-baseline: central; }
        .line-callout { stroke: #E53935; stroke-width: 2.2; stroke-dasharray: none; fill: none; }
        .dot-callout { fill: #E53935; }
      </style>
    </defs>

    <!-- White Canvas Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="#FFFFFF" />

    <!-- TOP HEADER -->
    <!-- Left: Red pill &amp; Subtitle -->
    <g transform="translate(60, 45)">
      <rect width="280" height="38" rx="8" fill="#E53935" />
      <text x="140" y="24" fill="#FFFFFF" font-size="16" font-weight="900" letter-spacing="1.5" text-anchor="middle">PRODUCT SKELETON LABEL</text>
      <text x="140" y="58" fill="#111827" font-size="14" font-weight="800" letter-spacing="5" text-anchor="middle">K N O W   Y O U R   C O O K T O P</text>
    </g>

    <!-- Right: Dark Pill -->
    <g transform="translate(${WIDTH - 460}, 45)">
      <rect width="400" height="52" rx="10" fill="#111827" />
      <text x="200" y="23" fill="#FACC15" font-size="16" font-weight="900" letter-spacing="1.2" text-anchor="middle">5-ZONE HYBRID COOKTOP</text>
      <text x="200" y="42" fill="#FFFFFF" font-size="13" font-weight="700" letter-spacing="0.5" text-anchor="middle">(4 GAS BURNERS + 1 ELECTRIC ZONE)</text>
    </g>

    <!-- CALLOUT PIN POINTERS &amp; LEADER LINES -->
    <!-- Pin 1: Left Rear Gas Burner -->
    <path d="M 230,220 L 320,290" class="line-callout" />
    <circle cx="320" cy="290" r="4.5" class="dot-callout" />
    <circle cx="230" cy="220" r="15" class="pin-circle" />
    <text x="230" y="220" class="pin-num">1</text>

    <!-- Pin 2: Left Front Gas Burner -->
    <path d="M 230,590 L 340,540" class="line-callout" />
    <circle cx="340" cy="540" r="4.5" class="dot-callout" />
    <circle cx="230" cy="590" r="15" class="pin-circle" />
    <text x="230" y="590" class="pin-num">2</text>

    <!-- Pin 3: Electric Heating Zone (Center) -->
    <path d="M 600,165 L 600,325" class="line-callout" />
    <circle cx="600" cy="325" r="4.5" class="dot-callout" />
    <circle cx="600" cy="165" r="15" class="pin-circle" />
    <text x="600" y="165" class="pin-num">3</text>

    <!-- Pin 4: Right Rear Gas Burner -->
    <path d="M 970,220 L 880,290" class="line-callout" />
    <circle cx="880" cy="290" r="4.5" class="dot-callout" />
    <circle cx="970" cy="220" r="15" class="pin-circle" />
    <text x="970" y="220" class="pin-num">4</text>

    <!-- Pin 5: Right Front Gas Burner -->
    <path d="M 970,590 L 860,540" class="line-callout" />
    <circle cx="860" cy="540" r="4.5" class="dot-callout" />
    <circle cx="970" cy="590" r="15" class="pin-circle" />
    <text x="970" y="590" class="pin-num">5</text>

    <!-- Pin 6: Child Lock -->
    <path d="M 440,730 L 495,655" class="line-callout" />
    <circle cx="495" cy="655" r="4" class="dot-callout" />
    <circle cx="440" cy="730" r="14" class="pin-circle" />
    <text x="440" y="730" class="pin-num">6</text>

    <!-- Pin 7: Timer Function -->
    <path d="M 490,750 L 525,655" class="line-callout" />
    <circle cx="525" cy="655" r="4" class="dot-callout" />
    <circle cx="490" cy="750" r="14" class="pin-circle" />
    <text x="490" y="750" class="pin-num">7</text>

    <!-- Pin 8: Power Reduce -->
    <path d="M 545,765 L 555,655" class="line-callout" />
    <circle cx="555" cy="655" r="4" class="dot-callout" />
    <circle cx="545" cy="765" r="14" class="pin-circle" />
    <text x="545" y="765" class="pin-num">8</text>

    <!-- Pin 9: Digital Display -->
    <path d="M 600,780 L 600,655" class="line-callout" />
    <circle cx="600" cy="655" r="4" class="dot-callout" />
    <circle cx="600" cy="780" r="14" class="pin-circle" />
    <text x="600" y="780" class="pin-num">9</text>

    <!-- Pin 10: Power Increase -->
    <path d="M 655,765 L 645,655" class="line-callout" />
    <circle cx="645" cy="655" r="4" class="dot-callout" />
    <circle cx="655" cy="765" r="14" class="pin-circle" />
    <text x="655" y="765" class="pin-num">10</text>

    <!-- Pin 11: Function Selection -->
    <path d="M 710,740 L 685,655" class="line-callout" />
    <circle cx="685" cy="655" r="4" class="dot-callout" />
    <circle cx="710" cy="740" r="14" class="pin-circle" />
    <text x="710" y="740" class="pin-num">11</text>

    <!-- Pin 12: Control Knobs (4 Gas Burners) -->
    <path d="M 780,810 L 730,735" class="line-callout" />
    <circle cx="730" cy="735" r="4" class="dot-callout" />
    <circle cx="780" cy="810" r="14" class="pin-circle" />
    <text x="780" y="810" class="pin-num">12</text>

    <!-- RIGHT SIDE: NUMBERED CALLOUT LIST CARD -->
    <g transform="translate(${WIDTH - 530}, 130)">
      <rect width="470" height="715" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.8" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.06))" />
      
      <!-- Card Items 1 to 12 -->
      ${[
        { num: 1, title: "Gas Burner 1 (Left Rear)", sub: "High-heat rapid cooking" },
        { num: 2, title: "Gas Burner 2 (Left Front)", sub: "Medium semi-rapid burner" },
        { num: 3, title: "Electric Heating Zone (Center)", sub: "2000W Radiant ceramic hotplate" },
        { num: 4, title: "Gas Burner 3 (Right Rear)", sub: "Medium semi-rapid burner" },
        { num: 5, title: "Gas Burner 4 (Right Front)", sub: "Auxiliary gentle simmer burner" },
        { num: 6, title: "Child Lock", sub: "Safety touch panel lock" },
        { num: 7, title: "Timer Function", sub: "Digital countdown auto-off" },
        { num: 8, title: "Power Reduce", sub: "Touch wattage decrease" },
        { num: 9, title: "Digital Display", sub: "Real-time LED power/timer readout" },
        { num: 10, title: "Power Increase", sub: "Touch wattage increase" },
        { num: 11, title: "Function Selection", sub: "Multi-mode heat settings" },
        { num: 12, title: "Control Knobs (4 Gas Burners)", sub: "Auto-ignition precision rotary dials" },
      ]
        .map((item, idx) => {
          const yPos = 46 + idx * 56;
          return `
          <g transform="translate(24, ${yPos})">
            <circle cx="16" cy="12" r="14" fill="#E53935" />
            <text x="16" y="12" fill="#FFFFFF" font-size="13" font-weight="800" text-anchor="middle" dominant-baseline="central">${item.num}</text>
            <text x="44" y="9" fill="#0F172A" font-size="15" font-weight="700">${item.title}</text>
            <text x="44" y="27" fill="#64748B" font-size="12" font-weight="500">${item.sub}</text>
          </g>
          ${idx < 11 ? `<line x1="24" y1="${yPos + 40}" x2="446" y2="${yPos + 40}" stroke="#F1F5F9" stroke-width="1" />` : ""}
          `;
        })
        .join("")}
    </g>

    <!-- BOTTOM ROW: FEATURES &amp; WHAT'S IN THE BOX -->
    <!-- Feature Pills -->
    <g transform="translate(60, 870)">
      <!-- 6 Feature Badges -->
      ${[
        { icon: "🔥", title: "4 GAS BURNERS", desc: "Fast &amp; Powerful Cooking" },
        { icon: "⚡", title: "1 ELECTRIC ZONE", desc: "Extra Cooking Flexibility" },
        { icon: "✨", title: "PREMIUM GLASS", desc: "Stylish &amp; Easy To Clean" },
        { icon: "📟", title: "DIGITAL DISPLAY", desc: "Simple &amp; Convenient" },
        { icon: "🛡️", title: "SAFETY FEATURES", desc: "Built for Peace of Mind" },
        { icon: "💎", title: "BUILT-IN DESIGN", desc: "Modern Luxury Kitchens" },
      ]
        .map((f, i) => {
          const x = i * 175;
          return `
          <g transform="translate(${x}, 0)">
            <rect width="165" height="110" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2" />
            <text x="82" y="38" font-size="24" text-anchor="middle">${f.icon}</text>
            <text x="82" y="68" fill="#0F172A" font-size="11.5" font-weight="800" text-anchor="middle">${f.title}</text>
            <text x="82" y="88" fill="#64748B" font-size="10" font-weight="600" text-anchor="middle">${f.desc}</text>
          </g>
          `;
        })
        .join("")}
    </g>

    <!-- What's In The Box Box -->
    <g transform="translate(1130, 870)">
      <rect width="320" height="110" rx="12" fill="#0F172A" />
      <text x="160" y="28" fill="#FACC15" font-size="12" font-weight="900" letter-spacing="1.5" text-anchor="middle">WHAT'S IN THE BOX?</text>
      
      <g transform="translate(25, 45)">
        <text x="0" y="16" fill="#FFFFFF" font-size="11.5" font-weight="700">📦 1x 5-Zone Hybrid Cooktop</text>
        <text x="0" y="36" fill="#FFFFFF" font-size="11.5" font-weight="700">📖 1x English User &amp; Safety Manual</text>
        <text x="0" y="56" fill="#FFFFFF" font-size="11.5" font-weight="700">🔩 1x Built-In Bracket &amp; Screw Kit</text>
      </g>
    </g>

    <!-- Brand Slogan on bottom right -->
    <g transform="translate(1480, 895)">
      <text x="130" y="42" fill="#E53935" font-size="18" font-weight="900" letter-spacing="2" text-anchor="middle">COOK MORE.</text>
      <text x="130" y="70" fill="#0F172A" font-size="18" font-weight="900" letter-spacing="2" text-anchor="middle">LIVE BETTER.</text>
    </g>

  </svg>
  `;

  // Composite SVG and Cooktop image together using Sharp
  const finalImage = await sharp(Buffer.from(svgOverlay))
    .composite([
      {
        input: resizedCooktop,
        top: 155,
        left: 60,
      },
      // Re-overlay SVG top elements (pins and lines) so they sit cleanly on top of the cooktop photo
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
    ])
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  // Write to public/Hd84f5f7654644224945b4ea055aa07a1Y.png
  fs.writeFileSync("public/Hd84f5f7654644224945b4ea055aa07a1Y.png", finalImage);
  fs.writeFileSync("public/assets/Hd84f5f7654644224945b4ea055aa07a1Y.png", finalImage);
  fs.writeFileSync("public/assets/cooktop-diagram.png", finalImage);
  fs.writeFileSync("public/cooktop-diagram.png", finalImage);

  console.log("Successfully generated diagram PNG! Size:", finalImage.length, "bytes");
}

generateDiagram().catch(console.error);
