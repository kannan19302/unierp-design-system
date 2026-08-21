#!/usr/bin/env node
/**
 * Cross-platform design token generator — CSS themes → Dart, for unierp-mobile.
 *
 * ── What this replaced ──
 * The previous version's docstring said it "translates TypeScript/CSS design
 * tokens into Dart theme constants". It did not. It declared a `tokens` object
 * that was **never referenced**, and emitted a fixed template string whose
 * values matched no shipped theme: `primary` was `#3b82f6`, a blue that exists
 * in neither `light` (`#6366f1`), nor `dark`, nor `meridian` (`#0e6b75`).
 *
 * So the Flutter app's "generated" tokens were a hand-written copy that had
 * silently diverged from the web palette, and running the generator to
 * resync them changed nothing — which is the worst version of this failure,
 * because the command appears to work.
 *
 * This version reads the actual theme CSS and fails loudly if a token it needs
 * is missing, so §9's "Native mobile (Flutter): same tokens" is a mechanism
 * rather than a sentence.
 *
 *   node scripts/generate-cross-platform-tokens.mjs
 *   node scripts/generate-cross-platform-tokens.mjs --check   # CI: no write, fail on drift
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOKENS = join(HERE, "..", "src", "tokens");
const OUT_DIR = resolve(HERE, "..", "..", "unierp-mobile", "lib", "src", "tokens");
const OUT_FILE = join(OUT_DIR, "tokens.g.dart");

// Second target: the Tauri desktop shell. It has no bundler and no
// node_modules, so it cannot `import` the package's CSS — which is exactly how
// it ended up with a FOURTH hand-rolled palette (`--bg-base: #0b0f19`,
// `--accent: #38bdf8`) matching no shipped theme. Generating a small CSS file
// from the same source, gated by the same --check, is the way a build-less
// target stays in the system instead of drifting out of it.
const DESKTOP_DIR = resolve(HERE, "..", "..", "desktop-app", "public");
const DESKTOP_FILE = join(DESKTOP_DIR, "tokens.g.css");
const CHECK_ONLY = process.argv.includes("--check");

// A newline as a value, so line joining never depends on an escape sequence
// surviving whatever wrote this file.
const NL = String.fromCharCode(10);

/* ── read the real themes ───────────────────────────────────────────────── */

function declarations(file, selectorTest) {
  const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const out = {};
  const blocks = /([^{}]+)\{([^{}]*)\}/g;
  let block;
  while ((block = blocks.exec(css))) {
    if (!selectorTest(block[1])) continue;
    const decl = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = decl.exec(block[2]))) out[d[1]] = d[2].trim();
  }
  return out;
}

function readTheme(theme) {
  const base = declarations(join(TOKENS, "base.css"), (s) => /:root/.test(s));
  const chrome = declarations(join(TOKENS, "meridian-chrome.css"), (s) =>
    s.includes(`[data-theme="${theme}"]`),
  );
  const own = declarations(join(TOKENS, "themes", `${theme}.css`), (s) =>
    s.includes(`[data-theme="${theme}"]`),
  );
  return { ...base, ...chrome, ...own };
}

/* ── convert ────────────────────────────────────────────────────────────── */

/** #rgb / #rrggbb → Dart 0xAARRGGBB. Anything else is a hard failure. */
function toDartColor(name, raw) {
  const v = raw.trim();
  let hex = /^#([0-9a-f]{3})$/i.exec(v)?.[1];
  if (hex) hex = hex.split("").map((c) => c + c).join("");
  else hex = /^#([0-9a-f]{6})$/i.exec(v)?.[1];

  if (!hex) {
    // A var() alias or an rgb() with alpha cannot be a Dart const Color, and
    // guessing one is how the web and the app drift apart again.
    throw new Error(`${name}: expected a plain hex colour, got "${raw}"`);
  }
  return `0xFF${hex.toUpperCase()}`;
}

/** `1rem` / `16px` → Dart double px, assuming the 16px root the brief sets. */
function toDartPx(name, raw) {
  const v = raw.trim();
  const rem = /^(-?[\d.]+)rem$/.exec(v);
  if (rem) return (parseFloat(rem[1]) * 16).toFixed(1);
  const px = /^(-?[\d.]+)px$/.exec(v);
  if (px) return parseFloat(px[1]).toFixed(1);
  throw new Error(`${name}: expected a rem or px length, got "${raw}"`);
}

