import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
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
  HERO_STYLES,
  HERO_STYLE_LABELS,
  isHeroStyle,
  STATS_STYLES,
  STATS_STYLE_LABELS,
  isStatsStyle,
  HeroSlidesEditor,
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

const SHORT_FIELD_KEYS = [
  'hero_title',
  'hero_cta_label',
  'hero_cta_link',
  'hero_cta_label2',
  'hero_cta_link2',
  'features_title',
  'stats_title',
]

// These already use a "label – value" / "label : value" per-line convention
// (parsed by parseBullets/parsePairs) — the paragraph/bullet hint below
// doesn't apply to that format.
const STRUCTURED_LIST_KEYS = ['features', 'stats', 'core_capabilities', 'why_anz']

const PARAGRAPH_HINT =
  'Plain lines render as paragraphs; start a line with -  to make it a bullet point. Mix both freely. ' +
  'Wrap text in **bold**, *italic*, or __underline__ — works on part of a sentence or the whole thing.'

// Mirrors the fallback copy each public route (Home/About/Contact/Products)
// shows when a page_content row doesn't exist yet, so the admin form displays
// the same text that's actually live instead of appearing blank.
const PAGE_DEFAULTS: Record<PageName, Record<string, string>> = {
  home: {
    hero_title: 'Sowing Potential.\nHarvesting Progress.',
    hero_subtitle:
      'Empowering agriculture with quality seeds, dependable performance and solutions created for sustainable growth.',
    hero_cta_label: 'Discover ANZ Agricrop',
    hero_cta_link: '/about',
    hero_cta_label2: 'Our Products',
    hero_cta_link2: '/products',
    intro:
      'An integrated agricultural enterprise with a strong foundation in plant genetics and seed production — delivering 100% pure, high-yield hybrid and open-pollinated varieties to growers nationwide and beyond.',
    features_title: 'Why choose ANZ Agri Crop Sciences',
    features:
      'Certified Genetics – Every seed batch is lab-tested for purity and germination before it leaves our facility.\nNationwide Reach – Trusted by farmers, distributors, and agro-retailers across the country.\nResearch-Backed – Over a decade of plant genetics and breeding R&D behind every variety.\nDedicated Support – Agronomy guidance from planting through harvest.',
    stats_title: 'ANZ by the numbers',
    stats: '24+ : Years of Experience\n500+ : Farmer Partners\n50+ : Seed Varieties\n100% : Purity Certified',
  },
  about: {
    hero_title: 'Seeds for Stronger Harvests',
    hero_subtitle:
      'High-quality seeds developed to support healthy crops, reliable performance and better yields across every growing season.',
    hero_cta_label: 'Explore Our Seeds',
    hero_cta_link: '/products',
    hero_cta_label2: 'Contact Us',
    hero_cta_link2: '/contact',
    stats_title: 'ANZ by the numbers',
    stats: '15+ : Years of Research\n12+ : Seed Varieties\n2 : Core Divisions\n100% : Farmer-First',
    who_we_are:
      'ANZ Agri Crop Sciences is an integrated agricultural enterprise with over 12 years of dedicated research and development in plant genetics, conventional breeding, and seed production. The company operates across farming, seed commerce, and apiculture (beekeeping), creating a synergistic model that supports both crop productivity and diversified revenue streams.',
    core_capabilities:
      'Seed Genetics & R&D – A strong foundation in plant heredity and innovative germination techniques drives the development of high-performance seed varieties.\nQuality Assurance – Every product undergoes rigorous handling in controlled environments supervised by expert horticulturists, ensuring 100% purity, extended shelf life, superior taste, nutritional density, and hygienic standards.\nSupply Chain Excellence – As a reliable manufacturer, shipper, exporter, and supplier, the organization ensures seamless distribution to agricultural markets across multiple geographies.\nBeekeeping Integration – Recently launched apiculture operations complement farming activities through natural pollination and open avenues for honey and hive-product commercialization.',
    market_position:
      "ANZ Agri Crop Sciences has earned broad customer recognition for consistency and product integrity. The company's commitment to zero-compromise quality has positioned it as a trusted partner among farmers, distributors, and agro-retailers nationally. Export operations extend the company's reach to international markets, adhering to stringent phytosanitary and trade compliance standards.",
    philosophy:
      'Agriculture remains the foundation of national economic growth, and seeds are its starting point — the very essence of food security. ANZ Agri Crop Sciences embraces this philosophy by continuously refining seed technologies, improving germination rates, and ensuring that high-quality genetic material reaches every farm gate. This approach contributes directly to higher yields, better farmer incomes, and sustainable food systems.',
    why_anz:
      'Purity: 100% certified\nShelf Life: Optimized through scientific storage\nNutrition: Preserved through careful processing\nTraceability: End-to-end batch tracking\nInnovation: Continuous investment in breeding R&D',
    future_direction:
      "Building on a decade of operational excellence, the organization is scaling its beekeeping division, expanding export footprints, and investing in climate-resilient seed traits. The goal remains clear: to remain at the forefront of India's agricultural evolution by delivering science-backed, farmer-first solutions.",
  },
  contact: {
    intro: 'Get in touch — we would love to hear from you.',
  },
  products: {
    hero_title: 'Better Seeds. Greater Potential.',
    hero_subtitle:
      'Discover dependable, high-performing seeds created to give every crop a strong beginning and every farmer greater confidence.',
    hero_cta_label: 'View Our Products',
    hero_cta_link: '#product-grid',
    hero_cta_label2: 'Enquire Now',
    hero_cta_link2: '/contact',
  },
}

const isPageName = (value: string | undefined): value is PageName =>
  value === 'home' || value === 'about' || value === 'contact' || value === 'products'

