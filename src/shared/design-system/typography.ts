/**
 * Design tokens: typography
 *
 * Маппинг Tailwind-классов для единообразного применения.
 * Каждый ключ — готовая строка классов для :class="typography.h1"
 */

export const typography = {
    h1: 'text-2xl font-bold leading-tight sm:text-3xl',
    h2: 'text-xl font-bold leading-snug sm:text-2xl',
    h3: 'text-lg font-semibold leading-snug',
    subtitle: 'text-base font-medium',
    body: 'text-sm leading-relaxed',
    bodyLarge: 'text-base leading-relaxed',
    small: 'text-xs leading-normal',
    label: 'text-sm font-medium',
} as const

export const fontFamily = "'Inter', system-ui, -apple-system, sans-serif"

