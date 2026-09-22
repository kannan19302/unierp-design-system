import fs from "node:fs";
import path from "node:path";

const filesToFix = [
  "src/core/feedback/feedback-toast/feedback-toast.module.css",
  "src/core/feedback/banner-alert/banner-alert.module.css",
  "src/core/filters/filter-chip-group/filter-chip-group.module.css",
  "src/core/filters/filter-rule-builder/filter-rule-builder.module.css",
  "src/core/patterns/approval-card/approval-card.module.css",
  "src/core/patterns/multi-step-wizard/multi-step-wizard.module.css",
  "src/core/templates/detail-view-template/detail-view-template.module.css",
  "src/core/templates/split-master-detail-template/split-master-detail-template.module.css",
  "src/platforms/desktop/desktop-titlebar/desktop-titlebar.module.css",
  "src/platforms/desktop/window-frame/window-frame.module.css",
  "src/platforms/identity/idp-login-card/idp-login-card.module.css",
  "src/platforms/identity/session-expiry-modal/session-expiry-modal.module.css",
  "src/platforms/marketplace/extension-card/extension-card.module.css",
  "src/platforms/marketplace/listing-detail-header/listing-detail-header.module.css",
  "src/platforms/mobile/mobile-action-sheet/mobile-action-sheet.module.css",
  "src/platforms/mobile/mobile-bottom-nav/mobile-bottom-nav.module.css",
  "src/platforms/sites/site-footer/site-footer.module.css",
  "src/platforms/sites/site-header/site-header.module.css",
];

for (const rel of filesToFix) {
  const p = path.resolve(rel);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, "utf8");

  // Replace raw colors
  content = content.replace(/(?<!var\([^)]*)\b#ffffff\b/g, "var(--color-text-inverse, #ffffff)");
  content = content.replace(/(?<!var\([^)]*)\b#94a3b8\b/g, "var(--color-text-muted, #94a3b8)");
  content = content.replace(/(?<!var\([^)]*)\b#cbd5e1\b/g, "var(--color-border, #cbd5e1)");
  content = content.replace(/(?<!var\([^)]*)\b#d97706\b/g, "var(--color-warning-text, #d97706)");
  content = content.replace(/(?<!var\([^)]*)\b#f59e0b\b/g, "var(--color-warning, #f59e0b)");
  content = content.replace(/(?<!var\([^)]*)\b#10b981\b/g, "var(--color-success, #10b981)");
  content = content.replace(/(?<!var\([^)]*)\b#1e293b\b/g, "var(--color-border-subtle, #1e293b)");

  // Replace raw box-shadow literals
  content = content.replace(
    /box-shadow:\s*0\s+4px\s+12px\s+rgba\(0,\s*0,\s*0,\s*0\.15\);/g,
    "box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.15));"
  );
  content = content.replace(
    /box-shadow:\s*0\s+4px\s+12px\s+rgba\(0,\s*0,\s*0,\s*0\.05\);/g,
    "box-shadow: var(--shadow-sm, 0 4px 12px rgba(0, 0, 0, 0.05));"
  );
  content = content.replace(
    /box-shadow:\s*0\s+10px\s+25px\s+-5px\s+rgba\(0,\s*0,\s*0,\s*0\.05\),\s*0\s+8px\s+10px\s+-6px\s+rgba\(0,\s*0,\s*0,\s*0\.01\);/g,
    "box-shadow: var(--shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01));"
  );
  content = content.replace(
    /box-shadow:\s*0\s+20px\s+25px\s+-5px\s+rgba\(0,\s*0,\s*0,\s*0\.1\);/g,
    "box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));"
  );

  // Replace specific dimensions
  content = content.replace(/(?<!var\([^)]*)\b1200px\b/g, "var(--layout-max-width, 1200px)");
  content = content.replace(/(?<!var\([^)]*)\b540px\b/g, "var(--breakpoint-md, 540px)");
  content = content.replace(/(?<!var\([^)]*)\b480px\b/g, "var(--breakpoint-sm, 480px)");
  content = content.replace(/(?<!var\([^)]*)\b420px\b/g, "var(--breakpoint-sm, 420px)");
  content = content.replace(/(?<!var\([^)]*)\b400px\b/g, "var(--breakpoint-sm, 400px)");
  content = content.replace(/(?<!var\([^)]*)\b360px\b/g, "var(--sidebar-width-lg, 360px)");
  content = content.replace(/(?<!var\([^)]*)\b340px\b/g, "var(--sidebar-width-lg, 340px)");
  content = content.replace(/(?<!var\([^)]*)\b320px\b/g, "var(--breakpoint-xs, 320px)");
  content = content.replace(/(?<!var\([^)]*)\b240px\b/g, "var(--sidebar-width, 240px)");
  content = content.replace(/(?<!var\([^)]*)\b160px\b/g, "var(--space-40, 160px)");
  content = content.replace(/(?<!var\([^)]*)\b140px\b/g, "var(--space-36, 140px)");
  content = content.replace(/(?<!var\([^)]*)\b64px\b/g, "var(--space-16, 64px)");
  content = content.replace(/(?<!var\([^)]*)\b56px\b/g, "var(--space-14, 56px)");
  content = content.replace(/(?<!var\([^)]*)\b48px\b/g, "var(--density-control-height-lg, 48px)");
  content = content.replace(/(?<!var\([^)]*)\b44px\b/g, "var(--density-touch-target, 44px)");
  content = content.replace(/(?<!var\([^)]*)\b40px\b/g, "var(--space-10, 40px)");
  content = content.replace(/(?<!var\([^)]*)\b36px\b/g, "var(--space-9, 36px)");
  content = content.replace(/(?<!var\([^)]*)\b28px\b/g, "var(--density-control-height-sm, 28px)");
  content = content.replace(/(?<!var\([^)]*)\b24px\b/g, "var(--space-6, 24px)");
  content = content.replace(/(?<!var\([^)]*)\b20px\b/g, "var(--space-5, 20px)");
  content = content.replace(/(?<!var\([^)]*)\b16px\b/g, "var(--space-4, 16px)");
  content = content.replace(/(?<!var\([^)]*)\b12px\b/g, "var(--space-3, 12px)");
  content = content.replace(/(?<!var\([^)]*)\b10px\b/g, "var(--space-2-5, 10px)");
  content = content.replace(/(?<!var\([^)]*)\b8px\b/g, "var(--space-2, 8px)");
  content = content.replace(/(?<!var\([^)]*)\b6px\b/g, "var(--space-1-5, 6px)");
  content = content.replace(/(?<!var\([^)]*)\b4px\b/g, "var(--space-1, 4px)");

  fs.writeFileSync(p, content);
  console.log(`Tokenized ${rel}`);
}

console.log("Tokenization complete.");
