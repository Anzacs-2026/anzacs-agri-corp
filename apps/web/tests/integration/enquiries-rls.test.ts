import path from 'node:path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Anon URL/key come from the app's own env; the service-role key is
// root-level only (never in apps/web/.env), matching how the Netlify
// Function is configured.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && serviceRoleKey)
const describeIfConfigured = isConfigured ? describe : describe.skip

describeIfConfigured('enquiries RLS — security boundary', () => {
  // Proves the boundary properly: a service-role client plants a real row
  // (so the table is provably non-empty), then the anon client is checked
  // against it. An empty anon result against an empty table would prove
  // nothing — this way, "anon sees zero rows" is meaningful. The service
  // client cleans up afterward so no junk data is left in the live table.
  it('rejects an anonymous select even when a row exists', async () => {
    const adminClient = createClient(supabaseUrl as string, serviceRoleKey as string)
    const anonClient = createClient(supabaseUrl as string, supabaseAnonKey as string)

    const { data: inserted, error: insertError } = await adminClient
      .from('enquiries')
      .insert({
        name: 'RLS Canary',
        email: 'rls-canary@example.com',
        phone: '0000000000',
        subject: 'General enquiry',
        message: 'Automated RLS boundary test canary row.',
      })
      .select('id')
      .single()

    expect(insertError).toBeNull()

    try {
      const { data, error } = await anonClient.from('enquiries').select('*')

      expect(error).toBeNull()
      expect(data).toEqual([])
    } finally {
      await adminClient.from('enquiries').delete().eq('id', inserted!.id)
    }
  })
})
