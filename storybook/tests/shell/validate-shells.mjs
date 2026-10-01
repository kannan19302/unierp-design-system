import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const storybookRoot = path.resolve(import.meta.dirname, "../..");
const designRoot = path.resolve(storybookRoot, "..");
const evidenceDir = process.env.SHELL_EVIDENCE_DIR
  ? path.resolve(process.env.SHELL_EVIDENCE_DIR)
  : path.resolve(designRoot, "docs/evidence/strata-shell-browser-current");
const index = JSON.parse(readFileSync(path.join(storybookRoot, "storybook-static/index.json"), "utf8"));
const allStories = Object.values(index.entries)
  .filter((entry) => entry.type === "story" && entry.importPath?.includes("/shells/"))
  .sort((a, b) => a.importPath.localeCompare(b.importPath) || a.id.localeCompare(b.id));
const shellName = (story) => story.importPath.split("/shells/")[1].split("/")[0];
const requestedShell = process.argv.find((arg) => arg.startsWith("--shell="))?.slice("--shell=".length);
const themes = ["strata", "strata-dark", "strata-high-contrast"];
const requiredShells = [
  "app-shell",
  "catalog-shell",
  "dashboard-shell",
  "data-shell",
  "editor-shell",
  "manifest",
  "record-shell",
  "settings-shell",
  "strata-bar",
];
if (requestedShell && !requiredShells.includes(requestedShell)) {
  throw new Error(`Shell validator received unknown shell "${requestedShell}"`);
}
const stories = requestedShell ? allStories.filter((story) => shellName(story) === requestedShell) : allStories;
if (stories.length === 0) throw new Error(`Shell validator discovered zero Storybook stories${requestedShell ? ` for ${requestedShell}` : ""}`);
const densities = ["ultra-compact", "compact", "standard", "comfortable"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];
const isMobileSmoke = process.argv.includes("--mobile-smoke");
const isSmoke = process.argv.includes("--smoke") || isMobileSmoke;
const baseURL = process.env.SHELL_STORYBOOK_URL || "http://127.0.0.1:6006";
const axePackage = readdirSync(path.join(storybookRoot, "node_modules/.pnpm"))
  .find((name) => name.startsWith("axe-core@"));
const axePath = axePackage
  ? path.join(storybookRoot, "node_modules/.pnpm", axePackage, "node_modules/axe-core/axe.min.js")
  : undefined;
if (!axePath || !existsSync(axePath)) throw new Error("Shell validator cannot run axe: axe-core is unavailable");
const discoveredShells = [...new Set(stories.map(shellName))].sort();
const expectedShells = requestedShell ? [requestedShell] : requiredShells;
const primary = expectedShells.map((shell) =>
  stories.find((story) => shellName(story) === shell && story.id.endsWith("--default")),
);
const missingShells = expectedShells.filter((shell, index) => !primary[index] || !discoveredShells.includes(shell));
const unexpectedShells = discoveredShells.filter((shell) => !requiredShells.includes(shell));
if (missingShells.length || unexpectedShells.length || primary.some((story) => !story)) {
  throw new Error(
    `Shell validator expected required groups [${expectedShells.join(", ")}] with default stories; ` +
    `missing [${missingShells.join(", ")}], unexpected [${unexpectedShells.join(", ")}]`,
  );
}

function scenario(story, theme, density, viewport, accessibility, screenshot) {
  return { story, shell: shellName(story), theme, density, viewport, accessibility, screenshot };
}

const scenarios = isSmoke
  ? [scenario(primary[0], "strata", "standard", isMobileSmoke ? viewports[0] : viewports[2], true, true)]
  : [
      ...stories.map((story) =>
        scenario(story, "strata", "standard", viewports[2], true, primary.includes(story)),
      ),
      ...primary.flatMap((story) =>
        themes.flatMap((theme) =>
          densities.flatMap((density) =>
            viewports.map((viewport) =>
              scenario(
                story,
                theme,
                density,
                viewport,
                density === "standard" && (viewport.name === "mobile" || theme === "strata-high-contrast"),
                density === "standard" && viewport.name !== "tablet",
              ),
            ),
          ),
        ),
      ),
    ];

