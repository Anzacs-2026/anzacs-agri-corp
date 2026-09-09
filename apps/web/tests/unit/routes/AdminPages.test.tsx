import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminPages from '@/routes/AdminPages'
import { usePageContent, useUpsertPageContent } from '@/features/pages'

jest.mock('@/features/pages', () => {
  const actualTypes = jest.requireActual('@/features/pages/types')
  const actualHeroSlidesEditor = jest.requireActual('@/features/pages/components/HeroSlidesEditor').default
  return {
    HERO_STYLES: actualTypes.HERO_STYLES,
    HERO_STYLE_LABELS: actualTypes.HERO_STYLE_LABELS,
    isHeroStyle: actualTypes.isHeroStyle,
    STATS_STYLES: actualTypes.STATS_STYLES,
    STATS_STYLE_LABELS: actualTypes.STATS_STYLE_LABELS,
    isStatsStyle: actualTypes.isStatsStyle,
    HeroSlidesEditor: actualHeroSlidesEditor,
    usePageContent: jest.fn(),
    useUpsertPageContent: jest.fn(),
    SECTION_KEYS: {
      home: [
        'hero_variant',
        'hero_parallax',
        'hero_slides',
        'hero_title',
        'hero_subtitle',
        'intro',
        'features_enabled',
        'stats_enabled',
        'stats_style',
      ],
      about: ['body'],
      contact: ['intro'],
    },
    getSectionText: (
      sections: { section_key: string; content: { text: string } }[] | undefined,
      key: string,
      fallback: string,
    ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
  }
})

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

jest.mock('@/features/photos/hooks/usePhotos', () => ({
  useUploadPhoto: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
}))

const mockUsePageContent = usePageContent as jest.Mock
const mockUseUpsertPageContent = useUpsertPageContent as jest.Mock

const renderAt = (page: string) =>
  render(
    <MemoryRouter initialEntries={[`/${page}`]}>
      <Routes>
        <Route path="/:page" element={<AdminPages />} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminPages', () => {
  const mutate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePageContent.mockReturnValue({ data: [] })
    mockUseUpsertPageContent.mockReturnValue({ mutate, isPending: false })
  })

  it('renders a humanized field for each section of the selected page', () => {
    renderAt('home')
    expect(screen.getByLabelText('Hero Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Hero Subtitle')).toBeInTheDocument()
    expect(screen.getByLabelText('Introduction')).toBeInTheDocument()
  })

  it('saves a section with its edited text', async () => {
    const user = userEvent.setup()
    renderAt('home')

    await user.type(screen.getByLabelText('Hero Title'), 'New headline')
    const heroTitleField = screen.getByLabelText('Hero Title').closest('div.rounded-xl') as HTMLElement
    await user.click(within(heroTitleField).getByRole('button', { name: /^save$/i }))

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'hero_title', content: { text: 'New headline' } })
  })

  it('saves the hero style immediately when a layout is picked', async () => {
    const user = userEvent.setup()
    renderAt('home')

    await user.click(screen.getByRole('radio', { name: 'Minimal (centered)' }))

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'hero_variant', content: { text: 'banner-center' } })
  })

  it('defaults hero parallax on for home and toggles it off', async () => {
    const user = userEvent.setup()
    renderAt('home')

    const toggle = screen.getByRole('checkbox', { name: /hero parallax/i })
    expect(toggle).toBeChecked()

    await user.click(toggle)

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'hero_parallax', content: { text: 'false' } })
  })

  it('renders a different page section set based on the route', () => {
    renderAt('about')

    expect(screen.getByLabelText('Page Body')).toBeInTheDocument()
    expect(screen.queryByLabelText('Hero Title')).not.toBeInTheDocument()
  })

  it('defaults features and stats sections on and toggles them off', async () => {
    const user = userEvent.setup()
    renderAt('home')

    const featuresToggle = screen.getByRole('checkbox', { name: /show features section/i })
    const statsToggle = screen.getByRole('checkbox', { name: /show stats counter section/i })
    expect(featuresToggle).toBeChecked()
    expect(statsToggle).toBeChecked()

    await user.click(featuresToggle)
    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'features_enabled', content: { text: 'false' } })
  })

  it('saves the stats position when a style is picked', async () => {
    const user = userEvent.setup()
    renderAt('home')

    await user.click(screen.getByRole('radio', { name: 'Separate Section' }))

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'stats_style', content: { text: 'section' } })
  })

  it('renders the hero slides editor and adds/saves a slide', async () => {
    const user = userEvent.setup()
    renderAt('home')

    expect(screen.getByText('Hero Slides')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add Slide' }))

    const titleInputs = screen.getAllByLabelText(/^Title/)
    await user.type(titleInputs[0], 'New Slide')
    await user.click(screen.getByRole('button', { name: 'Save Slides' }))

    expect(mutate).toHaveBeenCalledWith({
      sectionKey: 'hero_slides',
      content: {
        text: JSON.stringify([
          { imagePath: '', eyebrow: '', title: 'New Slide', subtitle: '', ctaLabel: '', ctaTo: '', ctaLabel2: '', ctaTo2: '', tags: '' },
        ]),
      },
    })
  })
})
