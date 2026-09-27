import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");

function findFiles(dir, filter) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findFiles(full, filter));
    } else if (filter(full)) {
      results.push(full);
    }
  }
  return results;
}

const storyFiles = findFiles(SRC, (f) => f.endsWith(".stories.tsx") || f.endsWith(".stories.ts"));
console.log(`Checking relative imports across ${storyFiles.length} story files...`);

let brokenCount = 0;
const brokenByFile = {};

for (const file of storyFiles) {
  const content = fs.readFileSync(file, "utf8");
  const importMatches = content.matchAll(/from\s+["'](\.[^"']+)["']/g);
  for (const m of importMatches) {
    const rel = m[1];
    const resolved = path.resolve(path.dirname(file), rel);
    const candidates = [
      resolved,
      resolved + ".ts",
      resolved + ".tsx",
      resolved + ".js",
      resolved + ".jsx",
      path.join(resolved, "index.ts"),
      path.join(resolved, "index.tsx"),
      path.join(resolved, "index.js"),
    ];

    if (!candidates.some((p) => fs.existsSync(p))) {
      const relFile = path.relative(ROOT, file);
      if (!brokenByFile[relFile]) brokenByFile[relFile] = [];
      brokenByFile[relFile].push(rel);
      brokenCount++;
    }
  }
}

for (const [file, imports] of Object.entries(brokenByFile)) {
  console.log(`\n❌ ${file}:`);
  for (const imp of imports) {
    console.log(`     ↳ ${imp}`);
  }
}

console.log(`\nTotal broken relative imports: ${brokenCount}`);
