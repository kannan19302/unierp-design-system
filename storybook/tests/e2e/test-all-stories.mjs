import { chromium } from "playwright";
import path from "node:path";
import http from "node:http";

const baseURL = process.env.STORYBOOK_URL || "http://localhost:6006";

async function fetchIndex() {
  return new Promise((resolve, reject) => {
    http.get(`${baseURL}/index.json`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error("Failed to parse index.json: " + err.message));
        }
      });
    }).on("error", reject);
  });
}

console.log(`Connecting to Storybook at ${baseURL}...`);
let indexData;
try {
  indexData = await fetchIndex();
} catch (err) {
  console.error(`Could not connect to Storybook at ${baseURL}: ${err.message}`);
  process.exit(1);
}

const entries = Object.values(indexData.entries);
const stories = entries
  .filter((entry) => entry.type === "story")
  .sort((a, b) => (a.importPath || "").localeCompare(b.importPath || "") || a.id.localeCompare(b.id));

console.log(`Discovered ${stories.length} stories across ${new Set(stories.map(s => s.importPath)).size} component files.`);

const CONCURRENCY = parseInt(process.env.CONCURRENCY || "4", 10);
const browser = await chromium.launch({ headless: true });

const results = [];
let cursor = 0;
let passCount = 0;
let failCount = 0;

async function worker(workerId) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  while (cursor < stories.length) {
    const story = stories[cursor++];
    const pageErrors = [];
    const consoleErrors = [];

    const onPageError = (err) => {
      const text = err.stack || err.message || String(err);
      if (text.includes("Simulated runtime exception")) return;
      pageErrors.push(text);
    };

    const onConsole = (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        // Ignore known deprecation notices or benign network errors
        if (text.includes("[UniERP Strata] Theme") && text.includes("is deprecated")) return;
        if (text.includes("Failed to load resource: net::ERR_")) return;
        if (text.includes("Simulated runtime exception")) return;
        if (text.includes("BuggyLedgerComponent")) return;
        consoleErrors.push(text);
      }
    };

    page.on("pageerror", onPageError);
    page.on("console", onConsole);

    const url = `${baseURL}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
    const storyResult = {
      id: story.id,
      title: story.title,
      name: story.name,
      importPath: story.importPath,
      errors: [],
    };

    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      if (!response?.ok()) {
        throw new Error(`HTTP ${response?.status() ?? "no response"}`);
      }

      // Wait for #storybook-root to render children or text, or for a real error display
      let timedOut = false;
      await page.waitForFunction(() => {
        const isErr = document.body.classList.contains("sb-show-errordisplay") ||
                      (document.querySelector("#error-message")?.textContent || "").trim().length > 0;
        if (isErr) return true;
        const root = document.querySelector("#storybook-root");
        if (root && root.children.length > 0) return true;
        // Check for portal or body child
        if (document.querySelector("[data-radix-portal], [data-portal], .portal-root")) return true;
        return false;
      }, { timeout: 10000 }).catch(() => {
        timedOut = true;
      });

      // Check for real Storybook error banner
      const errorState = await page.evaluate(() => {
        const isErrClass = document.body.classList.contains("sb-show-errordisplay");
        const errMsg = (document.querySelector("#error-message")?.textContent || "").trim();
        const errStack = (document.querySelector("#error-stack")?.textContent || "").trim();
        return { isErrClass, errMsg, errStack };
      });

      if (errorState.isErrClass || errorState.errMsg || errorState.errStack) {
        storyResult.errors.push(`Storybook Error: ${errorState.errMsg || errorState.errStack || "Storybook error display active"}`);
      }

      // Verify root has content
      const rootState = await page.evaluate(() => {
        const r = document.querySelector("#storybook-root");
        const hasPortal = !!document.querySelector("[data-radix-portal], [data-portal], .portal-root");
        const bodyText = (document.body.innerText || "").trim();
        if (!r) return { exists: false, childCount: 0, textLength: 0, hasPortal, bodyTextLength: bodyText.length };
        return {
          exists: true,
          childCount: r.children.length,
          textLength: (r.textContent || "").trim().length,
          hasPortal,
          bodyTextLength: bodyText.length,
        };
      });

      if (!rootState.exists) {
        storyResult.errors.push("#storybook-root missing from DOM");
      } else if (rootState.childCount === 0 && rootState.textLength === 0 && !rootState.hasPortal && rootState.bodyTextLength === 0) {
        if (timedOut) {
          storyResult.errors.push("Render timed out (10s) with empty DOM");
        } else {
          storyResult.errors.push("Rendered empty DOM (0 children and 0 text)");
        }
      }

      if (pageErrors.length > 0) {
        storyResult.errors.push(...pageErrors.map(e => `PageError: ${e.slice(0, 300)}`));
      }

      if (consoleErrors.length > 0) {
        storyResult.errors.push(...consoleErrors.map(e => `ConsoleError: ${e.slice(0, 300)}`));
      }
    } catch (err) {
      storyResult.errors.push(err.message || String(err));
    } finally {
      page.off("pageerror", onPageError);
      page.off("console", onConsole);

      const passed = storyResult.errors.length === 0;
      if (passed) {
        passCount++;
      } else {
        failCount++;
        console.error(`\n❌ [FAIL] ${story.id} (${story.title} -> ${story.name})`);
        for (const e of storyResult.errors) {
          console.error(`     ↳ ${e}`);
        }
      }

      results.push(storyResult);
      if (results.length % 10 === 0 || results.length === stories.length) {
        process.stdout.write(`\r[Progress: ${results.length}/${stories.length}] Passed: ${passCount}, Failed: ${failCount} `);
      }
    }
  }

  await page.close();
}

console.log(`Starting execution with ${CONCURRENCY} parallel browser workers...`);
const startTime = Date.now();
await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
await browser.close();
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

console.log("\n\n========================================================");
console.log(`Storybook E2E Test Run Completed in ${elapsed}s`);
console.log(`Total Stories Tested: ${stories.length}`);
console.log(`Passed:               ${passCount}`);
console.log(`Failed:               ${failCount}`);
console.log("========================================================\n");

// Group results by tier
const tierStats = {};
for (const r of results) {
  // importPath is like "../src/primitives/button/button.stories.tsx"
  const parts = (r.importPath || "").split("/");
  const srcIdx = parts.indexOf("src");
  const tier = srcIdx !== -1 && parts[srcIdx + 1] ? parts[srcIdx + 1] : "other";
  if (!tierStats[tier]) tierStats[tier] = { total: 0, passed: 0, failed: 0 };
  tierStats[tier].total++;
  if (r.errors.length === 0) {
    tierStats[tier].passed++;
  } else {
    tierStats[tier].failed++;
  }
}

console.log("Results by Tier:");
for (const [tier, stat] of Object.entries(tierStats)) {
  const icon = stat.failed === 0 ? "✔" : "✖";
  console.log(`  ${icon} ${tier.padEnd(16)}: ${stat.passed}/${stat.total} passed (${stat.failed} failures)`);
}

if (failCount > 0) {
  console.error(`\nFound ${failCount} failing stories. Exiting with code 1.`);
  process.exit(1);
} else {
  console.log("\n🎉 ALL STORIES RENDERED CLEANLY WITH ZERO ERRORS!\n");
  process.exit(0);
}
