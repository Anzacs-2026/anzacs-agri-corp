import { handler } from './send-enquiry-notification'

const insertMock = jest.fn().mockResolvedValue({ error: null })
const singleMock = jest.fn().mockResolvedValue({ data: { notify_email: 'nazar@anzacs.in' } })

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === 'server_logs') {
        return { insert: insertMock }
      }
      return {
        select: () => ({ limit: () => ({ single: singleMock }) }),
      }
    },
  }),
}))

const basePayload = {
  enquiryId: 'enq-1',
  name: 'Test Farmer',
  email: 'farmer@example.com',
  phone: '9999999999',
  subject: 'General enquiry',
  message: 'Hello',
}

function makeEvent(body: unknown) {
  return { httpMethod: 'POST', body: JSON.stringify(body) } as never
}

describe('send-enquiry-notification', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      BREVO_API_KEY: 'test-key',
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-key',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('sends the email on the success path', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => '' }) as never

    const result = await handler(makeEvent(basePayload), {} as never, {} as never)

    expect(result).toMatchObject({ statusCode: 200 })
    expect(JSON.parse((result as { body: string }).body)).toEqual({ emailSent: true })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('logs to server_logs and still returns 200 when Brevo fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' }) as never

    const result = await handler(makeEvent(basePayload), {} as never, {} as never)

    expect(result).toMatchObject({ statusCode: 200 })
    expect(JSON.parse((result as { body: string }).body)).toEqual({ emailSent: false })
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ context: expect.objectContaining({ enquiryId: 'enq-1' }) }),
    )
  })

  it('logs and returns 200 when the Brevo call throws (network failure)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as never

    const result = await handler(makeEvent(basePayload), {} as never, {} as never)

    expect(result).toMatchObject({ statusCode: 200 })
    expect(insertMock).toHaveBeenCalled()
  })
})
