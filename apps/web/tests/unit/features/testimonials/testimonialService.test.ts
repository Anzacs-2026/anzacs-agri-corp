import { testimonialService } from '@/features/testimonials/services/testimonialService'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: { from: jest.fn() },
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

describe('testimonialService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getShownTestimonials filters to shown + active rows', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await testimonialService.getShownTestimonials()

    expect(mockFrom).toHaveBeenCalledWith('testimonials')
    expect(chain.eq).toHaveBeenCalledWith('shown', true)
    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('getAllTestimonialsAdmin does not filter by shown', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await testimonialService.getAllTestimonialsAdmin()

    expect(chain.eq).not.toHaveBeenCalledWith('shown', true)
    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('softDeleteTestimonial calls update, never delete', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    chain.delete = jest.fn(() => chain)
    mockFrom.mockReturnValue(chain)

    await testimonialService.softDeleteTestimonial('testimonial-1', 'user-1')

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String), deleted_by: 'user-1' }),
    )
    expect(chain.delete).not.toHaveBeenCalled()
  })

  it('toggleShown flips the current value', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    await testimonialService.toggleShown('testimonial-1', true)

    expect(chain.update).toHaveBeenCalledWith({ shown: false })
  })
})
