import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const tokens = "src/core/tokens";
const themes = ["strata", "strata-dark", "strata-high-contrast", "meridian", "meridian-dark", "high-contrast"];
const declaration = (css, name) => new RegExp(`${name}:\\s*([^;]+);`).exec(css)?.[1].trim();

test("standalone themes preserve the canonical heading/body/code families", () => {
  const base = read(`${tokens}/base.css`);
  assert.match(declaration(base, "--font-sans"), /^"Inter",/);
  assert.equal(declaration(base, "--font-display"), declaration(base, "--font-sans"));
  assert.match(declaration(base, "--font-mono"), /^"IBM Plex Mono",/);
  for (const theme of themes) {
    for (const role of ["--font-sans", "--font-display", "--font-mono"]) {
      assert.equal(declaration(read(`${tokens}/themes/${theme}.css`), role), declaration(base, role), `${theme}: ${role}`);
    }
  }
  assert.doesNotMatch(read(`${tokens}/v2/typography.css`), /--font-(?:sans|display|mono):/,
    "the extended entrypoint must not redefine foundation families");
});

test("theme switching cannot override the default radius scale", () => {
  const base = read(`${tokens}/base.css`);
  for (const [size, value] of Object.entries({ xs: "0.25rem", sm: "0.375rem", md: "0.5rem", lg: "0.625rem", xl: "0.75rem", "2xl": "1rem" })) {
    assert.equal(declaration(base, `--radius-${size}`), value);
  }
  for (const path of [...themes.map((name) => `themes/${name}.css`), "strata-chrome.css", "meridian-chrome.css"]) {
    assert.doesNotMatch(read(`${tokens}/${path}`), /--radius-(?:xs|sm|md|lg|xl|2xl):/, path);
  }
});

test("surface roles are defined at every theme boundary and use the active palette", () => {
  const css = read(`${tokens}/v2/surfaces.css`);
  const boundary = /:root\s*,\s*\[data-theme\]\s*\{([^}]+)\}/.exec(css)?.[1];
  assert.ok(boundary, "a root-only alias freezes colours inherited by a nested theme");
  for (const [role, source] of Object.entries({
    "--surface-0-bg": "--color-bg",
    "--surface-1-bg": "--color-bg-elevated",
    "--surface-2-bg": "--color-bg-elevated",
    "--surface-3-bg": "--color-bg-elevated",
    "--surface-4-bg": "--color-bg-overlay",
    "--surface-selected": "--color-primary-light",
    "--surface-text-primary": "--color-text",
    "--separator-color": "--color-border",
  })) {
    assert.equal(declaration(boundary, role), `var(${source})`, role);
    for (const theme of themes) {
      assert.ok(declaration(read(`${tokens}/themes/${theme}.css`), source), `${theme}: missing ${source}`);
    }
  }
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, "surfaces must not contain a competing palette");
  assert.match(css, /\[data-theme="strata-high-contrast"\],\s*\[data-theme="high-contrast"\]/);
});

test("aggregate styles load Inter and heading family explicitly", () => {
  assert.match(read("src/core/styles/globals.css"), /@import "\.\/fonts.css"/);
  assert.match(read("src/core/styles/fonts.css"), /family=Inter/);
  const heading = /h6\s*\{([^}]+)\}/.exec(read("src/core/styles/layers/base.css"))?.[1];
  assert.equal(declaration(heading, "font-family"), "var(--font-display)");
  assert.match(read("src/core/icons/index.ts"), /export \* from "lucide-react"/);
});

/* ══════════════════════════════════════════════════════════════
   Strata DL 3.0 Foundation Token Architecture Verification
   ══════════════════════════════════════════════════════════════ */

const v3Tokens = "src/core/tokens/v3";
const v3Files = [
  "primitives.css", "typography.css", "spacing.css", "radius.css",
  "borders.css", "elevation.css", "opacity.css", "motion.css",
  "z-index.css", "focus.css", "icons.css", "layout.css",
  "colors.css", "surfaces.css", "density.css", "charts.css",
  "keyframes.css", "platform-accents.css",
  "themes/strata-dark.css", "themes/strata-high-contrast.css",
  "index.css"
];

