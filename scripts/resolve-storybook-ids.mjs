import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'd:/UniERP/design-system/src';
const listPath = 'd:/UniERP/design-system/scripts/components-audit-list.json';
const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));

for (const item of list) {
  const sPath = path.join(srcDir, item.category, item.name, `${item.name}.stories.tsx`);
  if (fs.existsSync(sPath)) {
    const content = fs.readFileSync(sPath, 'utf8');
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : `${item.category}/${item.name}`;
    
    // Find exported stories
    const storyExportMatches = [...content.matchAll(/export const ([A-Za-z0-9_]+)\s*:\s*Story/g)];
    const storyName = storyExportMatches.length > 0 ? storyExportMatches[0][1] : 'Default';
    
    // Convert to Storybook 8 slug:
    // "Primitives/Alert" -> "primitives-alert"
    // "Data Grid/MatterTrustLedger" -> "data-grid-mattertrustledger"
    const sanitizedTitle = title
      .toLowerCase()
      .split('/')
      .map(part => part.trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
      .join('-');
      
    const sanitizedStoryName = storyName
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    
    item.storybookTitle = title;
    item.storyName = storyName;
    item.storyId = `${sanitizedTitle}--${sanitizedStoryName}`;
    item.storybookUrl = `http://localhost:6006/?path=/story/${item.storyId}`;
  }
}

fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
console.log('Processed all 346 components storybook metadata.');
console.log('Sample 3:', list.slice(0, 3).map(i => ({ name: i.name, id: i.storyId, url: i.storybookUrl })));
