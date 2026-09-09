import { useSiteSettings } from '@/hooks/useSiteSettings'

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
          <a href={`tel:${data.contact_phone}`} className="hover:text-cream">
            Phone: {data.contact_phone}
          </a>
        )}
        {data?.whatsapp_number && (
          <a
            href={`https://wa.me/${data.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cream"
          >
            WhatsApp: {data.whatsapp_number}
          </a>
        )}
        {data?.contact_address && <p>{data.contact_address}</p>}
      </div>
    </footer>
  )
}

export default Footer
