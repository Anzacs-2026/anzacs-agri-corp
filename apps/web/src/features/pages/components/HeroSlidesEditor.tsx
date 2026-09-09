import { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { photoService } from '@/features/photos/services/photoService'
import { useUploadPhoto } from '@/features/photos/hooks/usePhotos'
import type { PageName } from '../types'
import type { HeroSlideContent } from '../types'
import { parseHeroSlides, stringifyHeroSlides, emptyHeroSlide } from '../heroSlides'

interface HeroSlidesEditorProps {
  page: PageName
  value: string
  onSave: (text: string) => void
  saving: boolean
}

const HeroSlidesEditor = ({ page, value, onSave, saving }: HeroSlidesEditorProps) => {
  const [slides, setSlides] = useState<HeroSlideContent[]>(() => parseHeroSlides(value))
  const uploadPhoto = useUploadPhoto()

  const updateSlide = (i: number, patch: Partial<HeroSlideContent>) =>
    setSlides((s) => s.map((slide, idx) => (idx === i ? { ...slide, ...patch } : slide)))

  const moveSlide = (i: number, dir: -1 | 1) =>
    setSlides((s) => {
      const j = i + dir
      if (j < 0 || j >= s.length) return s
      const next = [...s]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const removeSlide = (i: number) => setSlides((s) => s.filter((_, idx) => idx !== i))

  return (
    <div className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
      <Label>Hero Slides</Label>
      <p className="text-xs font-normal text-forest/70">
        If you add slides here, they replace the single Hero fields below.
      </p>

      <div className="mt-3 flex flex-col gap-4">
        {slides.map((slide, i) => {
          const previewUrl = slide.imagePath ? photoService.getPublicUrl(slide.imagePath) : null

          return (
            <div key={i} className="rounded-lg border border-forest/10 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-forest">Slide {i + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Move slide up"
                    disabled={i === 0}
                    onClick={() => moveSlide(i, -1)}
                    className="rounded p-1 text-forest/60 hover:bg-forest/5 disabled:opacity-30"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move slide down"
                    disabled={i === slides.length - 1}
                    onClick={() => moveSlide(i, 1)}
                    className="rounded p-1 text-forest/60 hover:bg-forest/5 disabled:opacity-30"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove slide"
                    onClick={() => removeSlide(i)}
                    className="rounded p-1 text-forest/60 hover:bg-forest/5"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {previewUrl && <img src={previewUrl} alt="" className="mb-2 h-24 w-full rounded-md object-cover" />}
              <input
                type="file"
                accept="image/*"
                className="mb-2"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const photo = await uploadPhoto.mutateAsync({ file, page })
                  updateSlide(i, { imagePath: photo.storage_path })
                }}
              />

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Label>
                  Eyebrow
                  <Input value={slide.eyebrow} onChange={(e) => updateSlide(i, { eyebrow: e.target.value })} />
                </Label>
                <Label>
                  Title
                  <Input value={slide.title} onChange={(e) => updateSlide(i, { title: e.target.value })} />
                </Label>
              </div>
              <Label className="mt-2">
                Subtitle
                <Textarea rows={2} value={slide.subtitle} onChange={(e) => updateSlide(i, { subtitle: e.target.value })} />
              </Label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Label>
                  CTA Label
                  <Input value={slide.ctaLabel} onChange={(e) => updateSlide(i, { ctaLabel: e.target.value })} />
                </Label>
                <Label>
                  CTA Link
                  <Input value={slide.ctaTo} onChange={(e) => updateSlide(i, { ctaTo: e.target.value })} />
                </Label>
                <Label>
                  CTA Label 2
                  <Input value={slide.ctaLabel2} onChange={(e) => updateSlide(i, { ctaLabel2: e.target.value })} />
                </Label>
                <Label>
                  CTA Link 2
                  <Input value={slide.ctaTo2} onChange={(e) => updateSlide(i, { ctaTo2: e.target.value })} />
                </Label>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setSlides((s) => [...s, emptyHeroSlide()])}>
          Add Slide
        </Button>
        <Button type="button" size="sm" disabled={saving} onClick={() => onSave(stringifyHeroSlides(slides))}>
          Save Slides
        </Button>
      </div>
    </div>
  )
}

export default HeroSlidesEditor
