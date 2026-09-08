import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EnquiryForm from '@/features/enquiries/components/EnquiryForm'
import { enquiryService } from '@/features/enquiries/services/enquiryService'
import { useSiteSettings } from '@/hooks/useSiteSettings'

jest.mock('@/features/enquiries/services/enquiryService', () => ({
  enquiryService: { createEnquiry: jest.fn() },
}))

jest.mock('@/hooks/useSiteSettings', () => ({
  useSiteSettings: jest.fn(),
}))

const mockCreateEnquiry = enquiryService.createEnquiry as jest.Mock
const mockUseSiteSettings = useSiteSettings as jest.Mock

describe('EnquiryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSiteSettings.mockReturnValue({ data: { enquiry_subjects: ['General enquiry', 'Request a quote'] } })
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
  })

  it('renders empty fields', () => {
    render(<EnquiryForm />)

    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
  })

  it('submits the enquiry and shows a success message', async () => {
    mockCreateEnquiry.mockResolvedValue({ id: 'enquiry-1' })
    const user = userEvent.setup()

    render(<EnquiryForm />)

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone/i), '9999999999')
    await user.type(screen.getByLabelText(/message/i), 'Interested in your products.')
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    await waitFor(() =>
      expect(mockCreateEnquiry).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Jane Doe', email: 'jane@example.com', message: 'Interested in your products.' }),
      ),
    )

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks/i)
    expect(global.fetch).toHaveBeenCalledWith(
      '/.netlify/functions/send-enquiry-notification',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('still shows success even when the notification call fails', async () => {
    mockCreateEnquiry.mockResolvedValue({ id: 'enquiry-1' })
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'))
    const user = userEvent.setup()

    render(<EnquiryForm />)

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone/i), '9999999999')
    await user.type(screen.getByLabelText(/message/i), 'Interested in your products.')
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/thanks/i)
  })

  it('shows an error message when the insert fails', async () => {
    mockCreateEnquiry.mockRejectedValue(new Error('insert failed'))
    const user = userEvent.setup()

    render(<EnquiryForm />)

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone/i), '9999999999')
    await user.type(screen.getByLabelText(/message/i), 'Interested in your products.')
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('insert failed')
  })
})
