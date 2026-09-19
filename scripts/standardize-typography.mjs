import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'd:/UniERP/design-system/src';
const listPath = 'd:/UniERP/design-system/scripts/components-audit-list.json';
const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));

const modifiedComps = [];

for (const item of list) {
  const cssPath = path.join(srcDir, item.category, item.name, `${item.name}.module.css`);
  if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    let modified = false;

    // Standardize legacy font family vars to canonical Strata DL 3.0 tokens
    if (css.includes('--font-family-mono')) {
      css = css.replace(/var\(--font-family-mono(,\s*[^)]+)?\)/g, 'var(--font-mono)');
      modified = true;
    }
    if (css.includes('--font-family-sans')) {
      css = css.replace(/var\(--font-family-sans(,\s*[^)]+)?\)/g, 'var(--font-sans)');
      modified = true;
    }

    // Standardize tabular numerals for metrics, currency, balances, ledger amounts
    if (css.match(/\.(amount|balance|rate|currency|metricValue|statValue|valNum|cellNum|thNum)\b/i)) {
      if (!css.includes('font-variant-numeric')) {
        // Find matching selector block and append tabular-nums
        css = css.replace(
          /(\.(amount|balance|rate|currency|metricValue|statValue|valNum|cellNum|thNum)[^{]*\{[^}]*)(\})/gi,
          (match, p1, p2, p3) => {
            if (!p1.includes('font-variant-numeric')) {
              return `${p1}  font-variant-numeric: tabular-nums lining-nums;\n${p3}`;
            }
            return match;
          }
        );
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(cssPath, css, 'utf8');
      modifiedComps.push(item.name);
    }
  }
}

console.log(`Standardized typography & tabular-nums across ${modifiedComps.length} components:`);
console.log(modifiedComps);
