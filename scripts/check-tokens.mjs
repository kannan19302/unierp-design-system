#!/usr/bin/env node
/**
 * check-tokens.mjs — the token gate.
 *
 * UI_UX_BRIEF §2 says: "A literal hex colour, a literal pixel value, or a
 * literal font size in application code is a **build failure**, enforced by a
 * CI gate." AGENTS.md lists "a hardcoded hex or `px` value" under **Rejected on
 * sight**.
 *
 * No such gate existed. Not in this repository, not in any other. The claim had
 * outlived its mechanism — which is the exact failure mode AGENTS.md warns
 * about three times ("3,241 files silencing the type checker, a coverage gate
 * with no threshold, and a CI step guarded by `if: hashFiles(...)` on a script
 * that exists in no repository"). Meanwhile ~100 hex literals shipped, and two
 * whole apps drew their chrome inline.
 *
 * This is that gate. It runs over CSS and over inline style objects in TSX.
 *
 *   node scripts/check-tokens.mjs                 # this package
 *   node scripts/check-tokens.mjs ../tenant-admin # any consumer
 *   node scripts/check-tokens.mjs --baseline      # write a baseline of existing
 *                                                 # violations, so the gate can
 *                                                 # be adopted without a
 *                                                 # thousand-file rewrite
 *
 * ADOPTION, deliberately: a gate that fails on day one for pre-existing debt
 * gets switched off, and a gate that is off is worse than no gate because it
 * still reads as a guarantee. So a repository records what it already owes in
 * `.token-baseline.json`; the gate fails on anything NEW, and on any baselined
 * file that gets WORSE. Paying the debt down shrinks the baseline; the gate
 * never lets it grow.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const ROOT = resolve(process.argv.find((a) => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]) ?? ".");
const WRITE_BASELINE = process.argv.includes("--baseline");
const BASELINE_FILE = join(ROOT, ".token-baseline.json");

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "build", "coverage", ".git",
  "__snapshots__", ".turbo", "out", "storybook-static",
]);

/* ── what counts as a violation ─────────────────────────────────────────── */

/**
 * The token files themselves are where literals are SUPPOSED to live — a theme
 * has to say `#0e6b75` somewhere or it defines nothing. Same for the generated
 * cross-platform token output.
 */
function isTokenSource(rel) {
  const p = rel.split(sep).join("/");
  return (
    p.includes("src/tokens/") ||
    p.endsWith("tokens.css") ||
    p.includes("/tokens/") ||
    p.includes("scripts/") ||
    p.includes("__tests__/") ||
    p.endsWith(".test.tsx") ||
    p.endsWith(".test.ts") ||
    p.endsWith(".stories.tsx")
  );
}

const RULES = [
  {
    id: "hex",
    // #abc / #aabbcc / #aabbccdd, not inside a var() fallback chain and not a
    // CSS-module :export or a url(#filter) SVG reference.
    re: /#[0-9a-fA-F]{3,8}\b/g,
    ok: (line, m) => {
      const before = line.slice(0, m.index);
      // url(#gradientId) and fill="url(#x)" are SVG references, not colours.
      if (/url\($/.test(before)) return true;
      // A fallback inside var() is a deliberate degradation path for a consumer
      // that has not loaded the tokens; the brief's rule is about values that
      // BYPASS tokens, not values that back one up.
      if (/var\(\s*--[\w-]+\s*,[^)]*$/.test(before)) return true;
      return false;
    },
    msg: "hardcoded hex colour — use var(--color-*)",
  },
  {
    id: "px",
    // A literal px length. Sub-pixel and hairline values are exempt: a 1px
    // border and a 2px focus offset are physical constants of the display, not
    // spacing decisions, and tokenising them buys nothing.
    re: /(?<![\w-])(\d{1,4}(?:\.\d+)?)px\b/g,
    ok: (line, m) => {
      const n = parseFloat(m[1]);
      if (n <= 2) return true; // hairlines, offsets
      if (/var\(\s*--[\w-]+\s*,[^)]*$/.test(line.slice(0, m.index))) return true;
      // Media-query breakpoints are layout structure, declared in one place per
      // component and meaningless as a theme token.
      if (/@media|@container/.test(line)) return true;
      return false;
    },
    msg: "hardcoded px length — use var(--space-*) / var(--radius-*) / var(--text-*)",
  },
  {
    id: "signal-leak",
    // §13.1: coral is for marketing surfaces and empty-state illustration only.
    // One definition to gate against, so this catches both the token and the
    // literal.
    re: /--brand-signal\b|#e4572e|#cf4622/gi,
    ok: () => false,
    msg: "--brand-signal (coral) is marketing-only — it must not appear in product CSS",
    // Only enforced outside the marketing surfaces and the token definition.
    appliesTo: (rel) => {
      const p = rel.split(sep).join("/");
      // The sanctioned surfaces: anything under a marketing app, the token
      // definition itself, the marketing block library, and `editorial-shell`
      // — which IS the marketing anatomy (UI_UX_BRIEF §11 row 2) even though it
      // ships from the design system rather than from the marketing app.
      return (
        !p.includes("marketing") &&
        !p.includes("src/tokens/") &&
        !p.includes("blocks/") &&
        !p.includes("editorial-shell")
      );
    },
  },
];

/* ── scanning ───────────────────────────────────────────────────────────── */

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) walk(full, out);
    else if (/\.(css|tsx|ts)$/.test(name)) out.push(full);
  }
  return out;
}

