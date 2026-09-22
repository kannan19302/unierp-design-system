import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("src");
const CORE_DIR = path.join(SRC_DIR, "core");

const COMPONENT_CATEGORIES = [
  "blocks",
  "brand",
  "charts",
  "components",
  "dashboard",
  "data-display",
  "data-grid",
  "form-engine",
  "forms",
  "hooks",
  "icons",
  "inputs",
  "layout",
  "navigation",
  "notifications",
  "overlays",
  "primitives",
  "shell",
  "studio",
  "theme",
  "utils",
  "workflow",
];

for (const cat of COMPONENT_CATEGORIES) {
  const catDir = path.join(SRC_DIR, cat);
  if (!fs.existsSync(catDir)) continue;

  const entries = fs.readdirSync(catDir);
  for (const entry of entries) {
    const full = path.join(catDir, entry);
    if (fs.statSync(full).isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else if (entry !== "index.ts") {
      fs.rmSync(full, { force: true });
    }
  }

  // Ensure index.ts contains sole compatibility re-export
  fs.writeFileSync(
    path.join(catDir, "index.ts"),
    `// Backward-compatibility re-export barrel (PLATFORM_ARCHITECTURE.md § 7.2)\nexport * from "../core/${cat}";\n`
  );
  console.log(`Cleaned up legacy src/${cat} -> re-exporting from ../core/${cat}`);
}

// Move src/screens into src/core/templates/screens
const screensSrc = path.join(SRC_DIR, "screens");
if (fs.existsSync(screensSrc)) {
  const screensTarget = path.join(CORE_DIR, "templates", "screens");
  if (!fs.existsSync(screensTarget)) {
    fs.mkdirSync(screensTarget, { recursive: true });
  }
  for (const file of fs.readdirSync(screensSrc)) {
    fs.copyFileSync(path.join(screensSrc, file), path.join(screensTarget, file));
  }
  fs.rmSync(screensSrc, { recursive: true, force: true });
  console.log("Moved src/screens into src/core/templates/screens");
}

console.log("All legacy component duplicates cleaned successfully.");
