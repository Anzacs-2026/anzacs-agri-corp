import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeroSlidesEditor from '@/features/pages/components/HeroSlidesEditor'
import { emptyHeroSlide, stringifyHeroSlides } from '@/features/pages/heroSlides'

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

jest.mock('@/features/photos/hooks/usePhotos', () => ({
  useUploadPhoto: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
}))

describe('HeroSlidesEditor', () => {
  it('starts empty and adds a slide', async () => {
    const user = userEvent.setup()
    const onSave = jest.fn()
    render(<HeroSlidesEditor page="home" value="" onSave={onSave} saving={false} />)

    expect(screen.queryByText('Slide 1')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add Slide' }))
    expect(screen.getByText('Slide 1')).toBeInTheDocument()
  })

  it('edits a slide field and saves the whole array as JSON', async () => {
    const user = userEvent.setup()
    const onSave = jest.fn()
    const initial = [{ ...emptyHeroSlide(), title: 'Original' }]
    render(<HeroSlidesEditor page="home" value={stringifyHeroSlides(initial)} onSave={onSave} saving={false} />)

    const titleInput = screen.getByLabelText(/^Title/)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Title')
    await user.click(screen.getByRole('button', { name: 'Save Slides' }))

    expect(onSave).toHaveBeenCalledWith(stringifyHeroSlides([{ ...emptyHeroSlide(), title: 'Updated Title' }]))
  })

  it('removes a slide', async () => {
    const user = userEvent.setup()
    const initial = [{ ...emptyHeroSlide(), title: 'One' }, { ...emptyHeroSlide(), title: 'Two' }]
    render(<HeroSlidesEditor page="home" value={stringifyHeroSlides(initial)} onSave={jest.fn()} saving={false} />)

    expect(screen.getByText('Slide 2')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Remove slide' })[1])
    expect(screen.queryByText('Slide 2')).not.toBeInTheDocument()
  })

  it('reorders slides with the move buttons', async () => {
    const user = userEvent.setup()
    const onSave = jest.fn()
    const initial = [{ ...emptyHeroSlide(), title: 'First' }, { ...emptyHeroSlide(), title: 'Second' }]
    render(<HeroSlidesEditor page="home" value={stringifyHeroSlides(initial)} onSave={onSave} saving={false} />)

    await user.click(screen.getAllByRole('button', { name: 'Move slide down' })[0])
    await user.click(screen.getByRole('button', { name: 'Save Slides' }))

    expect(onSave).toHaveBeenCalledWith(
      stringifyHeroSlides([{ ...emptyHeroSlide(), title: 'Second' }, { ...emptyHeroSlide(), title: 'First' }]),
    )
  })
})
