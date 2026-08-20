/**
 * Design tokens: colors
 *
 * ВАЖНО: единственный источник правды — CSS-переменные в `src/assets/main.css`.
 * Этот файл нужен только там, где значение требуется программно
 * (canvas, charts, инлайновые стили, meta theme-color).
 *
 * Для стилизации компонентов используйте Tailwind-классы семантических
 * токенов: `bg-surface`, `text-text-secondary`, `border-border-subtle`,
 * `bg-brand text-on-brand` и т.д. Хардкодить hex в компонентах нельзя —
 * это ломает тёмную тему.
 */

/** Читает значение семантического токена из текущей темы во время выполнения. */
export function themeColor(token: string, el: HTMLElement = document.documentElement): string {
    return getComputedStyle(el).getPropertyValue(`--theme-${token}`).trim()
}

/** Статические значения светлой темы. Соответствуют `:root` в main.css. */
export const colors = {
    brand: {
        DEFAULT: '#6b21a8',   // deep violet (8.7:1 on white)
        hover: '#581c87',
        active: '#4c1d95',
        soft: '#faf5ff',
        border: '#E9D5FF',
        /** текст/иконки поверх brand-заливки — всегда светлые */
        on: '#FFFFFF',
    },
    accent: {
        DEFAULT: '#8b5cf6',
    },
    surface: {
        DEFAULT: '#FFFFFF',
        secondary: '#F3F2F9',
        sunken: '#EDEBF5',
        page: '#F8F8FC',
    },
    text: {
        DEFAULT: '#16151D',
        secondary: '#5E5A6B',
        muted: '#6F6B7D',
        inverse: '#F8F8FC',
    },
    border: {
        subtle: '#EFEDF7',
        DEFAULT: '#E6E2F3',
        strong: '#D4CDE8',
    },
    success: { DEFAULT: '#16a34a', soft: '#f0fdf4', border: '#bbf7d0' },
    error:   { DEFAULT: '#dc2626', soft: '#fef2f2', border: '#fecaca' },
    warning: { DEFAULT: '#d97706', soft: '#fffbeb', border: '#fde68a' },
    info:    { DEFAULT: '#2563eb', soft: '#eff6ff', border: '#bfdbfe' },
} as const

/** Статические значения тёмной темы. Соответствуют `html.dark` в main.css. */
export const darkColors = {
    brand: {
        DEFAULT: '#A855F7',
        hover: '#B975F9',
        active: '#9333EA',
        soft: '#241A33',
        border: '#3F2E5C',
        on: '#16151D',
    },
    accent: {
        DEFAULT: '#C4B5FD',
    },
    surface: {
        DEFAULT: '#1B1A21',
        secondary: '#22212A',
        sunken: '#0E0D12',
        page: '#131218',
    },
    text: {
        DEFAULT: '#F3F2F8',
        secondary: '#A9A5B8',
        muted: '#8D8899',
        inverse: '#16151D',
    },
    border: {
        subtle: '#262530',
        DEFAULT: '#33303E',
        strong: '#454154',
    },
    success: { DEFAULT: '#4ADE80', soft: '#132A1B', border: '#1F4D2E' },
    error:   { DEFAULT: '#F87171', soft: '#2D1517', border: '#5A2225' },
    warning: { DEFAULT: '#FBBF24', soft: '#2C2109', border: '#573F13' },
    info:    { DEFAULT: '#60A5FA', soft: '#111E2E', border: '#1E3A5F' },
} as const
