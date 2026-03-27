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
        DEFAULT: '#5B3FD3',   // brand purple
        hover: '#4C31BF',     // brand hover
        soft: '#EEE9FF',      // brand soft bg
    },
    accent: {
        DEFAULT: '#8B7BFF',   // accent purple
    },
    success: {
        DEFAULT: '#16a34a',
        light: '#bbf7d0',
        bg: '#f0fdf4',
    },
    error: {
        DEFAULT: '#dc2626',
        light: '#fecaca',
        bg: '#fef2f2',
    },
    warning: {
        DEFAULT: '#d97706',
        light: '#fde68a',
        bg: '#fffbeb',
    },
    info: {
        DEFAULT: '#2563eb',
        light: '#bfdbfe',
        bg: '#eff6ff',
    },
    surface: {
        DEFAULT: '#FFFFFF',
        secondary: '#F8F8FC',  // page bg
        border: '#E6E2F3',     // border brand
    },
    text: {
        DEFAULT: '#16151D',    // text primary
        secondary: '#6F6B7D',  // text secondary
        inverse: '#ffffff',
    },
} as const
