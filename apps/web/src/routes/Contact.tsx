import { usePageContent, getSectionText } from '@/features/pages'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { EnquiryForm } from '@/features/enquiries'
import Reveal from '@/components/Reveal'
import Seo from '@/components/Seo'

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
        <p className="mt-4 text-forest/80">
          {getSectionText(sections, 'intro', 'Get in touch — we would love to hear from you.')}
        </p>

        {(settings?.contact_phone || settings?.whatsapp_number || settings?.contact_address) && (
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
            {settings?.contact_address && <p>{settings.contact_address}</p>}
          </div>
        )}

        <EnquiryForm />
      </Reveal>
    </>
  )
}

export default Contact
