import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, removeToken, getProfile, getBalance } from '../services/api'

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
        // Get user profile
        const profile = await getProfile()
        setUser(profile)
        setIsAuthenticated(true)
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
    setUser({
      username: userData.username,
      balance: userData.balance,
      currency: userData.currency,
      referral_code: userData.referral_code
    })
    setIsAuthenticated(true)
  }

  const logout = () => {
    removeToken()
    setUser(null)
    setIsAuthenticated(false)
  }

  const refreshBalance = async () => {
    try {
      const data = await getBalance()
      setUser(prev => prev ? { ...prev, balance: data.balance } : null)
    } catch (err) {
      console.error('Failed to refresh balance:', err)
    }
  }

  // Update balance directly (after bet, deposit, etc.)
  const updateBalance = (newBalance) => {
    setUser(prev => prev ? { ...prev, balance: newBalance } : null)
    console.log(`💰 Balance updated: Rp ${newBalance?.toLocaleString()}`)
  }

  const refreshProfile = async () => {
    try {
      const profile = await getProfile()
      setUser(profile)
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
