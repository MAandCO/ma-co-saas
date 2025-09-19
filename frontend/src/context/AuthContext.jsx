import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)
const authDisabledMessage = 'Authentication is disabled because Supabase environment variables are missing.'

export function AuthProvider ({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let subscription

    const bootstrap = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          throw sessionError
        }

        const currentSession = data.session
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.access_token) {
          axios.defaults.headers.common.Authorization = `Bearer ${currentSession.access_token}`
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()

    if (!isSupabaseConfigured) {
      return () => {}
    }

    const { data: listener, error: listenerError } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.access_token) {
        axios.defaults.headers.common.Authorization = `Bearer ${currentSession.access_token}`
      } else {
        delete axios.defaults.headers.common.Authorization
      }
    })

    if (listenerError) {
      console.error('Supabase auth listener error:', listenerError)
    }

    subscription = listener?.subscription

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const guardAuthEnabled = () => {
    if (isSupabaseConfigured) {
      return null
    }
    const errorInstance = new Error(authDisabledMessage)
    errorInstance.name = 'SupabaseConfigError'
    setError(errorInstance.message)
    return errorInstance
  }

  const signIn = async ({ email, password }) => {
    try {
      setError(null)
      const guardError = guardAuthEnabled()
      if (guardError) {
        throw guardError
      }
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
      const guardError = guardAuthEnabled()
      if (guardError) {
        throw guardError
      }
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
    const guardError = guardAuthEnabled()
    if (guardError) {
      setSession(null)
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    delete axios.defaults.headers.common.Authorization
  }

  const value = useMemo(() => ({
    session,
    user,
    loading,
    error,
    authEnabled: isSupabaseConfigured,
    authDisabledMessage,
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
