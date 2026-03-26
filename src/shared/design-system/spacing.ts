/**
 * Design tokens: spacing & radius
 *
 * Единые значения для gap, padding, border-radius.
 * Tailwind-классы остаются основным способом, tokens — справочник.
 */

export const radius = {
    sm: 'rounded-lg',         // 8px
    md: 'rounded-2xl',        // 16px  — inputs, buttons
    lg: 'rounded-3xl',        // 24px  — cards, modals
    full: 'rounded-full',     // pills, avatars
} as const

export const spacing = {
    page: 'px-4 sm:px-6 lg:px-8',
    section: 'py-8 sm:py-12',
    stack: 'space-y-6',
    inline: 'space-x-3',
} as const

