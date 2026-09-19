import fs from "node:fs";
import path from "node:path";

const srcDir = "d:/UniERP/design-system/src";
const categories = [
  "primitives",
  "inputs",
  "navigation",
  "data-display",
  "data-grid",
  "studio",
  "dashboard",
  "charts",
  "shell",
  "forms",
  "workflow",
  "overlays",
  "layout",
  "notifications",
];

const report = {};

for (const cat of categories) {
  const catDir = path.join(srcDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const dirs = fs
    .readdirSync(catDir)
    .filter((d) => fs.statSync(path.join(catDir, d)).isDirectory());

  report[cat] = [];

  for (const d of dirs) {
    const compDir = path.join(catDir, d);
    const files = fs.readdirSync(compDir);
    const hasTsx = files.includes(`${d}.tsx`);
    const hasCss = files.includes(`${d}.module.css`);
    const hasStory = files.includes(`${d}.stories.tsx`);
    const hasTest = files.includes(`${d}.test.tsx`);
    const hasIndex = files.includes("index.ts");

    let hasAutodocs = false;
    let hasAnatomy = false;
    let hasGallery = false;

    if (hasStory) {
      const content = fs.readFileSync(
        path.join(compDir, `${d}.stories.tsx`),
        "utf8",
      );
      hasAutodocs = content.includes('"autodocs"') || content.includes("'autodocs'");
      hasAnatomy = content.includes("AnatomyAndComposition");
      hasGallery = content.includes("AllStatesGallery");
    }

    let hasForwardRef = false;
    let hasMaturity = false;

    if (hasTsx) {
      const content = fs.readFileSync(path.join(compDir, `${d}.tsx`), "utf8");
      hasForwardRef = content.includes("forwardRef") || content.includes("extends Component");
      hasMaturity = content.includes("@maturity");
    }

    report[cat].push({
      name: d,
      hasTsx,
      hasCss,
      hasStory,
      hasTest,
      hasIndex,
      hasForwardRef,
      hasMaturity,
      hasAutodocs,
      hasAnatomy,
      hasGallery,
    });
  }
}

console.log("=== 10 PILLARS AUDIT SUMMARY ===");
for (const [cat, items] of Object.entries(report)) {
  const total = items.length;
  const compliant = items.filter(
    (i) =>
      i.hasForwardRef &&
      i.hasMaturity &&
      i.hasAutodocs &&
      i.hasAnatomy &&
      i.hasGallery &&
      i.hasTest,
  ).length;
  const pct = Math.round((compliant / (total || 1)) * 100);
  console.log(`${cat.padEnd(15)}: ${compliant.toString().padStart(2)} / ${total.toString().padStart(2)} (${pct.toString().padStart(3)}%)`);
}
console.log("=================================\n");

for (const [cat, items] of Object.entries(report)) {
  const total = items.length;
  const compliant = items.filter(
    (i) =>
      i.hasForwardRef &&
      i.hasMaturity &&
      i.hasAutodocs &&
      i.hasAnatomy &&
      i.hasGallery &&
      i.hasTest,
  ).length;
  console.log(
    `[${cat.toUpperCase()}] Total: ${total}, Fully Compliant (10 Pillars): ${compliant} (${Math.round(
      (compliant / (total || 1)) * 100,
    )}%)`,
  );
  const nonCompliant = items.filter(
    (i) =>
      !i.hasForwardRef ||
      !i.hasMaturity ||
      !i.hasAutodocs ||
      !i.hasAnatomy ||
      !i.hasGallery ||
      !i.hasTest,
  );
  if (nonCompliant.length > 0) {
    console.log(
      `   Non-compliant: ${nonCompliant
        .map(
          (n) =>
            `${n.name}(fRef:${n.hasForwardRef},mat:${n.hasMaturity},auto:${n.hasAutodocs},anat:${n.hasAnatomy},gal:${n.hasGallery},test:${n.hasTest})`,
        )
        .join(", ")}`,
    );
  }
}
