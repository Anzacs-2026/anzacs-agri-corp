import { photoService } from '@/features/photos/services/photoService'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: { from: jest.fn(() => ({ upload: jest.fn().mockResolvedValue({ error: null }) })) },
  },
}))

const mockFrom = supabase.from as jest.Mock

function makeQueryChain(finalResolution: unknown) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'is', 'order', 'update', 'insert']
  methods.forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  ;(chain as unknown as { then: PromiseLike<unknown>['then'] }).then = (resolve) =>
    Promise.resolve(finalResolution).then(resolve)
  return chain
}

describe('photoService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getAllPhotosAdmin filters to active rows only', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await photoService.getAllPhotosAdmin()

    expect(mockFrom).toHaveBeenCalledWith('photos')
    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('softDeletePhoto calls update, never delete', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    chain.delete = jest.fn(() => chain)
    mockFrom.mockReturnValue(chain)

    await photoService.softDeletePhoto('photo-1', 'user-1')

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String), deleted_by: 'user-1' }),
    )
    expect(chain.delete).not.toHaveBeenCalled()
  })

  it('updatePhotoLabel updates only the label', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    await photoService.updatePhotoLabel('photo-1', 'Front view')

    expect(chain.update).toHaveBeenCalledWith({ label: 'Front view' })
    expect(chain.eq).toHaveBeenCalledWith('id', 'photo-1')
  })
})
