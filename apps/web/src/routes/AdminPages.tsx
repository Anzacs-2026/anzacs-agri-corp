import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePageContent, useUpsertPageContent, getSectionText, SECTION_KEYS, type PageName } from '@/features/pages'

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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Pages</h1>

      <Label className="mb-6">
        Page
        <select
          value={page}
          onChange={(e) => {
            setPage(e.target.value as PageName)
            setDrafts({})
          }}
          className="rounded border border-forest/20 bg-cream px-2 py-1"
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
        </select>
      </Label>

      <div className="flex flex-col gap-6">
        {sectionKeys.map((key) => (
          <div key={key}>
            <Label>
              {key}
              <Textarea
                value={valueFor(key)}
                onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                rows={3}
              />
            </Label>
            <Button size="sm" className="mt-2" onClick={() => handleSave(key)} disabled={upsert.isPending}>
              Save
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPages
