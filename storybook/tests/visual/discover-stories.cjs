const { glob } = require('glob');
const path = require('path');

const STORIES_ROOT = path.resolve(__dirname, '..', '..', '..', 'src');
console.log(`Looking for stories in: ${STORIES_ROOT}`);

async function main() {
  const files = await glob('**/*.stories.@(ts|tsx)', { cwd: STORIES_ROOT, absolute: true });
  console.log(`Found ${files.length} story files`);
  if (files.length === 0) {
    throw new Error(`Storybook diagnostic discovery found zero story files in ${STORIES_ROOT}`);
  }
  for (const file of files.slice(0, 10)) {
    console.log(`  ${path.relative(STORIES_ROOT, file)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
