/**
 * i18n/types.ts - TypeScript types for i18n (Web)
 * 
 * Provides type safety for translation keys.
 * 
 * @author Kaiz Team
 * @version 1.0.0
 */

import type en from './locales/en.json';

// Type for all translation keys (dot notation)
export type TranslationKeys = NestedKeyOf<typeof en>;

// Helper type to generate dot-notation keys from nested object
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Type for translation function
export type TranslationFunction = (
  key: TranslationKeys | string,
  variables?: Record<string, string | number>
) => string;

// Type for the translation dictionary structure
export type TranslationDictionary = typeof en;

// Common translation key prefixes for autocomplete
export type CommonKeys = Extract<TranslationKeys, `common.${string}`>;
export type NavKeys = Extract<TranslationKeys, `nav.${string}`>;
export type HeroKeys = Extract<TranslationKeys, `hero.${string}`>;
export type FeatureKeys = Extract<TranslationKeys, `features.${string}`>;
export type FooterKeys = Extract<TranslationKeys, `footer.${string}`>;
export type AuthKeys = Extract<TranslationKeys, `auth.${string}`>;
export type ErrorKeys = Extract<TranslationKeys, `errors.${string}`>;
