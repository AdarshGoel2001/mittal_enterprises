import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'products');

export function getProductMarkdown(slug: string): string {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

export function extractModelsFromMarkdown(md: string): { models: string[]; markdown: string } {
  if (!md) return { models: [], markdown: '' };

  const lines = md.split('\n');
  const models: string[] = [];
  const kept: string[] = [];
  let inModelsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^##\s+Models?\s*$/i.test(trimmed)) {
      inModelsSection = true;
      continue;
    }

    if (inModelsSection && /^##\s+/.test(trimmed)) {
      inModelsSection = false;
      kept.push(line);
      continue;
    }

    if (inModelsSection) {
      const stripped = trimmed.replace(/^[-*]\s+/, '').replace(/^\*\*(.+)\*\*$/, '$1').trim();
      const m = stripped.match(/^Model\s+(.+)$/i);
      if (m) {
        models.push(m[1].trim());
        continue;
      }
      if (stripped) models.push(stripped);
      continue;
    }

    kept.push(line);
  }

  return {
    models,
    markdown: kept.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
  };
}
