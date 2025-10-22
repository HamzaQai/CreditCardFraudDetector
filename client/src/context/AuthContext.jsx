import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      }
    } catch (err) {
      console.error('Failed to load user:', err)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data) => {
    try {
      setError(null)
      const result = await authService.signup(data)
      setUser(result.user)
      return result
    } catch (err) {
      const message = err.response?.data?.error || 'Erreur lors de l\'inscription'
      setError(message)
      throw new Error(message)
    }
  }

  const login = async (data) => {
    try {
      setError(null)
      const result = await authService.login(data)
      setUser(result.user)
      return result
    } catch (err) {
      const message = err.response?.data?.error || 'Erreur lors de la connexion'
      setError(message)
      throw new Error(message)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    isPremium: user?.subscription_tier === 'premium',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
