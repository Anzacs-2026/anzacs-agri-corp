import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { humanizeKey } from '@/lib/humanize'
import { cn } from '@/lib/utils'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import {
  usePageContent,
  useUpsertPageContent,
  getSectionText,
  SECTION_KEYS,
  HERO_CATEGORIES,
  HERO_SUBTYPES,
  HERO_CATEGORY_LABELS,
  HERO_SUBTYPE_LABELS,
  parseHeroVariant,
  type PageName,
} from '@/features/pages'
import { photoService } from '@/features/photos/services/photoService'
import { useUploadPhoto } from '@/features/photos/hooks/usePhotos'

const PAGE_TITLES: Record<PageName, string> = {
  home: 'Home Page',
  about: 'About Page',
  contact: 'Contact Page',
  products: 'Products Page',
}

const SHORT_FIELD_KEYS = ['hero_title', 'hero_cta_label', 'hero_cta_link', 'hero_cta_label2', 'hero_cta_link2']

const isPageName = (value: string | undefined): value is PageName =>
  value === 'home' || value === 'about' || value === 'contact' || value === 'products'

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
            const { category, subtype } = parseHeroVariant(valueFor(key, 'minimal:centered'))

            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <Label>{humanizeKey(key)}</Label>

                <fieldset className="mt-2">
                  <legend className="mb-1 text-xs font-medium text-forest/70">Layout</legend>
                  <div className="flex flex-wrap gap-2">
                    {HERO_CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf has-[:focus-visible]:ring-offset-1',
                          category === cat
                            ? 'border-forest bg-forest text-cream'
                            : 'border-forest/20 text-forest hover:bg-forest/5',
                        )}
                      >
                        <input
                          type="radio"
                          name={`${key}-category`}
                          value={cat}
                          checked={category === cat}
                          onChange={() => handleSave(key, `${cat}:${HERO_SUBTYPES[cat][0]}`)}
                          className="sr-only"
                        />
                        {HERO_CATEGORY_LABELS[cat]}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-3">
                  <legend className="mb-1 text-xs font-medium text-forest/70">{HERO_CATEGORY_LABELS[category]} style</legend>
                  <div className="flex flex-wrap gap-2">
                    {HERO_SUBTYPES[category].map((sub) => (
                      <label
                        key={sub}
                        className={cn(
                          'cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf has-[:focus-visible]:ring-offset-1',
                          subtype === sub
                            ? 'border-leaf bg-leaf/20 text-forest'
                            : 'border-forest/15 text-forest/70 hover:bg-forest/5',
                        )}
                      >
                        <input
                          type="radio"
                          name={`${key}-subtype`}
                          value={sub}
                          checked={subtype === sub}
                          onChange={() => handleSave(key, `${category}:${sub}`)}
                          className="sr-only"
                        />
                        {HERO_SUBTYPE_LABELS[sub]}
                      </label>
                    ))}
                  </div>
                </fieldset>
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
