#!/usr/bin/env node
/**
 * check-logical-properties.mjs — BiDi & RTL CSS Logical Properties Gate.
 *
 * Enforces Pillar 4 of STRATA_DESIGN_SYSTEM_STANDARDS.md:
 * Physical directional CSS properties (margin-left/right, padding-left/right,
 * border-left/right, left/right, text-align: left/right) are strictly prohibited
 * in component styles. All component styles must use CSS Logical Properties:
 *   - margin-inline-start / margin-inline-end
 *   - padding-inline-start / padding-inline-end
 *   - border-inline-start / border-inline-end
 *   - inset-inline-start / inset-inline-end
 *   - text-align: start / end
 *
 * Usage:
 *   node scripts/check-logical-properties.mjs            # Validate against baseline
 *   node scripts/check-logical-properties.mjs --baseline # Record existing debt
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const ROOT = resolve(process.argv.find((a) => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]) ?? ".");
const WRITE_BASELINE = process.argv.includes("--baseline");
const BASELINE_FILE = join(ROOT, ".logical-properties-baseline.json");

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "build", "coverage", ".git",
  "__snapshots__", ".turbo", "out", "storybook-static",
]);

function isExempt(rel) {
  const p = rel.split(sep).join("/");
  return (
    p.includes("src/tokens/") ||
    p.includes("src/styles/layers/reset.css") ||
    p.includes("scripts/") ||
    p.includes(".stories.tsx") ||
    p.includes(".test.tsx") ||
    p.includes(".test.ts")
  );
}

const RULES = [
  {
    id: "margin-inline",
    re: /\bmargin-(left|right)\s*:/g,
    msg: "Use margin-inline-start / margin-inline-end instead of physical margin-left/right",
  },
  {
    id: "padding-inline",
    re: /\bpadding-(left|right)\s*:/g,
    msg: "Use padding-inline-start / padding-inline-end instead of physical padding-left/right",
  },
  {
    id: "border-inline",
    re: /\bborder-(left|right)\s*:/g,
    msg: "Use border-inline-start / border-inline-end instead of physical border-left/right",
  },
  {
    id: "inset-inline",
    re: /(?<![\w-])(left|right)\s*:\s*(?!auto\b)[^;]+;/g,
    msg: "Use inset-inline-start / inset-inline-end instead of physical left/right",
    filter: (line) => {
      // Ignore text comments or non-CSS property contexts
      return !line.trim().startsWith("/*") && !line.trim().startsWith("//");
    },
  },
  {
    id: "text-align-inline",
    re: /\btext-align\s*:\s*(left|right)\b/g,
    msg: "Use text-align: start / end instead of physical text-align: left/right",
  },
];

function scanFile(filePath, relPath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let match;
      while ((match = rule.re.exec(line)) !== null) {
        if (rule.filter && !rule.filter(line, match)) continue;
        violations.push({
          rule: rule.id,
          line: i + 1,
          content: line.trim(),
          match: match[0],
          msg: rule.msg,
        });
      }
    }
  }

  return violations;
}

function walk(dir, fileList = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, fileList);
    } else if (entry.endsWith(".css") || entry.endsWith(".module.css")) {
      fileList.push(full);
    }
  }
  return fileList;
}

console.log("\x1b[1m\x1b[34m[CSS Logical Properties Gate]\x1b[0m Scanning for physical directional CSS properties...");

const cssFiles = walk(join(ROOT, "src"));
const results = {};
let totalViolations = 0;

for (const file of cssFiles) {
  const rel = relative(ROOT, file);
  if (isExempt(rel)) continue;
  const v = scanFile(file, rel);
  if (v.length > 0) {
    results[rel] = v;
    totalViolations += v.length;
  }
}

if (WRITE_BASELINE) {
  const baseline = {};
  for (const [rel, v] of Object.entries(results)) {
    baseline[rel] = v.length;
  }
  writeFileSync(BASELINE_FILE, JSON.stringify(baseline, null, 2), "utf8");
  console.log(`\x1b[32m✔ Baseline written to ${BASELINE_FILE} with ${Object.keys(baseline).length} files (${totalViolations} violations recorded).\x1b[0m`);
  process.exit(0);
}

let baseline = {};
if (existsSync(BASELINE_FILE)) {
  baseline = JSON.parse(readFileSync(BASELINE_FILE, "utf8"));
}

let hasNewViolations = false;
let violationCount = 0;

for (const [rel, v] of Object.entries(results)) {
  const baseCount = baseline[rel] ?? 0;
  if (v.length > baseCount) {
    hasNewViolations = true;
    console.error(`\x1b[31m✖ ${rel}: ${v.length} violations (baseline: ${baseCount}, +${v.length - baseCount} new)\x1b[0m`);
    for (const item of v) {
      console.error(`    L${item.line}: ${item.content}  \x1b[90m--> ${item.msg}\x1b[0m`);
    }
  }
  violationCount += v.length;
}

if (hasNewViolations) {
  console.error(`\n\x1b[31m[CSS Logical Properties Gate FAILED] New physical directional CSS properties detected.\x1b[0m`);
  console.error(`Per Pillar 4 of STRATA_DESIGN_SYSTEM_STANDARDS.md, all styles must use CSS Logical Properties for BiDi/RTL compliance.\n`);
  process.exit(1);
}

console.log(`\x1b[32m✔ [CSS Logical Properties Gate PASSED]\x1b[0m Zero new physical directional CSS violations (Total tracked in baseline: ${violationCount}).`);
process.exit(0);
