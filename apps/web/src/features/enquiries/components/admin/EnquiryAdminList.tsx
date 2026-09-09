import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { useAdminEnquiries, useSoftDeleteEnquiry, useUpdateEnquiryStatus } from '../../hooks/useEnquiries'
import type { Enquiry, EnquiryStatus } from '../../types'

const STATUSES: EnquiryStatus[] = ['new', 'in_progress', 'done']

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`

const toCsv = (enquiries: Enquiry[]) => {
  const header = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Received']
  const rows = enquiries.map((e) =>
    [e.name, e.email, e.phone, e.subject, e.message, e.status, e.created_at].map(csvEscape),
  )
  return [header.map(csvEscape), ...rows].map((row) => row.join(',')).join('\r\n')
}

const downloadCsv = (enquiries: Enquiry[]) => {
  const blob = new Blob([toCsv(enquiries)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const EnquiryAdminList = () => {
  const { data: enquiries, isLoading } = useAdminEnquiries()
  const updateStatus = useUpdateEnquiryStatus()
  const softDelete = useSoftDeleteEnquiry()

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  if (isLoading) return <p className="text-forest/70">Loading…</p>

  const confirmDelete = () => {
    if (pendingDeleteId) softDelete.mutate(pendingDeleteId)
    setPendingDeleteId(null)
  }

  const statusSelect = (enquiry: Enquiry) => (
    <select
      value={enquiry.status}
      onChange={(e) => updateStatus.mutate({ id: enquiry.id, status: e.target.value as EnquiryStatus })}
      className="rounded border border-forest/20 bg-cream px-2 py-1"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Enquiries"
        description="Leads submitted through the contact form."
        action={
          <button
            type="button"
            onClick={() => downloadCsv(enquiries ?? [])}
            disabled={!enquiries?.length}
            className="rounded-md border border-forest/20 px-3 py-1.5 text-sm font-medium text-forest hover:bg-forest/5 disabled:opacity-50"
          >
            Export CSV
          </button>
        }
      />

      {/* Table — lg and up */}
      <div className="hidden overflow-hidden rounded-xl border border-forest/10 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-forest/10 bg-forest/5">
              <th className="px-4 py-3 font-medium text-forest/70">Name</th>
              <th className="px-4 py-3 font-medium text-forest/70">Contact</th>
              <th className="px-4 py-3 font-medium text-forest/70">Subject</th>
              <th className="px-4 py-3 font-medium text-forest/70">Message</th>
              <th className="px-4 py-3 font-medium text-forest/70">Status</th>
              <th className="px-4 py-3 font-medium text-forest/70">Received</th>
              <th className="px-4 py-3 font-medium text-forest/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries?.map((enquiry) => (
              <tr key={enquiry.id} className="border-b border-forest/5 align-top last:border-0">
                <td className="px-4 py-3">{enquiry.name}</td>
                <td className="px-4 py-3">
                  <div>{enquiry.email}</div>
                  <div className="text-forest/70">{enquiry.phone}</div>
                </td>
                <td className="px-4 py-3">{enquiry.subject}</td>
                <td className="max-w-xs truncate px-4 py-3" title={enquiry.message}>
                  {enquiry.message}
                </td>
                <td className="px-4 py-3">{statusSelect(enquiry)}</td>
                <td className="px-4 py-3">{new Date(enquiry.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(enquiry.id)}
                    className="text-sm font-medium text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — below lg, no horizontal scroll */}
      <div className="flex flex-col gap-3 lg:hidden">
        {enquiries?.map((enquiry) => (
          <div key={enquiry.id} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium text-forest">{enquiry.name}</div>
                <div className="text-xs text-forest/60">{new Date(enquiry.created_at).toLocaleDateString()}</div>
              </div>
              {statusSelect(enquiry)}
            </div>
            <div className="mt-2 text-sm text-forest/80">
              <div>{enquiry.email}</div>
              <div>{enquiry.phone}</div>
            </div>
            <div className="mt-2 text-sm font-medium text-forest">{enquiry.subject}</div>
            <p className="mt-1 whitespace-pre-line text-sm text-forest/70">{enquiry.message}</p>
            <div className="mt-3 border-t border-forest/10 pt-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(enquiry.id)}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this enquiry?"
        description="This removes it from your list. This can't be undone from here."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}

export default EnquiryAdminList
