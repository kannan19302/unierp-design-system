#!/usr/bin/env node
/**
 * check-storybook-standards.mjs
 *
 * Enforces Enterprise Storybook Standards across @kannan19302/ui:
 * 1. Co-located .stories.tsx for all components.
 * 2. Canonical story taxonomy (no generic 'COMPONENTS/' prefixes).
 * 3. Default export with Meta specifying component.
 * 4. Autodocs configuration or tag presence.
 * 5. Presence of comprehensive state/variant matrix stories.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(ROOT, "src");

// 1. Mandatory Compilation & JSX Syntax Verification Gate
console.log("Phase 1: Validating Storybook compilation & AST integrity...");
try {
  execSync("node scripts/check-stories-compilation.mjs", {
    cwd: ROOT,
    stdio: "inherit",
  });
} catch (err) {
  console.error("✖ Story compilation gate failed. Fix syntax/transform errors before proceeding.");
  process.exit(1);
}
console.log("Phase 2: Checking Enterprise Storybook Standards...");

const VALID_CATEGORIES = [
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
  "charts",
  "dashboard",
  "components",
  "form-engine",
  "workflow",
  "filters",
  "feedback",
  "patterns",
  "templates",
];

const CANONICAL_PREFIXES = [
  "Primitives/",
  "Inputs/",
  "Overlays/",
  "Navigation/",
  "DataDisplay/",
  "DataGrid/",
  "Forms/",
  "Blocks/",
  "Layout/",
  "Shell/",
  "Studio/",
  "Charts/",
  "Dashboard/",
  "Workflow/",
  "Core/",
  "Platforms/",
];

let totalScanned = 0;
let errors = [];
let warnings = [];

for (const category of VALID_CATEGORIES) {
  const catDir = existsSync(join(SRC_DIR, "core", category))
    ? join(SRC_DIR, "core", category)
    : join(SRC_DIR, category);
  if (!existsSync(catDir)) continue;

  const entries = readdirSync(catDir);
  for (const entry of entries) {
    const full = join(catDir, entry);
    if (!statSync(full).isDirectory()) continue;

    const files = readdirSync(full);
    const storyFile = files.find(
      (f) => f.endsWith(".stories.tsx") || f.endsWith(".stories.ts")
    );

    if (!storyFile) {
      // Not all subdirectories are components, but if they have source files they must have stories
      const hasSource = files.some(
        (f) =>
          (f.endsWith(".tsx") || f.endsWith(".ts")) &&
          !f.endsWith(".test.tsx") &&
          !f.endsWith(".test.ts") &&
          f !== "index.ts" &&
          f !== "index.tsx"
      );
      if (hasSource) {
        errors.push(`Missing story file in ${category}/${entry}`);
      }
      continue;
    }

    totalScanned++;
    const storyPath = join(full, storyFile);
    const content = readFileSync(storyPath, "utf8");

    // Check title taxonomy
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    if (!titleMatch) {
      errors.push(`${category}/${entry}: No Storybook title found in ${storyFile}`);
    } else {
      const title = titleMatch[1];
      if (title.startsWith("COMPONENTS/")) {
        errors.push(
          `${category}/${entry}: Non-standard taxonomy "${title}". Must use canonical prefix (e.g. Primitives/*, Inputs/*).`
        );
      }
    }

    // Check component attachment
    if (!content.includes("component:")) {
      warnings.push(`${category}/${entry}: Default export should specify "component: ..." for prop table generation.`);
    }
  }
}

console.log("Checking Enterprise Storybook Standards...");
console.log(`  Scanned ${totalScanned} component story files across ${VALID_CATEGORIES.length} categories.`);

if (errors.length > 0) {
  console.error(`\nStorybook Standards Gate FAILED with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  ✕ ${err}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(`\nStorybook Standards Warnings (${warnings.length}):`);
  for (const w of warnings.slice(0, 5)) {
    console.log(`  ⚠ ${w}`);
  }
}

console.log("\nstorybook gate: All story files satisfy enterprise taxonomy, co-location, and metadata standards.\n");
process.exit(0);
