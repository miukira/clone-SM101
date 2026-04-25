import { useTranslation } from 'react-i18next'
import i18n from '../i18n.js'

/**
 * Toggle ID / EN — state disinkron ke localStorage lewat i18n.js
 */
export default function I18nLanguageSwitch() {
  const { t } = useTranslation()
  const active = (i18n.resolvedLanguage || i18n.language || 'id').startsWith('en') ? 'en' : 'id'

  const base =
    'px-2 py-1 text-[10px] font-bold tracking-wider transition min-w-[2.25rem] '

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-md border border-[#404040] bg-[#1a1a1a] shadow-sm"
      role="group"
      aria-label={t('a11y.changeLanguage')}
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage('id')}
        className={
          base +
          (active === 'id'
            ? 'bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] text-[#E8E8E8]'
            : 'text-[#606060] hover:text-[#909090]')
        }
      >
        ID
      </button>
      <div className="h-3.5 w-px bg-[#404040]" aria-hidden />
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={
          base +
          (active === 'en'
            ? 'bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] text-[#E8E8E8]'
            : 'text-[#606060] hover:text-[#909090]')
        }
      >
        EN
      </button>
    </div>
  )
}
