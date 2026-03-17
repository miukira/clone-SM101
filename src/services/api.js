// API Service - Wrapper untuk mock atau real API
import * as mockApi from './mockApi'

// ============================================
// KONFIGURASI API
// ============================================
// Mode: 'mock-direct' | 'mock-server' | 'real'
// - mock-direct: Panggil mockApi langsung (tidak muncul di Network tab)
// - mock-server: HTTP request ke mock server localhost:4010 (muncul di Network tab)
// - real: HTTP request ke real backend
const API_MODE = 'mock-server'

// URL untuk masing-masing mode
const API_URLS = {
  'mock-direct': null,
  'mock-server': 'http://localhost:4010/api/v1',
  'real': '/api/v1'
}

const API_BASE_URL = API_URLS[API_MODE]

// ============================================
// HTTP REQUEST HELPER
// ============================================
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('pusattogel-token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
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
  return data
}

// ============================================
// HELPER: Pilih mode (mock-direct atau HTTP)
// ============================================
const useMockDirect = API_MODE === 'mock-direct'

// ============================================
// AUTH ENDPOINTS
// ============================================
export const login = (username, password) => {
  if (useMockDirect) {
    return mockApi.login(username, password)
  }
  return apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
}

export const register = (data) => {
  if (useMockDirect) {
    return mockApi.register(data)
  }
  return apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// ============================================
// USER ENDPOINTS
// ============================================
export const checkUsername = (username) => {
  if (useMockDirect) {
    return mockApi.checkUsername(username)
  }
  return apiCall(`/check-username?username=${encodeURIComponent(username)}`)
}

export const checkPhoneNumber = (number) => {
  if (useMockDirect) {
    return mockApi.checkPhoneNumber(number)
  }
  return apiCall(`/check-phone-number?number=${encodeURIComponent(number)}`)
}

export const checkBankNumber = (number) => {
  if (useMockDirect) {
    return mockApi.checkBankNumber(number)
  }
  return apiCall(`/check-bank-number?number=${encodeURIComponent(number)}`)
}

export const getProfile = () => {
  if (useMockDirect) {
    return mockApi.getProfile(mockApi.getToken())
  }
  return apiCall('/profile')
}

export const getBalance = () => {
  if (useMockDirect) {
    return mockApi.getBalance(mockApi.getToken())
  }
  return apiCall('/balance')
}

export const getBalanceMutation = () => {
  if (useMockDirect) {
    return mockApi.getBalanceMutation(mockApi.getToken())
  }
  return apiCall('/balance-mutation')
}

export const changePassword = (password, new_password) => {
  if (useMockDirect) {
    return mockApi.changePassword(mockApi.getToken(), password, new_password)
  }
  return apiCall('/change-password', {
    method: 'POST',
    body: JSON.stringify({ password, new_password })
  })
}

export const createDeposit = (bank_id, amount, promo_code = null) => {
  if (useMockDirect) {
    return mockApi.createDeposit(mockApi.getToken(), bank_id, amount, promo_code)
  }
  return apiCall('/deposit', {
    method: 'POST',
    body: JSON.stringify({ bank_id, amount, promo_code })
  })
}

export const createWithdraw = (amount) => {
  if (useMockDirect) {
    return mockApi.createWithdraw(mockApi.getToken(), amount)
  }
  return apiCall('/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export const getUserReferral = (fromdate = null, todate = null) => {
  if (useMockDirect) {
    return mockApi.getUserReferral(mockApi.getToken(), fromdate, todate)
  }
  const params = new URLSearchParams()
  if (fromdate) params.append('fromdate', fromdate)
  if (todate) params.append('todate', todate)
  return apiCall(`/user-referral?${params.toString()}`)
}

export const getUserPromo = () => {
  if (useMockDirect) {
    return mockApi.getUserPromo()
  }
  return apiCall('/user-promo')
}

// ============================================
// WEBSITE ENDPOINTS
// ============================================
export const getInfo = () => {
  if (useMockDirect) {
    return mockApi.getInfo()
  }
  return apiCall('/info')
}

export const getWebsite = () => {
  if (useMockDirect) {
    return mockApi.getWebsite()
  }
  return apiCall('/website')
}

export const getBankList = () => {
  if (useMockDirect) {
    return mockApi.getBankList()
  }
  return apiCall('/bank-list')
}

export const getReferral = () => {
  if (useMockDirect) {
    return mockApi.getReferral()
  }
  return apiCall('/referral')
}

export const getPromo = () => {
  if (useMockDirect) {
    return mockApi.getPromo()
  }
  return apiCall('/promo')
}

// ============================================
// GAME ENDPOINTS
// ============================================
export const getSlotProviders = () => {
  if (useMockDirect) {
    return mockApi.getSlotProviders()
  }
  return apiCall('/slot')
}

export const getFishProviders = () => {
  if (useMockDirect) {
    return mockApi.getFishProviders()
  }
  return apiCall('/fish')
}

export const getCasinoProviders = () => {
  if (useMockDirect) {
    return mockApi.getCasinoProviders()
  }
  return apiCall('/casino')
}

export const getSportsbookProviders = () => {
  if (useMockDirect) {
    return mockApi.getSportsbookProviders()
  }
  return apiCall('/sportsbook')
}

export const getTogelProviders = () => {
  if (useMockDirect) {
    return mockApi.getTogelProviders()
  }
  return apiCall('/togel')
}

export const getArcadeProviders = () => {
  if (useMockDirect) {
    return mockApi.getArcadeProviders()
  }
  return apiCall('/arcade')
}

export const getPokerProviders = () => {
  if (useMockDirect) {
    return mockApi.getPokerProviders()
  }
  return apiCall('/poker')
}

export const getCockfightProviders = () => {
  if (useMockDirect) {
    return mockApi.getCockfightProviders()
  }
  return apiCall('/cockfight')
}

export const getGameList = (provider_id) => {
  if (useMockDirect) {
    return mockApi.getGameList(provider_id)
  }
  return apiCall(`/game-list?provider_id=${encodeURIComponent(provider_id)}`)
}

export const playGame = (provider_id, game_id) => {
  if (useMockDirect) {
    return mockApi.playGame(mockApi.getToken(), provider_id, game_id)
      .then(data => {
        if (data.redirect) {
          window.location.href = data.redirect
        }
        return data
      })
  }
  // Note: /play endpoint returns redirect, handle differently
  return apiCall(`/play?provider_id=${provider_id}&game_id=${game_id}`)
}

// ============================================
// LOTTERY ENDPOINTS
// ============================================
export const placeBet = (bets) => {
  if (useMockDirect) {
    return mockApi.placeBet(mockApi.getToken(), bets)
  }
  return apiCall('/bet', {
    method: 'POST',
    body: JSON.stringify(bets)
  })
}

export const getBetHistory = (market) => {
  if (useMockDirect) {
    return mockApi.getBetHistory(mockApi.getToken(), market)
  }
  return apiCall(`/bet-history?market=${encodeURIComponent(market)}`)
}

export const getMarketInfo = (market, type) => {
  if (useMockDirect) {
    return mockApi.getMarketInfo(market, type)
  }
  return apiCall(`/market-info?market=${encodeURIComponent(market)}&type=${encodeURIComponent(type)}`)
}

// ============================================
// THEME ENDPOINTS
// ============================================
export const getTheme = () => {
  if (useMockDirect) {
    return mockApi.getTheme()
  }
  return apiCall('/theme')
}

export const updateTheme = (themeConfig) => {
  if (useMockDirect) {
    return mockApi.updateTheme(mockApi.getToken(), themeConfig)
  }
  return apiCall('/theme', {
    method: 'POST',
    body: JSON.stringify(themeConfig)
  })
}

// ============================================
// TOKEN HELPERS
// ============================================
export const getToken = () => localStorage.getItem('pusattogel-token')

export const setToken = (token) => {
  localStorage.setItem('pusattogel-token', token)
  mockApi.setToken(token) // Sync dengan mockApi
}

export const removeToken = () => {
  localStorage.removeItem('pusattogel-token')
  mockApi.removeToken()
}

// ============================================
// DEBUG: Log current mode
// ============================================
console.log(`🔧 API Mode: ${API_MODE}`)
console.log(`🌐 API URL: ${API_BASE_URL || 'Direct Function Calls'}`)