const COLORS = {
  primary: "--color-primary",
  onPrimary: "--on-primary",
  primaryLight: "--color-primary-light",
  success: "--color-success",
  successLight: "--color-success-light",
  successText: "--color-success-text",
  warning: "--color-warning",
  warningLight: "--color-warning-light",
  warningText: "--color-warning-text",
  danger: "--color-danger",
  dangerLight: "--color-danger-light",
  dangerText: "--color-danger-text",
  info: "--color-info",
  background: "--color-bg",
  bgElevated: "--color-bg-elevated",
  bgSunken: "--color-bg-sunken",
  border: "--color-border",
  borderStrong: "--color-border-strong",
  borderFocus: "--color-border-focus",
  text: "--color-text",
  textSecondary: "--color-text-secondary",
  textTertiary: "--color-text-tertiary",
  scopeApp: "--scope-app",
  scopeSite: "--scope-site",
  scopeLibrary: "--scope-library",
  scopeManage: "--scope-manage",
};

const SPACING = {
  space1: "--space-1",
  space2: "--space-2",
  space3: "--space-3",
  space4: "--space-4",
  space5: "--space-5",
  space6: "--space-6",
  space8: "--space-8",
};

const RADIUS = {
  radiusSm: "--radius-sm",
  radiusMd: "--radius-md",
  radiusLg: "--radius-lg",
  radiusXl: "--radius-xl",
};

const TEXT = {
  textXs: "--text-xs",
  textSm: "--text-sm",
  textBase: "--text-base",
  textLg: "--text-lg",
  textXl: "--text-xl",
};

/**
 * The t-shirt names `unierp-mobile` already calls (`UniTokens.spaceMd`,
 * `UniTokens.radiusLg`). They stay so the app keeps compiling, but they now
 * resolve to the REAL token values instead of the old hand-written ones.
 *
 * Spacing is unchanged — 4/8/16/24/32 happened to match. Radius is NOT:
 * the old file said md=8 and lg=12, while the design system says md=6 and
 * lg=8, because §13.4 tightened the product's corners and the mobile copy
 * never heard about it. Correcting that is the point of this generator.
 */
const LEGACY_ALIASES = {
  spaceXs: "--space-1",
  spaceSm: "--space-2",
  spaceMd: "--space-4",
  spaceLg: "--space-6",
  spaceXl: "--space-8",
  radiusSm: "--radius-sm",
  radiusMd: "--radius-md",
  radiusLg: "--radius-lg",
};

function emitTheme(className, theme) {
  const t = readTheme(theme);
  const missing = [];
  const line = (key, token, fn) => {
    const raw = t[token];
    if (!raw) {
      missing.push(token);
      return "";
    }
    try {
      return fn(key, raw);
    } catch (e) {
      missing.push(`${token} (${e.message})`);
      return "";
    }
  };

  const colors = Object.entries(COLORS)
    .map(([k, tok]) =>
      line(k, tok, (key, raw) => `  static const Color ${key} = Color(${toDartColor(tok, raw)});`),
    )
    .filter(Boolean)
    .join("\n");

  if (missing.length) {
    throw new Error(
      `theme "${theme}" is missing or cannot express:\n  - ${missing.join("\n  - ")}`,
    );
  }

  // Legacy scale aliases live on the light class only — the app reads them as
  // dimensions, not as theme-dependent values, and they are identical in both.
  const aliases =
    className === "UniTokens"
      ? [
          "",
          "  // Legacy scale aliases — see LEGACY_ALIASES in the generator.",
          ...Object.entries(LEGACY_ALIASES).map(([k, tok]) => {
            const raw = t[tok];
            if (!raw) throw new Error(`alias token missing: ${tok}`);
            return `  static const double ${k} = ${toDartPx(tok, raw)};`;
          }),
        ].join(NL)
      : "";

  return `class ${className} {
  const ${className}._();

${colors}${aliases}
}`;
}

function emitScale() {
  const t = readTheme("meridian");
  const rows = [];
  for (const [group, map, fn] of [
    ["Spacing", SPACING, toDartPx],
    ["Radius", RADIUS, toDartPx],
    ["Type", TEXT, toDartPx],
  ]) {
    rows.push(`  // ${group}`);
    for (const [key, tok] of Object.entries(map)) {
      const raw = t[tok];
      if (!raw) throw new Error(`scale token missing: ${tok}`);
      rows.push(`  static const double ${key} = ${fn(tok, raw)};`);
    }
    rows.push("");
  }
  // §9: every mobile target is at least 44px, and that is not negotiable per
  // platform — it is the one dimension the web tokens do not carry because only
  // touch surfaces need it.
  rows.push("  // Touch");
  rows.push("  static const double minTouchTarget = 44.0;");

  return `class UniScale {
  const UniScale._();

${rows.join("\n")}
}`;
}

/**
 * The desktop shell's CSS, generated from the same themes.
 *
 * It keeps the variable NAMES the existing markup already uses (`--bg-base`,
 * `--accent`, …) and repoints them at Meridian values, so the 100-line page
 * does not have to be rewritten to stop being a separate palette. The names are
 * a local alias layer; the values are the design system's.
 */
