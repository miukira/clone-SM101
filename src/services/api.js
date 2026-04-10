// API Service - Wrapper untuk mock atau real API
import * as mockApi from './mockApi'
import { resolveAssetUrlsDeep } from '../utils/publicAssetUrl'
import { normalizeWebsiteInfoResponse } from '../utils/normalizeWebsiteInfo'
import { resolveApiBaseUrl } from '../utils/resolveApiBaseUrl'

// ============================================
// KONFIGURASI API
// ============================================
// Mode: 'mock-direct' | 'mock-server' | 'real'
// - mock-direct: Panggil mockApi langsung (tidak muncul di Network tab)
// - mock-server: HTTP request ke mock server localhost:4010 (muncul di Network tab)
// - real: HTTP request ke real backend
//
// Base URL HTTP: set di .env sebagai VITE_API_BASE_URL (tanpa trailing slash).
// Jika kosong / tidak di-set, dipakai fallback per mode di bawah.
const API_MODE = 'mock-server'

// Fallback bila VITE_API_BASE_URL tidak di-set (.env)
const API_URLS = {
  'mock-direct': null,
  'mock-server': 'http://localhost:4010/api/v1',
  'real': '/api/v1',
}

const API_BASE_URL = resolveApiBaseUrl(
  API_MODE,
  import.meta.env.VITE_API_BASE_URL,
  API_URLS,
)

/** Key utama; legacy `token` selaras OpenAPI / backend lain */
const LS_TOKEN = 'pusattogel-token'
const LS_TOKEN_LEGACY = 'token'

export const getToken = () =>
  localStorage.getItem(LS_TOKEN) || localStorage.getItem(LS_TOKEN_LEGACY)

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

// ============================================
// HTTP REQUEST HELPER
// ============================================
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
  console.log(`📡 API Request: ${method} ${endpoint}`)
  if (options.body) {
    console.log(`   📤 Request Body:`, JSON.parse(options.body))
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    console.log(`❌ API Error (${response.status}):`, JSON.stringify(data, null, 2))
    throw { status: response.status, data }
  }
  
  // Log response lengkap sesuai Swagger format
  console.log(`✅ API Response (${response.status}):`, JSON.stringify(data, null, 2))
  return resolveAssetUrlsDeep(data)
}

// ============================================
// HELPER: Pilih mode (mock-direct atau HTTP)
// ============================================
const useMockDirect = API_MODE === 'mock-direct'

const withAssets = (p) => Promise.resolve(p).then(resolveAssetUrlsDeep)

// ============================================
// AUTH ENDPOINTS
// ============================================
export const login = (username, password) => {
  if (useMockDirect) {
    return withAssets(mockApi.login(username, password)).then(normalizeAuthResponse)
  }
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }).then(normalizeAuthResponse)
}

export const register = (data) => {
  if (useMockDirect) {
    return withAssets(mockApi.register(data)).then(normalizeAuthResponse)
  }
  return apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(normalizeAuthResponse)
}

// ============================================
// USER ENDPOINTS
// ============================================
export const checkUsername = (username) => {
  if (useMockDirect) {
    return withAssets(mockApi.checkUsername(username))
  }
  return apiCall(`/check-username?username=${encodeURIComponent(username)}`)
}

export const checkPhoneNumber = (number) => {
  if (useMockDirect) {
    return withAssets(mockApi.checkPhoneNumber(number))
  }
  return apiCall(`/check-phone-number?number=${encodeURIComponent(number)}`)
}

export const checkBankNumber = (number) => {
  if (useMockDirect) {
    return withAssets(mockApi.checkBankNumber(number))
  }
  return apiCall(`/check-bank-number?number=${encodeURIComponent(number)}`)
}

export const getProfile = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getProfile(mockApi.getToken()))
  }
  return apiCall('/profile')
}

export const getBalance = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getBalance(mockApi.getToken()))
  }
  return apiCall('/balance')
}

export const getBalanceMutation = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getBalanceMutation(mockApi.getToken()))
  }
  return apiCall('/balance-mutation')
}

export const changePassword = (password, new_password) => {
  if (useMockDirect) {
    return withAssets(mockApi.changePassword(mockApi.getToken(), password, new_password))
  }
  return apiCall('/change-password', {
    method: 'POST',
    body: JSON.stringify({ password, new_password })
  })
}

export const createDeposit = (bank_id, amount, promo_code = null) => {
  if (useMockDirect) {
    return withAssets(mockApi.createDeposit(mockApi.getToken(), bank_id, amount, promo_code))
  }
  return apiCall('/deposit', {
    method: 'POST',
    body: JSON.stringify({ bank_id, amount, promo_code })
  })
}

