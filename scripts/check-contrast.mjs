#!/usr/bin/env node
/**
 * check-contrast.mjs — WCAG 2.2 AA contrast gate for the shipped themes.
 *
 * UI_UX_BRIEF §8 requires 4.5:1 for body text and 3:1 for large text and UI
 * boundaries, and §3.5 says contrast is "verified automatically in CI". Until
 * this script existed that verification was a sentence, not a mechanism: the
 * only contrast code in the package (`theme/branding.ts`) checks a TENANT's
 * runtime branding overrides and never looks at the themes we ship ourselves.
 *
 * So a theme could ship with unreadable body text and nothing would say so.
 * This closes that: it reads the theme CSS as the browser would, resolves
 * var() aliases, and fails the build on any pair below its threshold.
 *
 * Run:  node scripts/check-contrast.mjs
 *       node scripts/check-contrast.mjs --theme meridian
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const TOKENS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "tokens");

/* ── colour ─────────────────────────────────────────────────────────────── */

/** sRGB → relative luminance, per WCAG 2.x definition. */
function luminance({ r, g, b }) {
  const chan = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Parses #rgb, #rrggbb and `rgb(r g b / a)`.
 *
 * A translucent colour cannot be scored on its own — its contrast depends on
 * whatever is behind it — so this returns null and the caller skips the pair
 * rather than silently scoring it against the wrong ground. Overlay scrims and
 * hover washes are the tokens this affects, and none of them carry text.
 */
function parseColor(raw) {
  const v = raw.trim();
  let m = /^#([0-9a-f]{3})$/i.exec(v);
  if (m) {
    const [x, y, z] = m[1];
    return { r: parseInt(x + x, 16), g: parseInt(y + y, 16), b: parseInt(z + z, 16) };
  }
  m = /^#([0-9a-f]{6})$/i.exec(v);
  if (m) {
    return {
      r: parseInt(m[1].slice(0, 2), 16),
      g: parseInt(m[1].slice(2, 4), 16),
      b: parseInt(m[1].slice(4, 6), 16),
    };
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.%]+)\s*)?\)$/i.exec(v);
  if (m) {
    if (m[4] !== undefined && parseFloat(m[4]) < 1) return null; // translucent
    return { r: +m[1], g: +m[2], b: +m[3] };
  }
  return null;
}

/* ── token extraction ───────────────────────────────────────────────────── */

/**
 * Collects `--token: value` declarations from every block whose selector
 * mentions the given theme.
 *
 * Comments are stripped first. A hex inside a prose comment would otherwise be
 * read as a declaration — and these files are heavily commented on purpose, so
 * that is not a hypothetical.
 */
