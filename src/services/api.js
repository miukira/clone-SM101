// API Service — selalu HTTP ke backend (mock-server lokal atau produksi)
import { resolveAssetUrlsDeep } from '../utils/publicAssetUrl'
import { normalizeWebsiteInfoResponse } from '../utils/normalizeWebsiteInfo'
import { resolveApiBaseUrl } from '../utils/resolveApiBaseUrl'

// Base URL: VITE_API_BASE_URL di .env (tanpa trailing slash).
// Dev tanpa env: /api/v1 (same-origin) + proxy Vite → mock/staging (hindari CORS ke host asing).
// Build produksi tanpa env: fallback langsung ke mock (set VITE_API_BASE_URL di deploy).
const DEFAULT_API_BASE_URL =
  import.meta.env.DEV === true ? '/api/v1' : 'http://localhost:4010/api/v1'

const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL)

/** Key utama; legacy `token` selaras OpenAPI / backend lain */
const LS_TOKEN = 'pusattogel-token'
const LS_TOKEN_LEGACY = 'token'
/** Cache saldo pemain (angka); diperbarui saat login / profile / GET /balance; dihapus saat logout */
const LS_PLAYER_BALANCE = 'pusattogel-player-balance'

export const getToken = () =>
  localStorage.getItem(LS_TOKEN) || localStorage.getItem(LS_TOKEN_LEGACY)

