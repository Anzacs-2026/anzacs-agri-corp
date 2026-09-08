import { pageContentService } from '@/features/pages/services/pageContentService'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

const mockFrom = supabase.from as jest.Mock

function makeQueryChain(finalResolution: unknown) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'is', 'upsert']
  methods.forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  ;(chain as unknown as { then: PromiseLike<unknown>['then'] }).then = (resolve) =>
    Promise.resolve(finalResolution).then(resolve)
  return chain
}

describe('pageContentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getPageContent filters by page and active rows', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await pageContentService.getPageContent('home')

    expect(mockFrom).toHaveBeenCalledWith('page_content')
    expect(chain.eq).toHaveBeenCalledWith('page', 'home')
    expect(chain.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('upsertPageContent upserts on the (page, section_key) pair', async () => {
    const chain = makeQueryChain({ data: null, error: null })
    mockFrom.mockReturnValue(chain)

    await pageContentService.upsertPageContent('home', 'hero_title', { text: 'Welcome' })

    expect(chain.upsert).toHaveBeenCalledWith(
      { page: 'home', section_key: 'hero_title', content: { text: 'Welcome' } },
      { onConflict: 'page,section_key' },
    )
  })
})
