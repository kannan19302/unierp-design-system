import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(root, path), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const tokens = "src/foundation/tokens";
const declaration = (css, name) => new RegExp(`${name}:\\s*([^;]+);`).exec(css)?.[1].trim();

test("standalone tokens preserve the canonical heading/body/code families", () => {
  const typo = read(`${tokens}/typography.css`);
  assert.match(declaration(typo, "--font-sans"), /^"Inter",/);
  assert.match(declaration(typo, "--font-display"), /^"Inter",/);
  assert.match(declaration(typo, "--font-mono"), /^"IBM Plex Mono",/);
});

test("canonical component radius scale adheres to Strata standards", () => {
  const radius = read(`${tokens}/radius.css`);
  assert.equal(declaration(radius, "--radius"), "0.375rem", "default component radius is 6px");
  assert.equal(declaration(radius, "--radius-md"), "0.375rem", "default component radius alias is 6px");
  assert.equal(declaration(radius, "--radius-lg"), "0.5rem", "card/container radius is 8px");
});

test("surface roles are defined at every theme boundary and use the active palette", () => {
  const css = read(`${tokens}/surfaces.css`);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, "surfaces must not contain a competing palette");
});

test("aggregate styles load Inter and heading family explicitly", () => {
  assert.match(read("src/foundation/styles/globals.css"), /@import "\.\/fonts.css"/);
  assert.match(read("src/foundation/styles/fonts.css"), /family=Inter/);
  const heading = /h6\s*\{([^}]+)\}/.exec(read("src/foundation/styles/layers/base.css"))?.[1];
  assert.equal(declaration(heading, "font-family"), "var(--font-display)");
  assert.match(read("src/foundation/icons/index.ts"), /export \* from "lucide-react"/);
});

/* ══════════════════════════════════════════════════════════════
   Strata Canonical Foundation Token Architecture Verification
   ══════════════════════════════════════════════════════════════ */

const canonicalFiles = [
  "primitives.css", "typography.css", "spacing.css", "radius.css",
  "borders.css", "elevation.css", "opacity.css", "motion.css",
  "z-index.css", "focus.css", "icons.css", "layout.css",
  "colors.css", "surfaces.css", "density.css", "charts.css",
  "studio.css", "keyframes.css", "platform-accents.css",
  "themes/strata-dark.css", "themes/strata-high-contrast.css",
  "index.css"
];

test("Strata canonical token files all exist and are imported by index.css", () => {
  const indexCss = read(`${tokens}/index.css`);
  for (const file of canonicalFiles) {
    assert.ok(read(`${tokens}/${file}`).length > 0, `${file} must exist and be non-empty`);
    if (file !== "index.css") {
      const importName = `./${file}`;
      assert.ok(
        indexCss.includes(importName),
        `index.css must import ${importName}`
      );
    }
  }
});

test("Strata locked baseline: Inter fonts and 6-8px component radius", () => {
  const typo = read(`${tokens}/typography.css`);
  assert.match(declaration(typo, "--font-sans"), /^"Inter",/);
  assert.match(declaration(typo, "--font-display"), /^"Inter",/);
  assert.match(declaration(typo, "--font-mono"), /^"IBM Plex Mono",/);

  const radius = read(`${tokens}/radius.css`);
  assert.equal(declaration(radius, "--radius"), "0.375rem", "default component radius is 6px");
  assert.equal(declaration(radius, "--radius-md"), "0.375rem", "default component radius alias is 6px");
  assert.equal(declaration(radius, "--radius-lg"), "0.5rem", "card/container radius is 8px");
});

test("Strata base color neutral: 11-step zinc primitive ramp and neutral semantic base", () => {
  const primitives = read(`${tokens}/primitives.css`);
  for (const step of ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]) {
    assert.ok(declaration(primitives, `--prim-zinc-${step}`), `prim-zinc-${step} must exist`);
  }

  const colors = read(`${tokens}/colors.css`);
  assert.equal(declaration(colors, "--color-bg"), "var(--prim-zinc-50)");
  assert.equal(declaration(colors, "--color-text"), "var(--prim-zinc-950)");
  assert.equal(declaration(colors, "--color-border"), "var(--prim-zinc-200)");
});

test("Strata density matrix: 4 tiers with explicit row heights and controls", () => {
  const density = read(`${tokens}/density.css`);
  assert.ok(density.includes("[data-density=\"comfortable\"]"));
  assert.ok(density.includes("[data-density=\"standard\"]"));
  assert.ok(density.includes("[data-density=\"compact\"]"));
  assert.ok(density.includes("[data-density=\"ultra-compact\"]"));
  assert.match(density, /--density-row-height:\s*32px;/);
  assert.match(density, /--density-row-height:\s*40px;/);
  assert.match(density, /--density-row-height:\s*28px;/);
  assert.match(density, /--density-row-height:\s*24px;/);
});

test("explicit density tokens override the unscoped root fallback at every input size", () => {
  const density = read(`${tokens}/density.css`);
  assert.match(density, /:where\(:root\),\s*\[data-density="standard"\]/);

  const expected = {
    "ultra-compact": { sm: 20, base: 24, lg: 28 },
    compact: { sm: 24, base: 28, lg: 32 },
    standard: { sm: 28, base: 32, lg: 40 },
    comfortable: { sm: 32, base: 40, lg: 48 },
  };
  for (const [mode, heights] of Object.entries(expected)) {
    const selector = new RegExp(`\\[data-density="${mode}"\\]\\s*\\{([^}]+)\\}`);
    const block = selector.exec(density)?.[1];
    assert.ok(block, `missing ${mode} token block`);
    for (const [size, height] of Object.entries(heights)) {
      const token = size === "base" ? "--density-control-height" : `--density-control-height-${size}`;
      assert.match(block, new RegExp(`${token}:\\s*${height}px;`));
    }
  }
});

test("Strata platform accents: platform scopes with light, dark, and border variants", () => {
  const accents = read(`${tokens}/platform-accents.css`);
  for (const scope of ["platform-admin", "apps", "tenant-admin", "developer", "marketplace", "ops", "marketing"]) {
    assert.ok(accents.includes(`[data-scope="${scope}"]`), `missing [data-scope="${scope}"] selector`);
  }
  assert.ok(accents.includes("--scope-accent:"), "missing --scope-accent");
  assert.ok(accents.includes("--scope-accent-hover:"), "missing --scope-accent-hover");
  assert.ok(accents.includes("--scope-accent-light:"), "missing --scope-accent-light");
  assert.ok(accents.includes("--scope-accent-border:"), "missing --scope-accent-border");
});

test("Strata dark and high-contrast themes provide full inverted token sets and aliases", () => {
  const dark = read(`${tokens}/themes/strata-dark.css`);
  assert.ok(dark.includes("[data-theme=\"dark\"]"));
  assert.ok(dark.includes("[data-theme=\"strata-dark\"]"));
  assert.equal(declaration(dark, "--color-bg"), "var(--prim-zinc-950)");
  assert.equal(declaration(dark, "--color-text"), "var(--prim-zinc-50)");

  const hc = read(`${tokens}/themes/strata-high-contrast.css`);
  assert.ok(hc.includes("[data-theme=\"high-contrast\"]"));
  assert.ok(hc.includes("[data-theme=\"strata-high-contrast\"]"));
  assert.equal(declaration(hc, "--color-border"), "var(--prim-zinc-400)");
});
