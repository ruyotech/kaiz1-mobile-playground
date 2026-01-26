'use client';

/**
 * useTranslation.ts - React hook for i18n in Next.js
 * 
 * Provides translation function and locale management
 * with automatic re-rendering on language change.
 * 
 * Usage:
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 * return <h1>{t('hero.title.line1')}</h1>;
 * ```
 * 
 * @author Kaiz Team
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  createTranslator, 
  getLocale, 
  setLocale as persistLocale,
  locales,
  localeNames,
  type Locale 
} from '@/i18n';

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize locale from storage/browser on mount
  useEffect(() => {
    setMounted(true);
    const storedLocale = getLocale();
    setLocaleState(storedLocale);
  }, []);

  // Create translator for current locale
  const t = useMemo(() => createTranslator(locale), [locale]);

  // Change locale and persist
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    persistLocale(newLocale);
  }, []);

  return {
    t,
    locale,
    setLocale,
    locales,
    localeNames,
    mounted,
  };
}

export default useTranslation;