/** Nilai saldo terakhir dari localStorage (null jika tidak ada / tidak valid). */
export function getStoredPlayerBalance() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(LS_PLAYER_BALANCE)
  if (raw == null || raw === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

/** Simpan saldo ke localStorage (hapus entri jika nilai tidak valid). */
export function persistPlayerBalance(balance) {
  if (typeof localStorage === 'undefined') return
  if (balance == null || balance === '') {
    localStorage.removeItem(LS_PLAYER_BALANCE)
    return
  }
  const n = Number(balance)
  if (!Number.isFinite(n)) {
    localStorage.removeItem(LS_PLAYER_BALANCE)
    return
  }
  localStorage.setItem(LS_PLAYER_BALANCE, String(n))
}

/** Samakan bentuk respons login/register (token | access_token | nested) */
function normalizeAuthResponse(data) {
  if (!data || typeof data !== 'object') return data
  const raw =
    data.token ??
    data.access_token ??
    (data.data && (data.data.token ?? data.data.access_token))
  if (raw != null && data.token === undefined) {
    return { ...data, token: typeof raw === 'string' ? raw : String(raw) }
  }
  return data
}

function normalizeBankType(rawType) {
  const t = String(rawType ?? '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .trim()
  if (t === 'bank-transfer' || t === 'bank') return 'bank-transfer'
  if (t === 'e-wallet' || t === 'ewallet') return 'e-wallet'
  if (t === 'qris') return 'qris'
  return t
}

function normalizeBankListResponse(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => ({
    ...row,
    type: normalizeBankType(row?.type),
  }))
}

function normalizeProfileResponse(data) {
  if (!data || typeof data !== 'object') return data
  const bankName = data.bank_name ?? data.bankName ?? data.bank?.name ?? data.bank?.bank_name ?? null
  const bankNumber =
    data.bank_number ?? data.bankNumber ?? data.bank_no ?? data.bankNo ?? data.bank?.number ?? null
  const bankAccount =
    data.bank_account ?? data.bankAccount ?? data.account_name ?? data.accountName ?? data.bank?.account ?? null
  return {
    ...data,
    bank_name: bankName,
    bank_number: bankNumber,
    bank_account: bankAccount,
  }
}

// ============================================
// HTTP REQUEST HELPER
// ============================================

/** Gabungkan GET identik yang overlap (mis. React StrictMode dev) — satu fetch. */
const getRequestInflight = new Map()

/** Respons GET publik terakhir (per kunci dedupe) — hindari fetch + log dobel bila inflight sudah selesai lalu dipanggil lagi segera. Dikosongkan saat refetch website. */
const PUBLIC_GET_RESPONSE_MEMO = new Map()
const PUBLIC_MEMO_TTL_MS = 45_000

export function clearPublicGetResponseMemo() {
  PUBLIC_GET_RESPONSE_MEMO.clear()
}

function cloneForMemo(value) {
  try {
    return structuredClone(value)
  } catch {
    return JSON.parse(JSON.stringify(value))
  }
}

/** Samakan `/website?domain=…` agar dedupe tidak pecah (hostname beda huruf / format query). */
function normalizeWebsiteDedupeEndpoint(endpoint) {
  if (typeof endpoint !== 'string' || !endpoint.startsWith('/website?')) return endpoint
  try {
    const qi = endpoint.indexOf('?')
    const sp = new URLSearchParams(endpoint.slice(qi + 1))
    const dom = (sp.get('domain') || 'localhost').toLowerCase()
    return `/website?domain=${encodeURIComponent(dom)}`
  } catch {
    return endpoint
  }
}

const PUBLIC_GET_PATHS = new Set([
  '/slot',
  '/fish',
  '/casino',
  '/togel',
  '/sportsbook',
  '/arcade',
  '/crush',
  '/esports',
  '/poker',
  '/cockfight',
  '/promo',
  '/referral',
])

/**
 * GET yang hasilnya tidak spesifik Bearer — satu inflight per URL logis (hindari (2) di console & beban dobel).
 * Tidak memasukkan /profile, /bank-list, /user-promo, dll.
 */
function buildGetDedupeKey(endpoint, token) {
  if (endpoint === '/info') return 'GET|public|/info'
  if (endpoint.startsWith('/website?')) {
    return `GET|public|${normalizeWebsiteDedupeEndpoint(endpoint)}`
  }
  const pathOnly = endpoint.split('?')[0]
  if (PUBLIC_GET_PATHS.has(pathOnly)) {
    return `GET|public|${endpoint}`
  }
  return `GET|${token || ''}|${endpoint}`
}

const apiCall = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const method = options.method || 'GET'

  const useGetDedupe =
    method === 'GET' &&
    options.skipGetDedupe !== true &&
    options.signal == null

  const dedupeKey = useGetDedupe ? buildGetDedupeKey(endpoint, token) : null

  if (dedupeKey?.startsWith('GET|public|')) {
    const row = PUBLIC_GET_RESPONSE_MEMO.get(dedupeKey)
    if (row != null && Date.now() - row.t < PUBLIC_MEMO_TTL_MS) {
      return Promise.resolve(cloneForMemo(row.value))
    }
  }

  const run = async () => {
    console.log(`📡 API Request: ${method} ${endpoint}`)
    if (options.body) {
      console.log(`   📤 Request Body:`, JSON.parse(options.body))
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      cache: options.cache ?? (method === 'GET' ? 'no-store' : 'default'),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log(`❌ API Error (${response.status}):`, JSON.stringify(data, null, 2))
      throw { status: response.status, data }
    }

    console.log(`✅ API Response (${response.status}):`, JSON.stringify(data, null, 2))
    const out = resolveAssetUrlsDeep(data)
    if (dedupeKey?.startsWith('GET|public|')) {
      PUBLIC_GET_RESPONSE_MEMO.set(dedupeKey, { value: cloneForMemo(out), t: Date.now() })
    }
    return out
  }

  if (useGetDedupe) {
    let p = getRequestInflight.get(dedupeKey)
    if (!p) {
      p = run().finally(() => {
        getRequestInflight.delete(dedupeKey)
      })
      getRequestInflight.set(dedupeKey, p)
    }
    return p
  }

  return run()
}

/** OpenAPI: GET /website membutuhkan query `domain` */
function resolveWebsiteDomain(explicit) {
  const e = explicit != null ? String(explicit).trim() : ''
  if (e !== '') return e
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname
  }
  return 'localhost'
}

// ============================================
// AUTH ENDPOINTS
// ============================================
export const login = (username, password) =>
  apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }).then(normalizeAuthResponse)

export const register = (data) =>
  apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(normalizeAuthResponse)

// ============================================
// USER ENDPOINTS
// ============================================
export const checkUsername = (username) =>
  apiCall(`/check-username?username=${encodeURIComponent(username)}`)

export const checkPhoneNumber = (number) =>
  apiCall(`/check-phone-number?number=${encodeURIComponent(number)}`)

export const checkBankNumber = (number) =>
  apiCall(`/check-bank-number?number=${encodeURIComponent(number)}`)

export const getProfile = () => apiCall('/profile').then(normalizeProfileResponse)

