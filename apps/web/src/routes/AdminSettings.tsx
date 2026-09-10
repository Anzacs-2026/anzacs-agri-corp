import { useEffect, useState } from 'react'
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from '@/components/icons/SocialIcons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useSiteSettings, useUpdateContactSettings } from '@/hooks/useSiteSettings'
import type { ContactSettingsInput } from '@/lib/siteSettingsService'

const EMPTY_FORM: ContactSettingsInput = {
  contact_phone: '',
  whatsapp_number: '',
  contact_address: '',
  contact_email: '',
  map_embed_url: '',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  social_linkedin: '',
  social_youtube: '',
}

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings()
  const updateContact = useUpdateContactSettings()
  const [form, setForm] = useState<ContactSettingsInput>(EMPTY_FORM)

  useEffect(() => {
    if (!settings) return
    setForm({
      contact_phone: settings.contact_phone ?? '',
      whatsapp_number: settings.whatsapp_number ?? '',
      contact_address: settings.contact_address ?? '',
      contact_email: settings.contact_email ?? '',
      map_embed_url: settings.map_embed_url ?? '',
      social_facebook: settings.social_facebook ?? '',
      social_instagram: settings.social_instagram ?? '',
      social_twitter: settings.social_twitter ?? '',
      social_linkedin: settings.social_linkedin ?? '',
      social_youtube: settings.social_youtube ?? '',
    })
  }, [settings])

  const setField = (key: keyof ContactSettingsInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v?.trim() ? v.trim() : null]),
    ) as unknown as ContactSettingsInput
    updateContact.mutate(cleaned)
  }

  if (isLoading) return <p className="text-forest/70">Loading…</p>

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader
        title="Site Settings"
        description="Contact details, map, and social links shown on the Contact page and footer."
        action={
          <Button onClick={handleSave} disabled={updateContact.isPending}>
            {updateContact.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-forest">Contact Info</h3>
          <div className="flex flex-col gap-4">
            <Label>
              Phone
              <Input value={form.contact_phone ?? ''} onChange={setField('contact_phone')} placeholder="+91 98765 43210" />
            </Label>
            <Label>
              WhatsApp number
              <Input value={form.whatsapp_number ?? ''} onChange={setField('whatsapp_number')} placeholder="919876543210" />
            </Label>
            <Label>
              Email
              <Input type="email" value={form.contact_email ?? ''} onChange={setField('contact_email')} placeholder="hello@anzacs.in" />
            </Label>
            <Label>
              Address
              <Textarea value={form.contact_address ?? ''} onChange={setField('contact_address')} rows={2} />
            </Label>
          </div>
        </div>

        <div className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
          <h3 className="font-medium text-forest">Map</h3>
          <p className="mb-3 text-xs text-forest/70">
            Paste a Google Maps "Embed a map" src URL (Share → Embed a map → copy the src="…" value).
          </p>
          <Input
            value={form.map_embed_url ?? ''}
            onChange={setField('map_embed_url')}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          {form.map_embed_url && (
            <iframe
              src={form.map_embed_url}
              title="Map preview"
              className="mt-3 h-48 w-full rounded-lg border border-forest/10"
              loading="lazy"
            />
          )}
        </div>

        <div className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-forest">Social Links</h3>
          <div className="flex flex-col gap-4">
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Facebook size={14} className="text-forest/60" /> Facebook
              </span>
              <Input value={form.social_facebook ?? ''} onChange={setField('social_facebook')} placeholder="https://facebook.com/..." />
            </Label>
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Instagram size={14} className="text-forest/60" /> Instagram
              </span>
              <Input value={form.social_instagram ?? ''} onChange={setField('social_instagram')} placeholder="https://instagram.com/..." />
            </Label>
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Twitter size={14} className="text-forest/60" /> Twitter / X
              </span>
              <Input value={form.social_twitter ?? ''} onChange={setField('social_twitter')} placeholder="https://x.com/..." />
            </Label>
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Linkedin size={14} className="text-forest/60" /> LinkedIn
              </span>
              <Input value={form.social_linkedin ?? ''} onChange={setField('social_linkedin')} placeholder="https://linkedin.com/company/..." />
            </Label>
            <Label>
              <span className="inline-flex items-center gap-1.5">
                <Youtube size={14} className="text-forest/60" /> YouTube
              </span>
              <Input value={form.social_youtube ?? ''} onChange={setField('social_youtube')} placeholder="https://youtube.com/@..." />
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
