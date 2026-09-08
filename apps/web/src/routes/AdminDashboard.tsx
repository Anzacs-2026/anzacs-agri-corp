import { useNavigate } from 'react-router-dom'
import { authService, useAuth } from '@/features/auth'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authService.signOut()
    navigate('/admin/login')
  }

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="mt-4 text-forest/80">Signed in as {user?.email}</p>
      <button onClick={handleSignOut} className="mt-6 rounded bg-forest px-4 py-2 text-cream">
        Sign out
      </button>
    </section>
  )
}

export default AdminDashboard
