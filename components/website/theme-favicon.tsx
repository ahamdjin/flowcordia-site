'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const FAVICONS = {
  light: '/flowcordia-logo-black.svg',
  dark: '/flowcordia-logo-white.svg',
} as const;

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return;

    const href = FAVICONS[resolvedTheme];
    const existingIcons = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']")
    );

    if (existingIcons.length === 0) {
      const icon = document.createElement('link');
      icon.rel = 'icon';
      icon.type = 'image/svg+xml';
      icon.href = href;
      document.head.appendChild(icon);
      return;
    }

    existingIcons.forEach((icon) => {
      icon.type = 'image/svg+xml';
      icon.href = href;
    });
  }, [resolvedTheme]);

  return null;
}