/**
 * In .ts/.tsx we only care about STYLE contexts — a hex in a chart config or a
 * test fixture is data, not a bypassed token. Restricting to style-ish lines is
 * what keeps this from drowning in false positives, which is the other way a
 * gate dies.
 */
function isStyleContext(line) {
  return (
    /style\s*=|style:|css`|styled\.|className=.*\[/.test(line) ||
    /(background|color|border|padding|margin|width|height|font|shadow|radius|gap|inset|top|left|right|bottom)\s*:/i.test(line)
  );
}

function scan(file) {
  const rel = relative(ROOT, file);
  if (isTokenSource(rel)) return [];
  const isCss = file.endsWith(".css");
  const text = readFileSync(file, "utf8");
  // Strip comments so prose about a colour is not a violation.
  const cleaned = isCss
    ? text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    : text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

  const found = [];
  cleaned.split("\n").forEach((line, i) => {
    if (!isCss) {
      if (/^\s*(\/\/|\*)/.test(line)) return;
      if (!isStyleContext(line)) return;
    } else if (/^\s*\*/.test(line)) return;

    for (const rule of RULES) {
      if (rule.appliesTo && !rule.appliesTo(rel)) continue;
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        if (rule.ok(line, m)) continue;
        found.push({ file: rel.split(sep).join("/"), line: i + 1, rule: rule.id, text: m[0], msg: rule.msg });
      }
    }
  });
  return found;
}

/* ── entry ──────────────────────────────────────────────────────────────── */

const violations = walk(ROOT).flatMap(scan);
const counts = {};
for (const v of violations) counts[v.file] = (counts[v.file] ?? 0) + 1;

if (WRITE_BASELINE) {
  writeFileSync(
    BASELINE_FILE,
    JSON.stringify(
      {
        _comment:
          "Pre-existing token violations, recorded so the gate can be adopted without a mass rewrite. The gate fails on any NEW violation and on any file here that gets worse. These numbers may only go down. Delete an entry when its file reaches zero.",
        _generated: new Date().toISOString().slice(0, 10),
        _total: violations.length,
        files: counts,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`baseline written: ${violations.length} violation(s) across ${Object.keys(counts).length} file(s)`);
  process.exit(0);
}

const baseline = existsSync(BASELINE_FILE)
  ? JSON.parse(readFileSync(BASELINE_FILE, "utf8")).files ?? {}
  : {};

const regressions = [];
for (const [file, n] of Object.entries(counts)) {
  const allowed = baseline[file] ?? 0;
  if (n > allowed) {
    regressions.push({ file, now: n, allowed, examples: violations.filter((v) => v.file === file).slice(allowed, allowed + 5) });
  }
}

if (regressions.length === 0) {
  const debt = Object.values(baseline).reduce((a, b) => a + b, 0);
  console.log(
    `  ok    token gate — no new violations` +
      (debt ? ` (${debt} baselined, in ${Object.keys(baseline).length} file(s); these may only go down)` : ""),
  );
  process.exit(0);
}

for (const r of regressions) {
  console.error(`  FAIL  ${r.file} — ${r.now} violation(s), baseline allows ${r.allowed}`);
  for (const e of r.examples) console.error(`          ${r.file}:${e.line}  ${e.text}  — ${e.msg}`);
}
console.error(`\ntoken gate: ${regressions.length} file(s) with new violations`);
process.exit(1);
