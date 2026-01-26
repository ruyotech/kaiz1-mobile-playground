'use client';

/**
 * LanguageSwitcher.tsx - Language selection component
 * 
 * A dropdown component for switching between supported languages.
 * Shows flag emoji and native language name.
 * 
 * @author Kaiz Team
 * @version 1.0.0
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'ghost';
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const { locale, setLocale, locales, localeNames, mounted } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn('w-24 h-10 bg-slate-800/50 rounded-lg animate-pulse', className)} />
    );
  }

  const currentLocale = localeNames[locale];

  const baseStyles = {
    default: 'bg-slate-800/50 border border-white/10 hover:bg-slate-700/50',
    minimal: 'bg-transparent hover:bg-white/5',
    ghost: 'bg-transparent',
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
          baseStyles[variant]
        )}
        aria-label="Select language"
      >
        <span className="text-lg">{currentLocale.flag}</span>
        <span className="hidden sm:inline text-slate-300">{currentLocale.nativeName}</span>
        <svg 
          className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50">
          {locales.map((loc) => {
            const localeInfo = localeNames[loc];
            const isSelected = loc === locale;
            
            return (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  isSelected 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'text-slate-300 hover:bg-white/5'
                )}
              >
                <span className="text-xl">{localeInfo.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{localeInfo.nativeName}</div>
                  <div className="text-xs text-slate-500">{localeInfo.name}</div>
                </div>
                {isSelected && (
                  <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
