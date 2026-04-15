import { useState, useEffect } from 'react'
import { getBalanceMutation } from '../../services/api'

export default function MemberHistoryPanel() {
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
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Riwayat Transaksi</h2>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Jenis Transaksi</label>
          <select
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="bonus roling">Bonus Roling</option>
            <option value="game">Game</option>
            <option value="lottery">Lottery</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Dari Tanggal</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Sampai Tanggal</label>
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
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">No</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Tipe</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Referensi</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">Jumlah</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium">Kredit/Debit</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {historyLoading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-sm text-[#5a5a5a]">
                  Memuat riwayat…
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
                  Tidak ada data yang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">
        {historyLoading
          ? '—'
          : `Showing 1 To ${filteredMutations.length} of ${filteredMutations.length} entries`}
      </p>
    </div>
  )
}
