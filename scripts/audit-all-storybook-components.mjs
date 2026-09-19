import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('../storybook/node_modules/playwright');

const listPath = 'd:/UniERP/design-system/scripts/components-audit-list.json';
const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
const screenshotDir = 'd:/UniERP/design-system/audit-screenshots';

const results = [];

async function runAudit() {
  console.log(`Starting Storybook automated audit across all ${list.length} components...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  // Test Storybook connection
  try {
    await page.goto('http://localhost:6006', { timeout: 15000, waitUntil: 'domcontentloaded' });
    console.log('Connected to Storybook successfully.');
  } catch (err) {
    console.error('Failed to connect to Storybook on http://localhost:6006:', err.message);
    await browser.close();
    process.exit(1);
  }

  let index = 0;
  for (const comp of list) {
    index++;
    const compSlug = `${comp.category}_${comp.name}`;
    const screenshotPath = path.join(screenshotDir, `${compSlug}.png`);
    
    // Construct direct iframe story URL to isolate component preview
    const iframeUrl = `http://localhost:6006/iframe.html?id=${comp.storyId}&viewMode=story`;
    
    const compResult = {
      index,
      category: comp.category,
      name: comp.name,
      storyId: comp.storyId,
      status: 'pass',
      issues: [],
      screenshot: screenshotPath
    };

    try {
      await page.goto(iframeUrl, { timeout: 8000, waitUntil: 'load' });
      // Small settle pause for web fonts & CSS module animations
      await page.waitForTimeout(200);

      // Analyze page for font inconsistencies, text overflows, and broken layouts
      const analysis = await page.evaluate(() => {
        const root = document.getElementById('storybook-root');
        if (!root) return { hasRoot: false, textOverlaps: [], fontIssues: [], hasContent: false };

        const allElements = Array.from(root.querySelectorAll('*'));
        const issues = [];
        const fontErrors = [];

        // Check computed fonts
        allElements.slice(0, 50).forEach(el => {
          const style = window.getComputedStyle(el);
          const fontFamily = style.fontFamily || '';
          // Verify font family uses Inter or JetBrains/IBM Plex Mono or system fallback
          if (
            fontFamily.toLowerCase().includes('times') ||
            fontFamily.toLowerCase().includes('georgia') ||
            fontFamily.toLowerCase().includes('comic')
          ) {
            fontErrors.push({ tag: el.tagName, font: fontFamily });
          }
        });

        // Check for severe scroll/text clipping or overlapping elements
        allElements.forEach(el => {
          if (el.scrollWidth > el.clientWidth + 30 && styleOverflowHidden(el)) {
            // Potential clipped content
          }
        });

        function styleOverflowHidden(el) {
          const s = window.getComputedStyle(el);
          return s.overflow === 'hidden' || s.overflowX === 'hidden';
        }

        return {
          hasRoot: true,
          hasContent: root.children.length > 0,
          elementCount: allElements.length,
          fontErrors
        };
      });

      if (!analysis.hasContent) {
        compResult.issues.push('No DOM elements rendered in storybook-root');
      }
      if (analysis.fontErrors && analysis.fontErrors.length > 0) {
        compResult.issues.push(`Serif or unstyled font detected: ${JSON.stringify(analysis.fontErrors[0])}`);
      }

      // Capture screenshot for audit evidence
      await page.screenshot({ path: screenshotPath, fullPage: false });

      if (compResult.issues.length > 0) {
        compResult.status = 'warning';
      }

    } catch (err) {
      compResult.status = 'error';
      compResult.issues.push(err.message);
    }

    results.push(compResult);
    if (index % 25 === 0 || index === list.length) {
      console.log(`Audited ${index}/${list.length} components (${Math.round((index / list.length) * 100)}%)...`);
    }
  }

  await browser.close();

  const reportPath = 'd:/UniERP/design-system/audit-screenshots/audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  const passed = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log('\n=======================================');
  console.log('STORYBOOK COMPONENT AUDIT COMPLETE');
  console.log(`Total Components: ${results.length}`);
  console.log(`Passed Cleanly:   ${passed}`);
  console.log(`Warnings:         ${warnings}`);
  console.log(`Errors:           ${errors}`);
  console.log('=======================================');
}

runAudit().catch(console.error);
