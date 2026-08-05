// Hoist "use client" to the very top of every emitted module.
//
// tsc emits the CommonJS prologue first:
//
//     "use strict";
//     "use client";
//
// React only honours "use client" when it is the FIRST statement in the module.
// One line lower and it is just a string expression, so every client component
// in this package is treated as a server component. The symptom is not a
// helpful error about directives — it is
//
//     Element type is invalid: ... but got: undefined
//
// on the consumer's root layout, because the context providers never register.
// All 43 client components in this package were affected.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const DIRECTIVE = '"use client";';

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith('.js')) yield p;
  }
}

let fixed = 0;
for (const file of walk(DIST)) {
  const text = readFileSync(file, 'utf8');
  if (!text.includes(DIRECTIVE)) continue;

  const lines = text.split('\n');
  const index = lines.findIndex((l) => l.trim() === DIRECTIVE);
  if (index <= 0) continue; // already first, or absent

  lines.splice(index, 1);
  lines.unshift(DIRECTIVE);
  writeFileSync(file, lines.join('\n'));
  fixed += 1;
}

console.log(`hoisted "use client" in ${fixed} file(s)`);