export const createWithdraw = (amount) => {
  if (useMockDirect) {
    return withAssets(mockApi.createWithdraw(mockApi.getToken(), amount))
  }
  return apiCall('/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export const getDepositStatus = (deposit_id) => {
  if (useMockDirect) {
    return withAssets(mockApi.getDepositStatus(mockApi.getToken(), deposit_id))
  }
  return apiCall(`/deposit/status?deposit_id=${encodeURIComponent(deposit_id)}`)
}

export const getWithdrawStatus = (withdraw_id) => {
  if (useMockDirect) {
    return withAssets(mockApi.getWithdrawStatus(mockApi.getToken(), withdraw_id))
  }
  return apiCall(`/withdraw/status?withdraw_id=${encodeURIComponent(withdraw_id)}`)
}

export const getUserReferral = (fromdate = null, todate = null) => {
  if (useMockDirect) {
    return withAssets(mockApi.getUserReferral(mockApi.getToken(), fromdate, todate))
  }
  const params = new URLSearchParams()
  if (fromdate) params.append('fromdate', fromdate)
  if (todate) params.append('todate', todate)
  return apiCall(`/user-referral?${params.toString()}`)
}

export const getUserPromo = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getUserPromo())
  }
  return apiCall('/user-promo')
}

// ============================================
// WEBSITE ENDPOINTS
// ============================================
export const getInfo = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getInfo()).then(normalizeWebsiteInfoResponse)
  }
  return apiCall('/info').then(normalizeWebsiteInfoResponse)
}

export const getWebsite = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getWebsite())
  }
  return apiCall('/website')
}

export const getBankList = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getBankList())
  }
  return apiCall('/bank-list')
}

export const getReferral = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getReferral())
  }
  return apiCall('/referral')
}

export const getPromo = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getPromo())
  }
  return apiCall('/promo')
}

// ============================================
// GAME ENDPOINTS
// ============================================
export const getSlotProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getSlotProviders())
  }
  return apiCall('/slot')
}

export const getFishProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getFishProviders())
  }
  return apiCall('/fish')
}

export const getCasinoProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getCasinoProviders())
  }
  return apiCall('/casino')
}

export const getSportsbookProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getSportsbookProviders())
  }
  return apiCall('/sportsbook')
}

export const getTogelProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getTogelProviders())
  }
  return apiCall('/togel')
}

export const getArcadeProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getArcadeProviders())
  }
  return apiCall('/arcade')
}

export const getCrushProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getCrushProviders())
  }
  return apiCall('/crush')
}

export const getEsportsProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getEsportsProviders())
  }
  return apiCall('/esports')
}

export const getPokerProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getPokerProviders())
  }
  return apiCall('/poker')
}

export const getCockfightProviders = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getCockfightProviders())
  }
  return apiCall('/cockfight')
}

export const getGameList = (provider_id) => {
  if (useMockDirect) {
    return withAssets(mockApi.getGameList(provider_id))
  }
  return apiCall(`/game-list?provider_id=${encodeURIComponent(provider_id)}`)
}

export const playGame = (provider_id, game_id) => {
  if (useMockDirect) {
    return withAssets(mockApi.playGame(mockApi.getToken(), provider_id, game_id)).then(
      (data) => {
        if (data.redirect) {
          window.location.href = data.redirect
        }
        return data
      }
    )
  }
  const token = getToken()
  if (!token) {
    return Promise.reject({
      status: 401,
      data: { message: 'please login' },
    })
  }
  return apiCall(
    `/play?provider_id=${encodeURIComponent(provider_id)}&game_id=${encodeURIComponent(game_id)}`
  )
}

// ============================================
// LOTTERY ENDPOINTS
// ============================================
export const placeBet = (bets) => {
  if (useMockDirect) {
    return withAssets(mockApi.placeBet(mockApi.getToken(), bets))
  }
  return apiCall('/bet', {
    method: 'POST',
    body: JSON.stringify(bets)
  })
}

export const getBetHistory = (market) => {
  if (useMockDirect) {
    return withAssets(mockApi.getBetHistory(mockApi.getToken(), market))
  }
  return apiCall(`/bet-history?market=${encodeURIComponent(market)}`)
}

export const getMarketInfo = (market, type) => {
  if (useMockDirect) {
    return withAssets(mockApi.getMarketInfo(market, type))
  }
  return apiCall(`/market-info?market=${encodeURIComponent(market)}&type=${encodeURIComponent(type)}`)
}

// ============================================
// THEME ENDPOINTS
// ============================================
export const getTheme = () => {
  if (useMockDirect) {
    return withAssets(mockApi.getTheme())
  }
  return apiCall('/theme')
}

export const updateTheme = (themeConfig) => {
  if (useMockDirect) {
    return withAssets(mockApi.updateTheme(mockApi.getToken(), themeConfig))
  }
  return apiCall('/theme', {
    method: 'POST',
    body: JSON.stringify(themeConfig)
  })
}

// ============================================
// TOKEN HELPERS (getToken didefinisikan di atas, dipakai apiCall)
// ============================================
export const setToken = (token) => {
  if (token == null || token === '') return
  const s = String(token)
  localStorage.setItem(LS_TOKEN, s)
  localStorage.setItem(LS_TOKEN_LEGACY, s)
  mockApi.setToken(s)
}

export const removeToken = () => {
  localStorage.removeItem(LS_TOKEN)
  localStorage.removeItem(LS_TOKEN_LEGACY)
  mockApi.removeToken()
}

// ============================================
// DEBUG: Log current mode
// ============================================
console.log(`🔧 API Mode: ${API_MODE}`)
console.log(`🌐 API URL: ${API_BASE_URL || 'Direct Function Calls'}`)
