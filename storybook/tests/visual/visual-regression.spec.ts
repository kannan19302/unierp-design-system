import { test, expect } from '@playwright/test';
import { discoverStories, THEMES, DENSITIES, generateStoryUrl } from './discover-stories';

test.describe.configure({ retries: 0 });

const stories = discoverStories();
console.log(`Discovered ${stories.length} stories for visual regression testing`);

test.describe('Visual Regression', () => {
  test('Storybook index matches source story exports', async ({ request }) => {
    const response = await request.get('/index.json');
    expect(response.ok()).toBeTruthy();
    const index = await response.json() as { entries: Record<string, { id: string; type: string }> };
    const indexedIds = Object.values(index.entries)
      .filter((entry) => entry.type === 'story')
      .map((entry) => entry.id)
      .sort();
    expect(indexedIds.length).toBeGreaterThan(0);
    expect(indexedIds).toEqual(stories.map((story) => story.id).sort());
  });

  for (const story of stories) {
    for (const theme of THEMES) {
      for (const density of DENSITIES) {
        const testName = `${story.component} > ${story.title} > ${story.id} [theme=${theme}, density=${density}]`;

        test(testName, async ({ page }) => {
          const url = generateStoryUrl(story.id, theme, density);
          await page.goto(url);
          await page.waitForLoadState('networkidle');

          // Wait for the story to render
          await page.waitForSelector('#storybook-root > *', { state: 'attached', timeout: 10000 });

          // Take screenshot
          const screenshot = await page.screenshot({
            fullPage: true,
            animations: 'disabled',
          });

          // Compare with baseline
          const baselineName = `${story.id}--${theme}--${density}.png`.replace(/[^a-zA-Z0-9.-]/g, '_');
          await expect(screenshot).toMatchSnapshot(baselineName, {
            maxDiffPixels: 100,
            threshold: 0.2,
          });
        });
      }
    }
  }
});
