'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type ThemeName = 'graphite-teal';

export const themes: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'graphite-teal', label: 'Graphite · Teal', swatch: '#0e4f4f' },
];

const STORAGE_KEY = 'me-theme';

function isTheme(value: string | null): value is ThemeName {
  return !!value && themes.some((t) => t.id === value);
}

export default function ThemeSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeName>('graphite-teal');

  useEffect(() => {
    let frame = 0;
    const fromUrl = searchParams.get('theme');
    const fromStorage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const resolved: ThemeName = isTheme(fromUrl) ? fromUrl : isTheme(fromStorage) ? fromStorage : 'graphite-teal';
    document.documentElement.setAttribute('data-theme', resolved);
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {}
    frame = requestAnimationFrame(() => setCurrent(resolved));
    return () => cancelAnimationFrame(frame);
  }, [searchParams]);

  const pick = (id: ThemeName) => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('theme', id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const active = themes.find((t) => t.id === current) ?? themes[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 font-mono text-xs">
      {open && (
        <ul
          role="listbox"
          className="mb-2 border border-rule-strong bg-surface shadow-lg rounded-sm overflow-hidden min-w-[200px]"
        >
          {themes.map((t) => {
            const isActive = t.id === current;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => pick(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-paper'
                  }`}
                >
                  <span
                    aria-hidden
                    className="w-3 h-3 rounded-full border border-rule-strong shrink-0"
                    style={{ background: t.swatch }}
                  />
                  <span className="flex-1 tracking-wide">{t.label}</span>
                  {isActive && <span aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Theme switcher"
        className="flex items-center gap-2 px-3 py-2 bg-surface border border-rule-strong rounded-sm text-ink-2 hover:text-ink hover:border-ink transition-colors shadow-sm"
      >
        <span
          aria-hidden
          className="w-3 h-3 rounded-full border border-rule-strong"
          style={{ background: active.swatch }}
        />
        <span className="tracking-widest uppercase text-[0.65rem]">Theme</span>
        <span aria-hidden className="text-ink-muted">{open ? '×' : '↗'}</span>
      </button>
    </div>
  );
}
