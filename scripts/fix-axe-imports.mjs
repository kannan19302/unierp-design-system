import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git" && entry.name !== "dist") {
        walk(full);
      }
    } else if (entry.name.endsWith(".test.tsx") || entry.name.endsWith(".test.ts")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("jest-axe")) {
        const updated = content.replace(/from "jest-axe"/g, 'from "vitest-axe"');
        fs.writeFileSync(full, updated, "utf8");
        console.log("Updated:", full);
      }
    }
  }
}

walk("./src");
