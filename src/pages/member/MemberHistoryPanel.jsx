import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getBalanceMutation } from '../../services/api'

export default function MemberHistoryPanel() {
  const { t } = useTranslation()
  const [balanceMutations, setBalanceMutations] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [transactionType, setTransactionType] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    const ac = new AbortController()
    let cancelled = false
    setHistoryLoading(true)
    getBalanceMutation({ signal: ac.signal })
      .then((rows) => {
        if (!cancelled) setBalanceMutations(Array.isArray(rows) ? rows : [])
      })
      .catch((err) => {
        if (cancelled || ac.signal.aborted) return
        console.error('Error fetching balance mutations:', err)
        if (!cancelled) setBalanceMutations([])
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false)
      })
    return () => {
      cancelled = true
      ac.abort()
    }
  }, [])

  const filteredMutations = balanceMutations.filter((m) => {
    if (transactionType && m.type !== transactionType) return false
    return true
  })

  const typeColors = {
    deposit: 'text-green-500',
    'bonus roling': 'text-blue-400',
    'bonus cashback': 'text-blue-400',
    'bonus referral': 'text-blue-400',
    withdraw: 'text-red-400',
    lottery: 'text-yellow-400',
    game: 'text-purple-400',
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">{t('history.title')}</h2>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">{t('history.transactionType')}</label>
          <select
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="">{t('history.allCategories')}</option>
            <option value="deposit">{t('history.typeDeposit')}</option>
            <option value="withdraw">{t('history.typeWithdraw')}</option>
            <option value="bonus roling">{t('history.typeBonusRolling')}</option>
            <option value="game">{t('history.typeGame')}</option>
            <option value="lottery">{t('history.typeLottery')}</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">{t('history.dateFrom')}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">{t('history.dateTo')}</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full min-w-[600px]">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('common.id')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('history.type')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('history.reference')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">{t('common.amount')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium">{t('history.creditDebit')}</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">{t('common.date')}</th>
            </tr>
          </thead>
          <tbody>
            {historyLoading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-sm text-[#5a5a5a]">
                  {t('history.loading')}
                </td>
              </tr>
            ) : filteredMutations.length > 0 ? (
              filteredMutations.map((mutation, i) => (
                <tr key={mutation.id} className="border-t border-[#909090]/20">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a]">{i + 1}</td>
                  <td
                    className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm capitalize ${typeColors[mutation.type] || 'text-[#3a3a3a]'}`}
                  >
                    {mutation.type}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a] font-mono">
                    {mutation.reference}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-[#3a3a3a]">
                    IDR {mutation.amount?.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        mutation.balance_type === 'credit'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}
                    >
                      {mutation.balance_type?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#5a5a5a]">{mutation.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-xs sm:text-sm text-[#5a5a5a]">
                  {t('common.noData')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">
        {historyLoading
          ? '—'
          : t('member.inbox.showing', { from: filteredMutations.length > 0 ? 1 : 0, to: filteredMutations.length, total: filteredMutations.length })}
      </p>
    </div>
  )
}
