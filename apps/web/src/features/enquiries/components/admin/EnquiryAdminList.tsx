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

  if (isLoading) return <p className="text-forest/60">Loading…</p>

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this enquiry?')) {
      softDelete.mutate(id)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <button
          type="button"
          onClick={() => downloadCsv(enquiries ?? [])}
          disabled={!enquiries?.length}
          className="rounded border border-forest/20 px-3 py-1.5 text-sm text-forest hover:opacity-90 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-forest/20">
            <th className="py-2">Name</th>
            <th className="py-2">Contact</th>
            <th className="py-2">Subject</th>
            <th className="py-2">Message</th>
            <th className="py-2">Status</th>
            <th className="py-2">Received</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries?.map((enquiry) => (
            <tr key={enquiry.id} className="border-b border-forest/10 align-top">
              <td className="py-2">{enquiry.name}</td>
              <td className="py-2">
                <div>{enquiry.email}</div>
                <div className="text-forest/60">{enquiry.phone}</div>
              </td>
              <td className="py-2">{enquiry.subject}</td>
              <td className="max-w-xs truncate py-2" title={enquiry.message}>
                {enquiry.message}
              </td>
              <td className="py-2">
                <select
                  value={enquiry.status}
                  onChange={(e) =>
                    updateStatus.mutate({ id: enquiry.id, status: e.target.value as EnquiryStatus })
                  }
                  className="rounded border border-forest/20 bg-cream px-2 py-1"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2">{new Date(enquiry.created_at).toLocaleDateString()}</td>
              <td className="py-2">
                <button
                  type="button"
                  onClick={() => handleDelete(enquiry.id)}
                  className="text-sm text-red-700 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EnquiryAdminList
