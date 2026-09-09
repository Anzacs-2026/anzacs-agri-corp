import { photoService } from '@/features/photos/services/photoService'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: { from: jest.fn() },
  },
}))

jest.mock('@/lib/resizeImage', () => ({
  resizeImage: jest.fn().mockResolvedValue(new Blob(['x'], { type: 'image/jpeg' })),
}))

const mockFrom = supabase.from as jest.Mock
const mockStorageFrom = supabase.storage.from as jest.Mock

function makeQueryChain(finalResolution: unknown) {
  const chain: Record<string, jest.Mock> = {}
  const methods = ['select', 'eq', 'is', 'order', 'insert', 'single']
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

  it('getPublicUrl resolves a storage path to a public URL', () => {
    mockStorageFrom.mockReturnValue({
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://cdn.example.com/pages/1.jpg' } })),
    })

    const url = photoService.getPublicUrl('pages/1.jpg')

    expect(mockStorageFrom).toHaveBeenCalledWith('product-images')
    expect(url).toBe('https://cdn.example.com/pages/1.jpg')
  })

  it('uploadPhoto uploads to storage and inserts a photos row', async () => {
    const upload = jest.fn().mockResolvedValue({ error: null })
    mockStorageFrom.mockReturnValue({ upload })

    const chain = makeQueryChain({ data: { id: 'photo-1', storage_path: 'pages/123.jpg' }, error: null })
    mockFrom.mockReturnValue(chain)

    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    const result = await photoService.uploadPhoto(file, 'home')

    expect(upload).toHaveBeenCalled()
    expect(mockFrom).toHaveBeenCalledWith('photos')
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ page: 'home' }))
    expect(result).toEqual({ id: 'photo-1', storage_path: 'pages/123.jpg' })
  })
})
