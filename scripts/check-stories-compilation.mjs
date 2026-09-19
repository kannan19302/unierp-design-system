import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

console.log("Validating Storybook Story Compilation & JSX Syntax Across All Stories...");

const SRC_DIR = path.resolve(process.cwd(), "src");

function findStoryFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findStoryFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".stories.tsx")) {
      results.push(fullPath);
    }
  }
  return results;
}

const storyFiles = findStoryFiles(SRC_DIR);
console.log(`  Discovered ${storyFiles.length} story files in src/`);

let failureCount = 0;
const failures = [];

for (const file of storyFiles) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, "/");
  const content = fs.readFileSync(file, "utf8");

  const sourceFile = ts.createSourceFile(
    file,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const diagnostics = sourceFile.parseDiagnostics || [];
  if (diagnostics.length > 0) {
    for (const diag of diagnostics) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start || 0);
      const msg = typeof diag.messageText === "string"
        ? diag.messageText
        : ts.flattenDiagnosticMessageText(diag.messageText, "\n");
      failures.push({
        file: relPath,
        line: line + 1,
        column: character + 1,
        message: msg,
      });
      failureCount++;
    }
  }

  // Also verify all JsxText nodes don't contain unescaped raw > or <
  function checkJsxText(node) {
    if (node.kind === ts.SyntaxKind.JsxText) {
      const text = node.getText(sourceFile);
      if (text.includes(">") || text.includes("<")) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        failures.push({
          file: relPath,
          line: line + 1,
          column: character + 1,
          message: `Unescaped raw '>' or '<' in JSX text node: "${text.trim()}". Replace with &gt; / &lt; or wrap in {"..."}`,
        });
        failureCount++;
      }
    }
    ts.forEachChild(node, checkJsxText);
  }
  checkJsxText(sourceFile);
}

if (failureCount > 0) {
  console.error(`\n✖ Story Compilation Gate FAILED (${failureCount} errors detected across story files):\n`);
  for (const f of failures) {
    console.error(`  - ${f.file}:${f.line}:${f.column} — ${f.message}`);
  }
  process.exit(1);
}

console.log(`\n✔ story compilation gate: All ${storyFiles.length} story files parsed and compiled with zero syntax or JSX transform errors.\n`);
process.exit(0);
