import fs from "node:fs";
import path from "node:path";

const SRC_TOKENS = path.resolve("src/tokens");
const CORE_TOKENS = path.resolve("src/core/tokens");

// 1. Root css files in src/tokens
const rootCssFiles = [
  "base.css",
  "charts.css",
  "design-tokens.css",
  "index.css",
  "meridian-chrome.css",
  "strata-chrome.css",
  "studio.css",
];

for (const f of rootCssFiles) {
  const p = path.join(SRC_TOKENS, f);
  fs.writeFileSync(p, `@import "../core/tokens/${f}";\n`);
  console.log(`Updated compatibility redirect: src/tokens/${f}`);
}

// 2. TypeScript files in src/tokens
fs.writeFileSync(
  path.join(SRC_TOKENS, "index.ts"),
  `// Backward-compatibility re-export barrel (PLATFORM_ARCHITECTURE.md § 7.2)\nexport * from "../core/tokens";\n`
);
fs.writeFileSync(
  path.join(SRC_TOKENS, "color-presets.ts"),
  `// Backward-compatibility re-export barrel (PLATFORM_ARCHITECTURE.md § 7.2)\nexport * from "../core/tokens/color-presets";\n`
);

// 3. Themes in src/tokens/themes/
const themesDir = path.join(SRC_TOKENS, "themes");
if (fs.existsSync(themesDir)) {
  for (const f of fs.readdirSync(themesDir)) {
    if (f.endsWith(".css")) {
      fs.writeFileSync(
        path.join(themesDir, f),
        `@import "../../core/tokens/themes/${f}";\n`
      );
    }
  }
  console.log(`Updated compatibility redirects in src/tokens/themes/`);
}

// 4. v2 in src/tokens/v2/
const v2Dir = path.join(SRC_TOKENS, "v2");
if (fs.existsSync(v2Dir)) {
  for (const f of fs.readdirSync(v2Dir)) {
    if (f.endsWith(".css")) {
      fs.writeFileSync(
        path.join(v2Dir, f),
        `@import "../../core/tokens/v2/${f}";\n`
      );
    }
  }
  console.log(`Updated compatibility redirects in src/tokens/v2/`);
}

// 5. Sync tokens.g.json
const jsonTarget = path.join(SRC_TOKENS, "tokens.g.json");
const jsonSource = path.join(CORE_TOKENS, "tokens.g.json");
if (fs.existsSync(jsonSource)) {
  fs.copyFileSync(jsonSource, jsonTarget);
  console.log("Synced src/tokens/tokens.g.json");
}

console.log("Tokens compatibility layer updated successfully.");
