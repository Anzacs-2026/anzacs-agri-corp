import { productService } from '@/features/products/services/productService'
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
  const methods = ['select', 'eq', 'is', 'neq', 'order', 'limit', 'single', 'update', 'insert']
  methods.forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  // Make the chain awaitable, resolving to finalResolution
  ;(chain as unknown as { then: PromiseLike<unknown>['then'] }).then = (resolve) =>
    Promise.resolve(finalResolution).then(resolve)
  return chain
}

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getVisibleProducts filters to visible + active rows', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await productService.getVisibleProducts()

    expect(mockFrom).toHaveBeenCalledWith('products')
    expect(chain.eq).toHaveBeenCalledWith('visible', true)
    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('getProductBySlug filters by slug + active', async () => {
    const chain = makeQueryChain({ data: { id: '1', slug: 'maize' }, error: null })
    mockFrom.mockReturnValue(chain)

    await productService.getProductBySlug('maize')

    expect(chain.eq).toHaveBeenCalledWith('slug', 'maize')
    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('getAllProductsAdmin does not filter by visibility', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await productService.getAllProductsAdmin()

    expect(chain.eq).not.toHaveBeenCalledWith('visible', true)
  })

  it('softDeleteProduct calls update, never delete', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    chain.delete = jest.fn(() => chain)
    mockFrom.mockReturnValue(chain)

    await productService.softDeleteProduct('product-1', 'user-1')

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String), deleted_by: 'user-1' }),
    )
    expect(chain.delete).not.toHaveBeenCalled()
  })
})
