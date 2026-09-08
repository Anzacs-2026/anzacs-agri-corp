import { usePageContent, getSectionText } from '@/features/pages'

const Home = () => {
  const { data: sections } = usePageContent('home')

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">{getSectionText(sections, 'hero_title', 'ANZ Agricrop Sciences')}</h1>
      <p className="mt-4 text-forest/80">
        {getSectionText(sections, 'hero_subtitle', 'Seeds for life — placeholder home page, Phase 4 wires real content.')}
      </p>
    </section>
  )
}

export default Home
