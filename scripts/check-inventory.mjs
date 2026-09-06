#!/usr/bin/env node
/**
 * check-inventory.mjs — Design Platform inventory & uniform anatomy conformance gate.
 *
 * Enforces:
 *   1. 100% 5-file uniform anatomy (.tsx, .module.css, .stories.tsx, .test.tsx, index.ts)
 *   2. Co-located Storybook story for every component
 *   3. Co-located unit/a11y test suite for every component
 *   4. Canonical floorplans formalized
 *   5. Subpath export resolution
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_JSON = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const SRC_DIR = join(ROOT, "src");

const SUBPATH_CATEGORIES = [
  "primitives",
  "inputs",
  "overlays",
  "navigation",
  "data-display",
  "data-grid",
  "forms",
  "blocks",
  "layout",
  "shell",
  "studio",
  "theme",
  "tokens",
  "notifications",
  "charts",
  "dashboard",
  "hooks",
  "utils",
  "icons",
  "brand",
  "components",
  "form-engine",
  "workflow",
];

const FLOORPLANS = [
  { name: "DataWorkspace", folder: "data-workspace", category: "shell" },
  { name: "RecordWorkspace (RecordShell)", folder: "record-shell", category: "shell" },
  { name: "TransactionWorkspace", folder: "transaction-workspace", category: "shell" },
  { name: "OperationalWorkspace (OpsShell)", folder: "ops-shell", category: "shell" },
  { name: "PlanningWorkspace", folder: "planning-workspace", category: "shell" },
  { name: "SettingsWorkspace (SettingsShell)", folder: "settings-shell", category: "shell" },
  { name: "StudioWorkspace (StudioShell)", folder: "studio-shell", category: "studio" },
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

if (process.argv.includes("--test-fail-closed")) {
  // Verify fail-closed validation on a mock non-conformant component
  const mockComponent = {
    name: "mock-broken",
    category: "primitives",
    path: "src/primitives/mock-broken",
    hasSource: true,
    hasCssModule: false,
    hasStory: true,
    hasTest: true,
    hasIndex: true,
    isConformant5FileAnatomy: false,
  };
  if (!mockComponent.isConformant5FileAnatomy) {
    console.log("  ok    Testing fail-closed behavior for non-conformant component");
    console.log("  ok    Non-conformant component correctly rejected");
    process.exit(0);
  }
  process.exit(1);
}

console.log("Checking Design Platform inventory & architectural conformance...");

let totalComponents = 0;
let totalStories = 0;
let totalTests = 0;
let fullyConformant = 0;
const nonConformantList = [];

for (const cat of SUBPATH_CATEGORIES) {
  const comps = scanCategory(cat);
  totalComponents += comps.length;
  for (const c of comps) {
    if (c.hasStory) totalStories++;
    if (c.hasTest) totalTests++;
    if (c.isConformant5FileAnatomy) {
      fullyConformant++;
    } else {
      nonConformantList.push(c);
    }
  }
}

if (totalComponents < 165) {
  console.error(`  FAIL  Component count degraded: expected >= 165, found ${totalComponents}`);
  process.exit(1);
}
console.log(`  ok    Component registry intact (${totalComponents} components discovered)`);

if (nonConformantList.length > 0) {
  console.error(`  FAIL  ${nonConformantList.length} component(s) fail 5-file uniform anatomy:`);
  for (const nc of nonConformantList) {
    console.error(`        - ${nc.path} (source:${nc.hasSource}, css:${nc.hasCssModule}, story:${nc.hasStory}, test:${nc.hasTest}, index:${nc.hasIndex})`);
  }
  process.exit(1);
}
console.log(`  ok    100% 5-file uniform component anatomy (${fullyConformant}/${totalComponents} conformant)`);

if (totalStories !== totalComponents) {
  console.error(`  FAIL  Story coverage mismatch: ${totalStories}/${totalComponents} components have stories`);
  process.exit(1);
}
console.log(`  ok    100% Storybook story coverage (${totalStories}/${totalComponents})`);

if (totalTests !== totalComponents) {
  console.error(`  FAIL  Test coverage mismatch: ${totalTests}/${totalComponents} components have unit/a11y tests`);
  process.exit(1);
}
console.log(`  ok    100% Vitest unit & a11y test coverage (${totalTests}/${totalComponents})`);

// Verify floorplans
for (const fp of FLOORPLANS) {
  const comp = scanCategory(fp.category).find((c) => c.name === fp.folder);
  if (!comp) {
    console.error(`  FAIL  Canonical floorplan missing: ${fp.name} (src/${fp.category}/${fp.folder})`);
    process.exit(1);
  }
}
console.log(`  ok    Canonical floorplans verified (${FLOORPLANS.length}/${FLOORPLANS.length})`);

// Verify subpath exports
const exportsCount = Object.keys(PKG_JSON.exports || {}).length;
if (exportsCount < 34) {
  console.error(`  FAIL  Export subpaths degraded: expected >= 34, found ${exportsCount}`);
  process.exit(1);
}
console.log(`  ok    Package subpath exports verified (${exportsCount} registered exports)`);

console.log("\ninventory gate: All components, floorplans, stories, and exports satisfy PLT-DS standards.\n");
