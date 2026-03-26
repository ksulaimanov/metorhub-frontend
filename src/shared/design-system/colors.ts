/**
 * Design tokens: colors
 *
 * Используются как справочник при стилизации через Tailwind.
 * Tailwind-классы остаются основным способом, но tokens дают единый
 * источник правды для тех случаев, когда нужны программные значения
 * (динамические стили, charts, canvas).
 */

export const colors = {
    primary: {
        DEFAULT: '#0f172a',   // slate-900 — основной brand
        light: '#334155',     // slate-700
        lighter: '#64748b',   // slate-500
    },
    accent: {
        DEFAULT: '#4f46e5',   // indigo-600
        light: '#818cf8',     // indigo-400
        dark: '#3730a3',      // indigo-800
    },
    success: {
        DEFAULT: '#16a34a',   // green-600
        light: '#bbf7d0',     // green-200
        bg: '#f0fdf4',        // green-50
    },
    error: {
        DEFAULT: '#dc2626',   // red-600
        light: '#fecaca',     // red-200
        bg: '#fef2f2',        // red-50
    },
    warning: {
        DEFAULT: '#d97706',   // amber-600
        light: '#fde68a',     // amber-200
        bg: '#fffbeb',        // amber-50
    },
    info: {
        DEFAULT: '#2563eb',   // blue-600
        light: '#bfdbfe',     // blue-200
        bg: '#eff6ff',        // blue-50
    },
    surface: {
        DEFAULT: '#ffffff',
        secondary: '#f8fafc', // slate-50
        tertiary: '#f1f5f9',  // slate-100
        border: '#e2e8f0',    // slate-200
    },
    text: {
        DEFAULT: '#0f172a',   // slate-900
        secondary: '#475569', // slate-600
        tertiary: '#94a3b8',  // slate-400
        inverse: '#ffffff',
    },
} as const

