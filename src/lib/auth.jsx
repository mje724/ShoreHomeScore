import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isDemoMode } from './supabase'
import { useStore } from './store'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const { user, setUser, setProperties } = useStore()

  useEffect(() => {
    if (isDemoMode) {
      setLoading(false)
      return
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserData(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadUserData(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId) => {
    if (isDemoMode) return
    
    try {
      const { data: properties } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (properties) {
        setProperties(properties)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const signUp = async (email, password, fullName) => {
    if (isDemoMode) {
      // Demo mode - create fake user
      const fakeUser = {
        id: 'demo-' + Date.now(),
        email,
        user_metadata: { full_name: fullName },
      }
      setUser(fakeUser)
      return { data: { user: fakeUser }, error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (isDemoMode) {
      // Demo mode - create fake user
      const fakeUser = {
        id: 'demo-' + Date.now(),
        email,
        user_metadata: { full_name: email.split('@')[0] },
      }
      setUser(fakeUser)
      return { data: { user: fakeUser }, error: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      const fakeUser = {
        id: 'demo-google-' + Date.now(),
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' },
      }
      setUser(fakeUser)
      return { data: { user: fakeUser }, error: null }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null)
      return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProperties([])
    }
    return { error }
  }

  const resetPassword = async (email) => {
    if (isDemoMode) {
      return { data: {}, error: null }
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    isDemoMode,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
