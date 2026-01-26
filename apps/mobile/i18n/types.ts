/**
 * i18n/types.ts - TypeScript types for i18n
 * 
 * Provides type safety for translation keys.
 * Generated from the translation structure.
 * 
 * @author Kaiz Team
 * @version 1.0.0
 */

import en from './locales/en.json';

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
export type AuthKeys = Extract<TranslationKeys, `auth.${string}`>;
export type NavigationKeys = Extract<TranslationKeys, `navigation.${string}`>;
export type TaskKeys = Extract<TranslationKeys, `tasks.${string}`>;
export type SettingsKeys = Extract<TranslationKeys, `settings.${string}`>;
export type ErrorKeys = Extract<TranslationKeys, `errors.${string}`>;
