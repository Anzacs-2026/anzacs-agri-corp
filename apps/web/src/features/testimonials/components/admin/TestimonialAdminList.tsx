import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { updateTestimonialsEnabled } from '@/lib/siteSettingsService'
import { testimonialService } from '../../services/testimonialService'
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useSoftDeleteTestimonial,
  useToggleTestimonialShown,
  useUpdateTestimonial,
} from '../../hooks/useTestimonials'

const TestimonialAdminList = () => {
  const { data: settings } = useSiteSettings()
  const { data: testimonials, isLoading } = useAdminTestimonials()
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const toggleShown = useToggleTestimonialShown()
  const softDelete = useSoftDeleteTestimonial()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [quote, setQuote] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const toggleEnabled = useMutation({
    mutationFn: (enabled: boolean) => updateTestimonialsEnabled(enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site_settings'] }),
  })

  const handleAdd = async () => {
    if (!name.trim() || !quote.trim()) return
    setSubmitting(true)
    try {
      const photo_url = photoFile ? await testimonialService.uploadTestimonialPhoto(photoFile) : null
      await createTestimonial.mutateAsync({ customer_name: name, quote, photo_url })
      setName('')
      setQuote('')
      setPhotoFile(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      softDelete.mutate(id)
    }
  }

  if (isLoading) return <p className="text-forest/60">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader title="Testimonials" description="Customer quotes shown on the home page." />

      <label className="mb-6 flex items-center gap-2 rounded-xl border border-forest/10 bg-white p-4 text-sm font-medium text-forest shadow-sm">
        <input
          type="checkbox"
          checked={settings?.testimonials_enabled ?? false}
          onChange={(e) => toggleEnabled.mutate(e.target.checked)}
        />
        Show testimonials on the public site
      </label>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
        <Input placeholder="Customer name" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea placeholder="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} />
        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
        <Button size="sm" onClick={handleAdd} disabled={submitting || !name.trim() || !quote.trim()}>
          Add testimonial
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {testimonials?.map((testimonial) => (
          <div key={testimonial.id} className="flex flex-col gap-3 rounded-xl border border-forest/10 bg-white p-4 shadow-sm sm:flex-row sm:items-start">
            {testimonial.photo_url && (
              <img src={testimonial.photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />
            )}
            <div className="flex-1 space-y-2">
              <Input
                defaultValue={testimonial.customer_name}
                onBlur={(e) =>
                  e.target.value !== testimonial.customer_name &&
                  updateTestimonial.mutate({ id: testimonial.id, input: { customer_name: e.target.value, quote: testimonial.quote } })
                }
              />
              <Textarea
                defaultValue={testimonial.quote}
                rows={2}
                onBlur={(e) =>
                  e.target.value !== testimonial.quote &&
                  updateTestimonial.mutate({ id: testimonial.id, input: { customer_name: testimonial.customer_name, quote: e.target.value } })
                }
              />
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <label className="flex items-center gap-2 text-sm text-forest">
                <input
                  type="checkbox"
                  checked={testimonial.shown}
                  onChange={() => toggleShown.mutate({ id: testimonial.id, current: testimonial.shown })}
                />
                Shown
              </label>
              <button
                type="button"
                onClick={() => handleDelete(testimonial.id)}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialAdminList
