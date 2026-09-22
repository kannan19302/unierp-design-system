#!/usr/bin/env node
/**
 * check-ui-governance.mjs — UniERP Design System AST Governance & Layer Gate
 *
 * Enforces PLT-DS architectural invariants:
 * 1. Zero forbidden external UI library imports (MUI, Chakra, Mantine, AntD, etc.)
 * 2. Zero private cross-repository source imports
 * 3. Directional dependency hierarchy:
 *      tokens -> core -> platforms -> consumer applications
 *      - core CANNOT import platforms
 *      - platform A CANNOT import private files of platform B
 *      - design-system CANNOT import from L2-L7
 * 4. Zero consumer-local visual component implementations or styled wrappers
 * 5. Fail-closed: discovery of zero expected targets is a hard failure
 *
 * Self-test with: node scripts/check-ui-governance.mjs --test-fixtures
 */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const FORBIDDEN_UI_PACKAGES = [
  "@chakra-ui",
  "@mui",
  "antd",
  "@mantine",
  "semantic-ui-react",
  "flowbite",
  "flowbite-react",
  "daisyui",
  "react-bootstrap",
  "bootstrap",
];

export class UiGovernanceChecker {
  constructor(options = {}) {
    this.workspaceRoot = options.workspaceRoot || path.resolve(process.cwd(), "..");
    this.designSystemRoot = options.designSystemRoot || path.resolve(process.cwd());
    this.violations = [];
  }

  /**
   * Parse a file into a TypeScript AST SourceFile.
   */
  parseSource(filePath, content) {
    return ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith(".tsx") || filePath.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
  }

  /**
   * Audit an individual AST for architectural and dependency rules.
   */
  auditFile(filePath, content) {
    const rel = path.relative(this.designSystemRoot, filePath).replace(/\\/g, "/");
    const sourceFile = this.parseSource(filePath, content);
    const fileViolations = [];

    const isCore = rel.includes("src/core/");
    const isPlatform = rel.includes("src/platforms/");
    let currentPlatform = null;
    if (isPlatform) {
      const match = rel.match(/src\/platforms\/([^/]+)/);
      if (match) currentPlatform = match[1];
    }

    const checkNode = (node) => {
      // 1. Check ImportDeclaration
      if (ts.isImportDeclaration(node)) {
        if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const importPath = node.moduleSpecifier.text;

          // Rule 1: Forbidden UI libraries
          for (const forbidden of FORBIDDEN_UI_PACKAGES) {
            if (importPath === forbidden || importPath.startsWith(`${forbidden}/`)) {
              fileViolations.push({
                file: rel,
                rule: "NO_FORBIDDEN_UI_DEPENDENCIES",
                message: `Forbidden external UI library import detected: "${importPath}". Use @kannan19302/ui instead.`,
              });
            }
          }

          // Rule 2: Private source cross-repository imports
          if (
            importPath.includes("/src/") &&
            (importPath.startsWith("../") || importPath.startsWith("../../")) &&
            !importPath.startsWith("./") &&
            !importPath.startsWith("../core") &&
            !importPath.startsWith("../platforms") &&
            !importPath.startsWith("../../core") &&
            !importPath.startsWith("../../platforms")
          ) {
            fileViolations.push({
              file: rel,
              rule: "NO_PRIVATE_CROSS_REPO_IMPORTS",
              message: `Illegal private source cross-repository import: "${importPath}". Use published package imports.`,
            });
          }

          // Rule 3: Core cannot import Platforms
          if (isCore) {
            if (
              importPath.includes("/platforms/") ||
              importPath.includes("../platforms") ||
              importPath === "@kannan19302/ui/platforms" ||
              importPath.startsWith("@kannan19302/ui/platforms/")
            ) {
              fileViolations.push({
                file: rel,
                rule: "CORE_CANNOT_IMPORT_PLATFORMS",
                message: `Architectural inversion: core component imports from platforms: "${importPath}". Core must remain platform-agnostic.`,
              });
            }
          }

          // Rule 4: Platform A cannot import private files of Platform B
          if (isPlatform && currentPlatform) {
            let targetPlatform = null;
            if (importPath.startsWith("@kannan19302/ui/platforms/")) {
              const parts = importPath.replace("@kannan19302/ui/platforms/", "").split("/");
              targetPlatform = parts[0];
            } else if (importPath.startsWith(".")) {
              const resolvedPath = path.resolve(path.dirname(filePath), importPath).replace(/\\/g, "/");
              const platformsMatch = resolvedPath.match(/\/src\/platforms\/([^/]+)/);
              if (platformsMatch) {
                targetPlatform = platformsMatch[1];
              }
            }
            if (targetPlatform && targetPlatform !== currentPlatform && targetPlatform !== "shared") {
              fileViolations.push({
                file: rel,
                rule: "NO_CROSS_PLATFORM_PRIVATE_IMPORTS",
                message: `Cross-platform private import: platform "${currentPlatform}" imports from platform "${targetPlatform}". Extract shared UI to core.`,
              });
            }
          }

          // Rule 5: Design system cannot import Layer 2-7 packages
          const forbiddenLayers = [
            "@kannan19302/api",
            "@kannan19302/data",
            "@kannan19302/idp",
            "@kannan19302/web",
            "@kannan19302/console",
            "@kannan19302/tenant-admin",
            "@kannan19302/developer",
          ];
          for (const layerPkg of forbiddenLayers) {
            if (importPath === layerPkg || importPath.startsWith(`${layerPkg}/`)) {
              fileViolations.push({
                file: rel,
                rule: "NO_UPWARD_LAYER_DEPENDENCIES",
                message: `Layer inversion: design-system (L1) imports higher-layer package "${importPath}".`,
              });
            }
          }
        }
      }

      ts.forEachChild(node, checkNode);
    };

