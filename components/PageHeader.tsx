import Link from 'next/link';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function PageHeader({ eyebrow, title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="border-b border-rule bg-surface">
      <div className="wrap pt-14 pb-12 md:pt-20 md:pb-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-muted mono">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="opacity-50">/</span>
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-ink">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-accent transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-ink max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-base md:text-lg text-ink-muted max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
