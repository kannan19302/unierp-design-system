import fs from "node:fs";
import path from "node:path";

const srcDir = "d:/UniERP/design-system/src";
const categories = [
  "primitives",
  "inputs",
  "shell",
  "overlays",
  "navigation",
  "studio",
  "dashboard",
  "charts",
  "data-display",
  "data-grid",
  "forms",
  "workflow",
  "layout",
  "notifications",
];

console.log("=== 10 PILLARS COMPLIANCE SUMMARY ===");
let grandTotal = 0;
let grandCompliant = 0;

for (const cat of categories) {
  const catDir = path.join(srcDir, cat);
  if (!fs.existsSync(catDir)) continue;
  const dirs = fs
    .readdirSync(catDir)
    .filter((d) => fs.statSync(path.join(catDir, d)).isDirectory());

  let compCount = dirs.length;
  let compliant = 0;

  for (const d of dirs) {
    const compDir = path.join(catDir, d);
    const files = fs.readdirSync(compDir);
    const hasTsx = files.includes(`${d}.tsx`);
    if (!hasTsx) {
      compCount--;
      continue;
    }
    const hasStory = files.includes(`${d}.stories.tsx`);
    const hasTest = files.includes(`${d}.test.tsx`);
    let fRef = false, mat = false, auto = false, anat = false, gal = false;
    if (hasStory) {
      const c = fs.readFileSync(path.join(compDir, `${d}.stories.tsx`), "utf8");
      auto = c.includes("autodocs");
      anat = c.includes("AnatomyAndComposition");
      gal = c.includes("AllStatesGallery");
    }
    if (hasTsx) {
      const c = fs.readFileSync(path.join(compDir, `${d}.tsx`), "utf8");
      fRef = c.includes("forwardRef") || c.includes("extends Component");
      mat = c.includes("@maturity");
    }
    if (fRef && mat && auto && anat && gal && hasTest) compliant++;
  }
  grandTotal += compCount;
  grandCompliant += compliant;
  const pct = Math.round((compliant / (compCount || 1)) * 100);
  console.log(`${cat.padEnd(16)}: ${compliant.toString().padStart(2)} / ${compCount.toString().padStart(2)} (${pct.toString().padStart(3)}%)`);
}
console.log("---------------------------------------");
console.log(`TOTAL           : ${grandCompliant.toString().padStart(2)} / ${grandTotal.toString().padStart(2)} (${Math.round((grandCompliant/grandTotal)*100)}%)`);
console.log("=======================================");
