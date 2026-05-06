import type { Citation } from '@/lib/citations-data';

export default function CitationCard({ citation }: { citation: Citation }) {
  const c = citation;
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <p className="text-sm md:text-base text-ink leading-snug group-hover:text-accent transition-colors">
        {c.title}
      </p>

      <p className="mono text-[0.7rem] tracking-wide uppercase text-ink-muted mt-2">
        {c.authors || 'Author n/a'}
        {c.year ? ` · ${c.year}` : ''}
        {c.journal ? ` · ${c.journal}` : ''}
        {c.citedByCount > 0 ? ` · cited by ${c.citedByCount}` : ''}
      </p>

      {c.modelCodes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.modelCodes.map((m) => (
            <span
              key={m}
              className="mono text-[0.65rem] tracking-wide px-2 py-0.5 border border-rule text-ink-2 bg-paper"
              title={`Identified Mittal Enterprises model used: ${m}`}
            >
              Model {m}
            </span>
          ))}
        </div>
      )}

      {c.evidenceSnippet && (
        <blockquote className="mt-4 border-l-2 border-rule pl-4 text-sm text-ink-2 italic leading-relaxed">
          &ldquo;{c.evidenceSnippet}&rdquo;
          {c.evidencePage != null && (
            <span className="block mono not-italic text-[0.65rem] tracking-widest uppercase text-ink-muted mt-2">
              Verified · evidence on page {c.evidencePage} of source PDF
            </span>
          )}
        </blockquote>
      )}
    </a>
  );
}