/** GET /balance — hanya untuk aksi refresh saldo (bukan load pertama halaman). */
export const getBalance = () => apiCall('/balance')

export const getBalanceMutation = (opts = {}) => apiCall('/balance-mutation', opts)

export const changePassword = (password, new_password) =>
  apiCall('/change-password', {
    method: 'POST',
    body: JSON.stringify({ password, new_password }),
  })

export const createDeposit = (bank_id, amount, promo_code = null) =>
  apiCall('/deposit', {
    method: 'POST',
    body: JSON.stringify({ bank_id, amount, promo_code }),
  })

export const createWithdraw = (amount) =>
  apiCall('/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })

export const getDepositStatus = (deposit_id) =>
  apiCall(`/deposit-status?deposit_id=${encodeURIComponent(deposit_id)}`)

export const getWithdrawStatus = (withdraw_id) =>
  apiCall(`/withdraw-status?withdraw_id=${encodeURIComponent(withdraw_id)}`)

export const getUserReferral = (fromdate = null, todate = null, opts = {}) => {
  const params = new URLSearchParams()
  if (fromdate) params.append('fromdate', fromdate)
  if (todate) params.append('todate', todate)
  return apiCall(`/user-referral?${params.toString()}`, opts)
}

export const getUserPromo = () => apiCall('/user-promo')

// ============================================
// WEBSITE ENDPOINTS
// ============================================
export const getInfo = () => apiCall('/info').then(normalizeWebsiteInfoResponse)

export const getWebsite = (domain) => {
  const d = resolveWebsiteDomain(domain).toLowerCase()
  const q = new URLSearchParams({ domain: d })
  return apiCall(`/website?${q}`)
}

export const getBankList = () => apiCall('/bank-list').then(normalizeBankListResponse)

export const getReferral = () => apiCall('/referral')

export const getPromo = () => apiCall('/promo')

// ============================================
// GAME ENDPOINTS
// ============================================
export const getSlotProviders = () => apiCall('/slot')

export const getFishProviders = () => apiCall('/fish')

export const getCasinoProviders = () => apiCall('/casino')

export const getSportsbookProviders = () => apiCall('/sportsbook')

export const getTogelProviders = () => apiCall('/togel')

export const getArcadeProviders = () => apiCall('/arcade')

export const getCrushProviders = () => apiCall('/crush')

export const getEsportsProviders = () => apiCall('/esports')

export const getPokerProviders = () => apiCall('/poker')

export const getCockfightProviders = () => apiCall('/cockfight')

export const getGameList = (provider_id) =>
  apiCall(`/game-list?provider_id=${encodeURIComponent(provider_id)}`)

export const playGame = (provider_id, game_id) => {
  const token = getToken()
  if (!token) {
    return Promise.reject({
      status: 401,
      data: { message: 'please login' },
    })
  }
  return apiCall(
    `/play?provider_id=${encodeURIComponent(provider_id)}&game_id=${encodeURIComponent(game_id)}`,
  )
}

// ============================================
// LOTTERY ENDPOINTS
// ============================================
export const placeBet = (bets) =>
  apiCall('/bet', {
    method: 'POST',
    body: JSON.stringify(bets),
  })

export const getBetHistory = (market) =>
  apiCall(`/bet-history?market=${encodeURIComponent(market)}`)

export const getMarketInfo = (market, type) =>
  apiCall(`/market-info?market=${encodeURIComponent(market)}&type=${encodeURIComponent(type)}`)

// ============================================
// THEME ENDPOINTS
// ============================================
export const getTheme = () => apiCall('/theme')

export const updateTheme = (themeConfig) =>
  apiCall('/theme', {
    method: 'POST',
    body: JSON.stringify(themeConfig),
  })

// ============================================
// TOKEN HELPERS
// ============================================
export const setToken = (token) => {
  if (token == null || token === '') return
  const s = String(token)
  localStorage.setItem(LS_TOKEN, s)
  localStorage.setItem(LS_TOKEN_LEGACY, s)
}

export const removeToken = () => {
  localStorage.removeItem(LS_TOKEN)
  localStorage.removeItem(LS_TOKEN_LEGACY)
  localStorage.removeItem(LS_PLAYER_BALANCE)
}

console.log(`🌐 API base URL: ${API_BASE_URL}`)
