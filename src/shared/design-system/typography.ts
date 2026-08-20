/**
 * Design tokens: typography
 *
 * Готовые строки Tailwind-классов: :class="typography.h1"
 *
 * Шкала намеренно короткая и с крупным шагом — так иерархия читается
 * без «почти одинаковых» размеров. Заголовки идут с tracking-tight,
 * основной текст — с увеличенным line-height для длинных русских слов.
 */

export const typography = {
    /** Маркетинговые заголовки (hero, лендинг). Серифный display-шрифт. */
    display: 'font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl',
    displaySm: 'font-display text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl',

    /** Заголовки внутри продукта. */
    h1: 'text-2xl font-semibold leading-tight tracking-tight sm:text-3xl',
    h2: 'text-xl font-semibold leading-snug tracking-tight sm:text-2xl',
    h3: 'text-base font-semibold leading-snug sm:text-lg',
    h4: 'text-sm font-semibold leading-snug sm:text-base',

    /** Подзаголовок / лид-абзац под заголовком. */
    subtitle: 'text-base leading-relaxed text-text-secondary sm:text-lg',

    /** Основной текст. */
    body: 'text-sm leading-relaxed sm:text-[0.9375rem]',
    bodyLarge: 'text-base leading-relaxed',
    small: 'text-xs leading-normal',

    /** Вспомогательные. */
    label: 'text-sm font-medium leading-none',
    caption: 'text-xs leading-normal text-text-secondary',
    /** Надзаголовок секции: КАПС, широкий трекинг. */
    overline: 'text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary',
    /** Числа в статистике — табличные цифры, чтобы не «прыгали». */
    metric: 'text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl',
} as const

export const fontFamily = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif"
export const fontFamilyDisplay = "'Newsreader', Georgia, 'Times New Roman', serif"