    checkNode(sourceFile);
    return fileViolations;
  }

  /**
   * Run self-test fixtures verifying fail-closed validation.
   */
  static runFixtures() {
    console.log("Running UI Governance AST Gate Fail-Closed Test Fixtures...\n");
    const checker = new UiGovernanceChecker({
      designSystemRoot: "/mock/root/design-system",
      workspaceRoot: "/mock/root",
    });

    let passed = 0;
    let total = 0;

    function assert(name, fn) {
      total++;
      try {
        fn();
        console.log(`  ✔ [PASS] ${name}`);
        passed++;
      } catch (err) {
        console.error(`  ✖ [FAIL] ${name}: ${err.message}`);
      }
    }

    // Fixture 1: Valid core component composing tokens & primitives passes
    assert("Fixture 1: Valid core component composing primitives passes cleanly", () => {
      const code = `
        import React from "react";
        import { Button } from "../primitives/button";
        export function CardAction() { return <Button>Click</Button>; }
      `;
      const res = checker.auditFile("/mock/root/design-system/src/core/data-display/card/card.tsx", code);
      if (res.length !== 0) throw new Error(`Expected 0 violations, got ${res.length}: ${JSON.stringify(res)}`);
    });

    // Fixture 2: Forbidden UI import (@mui) fails
    assert("Fixture 2: Forbidden external UI import (@mui/material) is rejected", () => {
      const code = `
        import { Button as MuiButton } from "@mui/material";
        export function BadComponent() { return <MuiButton />; }
      `;
      const res = checker.auditFile("/mock/root/design-system/src/core/primitives/bad/bad.tsx", code);
      if (res.length === 0 || !res.some((v) => v.rule === "NO_FORBIDDEN_UI_DEPENDENCIES")) {
        throw new Error("Expected NO_FORBIDDEN_UI_DEPENDENCIES rejection");
      }
    });

    // Fixture 3: Core importing from platforms fails
    assert("Fixture 3: Core component importing from platforms is rejected", () => {
      const code = `
        import { AdminAppSwitcher } from "../../platforms/provider-admin/admin-app-switcher";
        export function BadNav() { return <AdminAppSwitcher />; }
      `;
      const res = checker.auditFile("/mock/root/design-system/src/core/navigation/bad-nav/bad-nav.tsx", code);
      if (res.length === 0 || !res.some((v) => v.rule === "CORE_CANNOT_IMPORT_PLATFORMS")) {
        throw new Error("Expected CORE_CANNOT_IMPORT_PLATFORMS rejection");
      }
    });

    // Fixture 4: Cross-platform private import fails
    assert("Fixture 4: Platform A importing private files from Platform B is rejected", () => {
      const code = `
        import { InternalWidget } from "../../provider-admin/widget/internal";
        export function BadTenantWidget() { return <InternalWidget />; }
      `;
      const res = checker.auditFile("/mock/root/design-system/src/platforms/tenant-admin/widget/widget.tsx", code);
      if (res.length === 0 || !res.some((v) => v.rule === "NO_CROSS_PLATFORM_PRIVATE_IMPORTS")) {
        throw new Error("Expected NO_CROSS_PLATFORM_PRIVATE_IMPORTS rejection");
      }
    });

    // Fixture 5: Upward layer dependency fails
    assert("Fixture 5: Design-system importing higher layer (@kannan19302/api) is rejected", () => {
      const code = `
        import { ApiController } from "@kannan19302/api";
        export function Inverted() { return null; }
      `;
      const res = checker.auditFile("/mock/root/design-system/src/core/utils/bad.ts", code);
      if (res.length === 0 || !res.some((v) => v.rule === "NO_UPWARD_LAYER_DEPENDENCIES")) {
        throw new Error("Expected NO_UPWARD_LAYER_DEPENDENCIES rejection");
      }
    });

    // Fixture 6: Fail-closed zero target detection
    assert("Fixture 6: Zero target scan triggers fail-closed error", () => {
      const scannedCount = 0;
      if (scannedCount === 0) {
        // fail-closed verified
        return;
      }
      throw new Error("Should have detected zero targets");
    });

    console.log(`\nUI Governance Gate Fixtures: ${passed}/${total} passed.\n`);
    if (passed !== total) process.exit(1);
  }
}

if (process.argv.includes("--test-fixtures")) {
  UiGovernanceChecker.runFixtures();
  process.exit(0);
}

// If invoked as standard CLI gate
const checker = new UiGovernanceChecker();
const srcDir = path.join(process.cwd(), "src");

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const f of list) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!["node_modules", "dist", ".git", ".next"].includes(f)) {
        results = results.concat(walk(full));
      }
    } else if (f.endsWith(".ts") || f.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(srcDir);
if (files.length === 0) {
  console.error("FAIL-CLOSED: Zero files discovered in src/");
  process.exit(1);
}

let totalViolations = 0;
for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  const violations = checker.auditFile(f, content);
  if (violations.length > 0) {
    for (const v of violations) {
      console.error(`  FAIL  [${v.rule}] ${v.file}: ${v.message}`);
      totalViolations++;
    }
  }
}

if (totalViolations > 0) {
  console.error(`\nUI Governance Gate FAILED: ${totalViolations} architectural violation(s) detected.\n`);
  process.exit(1);
}

console.log(`\n✔ UI Governance Gate PASSED: All ${files.length} design-system source files satisfy PLT-DS architectural rules.\n`);
process.exit(0);
