import { logService } from '@/features/logs/services/logService'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockFrom = supabase.from as jest.Mock

function makeQueryChain(finalResolution: unknown) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'order', 'limit']
  methods.forEach((method) => {
    chain[method] = jest.fn(() => chain)
  })
  ;(chain as unknown as { then: PromiseLike<unknown>['then'] }).then = (resolve) =>
    Promise.resolve(finalResolution).then(resolve)
  return chain
}

describe('logService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getLogs orders newest first and applies the given limit', async () => {
    const chain = makeQueryChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)

    await logService.getLogs(50)

    expect(mockFrom).toHaveBeenCalledWith('server_logs')
    expect(chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(chain.limit).toHaveBeenCalledWith(50)
  })

  it('throws when the query errors', async () => {
    const chain = makeQueryChain({ data: null, error: new Error('boom') })
    mockFrom.mockReturnValue(chain)

    await expect(logService.getLogs(50)).rejects.toThrow('boom')
  })
})
