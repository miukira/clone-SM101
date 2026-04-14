import { createContext, useContext, useState, useEffect } from 'react'
import {
  getToken,
  removeToken,
  getProfile,
  getBalance,
  persistPlayerBalance,
  getStoredPlayerBalance,
} from '../services/api'

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
      try {
        // Get user profile — saldo selalu disamakan dengan server lalu di-cache ke localStorage
        const profile = await getProfile()
        const balance = resolveUserBalance(profile)
        const userRow = balance !== undefined ? { ...profile, balance } : profile
        setUser(userRow)
        setIsAuthenticated(true)
        if (userRow.balance != null) persistPlayerBalance(userRow.balance)
      } catch (err) {
        // Token invalid, clear it
        removeToken()
        setUser(null)
        setIsAuthenticated(false)
      }
    }
    setLoading(false)
  }

  const loginSuccess = (userData) => {
    const balance = resolveUserBalance(userData)
    setUser({
      username: userData.username,
      balance,
      currency: userData.currency,
      referral_code: userData.referral_code
    })
    setIsAuthenticated(true)
    if (balance != null) persistPlayerBalance(balance)
  }

  const logout = () => {
    removeToken()
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
      setUser((prev) => (prev ? { ...prev, balance: b } : null))
    } catch (err) {
      console.error('Failed to refresh balance:', err)
    }
  }

  // Update balance directly (after bet, deposit, etc.)
  const updateBalance = (newBalance) => {
    if (newBalance != null) persistPlayerBalance(newBalance)
    setUser(prev => prev ? { ...prev, balance: newBalance } : null)
    console.log(`💰 Balance updated: Rp ${newBalance?.toLocaleString()}`)
  }

  const refreshProfile = async () => {
    try {
      const profile = await getProfile()
      const balance = resolveUserBalance(profile)
      const userRow = balance !== undefined ? { ...profile, balance } : profile
      setUser(userRow)
      if (userRow.balance != null) persistPlayerBalance(userRow.balance)
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
