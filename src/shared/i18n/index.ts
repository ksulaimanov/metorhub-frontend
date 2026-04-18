import { createI18n } from 'vue-i18n'
import ru from '@/shared/i18n/ru'
import ky from '@/shared/i18n/ky'

export type SupportedLocale = 'ru' | 'ky'

const LOCALE_KEY = 'jaimentorship_locale'

function getSavedLocale(): SupportedLocale {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'ru' || saved === 'ky') return saved
    return 'ky'
}

export function saveLocale(locale: SupportedLocale) {
    localStorage.setItem(LOCALE_KEY, locale)
}

const i18n = createI18n({
    legacy: false,
    locale: getSavedLocale(),
    fallbackLocale: 'ru',
    messages: { ru, ky },
})

export default i18n

