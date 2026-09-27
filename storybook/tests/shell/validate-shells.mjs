import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const storybookRoot = path.resolve(import.meta.dirname, "../..");
const designRoot = path.resolve(storybookRoot, "..");
const evidenceDir = path.resolve(designRoot, "docs/evidence/strata-shell-browser");
const index = JSON.parse(readFileSync(path.join(storybookRoot, "storybook-static/index.json"), "utf8"));
const stories = Object.values(index.entries)
  .filter((entry) => entry.type === "story" && entry.importPath?.includes("/core/shell/"))
  .sort((a, b) => a.importPath.localeCompare(b.importPath) || a.id.localeCompare(b.id));
const shellName = (story) => story.importPath.split("/core/shell/")[1].split("/")[0];
const themes = ["strata", "strata-dark", "strata-high-contrast"];
const densities = ["ultra-compact", "compact", "standard", "comfortable"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];
const isSmoke = process.argv.includes("--smoke");
const baseURL = process.env.SHELL_STORYBOOK_URL || "http://127.0.0.1:6007";
const axePackage = readdirSync(path.join(storybookRoot, "node_modules/.pnpm"))
  .find((name) => name.startsWith("axe-core@"));
const axePath = axePackage
  ? path.join(storybookRoot, "node_modules/.pnpm", axePackage, "node_modules/axe-core/axe.min.js")
  : undefined;
const primary = [...new Set(stories.map(shellName))].map((shell) =>
  stories.find((story) => shellName(story) === shell && story.id.endsWith("--default")) ??
  stories.find((story) => shellName(story) === shell),
);

function scenario(story, theme, density, viewport, accessibility, screenshot) {
  return { story, shell: shellName(story), theme, density, viewport, accessibility, screenshot };
}

const scenarios = isSmoke
  ? [scenario(primary[0], "strata", "standard", viewports[2], true, true)]
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
      if (accessibility && axePath) {
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
          targets: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5),
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

await Promise.all(Array.from({ length: isSmoke ? 1 : 4 }, worker));
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
const reportPath = path.join(evidenceDir, isSmoke ? "smoke.json" : "matrix.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
process.stdout.write(`Shell browser validation: ${report.scenarioCount} scenarios, ${report.failures.length} failures; ${reportPath}\n`);
if (report.failures.length) process.exitCode = 1;