if (!existsSync(evidenceDir)) mkdirSync(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let cursor = 0;

async function worker() {
  const page = await browser.newPage();
  while (cursor < scenarios.length) {
    const current = scenarios[cursor++];
    const { story, shell, theme, density, viewport, accessibility, screenshot } = current;
    const errors = [];
    const onPageError = (error) => errors.push(error.message);
    page.on("pageerror", onPageError);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const globals = `theme:${theme};density:${density};platform:apps;direction:ltr`;
    const url = `${baseURL}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=${encodeURIComponent(globals)}`;
    const row = { id: story.id, shell, theme, density, viewport: viewport.name, errors: [] };
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
      await page.locator("#storybook-root > *").first().waitFor({ state: "attached", timeout: 15000 });
      await page.waitForTimeout(80);
      const state = await page.evaluate(() => ({
        theme: document.documentElement.getAttribute("data-theme"),
        density: document.documentElement.getAttribute("data-density"),
        width: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        rootText: document.querySelector("#storybook-root")?.textContent?.slice(0, 200) ?? "",
        errorPanel: document.querySelector("#error-stack, #storybook-error-root")?.textContent?.slice(0, 200) ?? "",
      }));
      row.state = state;
      if (state.theme !== theme || state.density !== density) row.errors.push("globals not applied");
      if (state.width > state.viewport + 2) row.errors.push(`document overflows ${state.width - state.viewport}px`);
      if (state.errorPanel) row.errors.push(`story error: ${state.errorPanel}`);
      if (errors.length) row.errors.push(...errors);
      if (accessibility) {
        await page.addScriptTag({ path: axePath });
        const axeResult = await page.evaluate(async () =>
          window.axe.run("#storybook-root", {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
          }),
        );
        row.axe = { violations: axeResult.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
          targets: violation.nodes.map((node) => ({
            selector: node.target.join(" "),
            html: node.html,
            checks: node.any.map((check) => ({ message: check.message, data: check.data })),
          })).slice(0, 10),
        })) };
        if (row.axe.violations.length) row.errors.push(`axe: ${row.axe.violations.map((v) => v.id).join(", ")}`);
      }
      if (screenshot) {
        const file = `${shell}--${theme}--${density}--${viewport.name}--${story.id}.png`;
        const image = await page.screenshot({ path: path.join(evidenceDir, file), fullPage: true, animations: "disabled" });
        row.screenshot = file;
        row.sha256 = createHash("sha256").update(image).digest("hex");
      }
    } catch (error) {
      row.errors.push(String(error));
    } finally {
      page.off("pageerror", onPageError);
      results.push(row);
      if (results.length % 25 === 0 || row.errors.length) {
        process.stdout.write(`${results.length}/${scenarios.length} ${shell} ${story.id} ${row.errors.length ? "FAIL " + row.errors.join(" | ") : "OK"}\n`);
      }
    }
  }
  await page.close();
}

// axe-core installs one runtime per page, but its asynchronous scans can still
// overlap with the next navigation while Playwright is reusing that page.
// Keep accessibility scenarios serial so a scan completes before the page is
// navigated or reused for another sample.
await Promise.all(Array.from({ length: isSmoke || scenarios.some((item) => item.accessibility) ? 1 : 4 }, worker));
await browser.close();
results.sort((a, b) =>
  a.shell.localeCompare(b.shell) || a.id.localeCompare(b.id) || a.theme.localeCompare(b.theme) ||
  a.density.localeCompare(b.density) || a.viewport.localeCompare(b.viewport),
);
const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  storyCount: stories.length,
  shellCount: primary.length,
  scenarioCount: scenarios.length,
  axeScenarioCount: results.filter((row) => row.axe).length,
  screenshotCount: results.filter((row) => row.screenshot).length,
  failures: results.filter((row) => row.errors.length),
  results,
};
const reportPath = path.join(evidenceDir, isMobileSmoke ? "mobile-smoke.json" : isSmoke ? "smoke.json" : requestedShell ? `matrix-${requestedShell}.json` : "matrix.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
process.stdout.write(`Shell browser validation: ${report.scenarioCount} scenarios, ${report.failures.length} failures; ${reportPath}\n`);
if (report.failures.length) process.exitCode = 1;
