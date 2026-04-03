import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const data = await api.get('/api/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUser() }, [fetchUser])

  const login = async (email, password) => {
    const data = await api.post('/api/auth/sign_in', { user: { email, password } })
    setUser(data.user)
    return data
  }

  const register = async (params) => {
    const data = await api.post('/api/auth/sign_up', { user: params })
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await api.delete('/api/auth/sign_out')
    setUser(null)
  }

  const updateProfile = async (params) => {
    const data = await api.patch('/api/auth/me', { user: params })
    setUser(data.user)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
