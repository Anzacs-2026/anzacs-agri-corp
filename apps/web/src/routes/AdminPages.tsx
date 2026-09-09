import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { humanizeKey } from '@/lib/humanize'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { usePageContent, useUpsertPageContent, getSectionText, SECTION_KEYS, type PageName } from '@/features/pages'

const PAGE_TABS: { value: PageName; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' },
]

const AdminPages = () => {
  const [page, setPage] = useState<PageName>('home')
  const { data: sections } = usePageContent(page)
  const upsert = useUpsertPageContent(page)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const sectionKeys = SECTION_KEYS[page]

  const valueFor = (key: string) => drafts[key] ?? getSectionText(sections, key, '')

  const handleSave = (key: string) => {
    upsert.mutate({ sectionKey: key, content: { text: valueFor(key) } })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title="Pages" description="Edit the copy shown on each public page." />

      <div role="group" aria-label="Page" className="mb-6 inline-flex gap-1 rounded-lg bg-forest/5 p-1">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setPage(tab.value)
              setDrafts({})
            }}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              page === tab.value ? 'bg-forest text-cream' : 'text-forest/70 hover:text-forest',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {sectionKeys.map((key) => (
          <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
            <Label>
              {humanizeKey(key)}
              <Textarea
                value={valueFor(key)}
                onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                rows={3}
              />
            </Label>
            <Button size="sm" className="mt-3" onClick={() => handleSave(key)} disabled={upsert.isPending}>
              Save
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPages
