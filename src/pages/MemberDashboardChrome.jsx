import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QRCode from 'react-qr-code'
import FooterChrome from '../components/FooterChrome'
import { useAuth } from '../context/AuthContext'
import {
  getProfile,
  getBalance,
  getBalanceMutation,
  getBankList,
  getUserReferral,
  getUserPromo,
  createDeposit,
  createWithdraw,
  getDepositStatus,
  getWithdrawStatus,
  changePassword,
  persistPlayerBalance,
} from '../services/api'
import {
  LS_PENDING_DEPOSIT,
  LS_PENDING_WITHDRAW,
  PENDING_STATUS_POLL_MS,
} from '../constants/pendingTransactions'
import {
  SlotsIconChrome,
  SportsIconChrome,
  CasinoIconChrome,
  LotteryIconChrome,
  FishingIconChrome,
  ArcadeIconChrome,
  CrushIconChrome,
  EsportsIconChrome,
  PokerIconChrome,
  CockFightingIconChrome,
  HomeIconChrome,
  PromoIconChrome,
  ReferralIconChrome,
} from '../components/IconsChrome'
import ChromeAppHeader from '../components/ChromeAppHeader'

// Navigation menu items for member page
const navMenuItems = [
  { id: 'home', name: 'HOME', icon: HomeIconChrome, path: '/' },
  { id: 'slots', name: 'SLOTS', icon: SlotsIconChrome, path: '/providers/slots' },
  { id: 'casino', name: 'CASINO', icon: CasinoIconChrome, path: '/providers/casino' },
  { id: 'togel', name: 'TOGEL', icon: LotteryIconChrome, path: '/providers/togel' },
  { id: 'sports', name: 'SPORTS', icon: SportsIconChrome, path: '/providers/sports' },
  { id: 'fishing', name: 'FISHING', icon: FishingIconChrome, path: '/providers/fishing' },
  { id: 'arcade', name: 'ARCADE', icon: ArcadeIconChrome, path: '/providers/arcade' },
  { id: 'crush', name: 'CRUSH', icon: CrushIconChrome, path: '/providers/crush' },
  { id: 'esports', name: 'ESPORTS', icon: EsportsIconChrome, path: '/providers/esports' },
  { id: 'poker', name: 'POKER', icon: PokerIconChrome, path: '/providers/poker' },
  { id: 'sabung', name: 'SABUNG', icon: CockFightingIconChrome, path: '/providers/sabung' },
  { id: 'promosi', name: 'PROMOSI', icon: PromoIconChrome, path: '/promo' },
  { id: 'referral', name: 'REFERRAL', icon: ReferralIconChrome, path: '/referral' },
]

// ============ SIDEBAR ICONS ============
// Chrome Silver theme - using silver/gray colors

const DepositIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="16" height="13" rx="2" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M3 10h16" stroke="#808080" strokeWidth="1.5"/>
    <rect x="13" y="12" width="4" height="3" rx="0.5" fill="#808080"/>
    <path d="M21 2v6M18 5l3 3 3-3" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PendingDepositIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="14" height="11" rx="1.5" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M3 11h14" stroke="#808080" strokeWidth="1.2"/>
    <circle cx="17" cy="6" r="4.5" fill="#D0D0D0" stroke="#909090" strokeWidth="0.5"/>
    <path d="M17 4.2v2.2l1.2 0.8" stroke="#505050" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const WithdrawIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="16" height="13" rx="2" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M3 10h16" stroke="#808080" strokeWidth="1.5"/>
    <path d="M21 8V2M18 5l3-3 3 3" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <circle cx="8" cy="12" r="1.5" fill="#808080"/>
    <circle cx="12" cy="12" r="1.5" fill="#808080"/>
    <circle cx="16" cy="12" r="1.5" fill="#808080"/>
  </svg>
)

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M12 7v5l3 3" stroke="#606060" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 12H3M21 12h-2" stroke="#808080" strokeWidth="1"/>
  </svg>
)

const ReferralIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M6 20q0-5 6-5t6 5" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <circle cx="4" cy="12" r="2.5" fill="#B0B0B0"/>
    <circle cx="20" cy="12" r="2.5" fill="#B0B0B0"/>
    <path d="M8 9L5.5 11M16 9l2.5 2" stroke="#909090" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M6 20q0-5 6-5t6 5" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
  </svg>
)

const PasswordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10" width="14" height="10" rx="2" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M8 10V7a4 4 0 018 0v3" stroke="#808080" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="15" r="2" fill="#606060"/>
    <path d="M12 17v2" stroke="#606060" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const InboxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M3 7l9 6 9-6" stroke="#808080" strokeWidth="1.5" fill="none"/>
  </svg>
)

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11" stroke="#808080" strokeWidth="1.5"/>
    <path d="M12 3L2 10h20L12 3z" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <circle cx="12" cy="7" r="1.5" fill="#606060"/>
  </svg>
)

const MissionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.5"/>
    <path d="M8 8h8M8 12h8M8 16h5" stroke="#808080" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="17" r="4" fill="#B0B0B0"/>
    <path d="M15 17l1.5 1.5L19 15" stroke="#E0E0E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 12a8 8 0 0114.93-4M20 12a8 8 0 01-14.93 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 4v4h-4M4 20v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ============ CONTENT COMPONENTS ============

/** True jika response deposit adalah QRIS (type case-insensitive). */
function isQrisDepositPayment(payment) {
  return String(payment?.type ?? '').toLowerCase() === 'qris'
}

/**
 * String EMV QRIS untuk barcode/QR — utamakan `qr_raw` (OpenAPI DepositQris), lalu alias backend.
 */
function getDepositQrisQrRaw(payment) {
  if (!isQrisDepositPayment(payment)) return ''
  const raw =
    payment.qr_raw ??
    payment.qris_raw ??
    payment.raw ??
    payment.qr_string ??
    payment.qrString
  if (raw == null || raw === '') return ''
  return String(raw).trim()
}

function readStoredPendingDeposit() {
  try {
    const raw = localStorage.getItem(LS_PENDING_DEPOSIT)
    if (!raw) return null
    const v = JSON.parse(raw)
    if (v?.deposit_id == null || !v.payment) {
      localStorage.removeItem(LS_PENDING_DEPOSIT)
      return null
    }
    return v
  } catch {
    localStorage.removeItem(LS_PENDING_DEPOSIT)
    return null
  }
}

function readStoredPendingWithdraw() {
  try {
    const raw = localStorage.getItem(LS_PENDING_WITHDRAW)
    if (!raw) return null
    const v = JSON.parse(raw)
    if (v?.withdraw_id == null || !v.payment) {
      localStorage.removeItem(LS_PENDING_WITHDRAW)
      return null
    }
    return v
  } catch {
    localStorage.removeItem(LS_PENDING_WITHDRAW)
    return null
  }
}

