import { chromium } from "playwright";

const id = process.argv[2];
if (!id) throw new Error("Provide a Storybook story id");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => console.log("PAGE ERROR:", error.stack));
page.on("console", (message) => {
  if (message.type() === "error") console.log("CONSOLE ERROR:", message.text());
});
await page.goto(`http://127.0.0.1:6007/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`, {
  waitUntil: "domcontentloaded",
});
await page.waitForTimeout(1500);
console.log("ROOT:", await page.locator("#storybook-root").innerHTML());
console.log("BODY:", (await page.locator("body").innerText()).slice(0, 4000));
await browser.close();
