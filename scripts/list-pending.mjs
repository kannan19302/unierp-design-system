import fs from "node:fs";
import path from "node:path";

const catDir = "d:/UniERP/design-system/src/data-display";
const dirs = fs.readdirSync(catDir).filter(d => fs.statSync(path.join(catDir, d)).isDirectory());
const pending = [];
for (const d of dirs) {
  const compDir = path.join(catDir, d);
  const files = fs.readdirSync(compDir);
  const hasTsx = files.includes(`${d}.tsx`);
  if (!hasTsx) continue;
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
  if (!(fRef && mat && auto && anat && gal && hasTest)) {
    pending.push({ name: d, fRef, mat, auto, anat, gal, hasTest });
  }
}
console.log(`Pending components (${pending.length}):`);
for (const p of pending) {
  console.log(`- ${p.name}: fRef=${p.fRef}, mat=${p.mat}, auto=${p.auto}, anat=${p.anat}, gal=${p.gal}, hasTest=${p.hasTest}`);
}
