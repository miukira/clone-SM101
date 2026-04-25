import { useTranslation } from 'react-i18next'
import i18n from '../i18n.js'

/**
 * Dropdown ID / EN — state disinkron ke localStorage lewat i18n.js
 */
export default function I18nLanguageSwitch() {
  const { t } = useTranslation()
  const active = (i18n.resolvedLanguage || i18n.language || 'id').startsWith('en') ? 'en' : 'id'

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t('a11y.changeLanguage')}</span>
      <select
        aria-label={t('a11y.changeLanguage')}
        value={active}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="min-w-[4.25rem] appearance-none rounded-md border border-[#404040] bg-[#1a1a1a] px-2 py-1 pr-6 text-[10px] font-bold tracking-wider text-[#E8E8E8] shadow-sm outline-none transition hover:border-[#606060] focus:border-[#808080]"
      >
        <option value="id">{t('locale.id')}</option>
        <option value="en">{t('locale.en')}</option>
      </select>
      <svg
        className="pointer-events-none absolute right-2 h-3 w-3 text-[#808080]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
  )
}
