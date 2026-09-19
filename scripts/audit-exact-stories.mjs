import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('../storybook/node_modules/playwright');

const index = JSON.parse(fs.readFileSync('d:/UniERP/design-system/storybook/storybook-static/index.json', 'utf8'));
const entries = index.entries;

const list = JSON.parse(fs.readFileSync('d:/UniERP/design-system/scripts/components-audit-list.json', 'utf8'));
const screenshotDir = 'd:/UniERP/design-system/audit-screenshots';

// Build map from component name to its primary story ID in index.json
const storyMap = new Map();

for (const [storyId, entry] of Object.entries(entries)) {
  if (entry.type !== 'story') continue;
  // Match componentPath: e.g. "../src/primitives/alert/alert.tsx"
  const compPath = entry.componentPath || entry.importPath;
  if (!compPath) continue;
  
  const m = compPath.match(/src\/([^\/]+)\/([^\/]+)\//);
  if (m) {
    const cat = m[1];
    const name = m[2];
    const key = `${cat}:${name}`;
    if (!storyMap.has(key) || storyId.endsWith('--default') || storyId.endsWith('--info')) {
      storyMap.set(key, storyId);
    }
  }
}

async function runExactAudit() {
  console.log(`Starting exact audit for all ${list.length} components using Storybook index.json entries...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  let passed = 0;
  let missing = 0;
  const auditResults = [];

  for (let i = 0; i < list.length; i++) {
    const comp = list[i];
    const key = `${comp.category}:${comp.name}`;
    const storyId = storyMap.get(key);

    if (!storyId) {
      console.warn(`[MISSING STORY] ${key}`);
      missing++;
      continue;
    }

    const iframeUrl = `http://localhost:6006/iframe.html?id=${storyId}&viewMode=story`;
    const screenshotPath = path.join(screenshotDir, `${comp.category}_${comp.name}.png`);

    try {
      await page.goto(iframeUrl, { timeout: 8000, waitUntil: 'load' });
      await page.waitForTimeout(150);

      const check = await page.evaluate(() => {
        const root = document.getElementById('storybook-root');
        if (!root) return { hasRoot: false, count: 0 };
        return {
          hasRoot: true,
          count: root.children.length,
          text: root.innerText.slice(0, 100)
        };
      });

      await page.screenshot({ path: screenshotPath, fullPage: false });
      auditResults.push({
        name: comp.name,
        category: comp.category,
        storyId,
        rendered: check.count > 0,
        status: 'pass'
      });
      passed++;

    } catch (err) {
      console.error(`[ERROR] ${key}:`, err.message);
      auditResults.push({
        name: comp.name,
        category: comp.category,
        storyId,
        status: 'error',
        error: err.message
      });
    }

    if ((i + 1) % 50 === 0 || i + 1 === list.length) {
      console.log(`Audited & Screenshotted: ${i + 1}/${list.length} (${Math.round(((i + 1) / list.length) * 100)}%)...`);
    }
  }

  await browser.close();

  fs.writeFileSync('d:/UniERP/design-system/audit-screenshots/exact-audit-report.json', JSON.stringify(auditResults, null, 2));

  console.log('\n=======================================');
  console.log('EXACT AUDIT COMPLETE');
  console.log(`Total Checked:      ${list.length}`);
  console.log(`Screenshots Captured: ${passed}`);
  console.log(`Unmatched Stories:    ${missing}`);
  console.log('=======================================');
}

runExactAudit().catch(console.error);
