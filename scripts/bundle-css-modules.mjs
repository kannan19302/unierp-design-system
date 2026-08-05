// Resolve CSS modules at BUILD time, not at require() time.
//
// tsc cannot process CSS, so its output kept `require("./button.module.css")`
// in the compiled JS. Only a bundler can satisfy that: Node throws
// `SyntaxError: Unexpected token '.'` on the first selector, which broke the
// test runner, any script importing the package, and every non-webpack
// consumer. The original packages avoided this by building with tsup; moving to
// plain tsc lost it.
//
// This step does what a CSS-modules loader does, ahead of time:
//
//   1. Namespace every class in every *.module.css as `ui-<file>-<class>`, so
//      two components can both define `.container` without colliding — which is
//      the entire point of CSS modules.
//   2. Replace the runtime require with the resulting literal mapping, so the
//      compiled JS carries the class names and imports nothing.
//   3. Concatenate the rewritten CSS into one dist/styles.css for consumers to
//      import once.
//
// The result loads anywhere: bundler, Node, vitest, a plain script.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const DIST = 'dist';

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const cssFiles = [...walk(DIST)].filter((f) => f.endsWith('.module.css'));
const bundled = [];
let rewritten = 0;

for (const cssPath of cssFiles) {
  const raw = readFileSync(cssPath, 'utf8');
  const stem = basename(cssPath, '.module.css');
  const prefix = `ui-${stem}-`;

  const names = new Set();
  for (const m of raw.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) names.add(m[1]);

  let css = raw;
  for (const name of names) {
    css = css.replace(new RegExp(`\\.${name}\\b`, 'g'), `.${prefix}${name}`);
  }
  bundled.push(`/* ${cssPath.split(/[\\/]/).slice(1).join('/')} */\n${css}`);

  const jsPath = join(dirname(cssPath), `${stem}.js`);
  if (!existsSync(jsPath)) continue;

  const mapping = JSON.stringify(
    Object.fromEntries([...names].map((n) => [n, `${prefix}${n}`])),
  );

  let js = readFileSync(jsPath, 'utf8');
  const before = js;
  const belongs = (spec) => spec.endsWith(`${stem}.module.css`);

  // const x_module_css_1 = __importDefault(require("./x.module.css"));
  js = js.replace(
    /(const\s+\w+\s*=\s*)__importDefault\(require\((["'])([^"']*\.module\.css)\2\)\);/g,
    (whole, decl, _q, spec) => (belongs(spec) ? `${decl}{ default: ${mapping} };` : whole),
  );

  // const x_module_css_1 = require("./x.module.css");
  js = js.replace(
    /(const\s+\w+\s*=\s*)require\((["'])([^"']*\.module\.css)\2\);/g,
    (whole, decl, _q, spec) => (belongs(spec) ? `${decl}${mapping};` : whole),
  );

  // import styles from "./x.module.css";
  js = js.replace(
    /import\s+(\w+)\s+from\s+(["'])([^"']*\.module\.css)\2;/g,
    (whole, id, _q, spec) => (belongs(spec) ? `const ${id} = ${mapping};` : whole),
  );

  if (js !== before) {
    writeFileSync(jsPath, js);
    rewritten += 1;
  }
}

if (bundled.length) {
  writeFileSync(join(DIST, 'styles.css'), `${bundled.join('\n\n')}\n`);
}

console.log(
  `css modules resolved at build time: ${cssFiles.length} stylesheet(s), ${rewritten} module(s) rewritten`,
);
