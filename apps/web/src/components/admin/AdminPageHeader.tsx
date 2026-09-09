import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

const AdminPageHeader = ({ title, description, action }: AdminPageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-forest">{title}</h2>
        {description && <p className="mt-1 text-sm text-forest/60">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export default AdminPageHeader
