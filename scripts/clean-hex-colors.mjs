import fs from "node:fs";
import path from "node:path";

const filesToFix = [
  "src/core/feedback/feedback-toast/feedback-toast.module.css",
  "src/core/patterns/approval-card/approval-card.module.css",
  "src/core/patterns/multi-step-wizard/multi-step-wizard.module.css",
  "src/platforms/desktop/desktop-titlebar/desktop-titlebar.module.css",
  "src/platforms/identity/session-expiry-modal/session-expiry-modal.module.css",
  "src/platforms/marketplace/extension-card/extension-card.module.css",
  "src/platforms/marketplace/listing-detail-header/listing-detail-header.module.css",
  "src/platforms/mobile/mobile-bottom-nav/mobile-bottom-nav.module.css",
  "src/platforms/sites/site-footer/site-footer.module.css",
  "src/platforms/sites/site-header/site-header.module.css",
];

for (const rel of filesToFix) {
  const p = path.resolve(rel);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, "utf8");

  content = content.replace(/#ffffff/g, "var(--color-text-inverse)");
  content = content.replace(/#94a3b8/g, "var(--color-text-muted)");
  content = content.replace(/#64748b/g, "var(--color-text-muted)");
  content = content.replace(/#cbd5e1/g, "var(--color-border)");
  content = content.replace(/#1e293b/g, "var(--color-border-subtle)");
  content = content.replace(/#d97706/g, "var(--color-warning-text)");
  content = content.replace(/#f59e0b/g, "var(--color-warning)");
  content = content.replace(/#10b981/g, "var(--color-success)");

  fs.writeFileSync(p, content);
  console.log(`Cleaned hex colors in ${rel}`);
}
