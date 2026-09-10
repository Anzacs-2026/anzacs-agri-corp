import { Facebook, Instagram, Linkedin, Twitter, Youtube } from '@/components/icons/SocialIcons'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const SOCIAL_LINKS = [
  { key: 'social_facebook', label: 'Facebook', Icon: Facebook },
  { key: 'social_instagram', label: 'Instagram', Icon: Instagram },
  { key: 'social_twitter', label: 'Twitter / X', Icon: Twitter },
  { key: 'social_linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'social_youtube', label: 'YouTube', Icon: Youtube },
] as const

const Footer = () => {
  const { data } = useSiteSettings()

  return (
    <footer className="bg-forest px-4 py-8 text-cream/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 font-serif text-cream">
          <img src="/anz_logos/badge.webp" alt="" className="h-10 w-10" />
          ANZ Agricrop
        </div>
        {data?.contact_phone && (
          <a href={`tel:${data.contact_phone}`} className="w-fit transition-colors hover:text-lime">
            Phone: {data.contact_phone}
          </a>
        )}
        {data?.whatsapp_number && (
          <a
            href={`https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-fit transition-colors hover:text-lime"
          >
            WhatsApp: {data.whatsapp_number}
          </a>
        )}
        {data?.contact_email && (
          <a href={`mailto:${data.contact_email}`} className="w-fit transition-colors hover:text-lime">
            Email: {data.contact_email}
          </a>
        )}
        {data?.contact_address && <p>{data.contact_address}</p>}
        {data && SOCIAL_LINKS.some(({ key }) => data[key]) && (
          <div className="flex gap-3 pt-1">
            {SOCIAL_LINKS.map(({ key, label, Icon }) => {
              const href = data[key]
              if (!href) return null
              return (
                <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="transition-colors hover:text-lime">
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        )}
        <p className="mt-2 border-t border-cream/10 pt-3 text-xs text-cream/60">
          © {new Date().getFullYear()} ANZ Agricrop. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
