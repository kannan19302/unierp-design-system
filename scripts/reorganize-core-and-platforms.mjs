#!/usr/bin/env node
/**
 * reorganize-core-and-platforms.mjs
 *
 * Copies and organizes categories into src/core/ and sets up src/platforms/
 * with backward-compatible re-export barrels at src/<category>/index.ts.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const SRC_DIR = path.join(ROOT, "src");
const CORE_DIR = path.join(SRC_DIR, "core");
const PLATFORMS_DIR = path.join(SRC_DIR, "platforms");

const CORE_CATEGORIES = [
  "tokens",
  "theme",
  "styles",
  "brand",
  "icons",
  "primitives",
  "inputs",
  "forms",
  "form-engine",
  "data-display",
  "data-grid",
  "navigation",
  "overlays",
  "charts",
  "dashboard",
  "layout",
  "shell",
  "workflow",
  "blocks",
  "studio",
  "notifications",
  "hooks",
  "utils",
  "components",
];

function copyDirRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  const files = fs.readdirSync(source);
  for (const file of files) {
    const srcPath = path.join(source, file);
    const tgtPath = path.join(target, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, tgtPath);
    } else {
      fs.copyFileSync(srcPath, tgtPath);
    }
  }
}

console.log("Creating src/core and copying categories...");
if (!fs.existsSync(CORE_DIR)) {
  fs.mkdirSync(CORE_DIR, { recursive: true });
}
if (!fs.existsSync(PLATFORMS_DIR)) {
  fs.mkdirSync(PLATFORMS_DIR, { recursive: true });
}

for (const cat of CORE_CATEGORIES) {
  const srcCat = path.join(SRC_DIR, cat);
  const tgtCat = path.join(CORE_DIR, cat);
  if (fs.existsSync(srcCat)) {
    console.log(`Copying ${cat} -> src/core/${cat}...`);
    copyDirRecursive(srcCat, tgtCat);
  }
}

// Generate src/core/index.ts
console.log("Generating src/core/index.ts...");
let coreIndexContent = `// ─────────────────────────────────────────────────
// @kannan19302/ui/core — Core Enterprise Design System Primitives & Components
// ─────────────────────────────────────────────────

export * from "./primitives";
export * from "./inputs";
export * from "./overlays";
export * from "./navigation";
export * from "./data-display";
export * from "./data-grid";
export * from "./forms";
export * from "./layout";
export * from "./shell";
export * from "./studio";
export * from "./dashboard";
export * from "./charts";
export * from "./theme";
export * from "./blocks";
export * from "./brand";
export * from "./form-engine";
export * from "./workflow";
export * from "./notifications";
export * from "./hooks";
export * from "./utils";
`;
fs.writeFileSync(path.join(CORE_DIR, "index.ts"), coreIndexContent);

// Generate src/platforms/index.ts
console.log("Generating src/platforms/index.ts...");
let platformsIndexContent = `// ─────────────────────────────────────────────────
// @kannan19302/ui/platforms — Platform Presentation Components
// ─────────────────────────────────────────────────

export * as providerAdmin from "./provider-admin";
export * as tenantAdmin from "./tenant-admin";
export * as businessSuite from "./business-suite";
export * as developerPlatform from "./developer-platform";
export * as marketing from "./marketing";
`;
fs.writeFileSync(path.join(PLATFORMS_DIR, "index.ts"), platformsIndexContent);

console.log("Reorganization to src/core completed successfully.");
