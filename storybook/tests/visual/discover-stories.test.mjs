import assert from 'node:assert/strict';
import test from 'node:test';
import { generateStoryUrl, THEMES, DENSITIES } from './discover-stories.ts';

test('generated visual matrix URLs preserve story, theme, and density', () => {
  const storyId = 'inputs-input--all-states-gallery';

  for (const theme of THEMES) {
    for (const density of DENSITIES) {
      const url = new URL(generateStoryUrl(storyId, theme, density), 'http://localhost:6006');
      assert.equal(url.pathname, '/iframe.html');
      assert.equal(url.searchParams.get('id'), storyId);
      assert.equal(url.searchParams.get('viewMode'), 'story');
      assert.equal(url.searchParams.get('globals'), `theme:${theme};density:${density}`);
    }
  }
});
