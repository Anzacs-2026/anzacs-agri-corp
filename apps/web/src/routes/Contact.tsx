import { usePageContent, getSectionText } from '@/features/pages'

const Contact = () => {
  const { data: sections } = usePageContent('contact')

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-forest/80">
        {getSectionText(sections, 'intro', 'Placeholder — Phase 5 wires the enquiry form.')}
      </p>
    </section>
  )
}

export default Contact
