'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export type ThemeName = 'graphite-teal' | 'steel' | 'meridian' | 'signal';

const STORAGE_KEY = 'me-theme';
const themes: readonly ThemeName[] = ['graphite-teal', 'steel', 'meridian', 'signal'] as const;

function isTheme(value: string | null): value is ThemeName {
  return !!value && (themes as readonly string[]).includes(value);
}

function applyTheme(name: ThemeName) {
  document.documentElement.setAttribute('data-theme', name);
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {}
}

function currentTheme(): ThemeName {
  const attr = document.documentElement.getAttribute('data-theme');
  return isTheme(attr) ? attr : 'graphite-teal';
}

/**
 * Headless — applies ?theme=<id> on client-side nav and persists it.
 * Initial paint is handled by the inline bootstrap script in app/layout.tsx.
 *
 * Also binds Shift+T to cycle through themes during design review.
 * Ignored while typing in inputs/textareas. Remove this whole file when
 * the palette is finalized.
 */
export default function ThemeSwitcher() {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<ThemeName | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get('theme');
    if (!isTheme(fromUrl)) return;
    applyTheme(fromUrl);
  }, [searchParams]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== 'T' && e.key !== 't') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;

      e.preventDefault();
      const idx = themes.indexOf(currentTheme());
      const next = themes[(idx + 1) % themes.length];
      applyTheme(next);
      setToast(next);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 1200);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
    >
      <div className="mono text-xs tracking-widest uppercase bg-ink text-paper px-4 py-2 rounded-sm shadow-lg">
        theme · {toast}
      </div>
    </div>
  );
}
