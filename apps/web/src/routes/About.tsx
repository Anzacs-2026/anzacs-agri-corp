import { usePageContent, getSectionText } from '@/features/pages'

const About = () => {
  const { data: sections } = usePageContent('about')

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4 whitespace-pre-line text-forest/80">
        {getSectionText(sections, 'body', 'Placeholder — Phase 4 wires page_content.')}
      </p>
    </section>
  )
}

export default About
