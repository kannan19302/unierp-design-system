#!/usr/bin/env node
/**
 * check-platform-accents.mjs — DL 2.0 platform accent contrast gate.
 *
 * Verifies that all 8 platform accents meet WCAG 2.2 AA (4.5:1 for normal text / 3:1 for graphical UI elements)
 * against their intended surface backgrounds in both light (Meridian) and dark (Meridian Dark) modes.
 */

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (clean.length === 6) {
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  if (clean.length === 3) {
    return [
      ((num >> 8) & 15) * 17,
      ((num >> 4) & 15) * 17,
      (num & 15) * 17,
    ];
  }
  throw new Error(`Invalid hex: ${hex}`);
}

function relativeLuminance([r, g, b]) {
  const sRGB = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(hex1, hex2) {
  const lum1 = relativeLuminance(hexToRgb(hex1));
  const lum2 = relativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const LIGHT_SURFACE = "#f7f6f4";
const DARK_SURFACE = "#1c2023";

const ACCENTS = [
  { platform: "developer", light: "#6d28d9", dark: "#a78bfa" },
  { platform: "apps", light: "#047857", dark: "#34d399" },
  { platform: "tenant-admin", light: "#1d4ed8", dark: "#60a5fa" },
  { platform: "platform-admin", light: "#7e22ce", dark: "#c084fc" },
  { platform: "ops", light: "#c2410c", dark: "#fb923c" },
  { platform: "marketing", light: "#0f766e", dark: "#2dd4bf" },
  { platform: "marketplace", light: "#5b21b6", dark: "#a78bfa" },
  { platform: "website", light: "#4338ca", dark: "#818cf8" },
];

let failed = false;

console.log("Checking platform accent contrast ratios (WCAG AA >= 4.5:1)...");

for (const { platform, light, dark } of ACCENTS) {
  const ratioLight = contrastRatio(light, LIGHT_SURFACE);
  const ratioDark = contrastRatio(dark, DARK_SURFACE);

  if (ratioLight < 4.5) {
    console.error(`  FAIL  [${platform}] Light accent ${light} on ${LIGHT_SURFACE} is ${ratioLight.toFixed(2)}:1 (minimum 4.5:1)`);
    failed = true;
  } else {
    console.log(`  ok    [${platform}] Light accent ${light} -> ${ratioLight.toFixed(2)}:1`);
  }

  if (ratioDark < 4.5) {
    console.error(`  FAIL  [${platform}] Dark accent ${dark} on ${DARK_SURFACE} is ${ratioDark.toFixed(2)}:1 (minimum 4.5:1)`);
    failed = true;
  } else {
    console.log(`  ok    [${platform}] Dark accent ${dark} -> ${ratioDark.toFixed(2)}:1`);
  }
}

if (failed) {
  console.error("\nPlatform accent contrast check FAILED");
  process.exit(1);
} else {
  console.log("\nplatform accents gate: All 8 platforms meet WCAG 2.2 AA contrast standards.\n");
}
