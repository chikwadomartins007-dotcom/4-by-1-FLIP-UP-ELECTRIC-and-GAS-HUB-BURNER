const fs = require("fs");
const content = fs.readFileSync("/tmp/ref_page.html", "utf8");

// Google fonts
const fontMatches = content.match(/fonts\.googleapis\.com\/css[^\"]+/g) || [];
console.log("GOOGLE FONTS:", [...new Set(fontMatches)]);

// Find CSS font-family
const ffMatches = content.match(/font-family:[^;\"\}]+/gi) || [];
console.log("FONT FAMILIES:", [...new Set(ffMatches.map(s => s.replace(/font-family:\s*/i, "").trim()))].slice(0, 20));

// Find background-colors
const bgMatches = content.match(/background(?:-color)?:\s*([^;\"\}]+)/gi) || [];
console.log("BACKGROUNDS:", [...new Set(bgMatches.map(s => s.trim()))].slice(0, 25));

// Find text colors
const colorMatches = content.match(/color:\s*([^;\"\}]+)/gi) || [];
console.log("COLORS:", [...new Set(colorMatches.map(s => s.trim()))].slice(0, 25));

// Find video tags
const videos = content.match(/<video[\s\S]*?<\/video>|<iframe[\s\S]*?<\/iframe>|<div[^>]*class="[^"]*video[^"]*"[\s\S]*?<\/div>/gi) || [];
console.log("VIDEOS:", videos.slice(0, 5));

// Find youtube or vimeo or mp4
const videoSources = content.match(/https?:\/\/[^\s"'<>]+\.(?:mp4|webm|m4v)|https?:\/\/(?:www\.)?(?:youtube\.com|vimeo\.com|player\.vimeo\.com)[^\s"'<>]+/gi) || [];
console.log("VIDEO SOURCES:", [...new Set(videoSources)]);

// Find image src
const imgSources = content.match(/<img[^>]+src=[\"\']([^\"\']+)[\"\']/gi) || [];
console.log("IMAGE COUNT:", imgSources.length);
console.log("SAMPLE IMAGES:", imgSources.slice(0, 10));

// Find major headings
const headings = content.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi) || [];
console.log("HEADINGS COUNT:", headings.length);
console.log("SAMPLE HEADINGS:");
headings.slice(0, 15).forEach(h => {
  const clean = h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  console.log(" -", clean.slice(0, 120));
});

// Check buttons
const buttons = content.match(/<(?:a|button)[^>]*class="[^"]*(?:btn|button|tve-btn)[^"]*"[^>]*>([\s\S]*?)<\/(?:a|button)>/gi) || [];
console.log("BUTTONS:", buttons.slice(0, 6).map(b => b.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));
