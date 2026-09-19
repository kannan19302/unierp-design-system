import fs from "node:fs";
import path from "node:path";

const inputsDir = "d:/UniERP/design-system/src/inputs";
const dirs = fs.readdirSync(inputsDir).filter(d => fs.statSync(path.join(inputsDir, d)).isDirectory());

console.log(`Found ${dirs.length} input components:\n`);
for (const d of dirs) {
  const compDir = path.join(inputsDir, d);
  const files = fs.readdirSync(compDir);
  const hasTsx = files.includes(`${d}.tsx`);
  const hasCss = files.includes(`${d}.module.css`);
  const hasStory = files.includes(`${d}.stories.tsx`);
  const hasTest = files.includes(`${d}.test.tsx`);
  const hasIndex = files.includes("index.ts");
  
  let storyDetails = "no story";
  if (hasStory) {
    const content = fs.readFileSync(path.join(compDir, `${d}.stories.tsx`), "utf8");
    const hasAutodocs = content.includes('"autodocs"') || content.includes("'autodocs'");
    const hasAnatomy = content.includes("AnatomyAndComposition");
    const hasGallery = content.includes("AllStatesGallery");
    storyDetails = `autodocs:${hasAutodocs}, anatomy:${hasAnatomy}, gallery:${hasGallery}`;
  }

  let tsxDetails = "no tsx";
  if (hasTsx) {
    const content = fs.readFileSync(path.join(compDir, `${d}.tsx`), "utf8");
    const hasForwardRef = content.includes("forwardRef");
    const hasMaturity = content.includes("@maturity");
    tsxDetails = `forwardRef:${hasForwardRef}, maturity:${hasMaturity}`;
  }

  console.log(`- ${d.padEnd(30)}: [${tsxDetails}] | [${storyDetails}] | test:${hasTest}`);
}
