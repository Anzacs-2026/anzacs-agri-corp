import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'
import { useSiteSettings } from '@/hooks/useSiteSettings'

jest.mock('@/hooks/useSiteSettings', () => ({
  useSiteSettings: jest.fn(),
}))

const mockUseSiteSettings = useSiteSettings as jest.Mock

describe('Footer', () => {
  it('renders the tagline', () => {
    mockUseSiteSettings.mockReturnValue({ data: undefined, isLoading: true })

    render(<Footer />)

    expect(screen.getByText(/seeds for life/i)).toBeInTheDocument()
  })

  it('renders contact info once site_settings loads', () => {
    mockUseSiteSettings.mockReturnValue({
      data: {
        testimonials_enabled: false,
        whatsapp_number: '+91 90000 00000',
        contact_phone: '+91 80000 00000',
        contact_address: 'Nashik, Maharashtra',
        enquiry_subjects: ['General enquiry', 'Request a quote'],
      },
      isLoading: false,
    })

    render(<Footer />)

    expect(screen.getByText(/\+91 80000 00000/)).toBeInTheDocument()
    expect(screen.getByText('Nashik, Maharashtra')).toBeInTheDocument()
  })

  it('renders gracefully when contact fields are unset', () => {
    mockUseSiteSettings.mockReturnValue({
      data: {
        testimonials_enabled: false,
        whatsapp_number: null,
        contact_phone: null,
        contact_address: null,
        enquiry_subjects: [],
      },
      isLoading: false,
    })

    render(<Footer />)

    expect(screen.queryByText('null')).not.toBeInTheDocument()
  })
})
