import { createI18n } from 'vue-i18n'
import ru from './ru'
import ky from './ky'

export type SupportedLocale = 'ru' | 'ky'

const LOCALE_KEY = 'mentorhub_locale'

function getSavedLocale(): SupportedLocale {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'ru' || saved === 'ky') return saved
    return 'ru'
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

