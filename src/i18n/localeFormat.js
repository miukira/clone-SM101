import i18n from 'i18next'

/** Locale BCP-47 for Date.prototype.toLocale* */
export function getDateLocale() {
  const l = (i18n.resolvedLanguage || i18n.language || 'id').toLowerCase()
  return l.startsWith('en') ? 'en-GB' : 'id-ID'
}

/** Locale for Number.prototype.toLocaleString */
export function getNumberLocale() {
  return getDateLocale()
}