const DESKTOP_MAP = {
  "--bg-base": "--color-bg",
  "--bg-surface": "--color-bg-elevated",
  "--bg-elevated": "--color-bg-sunken",
  "--border": "--color-border",
  "--accent": "--color-primary",
  "--text": "--color-text",
  "--text-muted": "--color-text-secondary",
  "--danger": "--color-danger",
  // Foreground ON the accent. The shell had `#fff` in one place and `#06131f`
  // in another for the same job — and both are wrong in one of the two modes,
  // because meridian's accent is dark teal and meridian-dark's is light teal.
  // One token, correct in both.
  "--on-accent": "--on-primary",
  "--danger-bg": "--color-danger-light",
  "--danger-text": "--color-danger-text",
};

function emitDesktopCss() {
  const light = readTheme("meridian");
  const dark = readTheme("meridian-dark");

  const rows = (t) =>
    Object.entries(DESKTOP_MAP)
      .map(([alias, tok]) => {
        const raw = t[tok];
        if (!raw) throw new Error(`desktop token missing: ${tok}`);
        return `  ${alias}: ${raw};`;
      })
      .join(NL);

  // No gradient. The old shell used a two-hue accent gradient; §13.1 allows one
  // accent, and a gradient here would be the only one in the platform.
  return [
    "/* GENERATED — DO NOT EDIT BY HAND.",
    " * scripts/generate-cross-platform-tokens.mjs in unierp-design-system.",
    " * The desktop shell has no bundler, so its tokens are generated rather than",
    " * imported. Re-run that script after any token change.",
    " */",
    ":root {",
    rows(light),
    "  --accent-grad: var(--accent);",
    "}",
    "",
    '[data-theme="dark"], [data-theme="meridian-dark"] {',
    rows(dark),
    "  --accent-grad: var(--accent);",
    "}",
    "",
    "@media (prefers-color-scheme: dark) {",
    '  :root:not([data-theme="light"]):not([data-theme="meridian"]) {',
    rows(dark).split(NL).map((l) => "  " + l).join(NL),
    "    --accent-grad: var(--accent);",
    "  }",
    "}",
    "",
  ].join(NL);
}

/* ── entry ──────────────────────────────────────────────────────────────── */

let dart;
let css;
try {
  dart = `// GENERATED CODE — DO NOT EDIT BY HAND.
// Generated by scripts/generate-cross-platform-tokens.mjs in unierp-design-system
// from src/tokens/themes/meridian{,-dark}.css. Re-run that script after any
// token change; \`--check\` fails CI when this file has drifted.
//
// UI_UX_BRIEF §9: "Native mobile (Flutter): same tokens, platform-native
// navigation and gestures." Same tokens means these are DERIVED, never typed.

import 'package:flutter/material.dart';

${emitTheme("UniTokens", "meridian")}

${emitTheme("UniTokensDark", "meridian-dark")}

${emitScale()}
`;
  css = emitDesktopCss();
} catch (e) {
  console.error(`  FAIL  ${e.message}`);
  process.exit(1);
}

// The mobile repository is a sibling checkout and is often simply not present —
// in CI for this package, in a shallow clone, on a machine that only does web.
// A gate that fails because a DIFFERENT repository is missing is a gate people
// switch off, so absence is skipped and only real drift fails.
if (!existsSync(resolve(OUT_DIR, "..", "..", ".."))) {
  console.log("  skip  unierp-mobile not checked out — nothing to compare");
  process.exit(0);
}

if (CHECK_ONLY) {
  if (existsSync(DESKTOP_DIR)) {
    const currentCss = existsSync(DESKTOP_FILE) ? readFileSync(DESKTOP_FILE, "utf8") : "";
    if (currentCss !== css) {
      console.error(
        "  FAIL  desktop-app tokens have drifted from the design system." +
          NL +
          "        Run: node scripts/generate-cross-platform-tokens.mjs",
      );
      process.exit(1);
    }
  }

  const current = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, "utf8") : "";
  if (current !== dart) {
    console.error(
      "  FAIL  unierp-mobile tokens have drifted from the design system.\n" +
        "        Run: node scripts/generate-cross-platform-tokens.mjs",
    );
    process.exit(1);
  }
  console.log("  ok    mobile tokens match the design system");
  process.exit(0);
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, dart);
console.log(`  ok    Dart tokens generated from meridian → ${OUT_FILE}`);

if (existsSync(DESKTOP_DIR)) {
  writeFileSync(DESKTOP_FILE, css);
  console.log(`  ok    desktop CSS tokens generated → ${DESKTOP_FILE}`);
}
