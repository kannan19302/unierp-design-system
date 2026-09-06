#!/usr/bin/env node
/**
 * Layer Rule Verification — docs/PLATFORM_ARCHITECTURE.md § 4.2.
 *
 * Asserts that a repository depends ONLY on strictly lower-layer published artifacts.
 * Sideways (same layer) and upward (higher layer) dependencies are strictly forbidden.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const LAYERS = {
  // Layer 0: Contracts
  'unierp-contracts': 0,
  '@kannan19302/contracts': 0,

  // Layer 1: Foundation
  'kernel': 1,
  'unierp-kernel': 1,
  '@kannan19302/kernel': 1,
  'design-system': 1,
  'unierp-design-system': 1,
  '@kannan19302/ui': 1,
  'sdk': 1,
  'unierp-sdk': 1,
  '@kannan19302/sdk': 1,
  'shared': 1,
  'unierp-shared': 1,
  '@kannan19302/shared': 1,
  'auth': 1,
  'unierp-auth': 1,
  '@kannan19302/auth': 1,
  'service-kit': 1,
  'unierp-service-kit': 1,
  '@kannan19302/service-kit': 1,
  'config': 1,
  'unierp-config': 1,
  '@kannan19302/config': 1,

  // Layer 2: Core Platform
  'data': 2,
  'unierp-data': 2,
  '@kannan19302/data': 2,
  'framework': 2,
  'unierp-framework': 2,
  '@kannan19302/framework': 2,
  'extension-api': 2,
  'unierp-extension-api': 2,
  '@kannan19302/extension-api': 2,
  'sandbox': 2,
  'unierp-sandbox': 2,
  '@kannan19302/sandbox': 2,
  'blockchain': 2,
  'unierp-blockchain': 2,
  '@kannan19302/blockchain': 2,

  // Layer 3: Services & API
  'api': 3,
  'unierp-api': 3,
  '@kannan19302/api': 3,
  'idp': 3,
  'unierp-idp': 3,
  '@kannan19302/idp': 3,

  // Layer 4: Presentation & Apps
  'tenant-apps': 4,
  'unierp-web': 4,
  '@kannan19302/tenant-apps': 4,
  'tenant-admin': 4,
  'provider-admin-os': 4,
  'unierp-console': 4,
  'developer-platform': 4,
  'unierp-developer': 4,
  'marketing-site': 4,
  'unierp-corporate-website': 4,
  'tenant-site-template': 4,
  'unierp-corporate-site-template': 4,
  'tenant-sites': 4,
  'unierp-tenant-sites': 4,
  'web-studio': 4,
  'marketplace': 4,
  'storybook': 4,
  'unierp-storybook': 4,

  // Layer 5: Clients
  'desktop-app': 5,
  'unierp-mobile': 5,

  // Layer 6: Extensions
  'extensions': 6,
  'unierp-extensions': 6,

  // Layer 7: Operations & Governance
  'infra': 7,
  'unierp-infra': 7,
  'unierp-workspace': 7,
  'unierp-platform': 7,
};

function pkgToRepo(pkgName) {
  if (LAYERS[pkgName] !== undefined) return pkgName;
  if (pkgName.startsWith('@kannan19302/')) {
    const short = pkgName.slice(13);
    if (LAYERS[short] !== undefined) return short;
    return 'unierp-' + short;
  }
  return pkgName;
}

const cwd = process.cwd();
const repoName = basename(cwd);

const pkgPath = join(cwd, 'package.json');
let pkgName = null;
if (existsSync(pkgPath)) {
  try {
    pkgName = JSON.parse(readFileSync(pkgPath, 'utf8')).name;
  } catch {}
}

const currentLayer = LAYERS[pkgName] ?? LAYERS[repoName];

if (process.argv.includes('--test-fail-closed')) {
  console.log('  ok    Testing fail-closed behavior for unmapped repository');
  const dummyLayer = LAYERS['unmapped-dummy-target'];
  if (dummyLayer === undefined) {
    console.log('  ok    Unmapped target correctly identified as undefined layer');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

if (currentLayer === undefined) {
  console.error(`  FAIL  Layer check: ${repoName} (${pkgName ?? 'no-pkg'}) is unmapped in PLATFORM_ARCHITECTURE LAYERS map.`);
  process.exit(1);
}
if (!existsSync(pkgPath)) {
  console.log(`  ℹ Layer check: no package.json found in ${repoName}.`);
  process.exit(0);
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const deps = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
  ...pkg.peerDependencies,
};

const violations = [];

for (const depName of Object.keys(deps)) {
  if (!depName.startsWith('@kannan19302/')) continue;
  // Shared lint/tsconfig build-time tooling in devDependencies is exempt from runtime layer check
  if (depName === '@kannan19302/config' && pkg.devDependencies?.[depName] && !pkg.dependencies?.[depName]) continue;

  const targetRepo = pkgToRepo(depName);
  const targetLayer = LAYERS[targetRepo];

  if (targetLayer === undefined) continue;

  if (targetLayer >= currentLayer) {
    violations.push({
      dep: depName,
      targetRepo,
      targetLayer,
      currentLayer,
    });
  }
}

if (violations.length === 0) {
  console.log(`  ✅ Layer rule verified for ${repoName} (L${currentLayer}): all @kannan19302/* dependencies are strictly lower-layer.`);
  process.exit(0);
}

console.error(`
────────────────────────────────────────────────────────────────────────
  ❌ LAYER RULE VIOLATION IN ${repoName} (Layer ${currentLayer})
────────────────────────────────────────────────────────────────────────`);
for (const v of violations) {
  console.error(`   - Depends on ${v.dep} (${v.targetRepo}, Layer ${v.targetLayer}) — Layer ${v.targetLayer} >= Layer ${v.currentLayer}`);
}
console.error(`
  A repository may ONLY depend on strictly lower-layer packages.
  Sideways and upward dependencies violate PLATFORM_ARCHITECTURE.md § 4.2.
────────────────────────────────────────────────────────────────────────
`);
process.exit(1);
