import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("../storybook/node_modules/playwright");

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const screens = [
    { id: "screens-financeledgerscreen--enterprise-finance-workbench", name: "screen_finance_ledger_workbench.png" },
    { id: "screens-operationsconsolescreen--cloud-operations-command-center", name: "screen_operations_command_center.png" },
    { id: "screens-clinicaldecisionsupportscreen--hospital-emergency-cds-workbench", name: "screen_clinical_decision_support.png" },
  ];

  const outDir = path.resolve("audit-screenshots", "screens");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const s of screens) {
    const url = `http://localhost:6006/iframe.html?id=${s.id}&viewMode=story`;
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const dest = path.join(outDir, s.name);
    await page.screenshot({ path: dest, fullPage: true });
    console.log(`Saved screenshot: ${dest}`);
  }

  await browser.close();
  console.log("Screenshots captured successfully.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
