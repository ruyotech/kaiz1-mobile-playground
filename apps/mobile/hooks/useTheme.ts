/**
 * useTheme.ts - Theme Management Hook for Kaiz LifeOS
 * 
 * Implements tri-state theme logic (Light / Dark / System) with proper
 * integration with React Native's Appearance API for system mode detection.
 * 
 * Usage:
 * ```tsx
 * const { theme, isDark, colors, setTheme } = useTheme();
 * ```
 * 
 * @author Kaiz Team
 * @version 1.0.0
 */

import { useEffect, useCallback } from 'react';
import { useColorScheme, Appearance, ColorSchemeName } from 'react-native';
import { usePreferencesStore, type ThemeMode } from '../store/preferencesStore';
import { useSettingsStore } from '../store/settingsStore';

// ============================================================================
// Color Palette Definition
// ============================================================================

export interface ThemeColors {
    // Backgrounds
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    card: string;
    
    // Text
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    
    // Borders
    border: string;
    borderSecondary: string;
    
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    // Semantic colors
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
    infoLight: string;
    
    // Special
    overlay: string;
    shadow: string;
    
    // Interactive
    ripple: string;
    highlight: string;
}

// Light theme colors
const LIGHT_COLORS: ThemeColors = {
    // Backgrounds
    background: '#F9FAFB',           // gray-50
    backgroundSecondary: '#FFFFFF',   // white
    backgroundTertiary: '#F3F4F6',    // gray-100
    card: '#FFFFFF',
    
    // Text
    text: '#111827',                  // gray-900
    textSecondary: '#6B7280',         // gray-500
    textTertiary: '#9CA3AF',          // gray-400
    textInverse: '#FFFFFF',
    
    // Borders
    border: '#E5E7EB',                // gray-200
    borderSecondary: '#F3F4F6',       // gray-100
    
    // Primary
    primary: '#3B82F6',               // blue-500
    primaryLight: '#DBEAFE',          // blue-100
    primaryDark: '#1D4ED8',           // blue-700
    
    // Semantic
    success: '#10B981',               // emerald-500
    successLight: '#D1FAE5',          // emerald-100
    warning: '#F59E0B',               // amber-500
    warningLight: '#FEF3C7',          // amber-100
    error: '#EF4444',                 // red-500
    errorLight: '#FEE2E2',            // red-100
    info: '#0EA5E9',                  // sky-500
    infoLight: '#E0F2FE',             // sky-100
    
    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Interactive
    ripple: 'rgba(0, 0, 0, 0.08)',
    highlight: 'rgba(59, 130, 246, 0.1)',
};

// Dark theme colors
const DARK_COLORS: ThemeColors = {
    // Backgrounds
    background: '#111827',            // gray-900
    backgroundSecondary: '#1F2937',   // gray-800
    backgroundTertiary: '#374151',    // gray-700
    card: '#1F2937',                  // gray-800
    
    // Text
    text: '#F9FAFB',                  // gray-50
    textSecondary: '#9CA3AF',         // gray-400
    textTertiary: '#6B7280',          // gray-500
    textInverse: '#111827',           // gray-900
    
    // Borders
    border: '#374151',                // gray-700
    borderSecondary: '#4B5563',       // gray-600
    
    // Primary
    primary: '#60A5FA',               // blue-400
    primaryLight: '#1E3A5F',          // custom dark blue
    primaryDark: '#93C5FD',           // blue-300
    
    // Semantic
    success: '#34D399',               // emerald-400
    successLight: '#064E3B',          // emerald-900
    warning: '#FBBF24',               // amber-400
    warningLight: '#78350F',          // amber-900
    error: '#F87171',                 // red-400
    errorLight: '#7F1D1D',            // red-900
    info: '#38BDF8',                  // sky-400
    infoLight: '#0C4A6E',             // sky-900
    
    // Special
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    
    // Interactive
    ripple: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(96, 165, 250, 0.2)',
};

// ============================================================================
// Theme Hook Return Type
// ============================================================================

export interface UseThemeReturn {
    /**
     * Current theme mode setting (light, dark, or system)
     */
    themeMode: ThemeMode;
    
    /**
     * The effective/resolved theme (light or dark)
     */
    theme: 'light' | 'dark';
    
    /**
     * Whether dark mode is currently active
     */
    isDark: boolean;
    
    /**
     * Whether light mode is currently active
     */
    isLight: boolean;
    
    /**
     * Current color palette based on theme
     */
    colors: ThemeColors;
    
    /**
     * System color scheme (what the device is set to)
     */
    systemScheme: ColorSchemeName;
    
    /**
     * Update the theme mode
     */
    setTheme: (mode: ThemeMode) => void;
    
    /**
     * Toggle between light and dark (ignores system)
     */
    toggleTheme: () => void;
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * Main theme hook for managing app-wide theming
 * 
 * Features:
 * - Tri-state theme mode (Light / Dark / System)
 * - Automatic system preference detection
 * - Persisted preference via Zustand
 * - Color palette access
 * 
 * @returns Theme state and controls
 */
export function useTheme(): UseThemeReturn {
    // Get system color scheme from React Native
    const systemScheme = useColorScheme();
    
    // Get theme preference from stores
    const themeMode = usePreferencesStore((state) => state.theme);
    const setPreferencesTheme = usePreferencesStore((state) => state.setTheme);
    const setSettingsTheme = useSettingsStore((state) => state.setThemeMode);
    
    // Calculate effective theme based on mode and system preference
    const getEffectiveTheme = useCallback((): 'light' | 'dark' => {
        if (themeMode === 'auto') {
            return systemScheme === 'dark' ? 'dark' : 'light';
        }
        return themeMode === 'dark' ? 'dark' : 'light';
    }, [themeMode, systemScheme]);
    
    const theme = getEffectiveTheme();
    const isDark = theme === 'dark';
    const isLight = theme === 'light';
    const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
    
    // Update theme mode in both stores
    const setTheme = useCallback((mode: ThemeMode) => {
        setPreferencesTheme(mode);
        setSettingsTheme(mode);
    }, [setPreferencesTheme, setSettingsTheme]);
    
    // Toggle between light and dark (ignores system)
    const toggleTheme = useCallback(() => {
        const newMode = isDark ? 'light' : 'dark';
        setTheme(newMode);
    }, [isDark, setTheme]);
    
    return {
        themeMode,
        theme,
        isDark,
        isLight,
        colors,
        systemScheme,
        setTheme,
        toggleTheme,
    };
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Simple hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
    const { isDark } = useTheme();
    return isDark;
}

/**
 * Get just the color palette for current theme
 */
export function useThemeColors(): ThemeColors {
    const { colors } = useTheme();
    return colors;
}

/**
 * Get a specific color from the theme
 */
export function useThemeColor(colorName: keyof ThemeColors): string {
    const colors = useThemeColors();
    return colors[colorName];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get color palette for a specific theme
 */
export function getColorsForTheme(theme: 'light' | 'dark'): ThemeColors {
    return theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}

/**
 * Static light colors export for direct access
 */
export const lightColors = LIGHT_COLORS;

/**
 * Static dark colors export for direct access
 */
export const darkColors = DARK_COLORS;
