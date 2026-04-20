export function extractModels(html: string | undefined): { models: string[]; html: string } {
  if (!html) return { models: [], html: '' };

  const stripped = html.replace(/<br\s*\/?>(\s|&nbsp;)*/gi, '\n');
  const lines = stripped.split('\n').map((l) => l.trim()).filter(Boolean);

  const modelRe = /^Model\s+(.+)$/i;
  const models: string[] = [];
  const keep: string[] = [];

  for (const line of lines) {
    const m = line.match(modelRe);
    if (m) {
      const cleaned = m[1].replace(/<\/?[^>]+>/g, '').trim();
      if (cleaned) models.push(cleaned);
    } else {
      keep.push(line);
    }
  }

  const modelsHeadingRe = /<strong>\s*Models?\s*<\/strong>\s*/i;
  let rebuiltHtml = keep.join('<br/>');
  if (models.length > 0) {
    rebuiltHtml = rebuiltHtml.replace(modelsHeadingRe, '');
    rebuiltHtml = rebuiltHtml.replace(/(<br\/>\s*){2,}/g, '<br/><br/>');
    rebuiltHtml = rebuiltHtml.replace(/^(<br\/>\s*)+|(<br\/>\s*)+$/g, '');
  }

  return { models, html: rebuiltHtml };
}
