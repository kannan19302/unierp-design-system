#!/usr/bin/env node
/**
 * check-density.mjs — DL 2.0 density token governance gate.
 *
 * Verifies that key interactive components (Button, Form controls, DataGrid, Navigation, Cards)
 * reference the DL 2.0 density tokens (--density-*) for height and padding instead of static values.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(".");
const SRC = join(ROOT, "src");

const REQUIRED_DENSITY_FILES = [
  "src/tokens/v2/density.css",
  "src/primitives/button/button.module.css",
  "src/inputs/form-control/form-control.module.css",
  "src/inputs/combobox/combobox.module.css",
  "src/inputs/date-picker/date-picker.module.css",
  "src/navigation/tabs/tabs.module.css",
  "src/data-display/card/card.module.css",
  "src/data-grid/table.tsx",
];

let failed = false;

console.log("Checking DL 2.0 density token integration...");

for (const rel of REQUIRED_DENSITY_FILES) {
  const fullPath = join(ROOT, rel);
  try {
    const content = readFileSync(fullPath, "utf-8");
    if (!content.includes("--density-")) {
      console.error(`  FAIL  ${rel} does not consume any --density-* token`);
      failed = true;
    } else {
      const matches = content.match(/--density-[\w-]+/g) || [];
      const uniqueTokens = new Set(matches);
      console.log(`  ok    ${rel} (${uniqueTokens.size} distinct density token refs)`);
    }
  } catch (err) {
    console.error(`  FAIL  Could not read ${rel}: ${err.message}`);
    failed = true;
  }
}

if (failed) {
  console.error("\nDensity token check FAILED");
  process.exit(1);
} else {
  console.log("\ndensity gate: All target components are density-aware.\n");
}