test("Strata DL 3.0 token files all exist and are imported by index.css", () => {
  const indexCss = read(`${v3Tokens}/index.css`);
  for (const file of v3Files) {
    assert.ok(read(`${v3Tokens}/${file}`).length > 0, `${file} must exist and be non-empty`);
    if (file !== "index.css") {
      const importName = `./${file}`;
      assert.ok(
        indexCss.includes(importName),
        `index.css must import ${importName}`
      );
    }
  }
});

test("Strata DL 3.0 locked baseline: Inter fonts and 6-8px component radius", () => {
  const typo = read(`${v3Tokens}/typography.css`);
  assert.match(declaration(typo, "--font-sans"), /^"Inter",/);
  assert.match(declaration(typo, "--font-display"), /^"Inter",/);
  assert.match(declaration(typo, "--font-mono"), /^"IBM Plex Mono",/);

  const radius = read(`${v3Tokens}/radius.css`);
  assert.equal(declaration(radius, "--radius"), "0.375rem", "default component radius is 6px");
  assert.equal(declaration(radius, "--radius-md"), "0.375rem", "default component radius alias is 6px");
  assert.equal(declaration(radius, "--radius-lg"), "0.5rem", "card/container radius is 8px");
});

test("Strata DL 3.0 base color neutral: 11-step zinc primitive ramp and neutral semantic base", () => {
  const primitives = read(`${v3Tokens}/primitives.css`);
  for (const step of ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]) {
    assert.ok(declaration(primitives, `--prim-zinc-${step}`), `prim-zinc-${step} must exist`);
  }

  const colors = read(`${v3Tokens}/colors.css`);
  assert.equal(declaration(colors, "--color-bg"), "var(--prim-zinc-50)");
  assert.equal(declaration(colors, "--color-text"), "var(--prim-zinc-950)");
  assert.equal(declaration(colors, "--color-border"), "var(--prim-zinc-200)");
});

test("Strata DL 3.0 density matrix: 4 tiers with explicit row heights and controls", () => {
  const density = read(`${v3Tokens}/density.css`);
  assert.ok(density.includes("[data-density=\"comfortable\"]"));
  assert.ok(density.includes("[data-density=\"standard\"]"));
  assert.ok(density.includes("[data-density=\"compact\"]"));
  assert.ok(density.includes("[data-density=\"ultra-compact\"]"));
  assert.match(density, /--density-row-height:\s*32px;/);
  assert.match(density, /--density-row-height:\s*40px;/);
  assert.match(density, /--density-row-height:\s*28px;/);
  assert.match(density, /--density-row-height:\s*24px;/);
});

test("Strata DL 3.0 platform accents: platform scopes with light, dark, and border variants", () => {
  const accents = read(`${v3Tokens}/platform-accents.css`);
  for (const scope of ["platform-admin", "apps", "tenant-admin", "developer", "marketplace", "ops", "marketing"]) {
    assert.ok(accents.includes(`[data-scope="${scope}"]`), `missing [data-scope="${scope}"] selector`);
  }
  assert.ok(accents.includes("--scope-accent:"), "missing --scope-accent");
  assert.ok(accents.includes("--scope-accent-hover:"), "missing --scope-accent-hover");
  assert.ok(accents.includes("--scope-accent-light:"), "missing --scope-accent-light");
  assert.ok(accents.includes("--scope-accent-border:"), "missing --scope-accent-border");
});

test("Strata DL 3.0 dark and high-contrast themes provide full inverted token sets", () => {
  const dark = read(`${v3Tokens}/themes/strata-dark.css`);
  assert.ok(dark.includes("[data-theme=\"dark\"]"));
  assert.ok(dark.includes("[data-theme=\"strata-dark\"]"));
  assert.equal(declaration(dark, "--color-bg"), "var(--prim-zinc-950)");
  assert.equal(declaration(dark, "--color-text"), "var(--prim-zinc-50)");

  const hc = read(`${v3Tokens}/themes/strata-high-contrast.css`);
  assert.ok(hc.includes("[data-theme=\"high-contrast\"]"));
  assert.ok(hc.includes("[data-theme=\"strata-high-contrast\"]"));
  assert.equal(declaration(hc, "--color-border"), "var(--prim-zinc-400)");
});

