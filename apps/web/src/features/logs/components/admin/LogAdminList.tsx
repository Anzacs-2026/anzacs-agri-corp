import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useAdminLogs } from '../../hooks/useLogs'

const PAGE_SIZE = 50

const LogAdminList = () => {
  const [limit, setLimit] = useState(PAGE_SIZE)
  const { data: logs, isLoading } = useAdminLogs(limit)

  if (isLoading) return <p className="text-forest/70">Loading…</p>

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader title="Logs" description="Recent server-side errors." />

      {logs && logs.length === 0 && <p className="text-forest/70">No logs yet.</p>}

      {logs && logs.length > 0 && (
        <>
          <div className="divide-y divide-forest/10 overflow-hidden rounded-xl border border-forest/10 bg-white shadow-sm">
            {logs.map((log) => (
              <div key={log.id} className="px-4 py-3">
                <p className="line-clamp-2 font-medium text-forest">{log.error_message}</p>
                <p className="mt-1 text-xs text-forest/60">
                  {new Date(log.created_at).toLocaleString()}
                  {log.user_id ? ` · ${log.user_id}` : ''}
                </p>
                {(log.stack || log.context) && (
                  <details className="mt-2 text-xs text-forest/70">
                    <summary className="cursor-pointer select-none">Details</summary>
                    {log.stack && <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">{log.stack}</pre>}
                    {log.context && (
                      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(log.context, null, 2)}</pre>
                    )}
                  </details>
                )}
              </div>
            ))}
          </div>

          {logs.length === limit && (
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE_SIZE)}
              className="mt-4 rounded-md border border-forest/20 px-3 py-1.5 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default LogAdminList