function DepositContent({
  bankList,
  promoCodes,
  userBank,
  onRefreshBalance,
  menuVariant = 'full',
  onNavigateToDeposit,
}) {
  const [activeTab, setActiveTab] = useState('qris')
  const [selectedBank, setSelectedBank] = useState(null)
  const [amount, setAmount] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(() => readStoredPendingDeposit())
  const [statusHint, setStatusHint] = useState('')

  useEffect(() => {
    setPending(readStoredPendingDeposit())
  }, [menuVariant])

  const tabs = [
    { id: 'qris', label: 'Qris Autopay' },
    { id: 'bank', label: 'Bank Transfer' },
    { id: 'ewallet', label: 'Ewallet Transfer' },
    { id: 'pulsa', label: 'Pulsa' },
  ]

  const filteredBanks = bankList.filter(bank => {
    if (activeTab === 'qris') return bank.type === 'qris'
    if (activeTab === 'bank') return bank.type === 'bank-transfer'
    if (activeTab === 'ewallet') return bank.type === 'e-wallet'
    return false
  })

  useEffect(() => {
    if (filteredBanks.length > 0 && !selectedBank) {
      setSelectedBank(filteredBanks[0])
    }
  }, [activeTab, filteredBanks])

  useEffect(() => {
    if (!pending?.deposit_id) return undefined
    let cancelled = false
    const tick = async () => {
      try {
        const s = await getDepositStatus(pending.deposit_id)
        if (cancelled) return
        if (s.status === 'success') {
          localStorage.removeItem(LS_PENDING_DEPOSIT)
          setPending(null)
          setStatusHint('')
          onRefreshBalance()
        } else if (s.status === 'fails') {
          localStorage.removeItem(LS_PENDING_DEPOSIT)
          setPending(null)
          setStatusHint('')
          setError('Deposit gagal atau dibatalkan.')
        } else {
          setStatusHint('Menunggu konfirmasi pembayaran…')
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(LS_PENDING_DEPOSIT)
          setPending(null)
          setStatusHint('')
          setError('Tidak dapat memeriksa status deposit. Silakan coba lagi.')
        }
      }
    }
    tick()
    const iv = setInterval(tick, PENDING_STATUS_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(iv)
    }
  }, [pending?.deposit_id, onRefreshBalance])

  const handleSubmit = async () => {
    if (!selectedBank || !amount) {
      setError('Pilih bank dan masukkan jumlah')
      return
    }

    setLoading(true)
    setError('')
    setStatusHint('')

    try {
      const result = await createDeposit(selectedBank.id, parseInt(amount, 10), promoCode || null)
      const stored = { deposit_id: result.deposit_id, payment: result }
      localStorage.setItem(LS_PENDING_DEPOSIT, JSON.stringify(stored))
      setPending(stored)
      setAmount('')
    } catch (err) {
      setError(err.data?.message || 'Gagal membuat deposit')
    } finally {
      setLoading(false)
    }
  }

  const payment = pending?.payment
  const qrisPayload = getDepositQrisQrRaw(payment)

  if (pending && payment) {
    return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Deposit — menunggu pembayaran</h2>
      {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
      <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
        <p className="font-semibold mb-1">ID deposit: {pending.deposit_id}</p>
        <p className="text-[#a0a0a0] text-xs">
          Status dicek otomatis setiap {PENDING_STATUS_POLL_MS / 1000} detik. Setelah berhasil, saldo diperbarui dan halaman ini kembali ke form deposit.
        </p>
        {statusHint ? <p className="mt-2 text-xs text-[#C0C0C0]">{statusHint}</p> : null}
      </div>
      {isQrisDepositPayment(payment) && !qrisPayload ? (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-lg text-sm text-red-300">
          Data QRIS (qr_raw) tidak tersedia dari server. Hubungi layanan pelanggan.
        </div>
      ) : isQrisDepositPayment(payment) && qrisPayload ? (
        <div className="space-y-4">
          <p className="text-sm text-[#4a4a4a]">Scan kode QR dengan aplikasi e-wallet atau m-banking Anda:</p>
          <div className="flex justify-center p-4 sm:p-6 bg-white rounded-xl border border-[#2a2a2a] shadow-inner w-fit mx-auto">
            <QRCode
              value={qrisPayload}
              size={240}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          {payment.amount != null ? (
            <p className="text-center text-sm font-medium text-[#3a3a3a]">
              Nominal: IDR {Number(payment.amount).toLocaleString('id-ID')}
            </p>
          ) : null}
          <details className="text-xs sm:text-sm">
            <summary className="cursor-pointer text-[#606060] hover:text-[#2a2a2a] select-none">
              Tampilkan data mentah (qr_raw)
            </summary>
            <pre className="mt-2 text-[10px] sm:text-xs bg-[#1a1a1a] text-[#C0C0C0] p-3 rounded-lg border border-[#333] overflow-x-auto whitespace-pre-wrap break-all">
              {qrisPayload}
            </pre>
          </details>
        </div>
      ) : (
        <div className="bg-[#d8d8d8]/50 border border-[#909090]/30 rounded-lg p-3 sm:p-4 space-y-2 text-sm text-[#2a2a2a]">
          <p><span className="text-[#5a5a5a]">Tujuan</span>: {(payment.name || '').toUpperCase()}</p>
          <p><span className="text-[#5a5a5a]">Rekening</span>: {payment.account}</p>
          <p><span className="text-[#5a5a5a]">Nomor</span>: {payment.number}</p>
          {payment.amount != null ? (
            <p><span className="text-[#5a5a5a]">Jumlah</span>: IDR {Number(payment.amount).toLocaleString('id-ID')}</p>
          ) : null}
        </div>
      )}
    </div>
    )
  }

  if (menuVariant === 'pending-only') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Deposit tertunda</h2>
        <div className="p-4 rounded-lg border border-[#909090]/40 bg-[#d8d8d8]/40 text-sm text-[#3a3a3a]">
          <p>Tidak ada deposit yang sedang menunggu pembayaran.</p>
          <p className="mt-2 text-xs text-[#5a5a5a]">
            Setelah mengirim permintaan deposit, QR dan detail pembayaran bisa Anda lihat di sini atau di menu Deposit.
          </p>
        </div>
        {onNavigateToDeposit ? (
          <button
            type="button"
            onClick={onNavigateToDeposit}
            className="px-6 py-2.5 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a] text-sm font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all"
          >
            Buat deposit baru
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Deposit</h2>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#1a1a1a] p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedBank(null); }}
            className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a]'
                : 'text-[#808080] hover:text-[#C0C0C0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}

      {/* Form */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Dari Rekening Bank</label>
          <div className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]">
            {userBank ? `${userBank.bank_name?.toUpperCase()} - ${userBank.bank_number}` : 'Loading...'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Bank Tujuan</label>
          <select 
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
            value={selectedBank?.id || ''}
            onChange={(e) => setSelectedBank(filteredBanks.find(b => b.id === parseInt(e.target.value)))}
          >
            {filteredBanks.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.name?.toUpperCase()} - {bank.account}
              </option>
            ))}
          </select>
        </div>

        {/* Bank Info */}
        {selectedBank && (
          <div className="bg-[#d8d8d8]/50 border border-[#909090]/30 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2">
            <div className="flex flex-col sm:flex-row"><span className="sm:w-40 text-xs sm:text-sm text-[#5a5a5a]">Bank Name</span><span className="text-xs sm:text-sm text-[#3a3a3a]">: {selectedBank.name?.toUpperCase()}</span></div>
            <div className="flex flex-col sm:flex-row"><span className="sm:w-40 text-xs sm:text-sm text-[#5a5a5a]">Account</span><span className="text-xs sm:text-sm text-[#3a3a3a]">: {selectedBank.account}</span></div>
            <div className="flex flex-col sm:flex-row"><span className="sm:w-40 text-xs sm:text-sm text-[#5a5a5a]">Number</span><span className="text-xs sm:text-sm text-[#3a3a3a]">: {selectedBank.number}</span></div>
            <div className="flex flex-col sm:flex-row"><span className="sm:w-40 text-xs sm:text-sm text-[#5a5a5a]">Jumlah Minimum</span><span className="text-xs sm:text-sm text-[#3a3a3a]">: IDR {selectedBank.min_deposit?.toLocaleString()}</span></div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Jumlah</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
            placeholder="Masukkan jumlah"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Bonus (optional)</label>
          <select 
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          >
            <option value="">No Bonus</option>
            {promoCodes.map(promo => (
              <option key={promo.code} value={promo.code}>{promo.name} ({promo.code})</option>
            ))}
          </select>
        </div>

        <div className="border-t border-[#909090]/30 my-4"></div>

        <p className="text-[10px] sm:text-xs text-[#5a5a5a]">
          Harap dicatat bahwa kami tidak menerima dan menyetorkan dengan cek, setiap cek yang disetorkan ke rekening kami tanpa pemberitahuan sebelumnya akan ditolak
        </p>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a] font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all disabled:opacity-50"
        >
          {loading ? 'LOADING...' : 'KIRIM'}
        </button>
      </div>
    </div>
  )
}

