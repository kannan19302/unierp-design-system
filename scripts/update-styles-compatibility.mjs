import fs from "node:fs";
import path from "node:path";

const SRC_STYLES = path.resolve("src/styles");

fs.writeFileSync(path.join(SRC_STYLES, "globals.css"), `@import "../core/styles/globals.css";\n`);
fs.writeFileSync(path.join(SRC_STYLES, "fonts.css"), `@import "../core/styles/fonts.css";\n`);

const layersDir = path.join(SRC_STYLES, "layers");
if (fs.existsSync(layersDir)) {
  for (const f of fs.readdirSync(layersDir)) {
    if (f.endsWith(".css")) {
      fs.writeFileSync(
        path.join(layersDir, f),
        `@import "../../core/styles/layers/${f}";\n`
      );
    }
  }
}
console.log("Styles compatibility layer updated.");
