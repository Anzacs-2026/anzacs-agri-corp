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

  return <LoginForm />
}

export default AdminLogin
