import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { humanizeKey } from '@/lib/humanize'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { usePageContent, useUpsertPageContent, getSectionText, SECTION_KEYS, HERO_VARIANTS, type PageName } from '@/features/pages'
import { photoService } from '@/features/photos/services/photoService'
import { useUploadPhoto } from '@/features/photos/hooks/usePhotos'

const PAGE_TITLES: Record<PageName, string> = {
  home: 'Home Page',
  about: 'About Page',
  contact: 'Contact Page',
}

const HERO_VARIANT_LABELS: Record<string, string> = {
  split: 'Split Hero',
  mockup: 'Hero + Product Mockup',
  minimal: 'Minimal Hero',
}

const SHORT_FIELD_KEYS = ['hero_title', 'hero_cta_label', 'hero_cta_link']

const isPageName = (value: string | undefined): value is PageName =>
  value === 'home' || value === 'about' || value === 'contact'

const AdminPages = () => {
  const { page: pageParam } = useParams<{ page: string }>()
  const page: PageName = isPageName(pageParam) ? pageParam : 'home'

  const { data: sections } = usePageContent(page)
  const upsert = useUpsertPageContent(page)
  const uploadPhoto = useUploadPhoto()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    setDrafts({})
  }, [page])

  const sectionKeys = SECTION_KEYS[page]

  const valueFor = (key: string, fallback = '') => drafts[key] ?? getSectionText(sections, key, fallback)

  const handleSave = (key: string, value: string) => {
    upsert.mutate({ sectionKey: key, content: { text: value } })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title={PAGE_TITLES[page]} description="Edit the copy shown on this page." />

      <div className="flex flex-col gap-6">
        {sectionKeys.map((key) => {
          if (key === 'hero_image') {
            const storagePath = valueFor(key)
            const previewUrl = storagePath ? photoService.getPublicUrl(storagePath) : null

            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <Label>
                  {humanizeKey(key)}
                  <span className="text-xs font-normal text-forest/70">Shown in this page's hero section.</span>
                </Label>
                {previewUrl && (
                  <img src={previewUrl} alt="" className="mt-2 h-32 w-full rounded-lg object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const photo = await uploadPhoto.mutateAsync({ file, page })
                    handleSave(key, photo.storage_path)
                  }}
                />
                {uploadPhoto.isPending && <p className="mt-1 text-xs text-forest/70">Uploading…</p>}
              </div>
            )
          }

          if (key === 'hero_variant') {
            const value = valueFor(key, HERO_VARIANTS[0])
            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <Label>
                  {humanizeKey(key)}
                  <select
                    value={value}
                    onChange={(e) => handleSave(key, e.target.value)}
                    className="rounded border border-forest/20 bg-cream px-3 py-2 text-forest focus:border-forest/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-1"
                  >
                    {HERO_VARIANTS.map((variant) => (
                      <option key={variant} value={variant}>
                        {HERO_VARIANT_LABELS[variant]}
                      </option>
                    ))}
                  </select>
                </Label>
              </div>
            )
          }

          const value = valueFor(key)
          const isShort = SHORT_FIELD_KEYS.includes(key)

          return (
            <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
              <Label>
                {humanizeKey(key)}
                {isShort ? (
                  <Input value={value} onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))} />
                ) : (
                  <Textarea
                    value={value}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                    rows={3}
                  />
                )}
              </Label>
              <Button size="sm" className="mt-3" onClick={() => handleSave(key, value)} disabled={upsert.isPending}>
                Save
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminPages
