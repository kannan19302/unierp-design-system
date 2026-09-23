#!/usr/bin/env node
/**
 * migrate-storybook-hierarchy.mjs
 * ────────────────────────────────
 * Migrates all Storybook story titles in `src/core/` to include the `Core/` prefix,
 * mirroring the source directory structure in the Storybook sidebar.
 *
 * Rules:
 *  1. Stories in `src/core/` → title must start with `Core/`
 *  2. Stories in `src/platforms/` → title must start with `Platforms/` (already correct)
 *  3. Stories already prefixed with `Core/` are skipped
 *  4. Foundation stories get `Core/Foundations/` prefix
 *  5. Orphan titles (no `/` separator) get mapped to their directory category
 *
 * Usage:
 *   node scripts/migrate-storybook-hierarchy.mjs          # dry-run (default)
 *   node scripts/migrate-storybook-hierarchy.mjs --apply  # apply changes
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, sep } from 'path';

const ROOT = join(import.meta.dirname, '..');
const SRC_CORE = join(ROOT, 'src', 'core');
const SRC_PLATFORMS = join(ROOT, 'src', 'platforms');
const DRY_RUN = !process.argv.includes('--apply');

// ── Collect all story files ──
function findStoryFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...findStoryFiles(fullPath));
    } else if (entry.isFile() && /\.stories\.(ts|tsx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Determine correct category from directory path ──
function getCategoryFromPath(filePath, srcRoot) {
  const rel = relative(srcRoot, filePath).split(sep);
  const category = rel[0];
  const categoryMap = {
    'blocks': 'Blocks',
    'brand': 'Brand',
    'charts': 'Charts',
    'components': 'Components',
    'dashboard': 'Dashboard',
    'data-display': 'Data Display',
    'data-grid': 'Data Grid',
    'feedback': 'Feedback',
    'filters': 'Filters',
    'form-engine': 'FormEngine',
    'forms': 'Forms',
    'hooks': 'Hooks',
    'icons': 'Icons',
    'inputs': 'Inputs',
    'layout': 'Layout',
    'navigation': 'Navigation',
    'notifications': 'Notifications',
    'overlays': 'Overlays',
    'patterns': 'Patterns',
    'primitives': 'Primitives',
    'shell': 'Shell',
    'studio': 'Studio',
    'styles': 'Styles',
    'templates': 'Templates',
    'theme': 'Theme',
    'tokens': 'Foundations',
    'utils': 'Utils',
    'workflow': 'Workflow',
  };
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// ── Process a single file ──
function processFile(filePath, srcRoot, layer) {
  const content = readFileSync(filePath, 'utf-8');

  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (!titleMatch) return null;

  const currentTitle = titleMatch[1];
  const prefix = layer === 'core' ? 'Core' : 'Platforms';

  if (currentTitle.startsWith(`${prefix}/`)) {
    return null;
  }

  let newTitle;

  if (currentTitle.includes('/')) {
    newTitle = `${prefix}/${currentTitle}`;
  } else {
    const category = getCategoryFromPath(filePath, srcRoot);
    newTitle = `${prefix}/${category}/${currentTitle}`;
  }

  if (DRY_RUN) {
    return { filePath, currentTitle, newTitle, applied: false };
  }

  const updatedContent = content.replace(
    titleMatch[0],
    titleMatch[0].replace(currentTitle, newTitle)
  );
  writeFileSync(filePath, updatedContent, 'utf-8');
  return { filePath, currentTitle, newTitle, applied: true };
}

// ── Main ──
console.log(`\n${'='.repeat(60)}`);
console.log(`  Storybook Hierarchy Migration — ${DRY_RUN ? 'DRY RUN' : 'APPLYING'}`);
console.log(`${'='.repeat(60)}\n`);

const coreStories = findStoryFiles(SRC_CORE);
const platformStories = findStoryFiles(SRC_PLATFORMS);

console.log(`Found ${coreStories.length} core stories`);
console.log(`Found ${platformStories.length} platform stories\n`);

const results = [];

for (const file of coreStories) {
  const result = processFile(file, SRC_CORE, 'core');
  if (result) results.push(result);
}

for (const file of platformStories) {
  const result = processFile(file, SRC_PLATFORMS, 'platforms');
  if (result) results.push(result);
}

if (results.length === 0) {
  console.log('All story titles already have correct hierarchy prefixes.\n');
} else {
  console.log(`${DRY_RUN ? 'Would update' : 'Updated'} ${results.length} stories:\n`);

  const byPrefix = {};
  for (const r of results) {
    const layer = r.newTitle.startsWith('Core/') ? 'Core' : 'Platforms';
    if (!byPrefix[layer]) byPrefix[layer] = [];
    byPrefix[layer].push(r);
  }

  for (const [layer, items] of Object.entries(byPrefix)) {
    console.log(`\n-- ${layer} (${items.length} changes) --`);
    for (const r of items.slice(0, 30)) {
      console.log(`  "${r.currentTitle}" -> "${r.newTitle}"`);
    }
    if (items.length > 30) {
      console.log(`  ... and ${items.length - 30} more`);
    }
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`  Total: ${results.length} title${results.length === 1 ? '' : 's'} ${DRY_RUN ? 'to update' : 'updated'}`);
if (DRY_RUN) {
  console.log('  Run with --apply to make changes');
}
console.log(`${'='.repeat(60)}\n`);

process.exit(0);
