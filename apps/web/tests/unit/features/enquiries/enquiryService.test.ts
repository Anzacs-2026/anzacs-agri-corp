import { enquiryService } from '@/features/enquiries/services/enquiryService'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockFrom = supabase.from as jest.Mock

function makeQueryChain(finalResolution: unknown) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'is', 'order', 'single', 'update', 'insert']
  methods.forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  ;(chain as unknown as { then: PromiseLike<unknown>['then'] }).then = (resolve) =>
    Promise.resolve(finalResolution).then(resolve)
  return chain
}

describe('enquiryService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('createEnquiry inserts and returns the row', async () => {
    const chain = makeQueryChain({ data: { id: '1' }, error: null })
    mockFrom.mockReturnValue(chain)

    const input = { name: 'Jane', email: 'jane@example.com', phone: '123', subject: 'General enquiry', message: 'Hi' }
    const result = await enquiryService.createEnquiry(input)

    expect(mockFrom).toHaveBeenCalledWith('enquiries')
    expect(chain.insert).toHaveBeenCalledWith(input)
    expect(result).toEqual({ id: '1' })
  })

  it('getAllEnquiriesAdmin filters to active rows only, newest first', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await enquiryService.getAllEnquiriesAdmin()

    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
    expect(chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
  })

  it('updateEnquiryStatus updates the status column', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    await enquiryService.updateEnquiryStatus('enquiry-1', 'done')

    expect(chain.update).toHaveBeenCalledWith({ status: 'done' })
    expect(chain.eq).toHaveBeenCalledWith('id', 'enquiry-1')
  })

  it('softDeleteEnquiry calls update, never delete', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    chain.delete = jest.fn(() => chain)
    mockFrom.mockReturnValue(chain)

    await enquiryService.softDeleteEnquiry('enquiry-1', 'user-1')

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String), deleted_by: 'user-1' }),
    )
    expect(chain.delete).not.toHaveBeenCalled()
  })
})
