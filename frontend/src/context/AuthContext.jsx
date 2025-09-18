import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { supabase } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession()
      const currentSession = data.session
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.access_token) {
        axios.defaults.headers.common.Authorization = `Bearer ${currentSession.access_token}`
      }
      setLoading(false)
    }
    bootstrap()
    const { data: listener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.access_token) {
        axios.defaults.headers.common.Authorization = `Bearer ${currentSession.access_token}`
      } else {
        delete axios.defaults.headers.common.Authorization
      }
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    try {
      setError(null)
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
        throw authError
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signUp = async ({ email, password }) => {
    try {
      setError(null)
      const { error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) {
        setError(authError.message)
        throw authError
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    delete axios.defaults.headers.common.Authorization
  }

  const value = useMemo(() => ({
    session,
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError: () => setError(null)
  }), [session, user, loading, error])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
