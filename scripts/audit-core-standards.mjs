import fs from 'node:fs';
import path from 'node:path';

const coreDir = path.join(process.cwd(), 'src', 'core');
const results = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      const tsxFiles = files.filter(f => f.endsWith('.tsx') && !f.endsWith('.stories.tsx') && !f.endsWith('.test.tsx'));
      const cssFiles = files.filter(f => f.endsWith('.module.css'));
      
      if (tsxFiles.length > 0 && cssFiles.length > 0) {
        const tsx = fs.readFileSync(path.join(fullPath, tsxFiles[0]), 'utf8');
        const css = fs.readFileSync(path.join(fullPath, cssFiles[0]), 'utf8');
        
        // Find classNames on <button, <a, role="button", tabIndex=0
        const buttonRegex = /<(?:button|a)\s+[^>]*className=\{styles\.([a-zA-Z0-9_]+)\}/g;
        let match;
        const interactiveClasses = new Set();
        while ((match = buttonRegex.exec(tsx)) !== null) {
          interactiveClasses.add(match[1]);
        }
        
        const roleBtnRegex = /role=["']button["'][^>]*className=\{styles\.([a-zA-Z0-9_]+)\}/g;
        while ((match = roleBtnRegex.exec(tsx)) !== null) {
          interactiveClasses.add(match[1]);
        }
        
        const tabIndexRegex = /tabIndex=\{?0\}?[^>]*className=\{styles\.([a-zA-Z0-9_]+)\}/g;
        while ((match = tabIndexRegex.exec(tsx)) !== null) {
          interactiveClasses.add(match[1]);
        }

        const missingFocusClasses = [];
        for (const cls of interactiveClasses) {
          // Check if css has .cls:focus-visible or .cls:focus or &:focus-visible inside .cls
          // or global button:focus-visible
          const hasFocus = css.includes(cls + ':focus') || 
                           css.includes(cls + ':focus-visible') || 
                           (css.includes('.' + cls) && css.includes(':focus-visible')) ||
                           css.includes('button:focus-visible') ||
                           css.includes('*:focus-visible');
          if (!hasFocus) {
            missingFocusClasses.push(cls);
          }
        }
        
        if (missingFocusClasses.length > 0) {
          results.push({
            comp: path.relative(coreDir, fullPath).replace(/\\/g, '/'),
            missing: missingFocusClasses,
            cssPath: path.join(fullPath, cssFiles[0])
          });
        }
      } else {
        walk(fullPath);
      }
    }
  }
}

walk(coreDir);
console.log('Components with interactive classes missing focus-visible:', results.length);
results.forEach(r => console.log(r.comp, '->', r.missing.join(', ')));
