'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export type ThemeName = 'graphite-teal';

const STORAGE_KEY = 'me-theme';
const themes: readonly ThemeName[] = ['graphite-teal'] as const;

function isTheme(value: string | null): value is ThemeName {
  return !!value && (themes as readonly string[]).includes(value);
}

/**
 * Headless — applies ?theme=<id> on client-side nav and persists it.
 * Initial paint is handled by the inline bootstrap script in app/layout.tsx.
 */
export default function ThemeSwitcher() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromUrl = searchParams.get('theme');
    if (!isTheme(fromUrl)) return;
    document.documentElement.setAttribute('data-theme', fromUrl);
    try {
      localStorage.setItem(STORAGE_KEY, fromUrl);
    } catch {}
  }, [searchParams]);

  return null;
}
