import { Facebook, Instagram, Linkedin, Twitter, Youtube } from '@/components/icons/SocialIcons'
import { usePageContent, getSectionText } from '@/features/pages'
import { renderRichText } from '@/lib/richText'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { EnquiryForm } from '@/features/enquiries'
import Reveal from '@/components/Reveal'
import Seo from '@/components/Seo'

const SOCIAL_LINKS = [
  { key: 'social_facebook', label: 'Facebook', Icon: Facebook },
  { key: 'social_instagram', label: 'Instagram', Icon: Instagram },
  { key: 'social_twitter', label: 'Twitter / X', Icon: Twitter },
  { key: 'social_linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'social_youtube', label: 'YouTube', Icon: Youtube },
] as const

const Contact = () => {
  const { data: sections } = usePageContent('contact')
  const { data: settings } = useSiteSettings()

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with ANZ Agri Crop Sciences for enquiries about seeds, farming inputs, and bulk orders."
        path="/contact"
      />

      <Reveal className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">Contact</h1>
        <div className="mt-4 space-y-3 text-forest/80">
          {renderRichText(getSectionText(sections, 'intro', 'Get in touch — we would love to hear from you.'))}
        </div>

        {(settings?.contact_phone ||
          settings?.whatsapp_number ||
          settings?.contact_email ||
          settings?.contact_address) && (
          <div className="mt-6 flex flex-col gap-1 text-sm text-forest/80">
            {settings?.contact_phone && (
              <a href={`tel:${settings.contact_phone}`} className="underline transition-colors hover:text-leaf">
                Call: {settings.contact_phone}
              </a>
            )}
            {settings?.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="underline transition-colors hover:text-leaf"
              >
                WhatsApp: {settings.whatsapp_number}
              </a>
            )}
            {settings?.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="underline transition-colors hover:text-leaf">
                Email: {settings.contact_email}
              </a>
            )}
            {settings?.contact_address && <p>{settings.contact_address}</p>}
          </div>
        )}

        {settings && SOCIAL_LINKS.some(({ key }) => settings[key]) && (
          <div className="mt-4 flex justify-center gap-4">
            {SOCIAL_LINKS.map(({ key, label, Icon }) => {
              const href = settings[key]
              if (!href) return null
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="text-forest/70 transition-colors hover:text-leaf"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>
        )}

        {settings?.map_embed_url && (
          <iframe
            src={settings.map_embed_url}
            title="Location map"
            className="mt-6 h-64 w-full rounded-xl border border-forest/10"
            loading="lazy"
          />
        )}

        <EnquiryForm />
      </Reveal>
    </>
  )
}

export default Contact