function WithdrawContent({ userBank, balance, onRefreshBalance }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(readStoredPendingWithdraw)
  const [statusHint, setStatusHint] = useState('')

  useEffect(() => {
    if (!pending?.withdraw_id) return undefined
    let cancelled = false
    const tick = async () => {
      try {
        const s = await getWithdrawStatus(pending.withdraw_id)
        if (cancelled) return
        if (s.status === 'success') {
          localStorage.removeItem(LS_PENDING_WITHDRAW)
          setPending(null)
          setStatusHint('')
          onRefreshBalance()
        } else if (s.status === 'fails') {
          localStorage.removeItem(LS_PENDING_WITHDRAW)
          setPending(null)
          setStatusHint('')
          setError('Penarikan ditolak atau gagal diproses.')
        } else {
          setStatusHint('Menunggu persetujuan penarikan…')
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(LS_PENDING_WITHDRAW)
          setPending(null)
          setStatusHint('')
          setError('Tidak dapat memeriksa status penarikan. Silakan coba lagi.')
        }
      }
    }
    tick()
    const iv = setInterval(tick, PENDING_STATUS_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(iv)
    }
  }, [pending?.withdraw_id, onRefreshBalance])

  const handleSubmit = async () => {
    if (!amount) {
      setError('Masukkan jumlah penarikan')
      return
    }

    if (parseInt(amount, 10) > balance) {
      setError('Saldo tidak mencukupi')
      return
    }

    setLoading(true)
    setError('')
    setStatusHint('')

    try {
      const result = await createWithdraw(parseInt(amount, 10))
      const stored = { withdraw_id: result.withdraw_id, payment: result }
      localStorage.setItem(LS_PENDING_WITHDRAW, JSON.stringify(stored))
      setPending(stored)
      setAmount('')
    } catch (err) {
      setError(err.data?.message || 'Gagal membuat penarikan')
    } finally {
      setLoading(false)
    }
  }

  const pay = pending?.payment

  if (pending && pay) {
    return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Penarikan — menunggu persetujuan</h2>
      {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
      <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
        <p className="font-semibold mb-1">ID penarikan: {pending.withdraw_id}</p>
        <p className="text-[#a0a0a0] text-xs">
          Status dicek otomatis setiap {PENDING_STATUS_POLL_MS / 1000} detik. Setelah disetujui, saldo akan dikurangi dan halaman kembali ke form penarikan.
        </p>
        {statusHint ? <p className="mt-2 text-xs text-[#C0C0C0]">{statusHint}</p> : null}
      </div>
      <div className="bg-[#d8d8d8]/50 border border-[#909090]/30 rounded-lg p-3 sm:p-4 space-y-2 text-sm text-[#2a2a2a]">
        <p><span className="text-[#5a5a5a]">Tujuan</span>: {(pay.name || '').toUpperCase()}</p>
        <p><span className="text-[#5a5a5a]">Rekening</span>: {pay.account}</p>
        <p><span className="text-[#5a5a5a]">Nomor</span>: {pay.number}</p>
        {pay.amount != null ? (
          <p><span className="text-[#5a5a5a]">Jumlah diminta</span>: IDR {Number(pay.amount).toLocaleString('id-ID')}</p>
        ) : null}
      </div>
    </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Penarikan</h2>
      
      {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Saldo Tersedia</label>
          <div className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]">
            IDR {balance?.toLocaleString() || 0}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Ke Rekening Bank</label>
          <div className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]">
            {userBank ? `${userBank.bank_name?.toUpperCase()} - ${userBank.bank_number}` : 'Loading...'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Jumlah</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
            placeholder="Masukkan jumlah"
          />
        </div>

        <div className="border-t border-[#909090]/30 my-4"></div>

        <p className="text-[10px] sm:text-xs text-[#5a5a5a]">
          Harap dicatat bahwa kami tidak menerima dan menyetorkan dengan cek, setiap cek yang disetorkan ke rekening kami tanpa pemberitahuan sebelumnya akan ditolak
        </p>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a] font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all disabled:opacity-50"
        >
          {loading ? 'LOADING...' : 'KIRIM'}
        </button>
      </div>
    </div>
  )
}

function PendingWithdrawContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Penarikan Tertunda</h2>
      
      <div className="overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full min-w-[500px]">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">No</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Nomor Referensi</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Jumlah (IDR)</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Ke Rekening Bank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-xs sm:text-sm text-[#5a5a5a]">
                Tidak ada data yang tersedia di tabel
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">Showing 0 To 0 of 0 entries</p>
    </div>
  )
}

function HistoryContent({ balanceMutations }) {
  const [transactionType, setTransactionType] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filteredMutations = balanceMutations.filter(m => {
    if (transactionType && m.type !== transactionType) return false
    return true
  })

  const typeColors = {
    'deposit': 'text-green-500',
    'bonus roling': 'text-blue-400',
    'bonus cashback': 'text-blue-400',
    'bonus referral': 'text-blue-400',
    'withdraw': 'text-red-400',
    'lottery': 'text-yellow-400',
    'game': 'text-purple-400',
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

      {/* Transaction History Table */}
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
            {filteredMutations.length > 0 ? filteredMutations.map((mutation, i) => (
              <tr key={mutation.id} className="border-t border-[#909090]/20">
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a]">{i + 1}</td>
                <td className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm capitalize ${typeColors[mutation.type] || 'text-[#3a3a3a]'}`}>
                  {mutation.type}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a] font-mono">{mutation.reference}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-[#3a3a3a]">
                  IDR {mutation.amount?.toLocaleString()}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center">
                  <span className={`px-2 py-1 rounded text-xs ${mutation.balance_type === 'credit' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                    {mutation.balance_type?.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#5a5a5a]">{mutation.created_at}</td>
              </tr>
            )) : (
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
        Showing 1 To {filteredMutations.length} of {filteredMutations.length} entries
      </p>
    </div>
  )
}

function ReferralContent({ referralData }) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Referral</h2>
      
      {/* Referral Info */}
      {referralData?.referral && (
        <div className="bg-[#d8d8d8]/50 border border-[#909090]/30 rounded-lg p-4">
          <p className="text-sm text-[#3a3a3a]">{referralData.referral.description}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Rentang Tanggal</label>
          <input 
            type="date" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-40 text-sm text-[#4a4a4a]">Sampai</label>
          <input 
            type="date" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
          />
        </div>

        <button className="w-full sm:w-auto px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a] font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all">
          CARI
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">No</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Username</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">First Depo Date</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">First Depo</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">Turnover</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">Win/Lose</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium">Komisi</th>
            </tr>
          </thead>
          <tbody>
            {referralData?.downline?.length > 0 ? referralData.downline.map((dl, i) => (
              <tr key={i} className="border-t border-[#909090]/20">
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a]">{i + 1}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#3a3a3a]">{dl.username}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#5a5a5a]">{dl.first_depo_date}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-[#3a3a3a]">IDR {dl.first_depo_amount?.toLocaleString()}</td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-[#3a3a3a]">IDR {dl.turnover?.toLocaleString()}</td>
                <td className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right ${dl.winlose >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  IDR {dl.winlose?.toLocaleString()}
                </td>
                <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-green-600">IDR {dl.comision?.toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-xs sm:text-sm text-[#5a5a5a]">
                  Tidak ada data downline
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">
        Showing {referralData?.downline?.length > 0 ? 1 : 0} To {referralData?.downline?.length || 0} of {referralData?.downline?.length || 0} entries
      </p>
    </div>
  )
}

function ProfileContent({ profile, referralCode }) {
  const maskString = (str, visibleStart = 2, visibleEnd = 3) => {
    if (!str) return ''
    if (str.length <= visibleStart + visibleEnd) return str
    return str.substring(0, visibleStart) + '***' + str.substring(str.length - visibleEnd)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Profile</h2>
      
      <div className="space-y-3 sm:space-y-4">
        {[
          { label: 'Username', value: profile?.username || '-' },
          { label: 'Bank', value: profile?.bank_name?.toUpperCase() || '-' },
          { label: 'Nama Rekening', value: profile?.bank_account || '-' },
          { label: 'No. Rekening', value: maskString(profile?.bank_number) || '-' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="sm:w-44 text-xs sm:text-sm text-[#4a4a4a]">{item.label}</label>
            <div className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#333] truncate">
              {item.value}
            </div>
          </div>
        ))}
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <label className="sm:w-44 text-xs sm:text-sm text-[#4a4a4a]">Referral Code</label>
          <div className="flex-1 flex gap-2">
            <div className="flex-1 bg-[#1a1a1a] text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#333] truncate">
              {referralCode || '-'}
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(referralCode)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] text-[#C0C0C0] rounded-lg border border-[#333] flex items-center justify-center flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <label className="sm:w-44 text-xs sm:text-sm text-[#4a4a4a]">Referral Link</label>
          <div className="flex-1 flex gap-2">
            <div className="flex-1 bg-[#1a1a1a] text-white text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#333] truncate">
              {`${window.location.origin}/register?ref=${referralCode}`}
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/register?ref=${referralCode}`)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a] text-[#C0C0C0] rounded-lg border border-[#333] flex items-center justify-center flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PasswordContent() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Semua field harus diisi')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError('Password baru tidak cocok')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess('Password berhasil diubah!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.data?.message || 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Ubah Password</h2>
      
      {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
      {success && <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">{success}</div>}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-44 text-sm text-[#4a4a4a]">Password Saat Ini</label>
          <input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-44 text-sm text-[#4a4a4a]">Password Baru</label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="sm:w-44 text-sm text-[#4a4a4a]">Konfirmasi Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white text-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#333]" 
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 sm:py-3 bg-gradient-to-b from-[#E0E0E0] via-[#C0C0C0] to-[#909090] text-[#1a1a1a] font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#B0B0B0] transition-all disabled:opacity-50"
        >
          {loading ? 'LOADING...' : 'KIRIM'}
        </button>
      </div>
    </div>
  )
}

function InboxContent() {
  const messages = [
    { no: 1, subject: 'INFO MAXWIN / JACKPOT 2026', date: '2026-01-02' },
    { no: 2, subject: 'Halo bos ku', date: '2025-11-16' },
    { no: 3, subject: 'HEPPY BERDSAY KAKEK JEUS', date: '2025-11-07' },
    { no: 4, subject: 'MAINTENANCE WEBSITE', date: '2025-10-21' },
    { no: 5, subject: 'INFO MAINTENANCE', date: '2025-09-22' },
    { no: 6, subject: 'INFORMASI PENTING', date: '2025-09-02' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Kotak Masuk</h2>
      
      {/* Mobile: Card Layout */}
      <div className="md:hidden space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="bg-white/50 rounded-lg p-3 border border-[#909090]/20">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2a2a2a] truncate">{msg.subject}</p>
                <p className="text-xs text-[#5a5a5a] mt-1">{msg.date}</p>
              </div>
              <button className="text-[#C0C0C0] flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium w-16">No</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Subjek</th>
              <th className="px-4 py-3 text-center text-sm font-medium w-40">Tanggal</th>
              <th className="px-4 py-3 text-center text-sm font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, i) => (
              <tr key={i} className="border-t border-[#909090]/20">
                <td className="px-4 py-3 text-sm text-[#3a3a3a]">{msg.no}</td>
                <td className="px-4 py-3 text-sm text-[#3a3a3a] text-center">{msg.subject}</td>
                <td className="px-4 py-3 text-sm text-[#5a5a5a] text-center whitespace-pre-line">{msg.date.replace(' ', '\n')}</td>
                <td className="px-4 py-3 text-center">
                  <button className="w-8 h-8 bg-gradient-to-b from-[#E0E0E0] to-[#C0C0C0] rounded-full flex items-center justify-center shadow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 16v-4m0 0V8m0 4h4m-4 0H8" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">Showing 1 To 6 of 6 entries</p>
    </div>
  )
}

function BankAccountContent({ profile }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Rekening Bank</h2>
        <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-b from-[#E0E0E0] to-[#C0C0C0] text-[#1a1a1a] font-bold rounded-full hover:from-[#F0F0F0] hover:to-[#D0D0D0] transition-all shadow">
          ADD
        </button>
      </div>
      
      {/* Mobile: Card Layout */}
      <div className="md:hidden space-y-3">
        <div className="bg-white/50 rounded-lg p-4 border border-[#909090]/20">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-[#5a5a5a] text-xs">Bank</span>
              <p className="text-[#2a2a2a] font-medium">{profile?.bank_name?.toUpperCase() || '-'}</p>
            </div>
            <div>
              <span className="text-[#5a5a5a] text-xs">No. Rekening</span>
              <p className="text-[#2a2a2a] font-medium text-xs">{profile?.bank_number || '-'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[#5a5a5a] text-xs">Nama</span>
              <p className="text-[#2a2a2a] font-medium">{profile?.bank_account || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium w-16">No</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Bank Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Account Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Account Name</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#909090]/20">
              <td className="px-4 py-3 text-sm text-[#3a3a3a]">1</td>
              <td className="px-4 py-3 text-sm text-[#3a3a3a]">{profile?.bank_name?.toUpperCase() || '-'}</td>
              <td className="px-4 py-3 text-sm text-[#3a3a3a]">{profile?.bank_number || '-'}</td>
              <td className="px-4 py-3 text-sm text-[#3a3a3a]">{profile?.bank_account || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs sm:text-sm text-[#5a5a5a]">Showing 1 To 1 of 1 entries</p>
    </div>
  )
}

function MissionContent() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#2a2a2a]">Misi Anggota</h2>
      
      <div className="overflow-x-auto rounded-lg border border-[#909090]/30">
        <table className="w-full min-w-[500px]">
          <thead className="bg-[#1a1a1a] text-white">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Title</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Condition</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Reward</th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="px-4 py-6 text-center text-xs sm:text-sm text-[#5a5a5a]">
                Tidak ada data yang tersedia di tabel
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============ MAIN DASHBOARD COMPONENT ============

export default function MemberDashboardChrome() {
  const navigate = useNavigate()
  const { section } = useParams()
  const { user, logout, isAuthenticated } = useAuth()
  
  const [activeMenu, setActiveMenu] = useState(section || 'deposit')

  // API Data States
  const [profile, setProfile] = useState(null)
  const [balance, setBalance] = useState(0)
  const [balanceMutations, setBalanceMutations] = useState([])
  const [bankList, setBankList] = useState([])
  const [promoCodes, setPromoCodes] = useState([])
  const [referralData, setReferralData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (section) {
      setActiveMenu(section)
    } else {
      setActiveMenu('deposit')
    }
  }, [section])

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [profileRes, balanceRes, mutationsRes, banksRes, promoRes, referralRes] = await Promise.all([
          getProfile(),
          getBalance(),
          getBalanceMutation(),
          getBankList(),
          getUserPromo(),
          getUserReferral()
        ])
        
        setProfile(profileRes)
        setBalance(balanceRes.balance)
        if (balanceRes.balance != null) persistPlayerBalance(balanceRes.balance)
        setBalanceMutations(mutationsRes)
        setBankList(banksRes)
        setPromoCodes(promoRes)
        setReferralData(referralRes)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const refreshBalance = useCallback(async () => {
    try {
      const balanceRes = await getBalance()
      setBalance(balanceRes.balance)
      if (balanceRes.balance != null) persistPlayerBalance(balanceRes.balance)
    } catch (err) {
      console.error('Error refreshing balance:', err)
    }
  }, [])

  const [balanceRefreshing, setBalanceRefreshing] = useState(false)
  const refreshBalanceWithSpin = useCallback(async () => {
    const started = Date.now()
    const minSpinMs = 450
    setBalanceRefreshing(true)
    try {
      await refreshBalance()
    } finally {
      const wait = minSpinMs - (Date.now() - started)
      if (wait > 0) await new Promise((r) => setTimeout(r, wait))
      setBalanceRefreshing(false)
    }
  }, [refreshBalance])

  const menuItems = [
    { id: 'deposit', label: 'DEPOSIT', icon: DepositIcon },
    { id: 'pending-deposit', label: 'DEPOSIT TERTUNDA', icon: PendingDepositIcon },
    { id: 'withdraw', label: 'PENARIKAN', icon: WithdrawIcon },
    { id: 'pending', label: 'PENARIKAN TERTUNDA', icon: PendingIcon },
    { id: 'history', label: 'RIWAYAT', icon: HistoryIcon },
    { id: 'referral', label: 'REFERRAL', icon: ReferralIcon },
    { id: 'profile', label: 'PROFILE', icon: ProfileIcon },
    { id: 'password', label: 'UBAH PASSWORD', icon: PasswordIcon },
    { id: 'inbox', label: 'KOTAK MASUK', icon: InboxIcon },
    { id: 'bank', label: 'REKENING BANK', icon: BankIcon },
    { id: 'mission', label: 'MISI ANGGOTA', icon: MissionIcon },
  ]

  const goToMemberSection = useCallback((id) => {
    setActiveMenu(id)
    navigate(`/member/${id}`)
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-[#C0C0C0] border-t-transparent rounded-full"></div>
        </div>
      )
    }

    switch (activeMenu) {
      case 'deposit':
      case 'pending-deposit':
        return (
          <DepositContent
            bankList={bankList}
            promoCodes={promoCodes}
            userBank={profile}
            onRefreshBalance={refreshBalanceWithSpin}
            menuVariant={activeMenu === 'pending-deposit' ? 'pending-only' : 'full'}
            onNavigateToDeposit={() => goToMemberSection('deposit')}
          />
        )
      case 'withdraw': 
        return <WithdrawContent 
          userBank={profile} 
          balance={balance}
          onRefreshBalance={refreshBalanceWithSpin}
        />
      case 'pending': return <PendingWithdrawContent />
      case 'history': return <HistoryContent balanceMutations={balanceMutations} />
      case 'referral': return <ReferralContent referralData={referralData} />
      case 'profile': return <ProfileContent profile={profile} referralCode={user?.referral_code || 'N/A'} />
      case 'password': return <PasswordContent />
      case 'inbox': return <InboxContent />
      case 'bank': return <BankAccountContent profile={profile} />
      case 'mission': return <MissionContent />
      default:
        return (
          <DepositContent
            bankList={bankList}
            promoCodes={promoCodes}
            userBank={profile}
            onRefreshBalance={refreshBalanceWithSpin}
          />
        )
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/')
    }
  }, [isAuthenticated, loading, navigate])

  return (
    <div className="min-h-screen">
      <ChromeAppHeader
        navigate={navigate}
        onOpenAuth={() => navigate('/')}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        desktopNav={null}
        balanceOverride={balance}
        onBalanceRefresh={refreshBalanceWithSpin}
        balanceRefreshSpinning={balanceRefreshing}
        showQuickDeposit
        onQuickDeposit={() => goToMemberSection('deposit')}
      />

      {/* ==================== NAVIGATION MENU BAR ==================== */}
      <nav className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-[#111] themed-border-bottom">
        <div className="max-w-[1600px] mx-auto">
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 px-4 py-2 overflow-x-auto hide-scrollbar">
            {navMenuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 text-[#808080] hover:bg-[#1a1a1a] hover:text-[#C0C0C0] whitespace-nowrap"
                >
                  <Icon size={18} />
                  <span className="text-xs font-bold tracking-wider">{item.name}</span>
                </button>
              )
            })}
          </div>
          
          {/* Mobile Nav - Scrollable */}
          <div className="lg:hidden flex items-center gap-1 px-2 md:px-4 py-2 overflow-x-auto hide-scrollbar">
            {navMenuItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all duration-300 text-[#808080] hover:bg-[#1a1a1a] hover:text-[#C0C0C0] whitespace-nowrap touch-manipulation"
                >
                  <Icon size={16} />
                  <span className="text-[10px] md:text-xs font-bold tracking-wider">{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ==================== MAIN LAYOUT (satu renderContent — mobile & desktop) ==================== */}
      <div className="pt-[108px] md:pt-[116px] lg:pt-[128px] pb-4 lg:pb-0">
        <div className="flex flex-col md:flex-row max-w-[1600px] mx-auto">
          <aside className="w-full md:w-48 lg:w-56 flex-shrink-0 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#1a1a1a] p-2 md:p-3">
            <nav className="flex flex-row md:flex-col gap-1 md:gap-0 md:space-y-1 overflow-x-auto hide-scrollbar pb-1 md:pb-0 md:overflow-visible">
              {menuItems.map(item => {
                const Icon = item.icon
                const isActive = activeMenu === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToMemberSection(item.id)}
                    className={`shrink-0 min-w-[118px] md:min-w-0 w-auto md:w-full flex items-center gap-2 md:gap-3 px-2.5 md:px-3 py-2 md:py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E0E0E0] via-[#C0C0C0] to-[#A0A0A0] text-[#1a1a1a]'
                        : 'text-[#C0C0C0] hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#1a1a1a]/20'
                        : 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#3a3a3a]'
                    }`}>
                      <Icon />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold tracking-wide line-clamp-2">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 p-3 md:p-4 lg:p-6">
            <div className="bg-gradient-to-br from-[#D0D0D0] via-[#C0C0C0] to-[#A8A8A8] rounded-2xl lg:rounded-3xl p-4 md:p-5 lg:p-6 min-h-[400px] shadow-xl lg:shadow-2xl">
              {renderContent()}
            </div>
          </main>

          <aside className="hidden lg:block w-52 flex-shrink-0 bg-[#0a0a0a] border-l border-[#1a1a1a] p-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-[#808080] themed-border-bottom pb-2">
                <span>Wallet Type</span>
                <span>Jumlah</span>
              </div>
              <div className="flex justify-between items-center py-2 themed-border-bottom">
                <span className="text-sm text-[#C0C0C0]">Dompet Utama</span>
                <span className="text-sm text-[#808080]">IDR {balance?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 themed-border-bottom">
                <span className="text-sm text-[#C0C0C0]">Rollover</span>
                <span className="text-sm text-[#808080]">IDR 0</span>
              </div>
              <button
                type="button"
                onClick={refreshBalanceWithSpin}
                disabled={balanceRefreshing}
                className="flex items-center gap-2 text-[#C0C0C0] hover:text-white transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                <span
                  className={`inline-flex shrink-0 items-center justify-center origin-center ${
                    balanceRefreshing ? 'animate-saldo-refresh motion-reduce:animate-none' : ''
                  }`}
                  aria-hidden
                >
                  <RefreshIcon />
                </span>
                <span className="text-sm">Segarkan</span>
              </button>
            </div>
          </aside>
        </div>
      </div>


      {/* ==================== FOOTER ==================== */}
      <FooterChrome />

      {/* Scrollbar helper (horizontal menu strip) */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
