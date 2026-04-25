import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import id from './locales/id.json'

const LANG_KEY = 'i18n_lang'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LANG_KEY) : null
const initialLng = saved === 'en' || saved === 'id' ? saved : 'id'

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: id },
    en: { translation: en },
  },
  lng: initialLng,
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

i18n.on('languageChanged', (lng) => {
  if (typeof localStorage !== 'undefined' && (lng === 'en' || lng === 'id')) {
    try {
      localStorage.setItem(LANG_KEY, lng)
    } catch {
      /* abaikan */
    }
  }
})

export { LANG_KEY }
export { getDateLocale, getNumberLocale } from './i18n/localeFormat.js'
export default i18n
