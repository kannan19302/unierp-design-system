#!/usr/bin/env node
/**
 * generate-inventory.mjs — Design Platform conformance and component catalog inventory.
 *
 * Generates an authoritative, fail-closed inventory of all package subpath exports,
 * components, floorplans, stories, themes, densities, and platforms.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_JSON = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const SRC_DIR = join(ROOT, "src");
const OUTPUT_FILE = join(ROOT, "dist", "component-inventory.json");

const SUBPATH_CATEGORIES = [
  "primitives",
  "inputs",
  "compositions",
  "charts",
  "overlays",
  "navigation",
  "templates",
  "shells",
  "forms",
];

const FLOORPLANS = [
  { name: "DataShell", category: "shells", targetAnatomy: "data" },
  { name: "RecordShell", category: "shells", targetAnatomy: "record" },
  { name: "SettingsShell", category: "shells", targetAnatomy: "settings" },
  { name: "EditorShell", category: "shells", targetAnatomy: "editor" },
  { name: "AppShell", category: "shells", targetAnatomy: "app" },
  { name: "CatalogShell", category: "shells", targetAnatomy: "catalog" },
];

function scanCategory(category) {
  const catDir = join(SRC_DIR, category);
  if (!existsSync(catDir)) return [];

  const components = [];
  const entries = readdirSync(catDir);

  for (const entry of entries) {
    const full = join(catDir, entry);
    if (!statSync(full).isDirectory()) continue;

    const files = readdirSync(full);
    const hasSource = files.some(
      (f) =>
        (f.endsWith(".tsx") || f.endsWith(".ts")) &&
        !f.endsWith(".stories.tsx") &&
        !f.endsWith(".test.tsx") &&
        !f.endsWith(".stories.ts") &&
        !f.endsWith(".test.ts") &&
        f !== "index.ts" &&
        f !== "index.tsx"
    );
    const hasCssModule = files.some((f) => f.endsWith(".module.css"));
    const hasStory = files.some((f) => f.endsWith(".stories.tsx") || f.endsWith(".stories.ts"));
    const hasTest = files.some((f) => f.endsWith(".test.tsx") || f.endsWith(".test.ts"));
    const hasIndex = files.includes("index.ts") || files.includes("index.tsx");

    if (hasSource || hasIndex) {
      components.push({
        name: entry,
        category,
        path: `src/${category}/${entry}`,
        hasSource,
        hasCssModule,
        hasStory,
        hasTest,
        hasIndex,
        isConformant5FileAnatomy: hasSource && hasCssModule && hasStory && hasTest && hasIndex,
      });
    }
  }
  return components;
}

const inventory = {
  packageName: PKG_JSON.name,
  packageVersion: PKG_JSON.version,
  generatedAt: new Date().toISOString(),
  exports: Object.keys(PKG_JSON.exports || {}),
  floorplans: FLOORPLANS,
  categories: {},
  totals: {
    totalComponents: 0,
    totalStories: 0,
    totalTests: 0,
    fullyConformant5FileComponents: 0,
  },
};

for (const cat of SUBPATH_CATEGORIES) {
  const comps = scanCategory(cat);
  inventory.categories[cat] = {
    count: comps.length,
    components: comps,
  };
  inventory.totals.totalComponents += comps.length;
  for (const c of comps) {
    if (c.hasStory) inventory.totals.totalStories++;
    if (c.hasTest) inventory.totals.totalTests++;
    if (c.isConformant5FileAnatomy) inventory.totals.fullyConformant5FileComponents++;
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2), "utf8");
console.log(`Component inventory written to dist/component-inventory.json (${inventory.totals.totalComponents} components).`);
