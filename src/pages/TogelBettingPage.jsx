// Halaman Betting Togel - Menggunakan Lottery API Endpoints
import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTogelBetting } from '../hooks/useLottery'
import { useAuth } from '../context/AuthContext'
import { getStoredPlayerBalance } from '../services/api'
import AuthModal from '../components/AuthModal'
import { expandBbfsLines, countBbfsByKind } from '../utils/bbfsExpand'
import {
  effectivePrizeMultiplier,
  computePerLinePay,
  computeTotalPay,
} from '../utils/togelDiscount'

const MARKETS = [
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', color: 'from-blue-600 to-blue-800' },
  { id: 'hongkong', name: 'Hong Kong', flag: '🇭🇰', color: 'from-purple-600 to-purple-800' },
  { id: 'sydney', name: 'Sydney', flag: '🇦🇺', color: 'from-amber-600 to-amber-800' },
  { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', color: 'from-red-600 to-red-800' },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', color: 'from-green-600 to-green-800' },
  { id: 'china', name: 'China', flag: '🇨🇳', color: 'from-red-700 to-red-900' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', color: 'from-pink-600 to-pink-800' },
  { id: 'macau', name: 'Macau', flag: '🇲🇴', color: 'from-yellow-600 to-yellow-800' },
  { id: 'seoul', name: 'Seoul', flag: '🇰🇷', color: 'from-sky-600 to-sky-800' },
  { id: 'bangkok', name: 'Bangkok', flag: '🇹🇭', color: 'from-orange-600 to-orange-800' },
]

const BET_TYPES = [
  { id: '4D', digits: 4, label: '4D', descKey: 'togel.type4d' },
  { id: '3D', digits: 3, label: '3D', descKey: 'togel.type3d' },
  { id: '2D', digits: 2, label: '2D', descKey: 'togel.type2d' },
  { id: 'BBFS', digits: 4, label: 'BBFS', descKey: 'togel.bbfsDesc' },
]

const POSITIONS_3D = [
  { id: 'depan', labelKey: 'togel.front', descKey: 'togel.posDepan3' },
  { id: 'belakang', labelKey: 'togel.backPos', descKey: 'togel.posBelakang3' },
]

const POSITIONS_2D = [
  { id: 'depan', labelKey: 'togel.front', descKey: 'togel.posDepan2' },
  { id: 'tengah', labelKey: 'togel.middle', descKey: 'togel.posTengah2' },
  { id: 'belakang', labelKey: 'togel.backPos', descKey: 'togel.posBelakang2' },
]

function LoadingSpinner({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${sizeClass} border-2 border-[#333] border-t-[#C0C0C0] rounded-full animate-spin`}></div>
  )
}

function MarketCard({ market, isSelected, onClick, marketInfo }) {
  const { t } = useTranslation()
  const status = marketInfo?.status || 'unknown'
  const isOpen = status === 'open'

  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${isSelected
          ? 'border-[#C0C0C0] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] scale-105'
          : 'border-[#333] bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] hover:border-[#505050]'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{market.flag}</span>
        <div className="text-left">
          <h3 className="font-bold text-white">{market.name}</h3>
          <span className={`text-xs font-semibold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
            {isOpen ? t('togel.open') : t('togel.closed')}
          </span>
        </div>
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C0C0C0] rounded-full flex items-center justify-center">
          <span className="text-black text-sm">✓</span>
        </div>
      )}
    </button>
  )
}

function NumberInput({ value, onChange, digits, disabled }) {
  const { t } = useTranslation()
  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, digits)
    onChange(val)
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={'0'.repeat(digits)}
        maxLength={digits}
        className="
          w-full text-center text-4xl font-mono font-bold tracking-[0.5em] py-4 px-6
          bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]
          border-2 border-[#333] rounded-xl
          text-[#C0C0C0] placeholder-[#333]
          focus:border-[#C0C0C0] focus:outline-none
          disabled:opacity-50
          transition-all
        "
      />
      <div className="absolute bottom-1 right-3 text-xs text-[#505050]">
        {value.length}/{digits} {t('togel.digit')}
      </div>
    </div>
  )
}

function AmountButtons({ shortcuts, onSelect, disabled }) {
  const formatAmount = (amt) => (amt >= 1000 ? `${amt / 1000}K` : amt.toString())

  return (
    <div className="flex gap-2 flex-wrap">
      {shortcuts.map((amt) => (
        <button
          key={amt}
          onClick={() => onSelect(String(amt))}
          disabled={disabled}
          className="
            px-4 py-2 rounded-lg
            bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]
            border border-[#333] hover:border-[#505050]
            text-[#C0C0C0] text-sm font-bold
            disabled:opacity-50
            transition-all hover:scale-105
          "
        >
          {formatAmount(amt)}
        </button>
      ))}
    </div>
  )
}

function PrizeInfo({ marketInfo, betType, useDiscount }) {
  const { t } = useTranslation()
  if (!marketInfo?.prize) return null

  const discount = marketInfo.discount_percentage || 0
  const eff4 = effectivePrizeMultiplier(marketInfo.prize['4d'], useDiscount, discount)
  const eff3 = effectivePrizeMultiplier(marketInfo.prize['3d'], useDiscount, discount)
  const eff2 = effectivePrizeMultiplier(marketInfo.prize['2d'], useDiscount, discount)
  const full4 = effectivePrizeMultiplier(marketInfo.prize['4d'], false, discount)
  const dis4 = effectivePrizeMultiplier(marketInfo.prize['4d'], true, discount)

  if (betType === 'BBFS') {
    return (
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#252525] to-[#1a1a1a] rounded-xl p-4 border border-[#333]">
        <p className="text-center text-[11px] text-[#707070] mb-3">
          BBFS: multiplier per baris mengikuti jenis (4D/3D/2D) — <strong className="text-[#A0A0A0]">{useDiscount ? t('togel.modeDisc') : t('togel.modeNoDisc')}</strong>
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[#505050] text-xs">{t('togel.prize4d')}</p>
            <p className="text-[#C0C0C0] text-lg font-bold">{eff4.toLocaleString()}x</p>
          </div>
          <div>
            <p className="text-[#505050] text-xs">{t('togel.prize3d')}</p>
            <p className="text-[#C0C0C0] text-lg font-bold">{eff3.toLocaleString()}x</p>
          </div>
          <div>
            <p className="text-[#505050] text-xs">{t('togel.prize2d')}</p>
            <p className="text-[#C0C0C0] text-lg font-bold">{eff2.toLocaleString()}x</p>
          </div>
        </div>
        {discount > 0 && (
          <p className="text-center text-[10px] text-[#505050] mt-2">
            {t('togel.compare4d', { full: full4.toLocaleString(), disc: dis4.toLocaleString(), pct: discount })}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 text-center mt-4 pt-4 border-t border-[#333]">
          <div>
            <p className="text-[#505050] text-xs">{t('togel.marketDisc')} ({t('togel.optional')})</p>
            <p className="text-green-400 text-xl font-bold">{discount}%</p>
          </div>
          <div>
            <p className="text-[#505050] text-xs">{t('togel.minBetShort')} / {t('togel.perLine')}</p>
            <p className="text-[#C0C0C0] text-xl font-bold">{marketInfo.min_bet?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    )
  }

  const prizeKey = betType.toLowerCase()
  const base = marketInfo.prize[prizeKey]
  const eff = effectivePrizeMultiplier(base, useDiscount, discount)

  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] via-[#252525] to-[#1a1a1a] rounded-xl p-4 border border-[#333]">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[#505050] text-xs">{t('togel.winMultiplier')}</p>
          <p className="text-[#C0C0C0] text-xl font-bold">{eff.toLocaleString()}x</p>
          {discount > 0 && (
            <p className="text-[10px] text-[#505050] mt-1">
              {useDiscount ? t('togel.discApplied', { p: discount }) : t('togel.fullPrize')}
            </p>
          )}
        </div>
        <div>
          <p className="text-[#505050] text-xs">{t('togel.marketDisc')}</p>
          <p className="text-green-400 text-xl font-bold">{discount}%</p>
          <p className="text-[10px] text-[#505050] mt-1">{t('togel.ifSelected')}</p>
        </div>
        <div>
          <p className="text-[#505050] text-xs">{t('togel.minBetShort')}</p>
          <p className="text-[#C0C0C0] text-xl font-bold">{marketInfo.min_bet?.toLocaleString()}</p>
        </div>
      </div>
      {discount > 0 && (
        <p className="text-center text-[10px] text-[#505050] mt-3 pt-3 border-t border-[#333]">
          {t('togel.comparePrize', {
            full: effectivePrizeMultiplier(base, false, discount).toLocaleString(),
            disc: effectivePrizeMultiplier(base, true, discount).toLocaleString(),
          })}
        </p>
      )}
    </div>
  )
}

function BetHistoryItem({ bet }) {
  const { t } = useTranslation()
  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    won: 'text-green-400 bg-green-400/10',
    lost: 'text-red-400 bg-red-400/10',
    settled: 'text-blue-400 bg-blue-400/10',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] rounded-lg border border-[#2a2a2a]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#C0C0C0] font-bold text-sm">{bet.type}</span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-mono font-bold tracking-wider truncate">{bet.number?.replace(/,/g, ' ')}</p>
          <p className="text-[#505050] text-xs truncate">
            {bet.market?.toUpperCase()} • {bet.position}
            {bet.discount === false && <span className="text-amber-500/90">{t('togel.noDiscTag')}</span>}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[#C0C0C0] font-bold">Rp {bet.amount?.toLocaleString()}</p>
        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[bet.status] || 'text-gray-400'}`}>
          {t(`togel.status.${bet.status}`, { defaultValue: String(bet.status || '').toUpperCase() })}
        </span>
      </div>
    </div>
  )
}

export default function TogelBettingPage() {
  const { t } = useTranslation()
  const { market: urlMarket } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user, loginSuccess, updateBalance } = useAuth()

  const [selectedMarket, setSelectedMarket] = useState(urlMarket || 'singapore')
  const [betType, setBetType] = useState('4D')
  const [position, setPosition] = useState('full')
  const [numbers, setNumbers] = useState('')
  const [amount, setAmount] = useState('')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [bbfsPreviewOpen, setBbfsPreviewOpen] = useState(false)
  /** true = potong bayar + potong multiplier hadiah sesuai % pasaran */
  const [useDiscount, setUseDiscount] = useState(true)

  const marketInfoType = betType === 'BBFS' ? 'bbfs' : betType.toLowerCase()

  const {
    marketInfo,
    marketLoading,
    history,
    historyLoading,
    refetchHistory,
    placeBet,
    betLoading,
    betError,
    betSuccess,
    resetBet,
  } = useTogelBetting(selectedMarket, marketInfoType)

  const digits = BET_TYPES.find((t) => t.id === betType)?.digits || 4

  const bbfsExpansion = useMemo(() => {
    if (betType !== 'BBFS' || numbers.length !== 4) return { lines: [], lineCount: 0 }
    return expandBbfsLines(numbers)
  }, [betType, numbers])

  const bbfsLineCount = bbfsExpansion.lineCount
  const bbfsByKind = useMemo(() => countBbfsByKind(bbfsExpansion.lines), [bbfsExpansion.lines])

  const positionOptions = betType === '3D' ? POSITIONS_3D : betType === '2D' ? POSITIONS_2D : []
  const selectedMarketCard = useMemo(
    () => MARKETS.find((m) => m.id === selectedMarket) ?? null,
    [selectedMarket],
  )

  useEffect(() => {
    if (betType === '4D' || betType === 'BBFS') {
      setPosition('full')
    } else if (betType === '3D') {
      setPosition((p) => (p === 'depan' || p === 'belakang' ? p : 'depan'))
    } else if (betType === '2D') {
      setPosition((p) => (['depan', 'tengah', 'belakang'].includes(p) ? p : 'depan'))
    }
  }, [betType])

  const unitAmount = parseInt(amount, 10) || 0
  const lineCount = betType === 'BBFS' ? bbfsLineCount : 1
  const discPct = marketInfo?.discount_percentage || 0
  const grossNominal = unitAmount * Math.max(lineCount, betType === 'BBFS' ? 0 : 1)

  const payTotal =
    !amount || !marketInfo || (betType === 'BBFS' && bbfsLineCount === 0)
      ? 0
      : computeTotalPay(unitAmount, lineCount, useDiscount, discPct)

  const buildNormalBetPayload = () => {
    const pos = betType === '4D' ? 'full' : position
    const basePrize = marketInfo?.prize?.[betType.toLowerCase()] || 0
    const prizeVal = effectivePrizeMultiplier(basePrize, useDiscount, discPct)
    const payLine = computePerLinePay(unitAmount, useDiscount, discPct)
    return [{
      market: selectedMarket,
      type: betType,
      prize: prizeVal,
      discount: useDiscount,
      number: numbers.split('').join(','),
      amount: unitAmount,
      pay: payLine,
      position: pos,
    }]
  }

  const buildBbfsBetPayload = () => {
    const payPerLine = computePerLinePay(unitAmount, useDiscount, discPct)
    return bbfsExpansion.lines.map((row) => {
      const basePrize = marketInfo?.prize?.[row.type.toLowerCase()] || 0
      return {
        market: selectedMarket,
        type: row.type,
        prize: effectivePrizeMultiplier(basePrize, useDiscount, discPct),
        discount: useDiscount,
        number: row.number,
        amount: unitAmount,
        pay: payPerLine,
        position: row.position,
      }
    })
  }

  const handlePlaceBet = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true)
      return
    }

    if (numbers.length !== digits) {
      alert(t('togel.enterDigitAlert', { digits }))
      return
    }

    if (!amount || unitAmount < (marketInfo?.min_bet || 100)) {
      alert(t('togel.minBetPerLineAlert', { amount: marketInfo?.min_bet?.toLocaleString() || '100' }))
      return
    }

    if (betType === 'BBFS') {
      if (bbfsLineCount === 0) {
        alert(t('togel.errBbfs'))
        return
      }
    }

    const betData = betType === 'BBFS' ? buildBbfsBetPayload() : buildNormalBetPayload()

    const result = await placeBet(betData)

    if (result) {
      if (result.new_balance !== undefined) {
        updateBalance(result.new_balance)
      }

      const balMsg = result.new_balance != null
        ? ` ${t('togel.newBalance', { amount: result.new_balance.toLocaleString() })}`
        : ''
      setSuccessMessage(`${t('togel.betSuccess')}${balMsg}`)
      setNumbers('')
      setAmount('')
      refetchHistory()
      setTimeout(() => {
        setSuccessMessage('')
        resetBet()
      }, 3000)
    }
  }

  const canSubmit =
    marketInfo?.status === 'open' &&
    unitAmount >= (marketInfo?.min_bet || 100) &&
    numbers.length === digits &&
    (betType !== 'BBFS' || bbfsLineCount > 0)

  useEffect(() => {
    if (urlMarket) {
      const marketExists = MARKETS.find((m) => m.id === urlMarket)
      if (marketExists) setSelectedMarket(urlMarket)
      else setSelectedMarket(urlMarket)
    }
  }, [urlMarket])

  useEffect(() => {
    if (marketInfo && (marketInfo.discount_percentage || 0) <= 0) {
      setUseDiscount(false)
    }
  }, [marketInfo])

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
        onLoginSuccess={loginSuccess}
      />

      <header className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#C0C0C0] hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-bold">{t('togel.back')}</span>
          </button>

          <h1 className="text-lg sm:text-xl font-black tracking-wider text-center flex-1 min-w-[140px]">
            <span className="text-[#C0C0C0]">{t('togel.headerLine1')}</span>
            <span className="text-white">{t('togel.headerLine2')}</span>
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={`/togel/rules#${betType === 'BBFS' ? 'bbfs' : betType.toLowerCase()}`}
              className="text-xs sm:text-sm font-bold text-[#808080] hover:text-[#C0C0C0] underline underline-offset-2"
            >
              {t('togel.rules')} ({betType})
            </Link>
            {isAuthenticated ? (
              <div className="text-right">
                <p className="text-xs text-[#505050]">{t('togel.balance')}</p>
                <p className="text-[#C0C0C0] font-bold text-sm">
                  Rp {(user?.balance ?? getStoredPlayerBalance() ?? 0).toLocaleString()}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-3 py-2 bg-gradient-to-b from-[#C0C0C0] to-[#909090] text-black font-bold rounded-lg text-sm"
              >
                {t('togel.login')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20 space-y-6">
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-xl text-center font-bold animate-pulse">
            ✓ {successMessage}
          </div>
        )}

        {betError && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-center">
            ✗ {betError.data?.message || t('togel.errGeneric')}
          </div>
        )}

        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">{t('togel.selectMarket')}</h2>
          {selectedMarketCard && (
            <div className="grid grid-cols-1 gap-3 max-w-sm">
              <MarketCard
                market={selectedMarketCard}
                isSelected
                onClick={() => setSelectedMarket(selectedMarketCard.id)}
                marketInfo={marketInfo}
              />
            </div>
          )}
        </section>

        {marketLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">{t('togel.betTypeTitle')}</h2>
          <p className="text-[11px] text-[#606060] mb-3" dangerouslySetInnerHTML={{ __html: t('togel.betTypeHelp') }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BET_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setBetType(type.id)
                  setNumbers('')
                }}
                className={`
                  py-3 px-2 sm:px-4 rounded-xl border-2 transition-all text-left
                  ${betType === type.id
                    ? 'border-[#C0C0C0] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]'
                    : 'border-[#333] bg-[#0d0d0d] hover:border-[#505050]'
                  }
                `}
              >
                <span className="text-xl sm:text-2xl font-black text-[#C0C0C0]">{type.label}</span>
                <p className="text-[10px] sm:text-xs text-[#505050] leading-tight mt-0.5">{t(type.descKey)}</p>
              </button>
            ))}
          </div>
        </section>

        {(betType === '3D' || betType === '2D') && (
          <section>
            <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">{t('togel.positionTitle')}</h2>
            <p className="text-[11px] text-[#606060] mb-2">
              {betType === '3D'
                ? t('togel.position3d')
                : t('togel.position2d')}
            </p>
            <div className="flex gap-2 flex-wrap">
              {positionOptions.map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPosition(pos.id)}
                  className={`
                    py-2 px-4 rounded-lg border transition-all
                    ${position === pos.id
                      ? 'border-[#C0C0C0] bg-[#2a2a2a] text-white'
                      : 'border-[#333] bg-[#1a1a1a] text-[#505050] hover:border-[#505050]'
                    }
                  `}
                >
                  {t(pos.labelKey)}
                </button>
              ))}
            </div>
          </section>
        )}

        {betType === '4D' && (
          <p className="text-[11px] text-[#606060] -mt-2">
            <span dangerouslySetInnerHTML={{ __html: t('togel.full4d') }} />
          </p>
        )}

        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">
            {betType === 'BBFS' ? t('togel.enter4bbfs') : t('togel.enterNumbers')}
          </h2>
          {betType === 'BBFS' && (
            <p className="text-[11px] text-[#606060] mb-2">
              {t('togel.bbfsBuild')}
            </p>
          )}
          <NumberInput
            value={numbers}
            onChange={setNumbers}
            digits={digits}
            disabled={marketInfo?.status === 'closed'}
          />
        </section>

        {betType === 'BBFS' && numbers.length === 4 && bbfsLineCount > 0 && (
          <section className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-4">
            <button
              type="button"
              onClick={() => setBbfsPreviewOpen((o) => !o)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-sm font-bold text-[#C0C0C0]">
                {t('togel.bbfsSummary', { count: bbfsLineCount, d4: bbfsByKind['4D'], d3: bbfsByKind['3D'], d2: bbfsByKind['2D'] })}
              </span>
              <span className="text-[#808080]">{bbfsPreviewOpen ? '▲' : '▼'}</span>
            </button>
            {bbfsPreviewOpen && (
              <div className="mt-3 max-h-48 overflow-y-auto text-xs font-mono text-[#909090] space-y-1 border-t border-[#2a2a2a] pt-3">
                {bbfsExpansion.lines.slice(0, 80).map((row, i) => (
                  <div key={`${row.type}-${row.number}-${row.position}-${i}`}>
                    {row.type} [{row.position}] {row.number.replace(/,/g, ' ')}
                  </div>
                ))}
                {bbfsLineCount > 80 && (
                  <p className="text-[#505050] pt-2">{t('togel.bbfsMore', { n: bbfsLineCount - 80 })}</p>
                )}
              </div>
            )}
          </section>
        )}

        {marketInfo && !marketLoading && (
          <PrizeInfo marketInfo={marketInfo} betType={betType} useDiscount={useDiscount} />
        )}

        {marketInfo && !marketLoading && (
          <section>
            <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">{t('togel.discountHeader')}</h2>
            <p className="text-[11px] text-[#606060] mb-3">{t('togel.discountBody')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUseDiscount(false)}
                className={`
                  rounded-xl border-2 px-4 py-3 text-left transition-all
                  ${!useDiscount
                    ? 'border-amber-500/80 bg-gradient-to-b from-[#2a2520] to-[#1a1814]'
                    : 'border-[#333] bg-[#0d0d0d] hover:border-[#505050]'
                  }
                `}
              >
                <span className="font-black text-[#E8E8E8] block">{t('togel.noDiscLine1')}</span>
                <span className="text-[10px] text-[#808080]">{t('togel.noDiscLine2')}</span>
              </button>
              <button
                type="button"
                onClick={() => setUseDiscount(true)}
                disabled={discPct <= 0}
                className={`
                  rounded-xl border-2 px-4 py-3 text-left transition-all
                  ${useDiscount && discPct > 0
                    ? 'border-green-500/50 bg-gradient-to-b from-[#1a2a22] to-[#0d1a14]'
                    : 'border-[#333] bg-[#0d0d0d] hover:border-[#505050]'
                  }
                  disabled:opacity-40 disabled:cursor-not-allowed
                `}
              >
                <span className="font-black text-[#E8E8E8] block">{t('togel.useDiscLine1')}</span>
                <span className="text-[10px] text-[#808080]">
                  {discPct > 0
                    ? t('togel.useDiscLine2Pct', { p: 100 - discPct })
                    : t('togel.useDiscLine2None')}
                </span>
              </button>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">{t('togel.stakePerLine')}</h2>
          <p className="text-[11px] text-[#606060] mb-2">
            {betType === 'BBFS'
              ? t('togel.stakeNoteBbfs')
              : t('togel.stakeNoteOne')}
          </p>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#505050] font-bold">Rp</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min={marketInfo?.min_bet || 100}
                disabled={marketInfo?.status === 'closed'}
                className="
                  w-full py-4 px-12 text-2xl font-bold
                  bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]
                  border-2 border-[#333] rounded-xl
                  text-[#C0C0C0] placeholder-[#333]
                  focus:border-[#C0C0C0] focus:outline-none
                  disabled:opacity-50
                "
              />
            </div>
            {marketInfo?.bet_shortcut && (
              <AmountButtons
                shortcuts={marketInfo.bet_shortcut}
                onSelect={setAmount}
                disabled={marketInfo?.status === 'closed'}
              />
            )}
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-xl p-4 border border-[#333]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">{t('togel.sumMarket')}</span>
              <span className="text-white font-bold">{MARKETS.find((m) => m.id === selectedMarket)?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">{t('togel.sumType')}</span>
              <span className="text-white font-bold">
                {betType}
                {betType === 'BBFS' ? ` (${bbfsLineCount} baris)` : ''}
                {betType !== '4D' && betType !== 'BBFS' ? ` (${position})` : ''}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">{t('togel.sumNumbers')}</span>
              <span className="text-white font-mono font-bold tracking-widest">{numbers || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#505050]">{t('togel.sumPerLine')}</span>
              <span className="text-white font-bold">Rp {unitAmount.toLocaleString()}</span>
            </div>
            {betType === 'BBFS' && bbfsLineCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#505050]">{t('togel.sumGross')}</span>
                <span className="text-white font-bold">Rp {grossNominal.toLocaleString()}</span>
              </div>
            )}
            {useDiscount && discPct > 0 && payTotal > 0 && grossNominal > payTotal && (
              <div className="flex justify-between text-sm">
                <span className="text-[#505050]">{t('togel.sumDeduction', { p: discPct })}</span>
                <span className="text-green-400 font-bold">
                  - Rp {(grossNominal - payTotal).toLocaleString()}
                </span>
              </div>
            )}
            {!useDiscount && discPct > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#505050]">{t('togel.sumMode')}</span>
                <span className="text-amber-400/90 font-bold">{t('togel.sumModeNoDisc')}</span>
              </div>
            )}
            <div className="border-t border-[#333] pt-2 flex justify-between">
              <span className="text-[#505050] font-bold">{t('togel.sumPay')}</span>
              <span className="text-[#C0C0C0] text-xl font-black">Rp {payTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceBet}
            disabled={betLoading || !canSubmit}
            className={`
              w-full py-4 rounded-xl font-black text-lg tracking-widest
              transition-all duration-300
              ${marketInfo?.status === 'closed'
                ? 'bg-[#333] text-[#505050] cursor-not-allowed'
                : 'bg-gradient-to-b from-[#C0C0C0] via-[#a0a0a0] to-[#808080] text-black hover:from-white hover:via-[#d0d0d0] hover:to-[#a0a0a0] hover:scale-[1.02]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {betLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                {t('togel.processing')}
              </span>
            ) : marketInfo?.status === 'closed' ? (
              t('togel.marketClosedCta')
            ) : (
              t('togel.placeBetCta')
            )}
          </button>
        </section>

        {isAuthenticated && (
          <section>
            <h2 className="text-sm font-bold text-[#505050] mb-3 tracking-widest">{t('togel.betHistory')}</h2>
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-2">
                {history.map((bet, i) => (
                  <BetHistoryItem key={i} bet={bet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#505050]">
                <p>{t('togel.noBets')}</p>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  )
}
