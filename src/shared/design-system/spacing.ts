/**
 * Design tokens: spacing, radius, elevation
 *
 * Радиусы намеренно скромнее прежних: крупные скругления читаются
 * «игрушечно». Иерархия — control < card < modal.
 */

export const radius = {
    xs: 'rounded-md',         // 6px  — бейджи, чипы
    sm: 'rounded-lg',         // 8px  — мелкие контролы
    md: 'rounded-xl',         // 12px — inputs, buttons
    lg: 'rounded-2xl',        // 16px — карточки, модалки
    full: 'rounded-full',     // пилюли, аватары
} as const

export const elevation = {
    none: '',
    /** Карточка в покое: граница вместо тени. */
    flat: 'border border-border-subtle',
    /** Карточка, которую можно поднять при hover. */
    raised: 'border border-border-subtle shadow-sm',
    /** Поповеры, дропдауны. */
    overlay: 'border border-border-default shadow-md',
    /** Модалки. */
    modal: 'border border-border-default shadow-lg',
} as const

export const spacing = {
    /** Горизонтальные отступы контейнера страницы. */
    page: 'px-4 sm:px-6 lg:px-8',
    /** Максимальная ширина контента продукта. */
    container: 'mx-auto w-full max-w-7xl',
    /** Узкая колонка для текста/форм — 65–75 символов. */
    prose: 'mx-auto w-full max-w-2xl',
    /** Вертикальный ритм секции. */
    section: 'py-10 sm:py-14',
    sectionLarge: 'py-16 sm:py-24',
    /** Вертикальные стеки. */
    stack: 'space-y-6',
    stackTight: 'space-y-3',
    stackLoose: 'space-y-10',
    inline: 'space-x-3',
} as const
