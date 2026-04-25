import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getUserReferral } from '../../services/api'

export default function MemberReferralPanel() {
  const { t } = useTranslation()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [referralData, setReferralData] = useState(null)
  const [referralLoading, setReferralLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    let cancelled = false
    setReferralLoading(true)
    getUserReferral(null, null, { signal: ac.signal })
      .then((data) => {
        if (!cancelled) setReferralData(data)
      })
      .catch((err) => {
        if (cancelled || ac.signal.aborted) return
        console.error('Error fetching referral:', err)
        if (!cancelled) setReferralData(null)
      })
      .finally(() => {
        if (!cancelled) setReferralLoading(false)
      })
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [])

  const downlines = referralData?.downline ?? referralData?.downlines ?? []

  if (referralLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-[#5a5a5a]">
        {t('referralPanel.loading')}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">{t('referralPanel.title')}</h2>

      {referralData?.referral && (
        <div className="bg-[#d8d8d8]/50 border border-[#909090]/30 rounded-lg p-4">
          <p className="text-sm text-[#3a3a3a]">{referralData.referral.description}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">{t('referralPanel.dateFrom')}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">{t('referralPanel.dateTo')}</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
          />
        </div>

        <button
          type="button"
          className="w-full sm:w-auto px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a] font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all"
          onClick={async () => {
            const ac = new AbortController()
            setReferralLoading(true)
            try {
              const data = await getUserReferral(fromDate || null, toDate || null, { signal: ac.signal })
              setReferralData(data)
            } catch (err) {
              if (!ac.signal.aborted) console.error('Error fetching referral:', err)
            } finally {
              setReferralLoading(false)
            }
          }}
        >
          {t('referralPanel.filter')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('referralPanel.thNo')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('referralPanel.thUser')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('referralPanel.thFirstDepo')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">{t('referralPanel.thFirstDepoAmt')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">{t('referralPanel.thTurnover')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">{t('referralPanel.thWinLose')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">{t('referralPanel.thCommission')}</th>
            </tr>
          </thead>
          <tbody>
            {downlines.length > 0 ? (
              downlines.map((dl, i) => (
                <tr key={i} className="border-t border-[#909090]/20">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a]">{i + 1}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a]">{dl.username}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#5a5a5a]">{dl.first_depo_date}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-[#3a3a3a]">
                    IDR {dl.first_depo_amount?.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-[#3a3a3a]">
                    IDR {dl.turnover?.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right ${
                      dl.winlose >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    IDR {dl.winlose?.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-green-600">
                    IDR {dl.comision?.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-xs sm:text-sm text-[#5a5a5a]">
                  {t('referralPanel.noData')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">
        {t('member.inbox.showing', { from: downlines.length > 0 ? 1 : 0, to: downlines.length || 0, total: downlines.length || 0 })}
      </p>
    </div>
  )
}
