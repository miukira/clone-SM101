import { createContext, useContext, useState, useEffect } from 'react'
import {
  getToken,
  removeToken,
  getProfile,
  getBalance,
  persistPlayerBalance,
  getStoredPlayerBalance,
} from '../services/api'

const LS_AUTH_USER = 'pusattogel-auth-user'

function persistAuthSnapshot(user) {
  if (typeof localStorage === 'undefined') return
  const username = user?.username != null ? String(user.username).trim() : ''
  const balance = user?.balance
  const row = { username, balance }
  try {
    localStorage.setItem(LS_AUTH_USER, JSON.stringify(row))
  } catch {
    // ignore quota / serialization errors
  }
}

function getStoredAuthSnapshot() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(LS_AUTH_USER)
  if (!raw) return null
  try {
    const row = JSON.parse(raw)
    if (!row || typeof row !== 'object') return null
    const username = row.username != null ? String(row.username).trim() : ''
    const balance = row.balance
    return {
      username: username || null,
      balance:
        balance != null && Number.isFinite(Number(balance))
          ? Number(balance)
          : getStoredPlayerBalance(),
    }
  } catch {
    return null
  }
}

function clearAuthSnapshot() {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(LS_AUTH_USER)
}

function resolveUserBalance(profileOrLogin) {
  if (profileOrLogin?.balance != null && profileOrLogin?.balance !== undefined) {
    return profileOrLogin.balance
  }
  const cached = getStoredPlayerBalance()
  return cached != null ? cached : undefined
}

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = getToken()
    if (token) {
      // Tidak GET /profile otomatis lagi; hydrate dari localStorage saat token ada.
      const cached = getStoredAuthSnapshot()
      const fallbackBalance = getStoredPlayerBalance()
      const userRow = cached
        ? { username: cached.username, balance: cached.balance ?? fallbackBalance ?? 0 }
        : fallbackBalance != null
          ? { username: null, balance: fallbackBalance }
          : null
      setUser(userRow)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }

  const loginSuccess = (userData) => {
    const balance = resolveUserBalance(userData)
    const userRow = {
      username: userData.username,
      balance,
      currency: userData.currency,
      referral_code: userData.referral_code,
    }
    setUser(userRow)
    setIsAuthenticated(true)
    if (balance != null) persistPlayerBalance(balance)
    persistAuthSnapshot(userRow)
  }

  const logout = () => {
    removeToken()
    clearAuthSnapshot()
    setUser(null)
    setIsAuthenticated(false)
  }

  /** Hanya memanggil GET /balance — dipakai tombol refresh; setelah sukses sync context + localStorage */
  const refreshBalance = async () => {
    try {
      const data = await getBalance()
      const b = data?.balance
      if (b == null || b === undefined) return
      persistPlayerBalance(b)
      setUser((prev) => {
        if (!prev) return null
        const next = { ...prev, balance: b }
        persistAuthSnapshot(next)
        return next
      })
    } catch (err) {
      console.error('Failed to refresh balance:', err)
    }
  }

  // Update balance directly (after bet, deposit, etc.)
  const updateBalance = (newBalance) => {
    if (newBalance != null) persistPlayerBalance(newBalance)
    setUser((prev) => {
      if (!prev) return null
      const next = { ...prev, balance: newBalance }
      persistAuthSnapshot(next)
      return next
    })
    console.log(`💰 Balance updated: Rp ${newBalance?.toLocaleString()}`)
  }

  const refreshProfile = async () => {
    try {
      const profile = await getProfile()
      const balance = resolveUserBalance(profile)
      const userRow = balance !== undefined ? { ...profile, balance } : profile
      setUser(userRow)
      if (userRow.balance != null) persistPlayerBalance(userRow.balance)
      persistAuthSnapshot(userRow)
    } catch (err) {
      console.error('Failed to refresh profile:', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      loginSuccess,
      logout,
      refreshBalance,
      updateBalance,
      refreshProfile,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
