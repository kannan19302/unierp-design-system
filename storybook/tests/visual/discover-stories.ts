import { globSync } from 'glob';
import path from 'path';
import { readFileSync } from 'fs';
import ts from 'typescript';

const STORIES_ROOT = path.resolve(__dirname, '../../../src');

export interface StoryInfo {
  id: string;
  title: string;
  filePath: string;
  component: string;
}

export function discoverStories(): StoryInfo[] {
  const storyFiles = globSync('**/*.stories.@(ts|tsx)', { cwd: STORIES_ROOT, absolute: true });
  if (storyFiles.length === 0) {
    throw new Error(`Storybook visual discovery found zero story files in ${STORIES_ROOT}`);
  }
  
  const stories: StoryInfo[] = [];
  
  for (const filePath of storyFiles) {
    const content = readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(STORIES_ROOT, filePath);
    
    // Parse CSF exports with TypeScript so typed StoryObj declarations are included.
    const source = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const storyNames = source.statements
      .filter((statement): statement is ts.VariableStatement =>
        ts.isVariableStatement(statement) &&
        Boolean(statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)))
      .flatMap((statement) => statement.declarationList.declarations)
      .filter((declaration) => ts.isIdentifier(declaration.name))
      .map((declaration) => declaration.name.getText(source))
      .filter((name) => name !== 'meta' && !name.startsWith('_'));
    const metaDeclaration = source.statements
      .filter(ts.isVariableStatement)
      .flatMap((statement) => statement.declarationList.declarations)
      .find((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'meta');
    const titleProperty = metaDeclaration?.initializer && ts.isObjectLiteralExpression(metaDeclaration.initializer)
      ? metaDeclaration.initializer.properties.find((property) =>
          ts.isPropertyAssignment(property) && property.name.getText(source) === 'title')
      : undefined;
    const title = titleProperty && ts.isPropertyAssignment(titleProperty) && ts.isStringLiteral(titleProperty.initializer)
      ? titleProperty.initializer.text
      : undefined;
    if (!title) {
      throw new Error(`Storybook visual discovery could not read the meta title in ${relativePath}`);
    }
    const component = path.dirname(relativePath).split(path.sep).pop() || 'unknown';
    
    // Find named exports (individual stories)
    if (storyNames.length === 0) {
      throw new Error(`Storybook visual discovery found no CSF story exports in ${relativePath}`);
    }
    for (const storyName of storyNames) {
      stories.push({
        id: `${toStorybookId(title)}--${toStorybookId(storyName, true)}`,
        title,
        filePath: relativePath,
        component,
      });
    }
  }

  if (stories.length === 0) {
    throw new Error(`Storybook visual discovery found zero story exports in ${STORIES_ROOT}`);
  }
  if (new Set(stories.map((story) => story.id)).size !== stories.length) {
    throw new Error('Storybook visual discovery found duplicate story IDs');
  }
  return stories;
}

function toStorybookId(value: string, isExportName = false): string {
  return (isExportName
    ? value
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Za-z])([0-9])/g, '$1-$2')
    : value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const THEMES = ['strata', 'strata-dark', 'strata-high-contrast'];
export const DENSITIES = ['ultra-compact', 'compact', 'standard', 'comfortable'];

export function generateStoryUrl(storyId: string, theme: string, density: string): string {
  return `/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story&globals=${encodeURIComponent(`theme:${theme},density:${density}`)}`;
}
