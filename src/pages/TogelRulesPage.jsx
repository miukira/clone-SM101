import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

const SECTION_KEYS = ['diskon', '4d', '3d', '2d', 'bbfs']

function buildToc(t) {
  return [
    { href: '#diskon', label: t('togelRules.toc.diskon') },
    { href: '#4d', label: t('togelRules.toc.4d') },
    { href: '#3d', label: t('togelRules.toc.3d') },
    { href: '#2d', label: t('togelRules.toc.2d') },
    { href: '#bbfs', label: t('togelRules.toc.bbfs') },
  ]
}

export default function TogelRulesPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const toc = useMemo(() => buildToc(t), [t, i18n.language])
  const sections = useMemo(
    () =>
      SECTION_KEYS.map((k) => ({
        id: k,
        title: t(`togelRules.${k}.title`),
        bullets: t(`togelRules.${k}.bullets`, { returnObjects: true }) || [],
      })),
    [t, i18n.language],
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/90 border-b border-[#2a2a2a] backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#C0C0C0] hover:text-white font-bold text-sm"
          >
            {t('togelRules.back')}
          </button>
          <h1 className="text-lg font-black tracking-wider text-[#C0C0C0]">{t('togelRules.title')}</h1>
          <Link to="/togel" className="text-sm font-bold text-[#808080] hover:text-white">
            {t('togelRules.linkBet')}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-16">
        <p className="text-sm text-[#808080] leading-relaxed">
          {t('togelRules.intro')}
        </p>

        <nav
          aria-label={t('togelRules.navLabel')}
          className="flex flex-wrap gap-2 rounded-xl border border-[#333] bg-[#0d0d0d] p-3"
        >
          {toc.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs font-bold text-[#C0C0C0] hover:border-[#505050] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="rounded-2xl border border-[#333] bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-5 sm:p-6"
          >
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] to-[#909090] mb-4">
              {s.title}
            </h2>
            <ul className="space-y-3 text-sm text-[#A0A0A0] leading-relaxed list-disc pl-5">
              {Array.isArray(s.bullets) && s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        <p className="text-xs text-[#505050] text-center">
          {t('togelRules.footer')}
        </p>
      </main>
    </div>
  )
}