const groupTitleFor = (key: string): string => {
  if (key.startsWith('hero_')) return 'Hero Section'
  if (key.startsWith('stats')) return 'Stats Section'
  if (key.startsWith('features')) return 'Features Section'
  return 'Page Content'
}

const groupKeys = (keys: string[]): { title: string; keys: string[] }[] => {
  const order: string[] = []
  const byTitle: Record<string, string[]> = {}

  keys.forEach((key) => {
    const title = groupTitleFor(key)
    if (!byTitle[title]) {
      byTitle[title] = []
      order.push(title)
    }
    byTitle[title].push(key)
  })

  return order.map((title) => ({ title, keys: byTitle[title] }))
}

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
  const groups = groupKeys(sectionKeys)

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setOpenGroups({ [groups[0]?.title]: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const toggleGroup = (title: string) => setOpenGroups((g) => ({ ...g, [title]: !g[title] }))

  const valueFor = (key: string, fallback?: string) =>
    drafts[key] ?? getSectionText(sections, key, fallback ?? PAGE_DEFAULTS[page][key] ?? '')

  const handleSave = (key: string, value: string) => {
    upsert.mutate({ sectionKey: key, content: { text: value } })
  }

  const renderField = (key: string) => {
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
            const rawValue = valueFor(key, 'banner-left')
            const style = isHeroStyle(rawValue) ? rawValue : 'banner-left'

            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <Label>{humanizeKey(key)}</Label>

                <fieldset className="mt-2">
                  <legend className="mb-1 text-xs font-medium text-forest/70">Layout</legend>
                  <div className="flex flex-wrap gap-2">
                    {HERO_STYLES.map((s) => (
                      <label
                        key={s}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf has-[:focus-visible]:ring-offset-1',
                          style === s
                            ? 'border-forest bg-forest text-cream'
                            : 'border-forest/20 text-forest hover:bg-forest/5',
                        )}
                      >
                        <input
                          type="radio"
                          name={`${key}-style`}
                          value={s}
                          checked={style === s}
                          onChange={() => handleSave(key, s)}
                          className="sr-only"
                        />
                        {HERO_STYLE_LABELS[s]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )
          }

          if (key === 'hero_parallax') {
            const enabled = valueFor(key, page === 'home' ? 'true' : 'false') === 'true'

            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <label className="flex cursor-pointer items-center justify-between">
                  <span>
                    <span className="block font-medium text-forest">{humanizeKey(key)}</span>
                    <span className="text-xs font-normal text-forest/70">
                      Background photo scrolls slower than the page for a depth effect.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleSave(key, e.target.checked ? 'true' : 'false')}
                    className="h-5 w-5 accent-forest"
                  />
                </label>
              </div>
            )
          }

          if (key === 'hero_slides') {
            return (
              <HeroSlidesEditor
                key={page}
                page={page}
                value={valueFor(key)}
                saving={upsert.isPending}
                onSave={(text) => handleSave(key, text)}
              />
            )
          }

          if (key === 'stats_enabled' || key === 'features_enabled') {
            const label = key === 'stats_enabled' ? 'Show stats counter section' : 'Show features section'
            const enabled = valueFor(key, 'true') === 'true'

            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="block font-medium text-forest">{label}</span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => handleSave(key, e.target.checked ? 'true' : 'false')}
                    className="h-5 w-5 accent-forest"
                  />
                </label>
              </div>
            )
          }

          if (key === 'stats_style') {
            const defaultStyle = page === 'home' ? 'section' : 'overlap'
            const rawValue = valueFor(key, defaultStyle)
            const style = isStatsStyle(rawValue) ? rawValue : defaultStyle

            return (
              <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <Label>{humanizeKey(key)}</Label>

                <fieldset className="mt-2">
                  <legend className="mb-1 text-xs font-medium text-forest/70">Position</legend>
                  <div className="flex flex-wrap gap-2">
                    {STATS_STYLES.map((s) => (
                      <label
                        key={s}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf has-[:focus-visible]:ring-offset-1',
                          style === s
                            ? 'border-forest bg-forest text-cream'
                            : 'border-forest/20 text-forest hover:bg-forest/5',
                        )}
                      >
                        <input
                          type="radio"
                          name={`${key}-style`}
                          value={s}
                          checked={style === s}
                          onChange={() => handleSave(key, s)}
                          className="sr-only"
                        />
                        {STATS_STYLE_LABELS[s]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )
          }

          const value = valueFor(key)
          const isShort = SHORT_FIELD_KEYS.includes(key)
          const isStructuredList = STRUCTURED_LIST_KEYS.includes(key)
          const isParagraph = !isShort && !isStructuredList

          return (
            <div key={key} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
              <Label>
                {humanizeKey(key)}
                {isParagraph && <span className="text-xs font-normal text-forest/70">{PARAGRAPH_HINT}</span>}
                {isShort ? (
                  <Input value={value} onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))} />
                ) : (
                  <Textarea
                    value={value}
                    onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                    rows={isParagraph ? 4 : 3}
                  />
                )}
              </Label>
              <Button size="sm" className="mt-3" onClick={() => handleSave(key, value)} disabled={upsert.isPending}>
                Save
              </Button>
            </div>
          )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader title={PAGE_TITLES[page]} description="Edit the copy shown on this page." />

      <div className="flex flex-col gap-4">
        {groups.map(({ title, keys }) => {
          const isOpen = openGroups[title] ?? false

          return (
            <div key={title} className="overflow-hidden rounded-xl border border-forest/10 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleGroup(title)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-forest">{title}</span>
                <ChevronDown
                  size={18}
                  className={cn('text-forest/60 transition-transform', isOpen && 'rotate-180')}
                />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-4 border-t border-forest/10 bg-cream/40 p-4">
                  {keys.map((key) => renderField(key))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminPages
