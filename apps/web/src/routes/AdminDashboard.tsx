import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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

      <nav className="mt-6 flex justify-center gap-4">
        <Link to="/admin/products" className="text-forest underline">
          Products
        </Link>
      </nav>

      <Button onClick={handleSignOut} className="mt-6">
        Sign out
      </Button>
    </section>
  )
}

export default AdminDashboard