function readTheme(theme) {
  const files = [
    ...readdirSync(join(TOKENS_DIR, "themes")).map((f) => join(TOKENS_DIR, "themes", f)),
    join(TOKENS_DIR, "base.css"),
    join(TOKENS_DIR, "meridian-chrome.css"),
  ];

  const tokens = {};
  for (const file of files) {
    const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const blockRe = /([^{}]+)\{([^{}]*)\}/g;
    let block;
    while ((block = blockRe.exec(css))) {
      const [, selector, body] = block;
      const selectsTheme =
        selector.includes(`[data-theme="${theme}"]`) ||
        (/:root/.test(selector) && !/\[data-theme/.test(selector));
      if (!selectsTheme) continue;
      const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
      let decl;
      while ((decl = declRe.exec(body))) tokens[decl[1]] = decl[2].trim();
    }
  }
  return tokens;
}

/** Resolves `var(--a, fallback)` chains to a literal, with cycle protection. */
function resolve(tokens, name, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = tokens[name];
  if (!raw) return null;
  const m = /^var\(\s*(--[\w-]+)\s*(?:,\s*(.+))?\)$/.exec(raw);
  if (m) return resolve(tokens, m[1], seen) ?? (m[2] ? parseColor(m[2]) : null);
  return parseColor(raw);
}

/* ── the pairs that must hold ───────────────────────────────────────────── */

const AA_BODY = 4.5; // §8 body text
const AA_LARGE = 3.0; // §8 large text and UI boundaries

/**
 * Every pair here is a combination the components actually render. The
 * `-text on -light` rows are the status-pill rule from §7 ("pills always use
 * the -light background with -text foreground"), which is exactly the pairing
 * that goes wrong when a status ramp is retuned by hand.
 */
const PAIRS = [
  ["--color-text", "--color-bg", AA_BODY, "body text on page ground"],
  ["--color-text", "--color-bg-elevated", AA_BODY, "body text on a card"],
  ["--color-text", "--color-bg-sunken", AA_BODY, "body text in a well"],
  ["--color-text-secondary", "--color-bg", AA_BODY, "secondary text on ground"],
  ["--color-text-secondary", "--color-bg-elevated", AA_BODY, "secondary text on a card"],
  ["--color-text-tertiary", "--color-bg", AA_BODY, "metadata on ground"],
  ["--color-text-tertiary", "--color-bg-elevated", AA_BODY, "metadata on a card"],
  ["--color-text-link", "--color-bg", AA_BODY, "link on ground"],
  ["--color-text-link", "--color-bg-elevated", AA_BODY, "link on a card"],

  ["--on-primary", "--color-primary", AA_BODY, "label on the primary fill"],
  ["--on-danger", "--color-danger", AA_BODY, "label on a solid danger fill"],
  // The eight-way avatar identity ramp. Generated rather than typed out, so
  // adding a ninth pair cannot be done without it being checked.
  ...Array.from({ length: 8 }, (_, i) => [
    `--color-avatar-${i}-fg`,
    `--color-avatar-${i}-bg`,
    AA_BODY,
    `avatar ${i} initials on its ground`,
  ]),
  ["--color-primary", "--color-bg", AA_LARGE, "primary as a boundary on ground"],
  ["--color-border-strong", "--color-bg-elevated", AA_LARGE, "input boundary on a card"],
  ["--color-border-focus", "--color-bg", AA_LARGE, "focus ring on ground"],
  ["--color-border-focus", "--color-bg-elevated", AA_LARGE, "focus ring on a card"],

  ["--color-success-text", "--color-success-light", AA_BODY, "success pill"],
  ["--color-warning-text", "--color-warning-light", AA_BODY, "warning pill"],
  ["--color-danger-text", "--color-danger-light", AA_BODY, "danger pill"],
  ["--color-info-text", "--color-info-light", AA_BODY, "info pill"],

  ["--color-success", "--color-bg-elevated", AA_LARGE, "success icon on a card"],
  ["--color-warning", "--color-bg-elevated", AA_LARGE, "warning icon on a card"],
  ["--color-danger", "--color-bg-elevated", AA_LARGE, "danger icon on a card"],
  ["--color-info", "--color-bg-elevated", AA_LARGE, "info icon on a card"],

  ["--color-sidebar-text", "--color-sidebar-bg", AA_BODY, "sidebar item"],
  ["--color-sidebar-text-active", "--color-sidebar-bg", AA_BODY, "sidebar active item"],

  ["--scope-app", "--color-bg-elevated", AA_LARGE, "scope edge: app"],
  ["--scope-site", "--color-bg-elevated", AA_LARGE, "scope edge: site"],
  ["--scope-library", "--color-bg-elevated", AA_LARGE, "scope edge: library"],
  ["--scope-manage", "--color-bg-elevated", AA_LARGE, "scope edge: manage"],
];

/**
 * Chart series must separate from the ground AND from each other. The second
 * check is what makes the ramp survive greyscale, print and colour-vision
 * deficiency — adjacent series are the ones a reader has to tell apart.
 */
const CHART_MIN_VS_BG = 1.7;
const CHART_MIN_ADJACENT = 1.25;

function checkTheme(theme) {
  const tokens = readTheme(theme);
  if (!Object.keys(tokens).length) return [`${theme}: no tokens found — is the theme registered?`];

  const failures = [];

  for (const [fgName, bgName, min, label] of PAIRS) {
    const fg = resolve(tokens, fgName);
    const bg = resolve(tokens, bgName);
    if (!fg || !bg) continue; // token absent or translucent — not scoreable
    const ratio = contrast(fg, bg);
    if (ratio < min) {
      failures.push(
        `${theme}: ${label} — ${fgName} on ${bgName} is ${ratio.toFixed(2)}:1, needs ${min}:1`,
      );
    }
  }

  const bg = resolve(tokens, "--color-bg");
  const series = [];
  for (let i = 1; i <= 10; i++) {
    const c = resolve(tokens, `--chart-${i}`);
    if (!c) continue;
    series.push([i, c]);
    if (bg && contrast(c, bg) < CHART_MIN_VS_BG) {
      failures.push(
        `${theme}: --chart-${i} is ${contrast(c, bg).toFixed(2)}:1 against the ground, needs ${CHART_MIN_VS_BG}:1`,
      );
    }
  }
  for (let i = 1; i < series.length; i++) {
    const [ai, a] = series[i - 1];
    const [bi, b] = series[i];
    const ratio = contrast(a, b);
    if (ratio < CHART_MIN_ADJACENT) {
      failures.push(
        `${theme}: --chart-${ai} and --chart-${bi} differ by only ${ratio.toFixed(2)}:1 in luminance — they will merge in greyscale (needs ${CHART_MIN_ADJACENT}:1)`,
      );
    }
  }

  return failures;
}

/* ── entry ──────────────────────────────────────────────────────────────── */

const arg = process.argv.indexOf("--theme");
const themes = arg > -1 ? [process.argv[arg + 1]] : ["meridian", "meridian-dark"];

let failed = 0;
for (const theme of themes) {
  const failures = checkTheme(theme);
  if (failures.length) {
    failed += failures.length;
    for (const f of failures) console.error(`  FAIL  ${f}`);
  } else {
    console.log(`  ok    ${theme} — every checked pair meets WCAG 2.2 AA`);
  }
}

if (failed) {
  console.error(`\ncontrast gate: ${failed} failure(s)`);
  process.exit(1);
}
console.log(`\ncontrast gate: ${themes.length} theme(s) pass`);
