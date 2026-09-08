import { useAuth } from '@/features/auth'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="mt-4 text-forest/80">Signed in as {user?.email}</p>
      <p className="mt-2 text-sm text-forest/60">Use the menu above to manage Products, Pages, and Photos.</p>
    </section>
  )
}

export default AdminDashboard
