#!/usr/bin/env node
/**
 * check-density.mjs — DL 2.0 density token governance gate.
 *
 * Verifies that:
 * 1. Key interactive components reference DL 2.0 density tokens (--density-*).
 * 2. Density text sizes never drop below 11px (0.6875rem) at any density mode (DS-NFR-006).
 * 3. Comfortable density satisfies >= 44px touch targets.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(".");

const REQUIRED_DENSITY_FILES = [
  "src/tokens/v2/density.css",
  "src/tokens/v2/typography.css",
  "src/primitives/button/button.module.css",
  "src/inputs/form-control/form-control.module.css",
  "src/inputs/combobox/combobox.module.css",
  "src/inputs/date-picker/date-picker.module.css",
  "src/navigation/tabs/tabs.module.css",
  "src/data-display/card/card.module.css",
  "src/data-grid/table/table.tsx",
];

let failed = false;

console.log("Checking DL 2.0 density token integration...");

for (const rel of REQUIRED_DENSITY_FILES) {
  const fullPath = join(ROOT, rel);
  try {
    const content = readFileSync(fullPath, "utf-8");
    if (!content.includes("--density-") && !content.includes("--type-")) {
      console.error(`  FAIL  ${rel} does not consume any --density-* or --type-* token`);
      failed = true;
    } else {
      const matches = content.match(/--(?:density|type)-[\w-]+/g) || [];
      const uniqueTokens = new Set(matches);
      console.log(`  ok    ${rel} (${uniqueTokens.size} distinct token refs)`);
    }
  } catch (err) {
    console.error(`  FAIL  Could not read ${rel}: ${err.message}`);
    failed = true;
  }
}

// ── Verify minimum text size constraint (>= 11px / 0.6875rem) ──
console.log("\nChecking minimum text size across density modes (>= 11px / 0.6875rem)...");

const densityCssPath = join(ROOT, "src/tokens/v2/density.css");
const typographyCssPath = join(ROOT, "src/tokens/v2/typography.css");

if (existsSync(densityCssPath)) {
  const content = readFileSync(densityCssPath, "utf-8");
  // Check for any --density-*-size under 11px
  const sizeMatches = content.matchAll(/--density-[\w-]*-size:\s*(\d+)px/g);
  for (const match of sizeMatches) {
    const px = parseInt(match[1], 10);
    if (px < 11) {
      console.error(`  FAIL  ${match[0]} in density.css is below 11px minimum!`);
      failed = true;
    }
  }
}

if (existsSync(typographyCssPath)) {
  const content = readFileSync(typographyCssPath, "utf-8");
  // Check for any rem value below 0.6875rem (11px at 16px base)
  const remMatches = content.matchAll(/--type-[\w-]+:\s*([0-9.]+)rem/g);
  for (const match of remMatches) {
    const rem = parseFloat(match[1]);
    if (rem < 0.6875 - 0.001) {
      console.error(`  FAIL  ${match[0]} in typography.css is below 0.6875rem (11px) minimum!`);
      failed = true;
    }
  }
}

// ── Verify comfortable touch target (>= 44px) ──
if (existsSync(densityCssPath)) {
  const content = readFileSync(densityCssPath, "utf-8");
  const touchMatch = content.match(/--density-touch-target:\s*(\d+)px/);
  if (!touchMatch || parseInt(touchMatch[1], 10) < 44) {
    console.error(`  FAIL  Comfortable touch target must be >= 44px`);
    failed = true;
  } else {
    console.log(`  ok    Comfortable touch target meets >= 44px (${touchMatch[1]}px)`);
  }
}

if (failed) {
  console.error("\nDensity token check FAILED");
  process.exit(1);
} else {
  console.log("\ndensity gate: All target components are density-aware and satisfy WCAG/Meridian constraints.\n");
}
