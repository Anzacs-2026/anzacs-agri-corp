import { createContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { AuthState } from '../types'

export const AuthContext = createContext<AuthState | undefined>(undefined)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ session: null, user: null, loading: true })

  useEffect(() => {
    authService.getSession().then(({ data: { session } }) => {
      setState({ session, user: session?.user ?? null, loading: false })
    })

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      setState({ session, user: session?.user ?? null, loading: false })
      return Promise.resolve()
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export default AuthProvider
