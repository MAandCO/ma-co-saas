import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const missingConfigMessage = 'Supabase environment variables are missing. Auth features are disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided.'

const createMissingConfigError = () => {
  const error = new Error(missingConfigMessage)
  error.name = 'SupabaseConfigError'
  return error
}

const createFallbackClient = () => {
  console.warn(missingConfigMessage)

  const createResponse = (override = {}) => ({
    data: { session: null, ...override.data },
    error: createMissingConfigError()
  })

  const subscription = {
    unsubscribe: () => {}
  }

  return {
    auth: {
      async getSession () {
        return createResponse()
      },
      onAuthStateChange () {
        return {
          data: { subscription },
          error: createMissingConfigError()
        }
      },
      async signInWithPassword () {
        return createResponse()
      },
      async signUp () {
        return createResponse()
      },
      async signOut () {
        return { error: createMissingConfigError() }
      }
    }
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackClient()
