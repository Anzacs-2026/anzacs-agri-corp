import { useSiteSettings } from '@/hooks/useSiteSettings'

const Footer = () => {
  const { data } = useSiteSettings()

  return (
    <footer className="bg-forest px-4 py-6 text-cream/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm">
        <p>Seeds for life.</p>

        {data?.contact_phone && <p>Phone: {data.contact_phone}</p>}
        {data?.whatsapp_number && <p>WhatsApp: {data.whatsapp_number}</p>}
        {data?.contact_address && <p>{data.contact_address}</p>}
      </div>
    </footer>
  )
}

export default Footer
