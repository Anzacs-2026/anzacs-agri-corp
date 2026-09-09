import { Navigate } from 'react-router-dom'
import { LoginForm, useAuth } from '@/features/auth'

const AdminLogin = () => {
  const { session, loading } = useAuth()

  if (loading) {
    return null
  }

  if (session) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-4">
      <div className="w-full max-w-sm rounded-xl bg-cream p-8 shadow-xl">
        <img src="/crops/logo.png" alt="ANZ Agricrop" className="mx-auto h-10" />
        <p className="mb-6 mt-2 text-center text-sm text-forest/60">Admin sign in</p>
        <LoginForm />
      </div>
    </div>
  )
}

export default AdminLogin
