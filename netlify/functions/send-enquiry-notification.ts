import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

interface EnquiryPayload {
  enquiryId: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const DEFAULT_NOTIFY_EMAIL = 'nazar@anzacs.in'

const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, serviceKey)
}

const logFailure = async (enquiryId: string, errorMessage: string, stack?: string) => {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    await supabaseAdmin.from('server_logs').insert({
      error_message: errorMessage,
      stack: stack ?? null,
      context: { enquiryId, source: 'send-enquiry-notification' },
    })
  } catch (loggingError) {
    // Last resort — even the failure log failed. Surface to Netlify function logs.
    console.error('Failed to write server_logs row', loggingError, { enquiryId, errorMessage })
  }
}

const resolveNotifyEmail = async (): Promise<string> => {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data } = await supabaseAdmin.from('site_settings').select('notify_email').limit(1).single()
    return data?.notify_email ?? DEFAULT_NOTIFY_EMAIL
  } catch {
    return DEFAULT_NOTIFY_EMAIL
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let payload: EnquiryPayload
  try {
    payload = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: 'Invalid JSON body' }
  }

  const { enquiryId, name, email, phone, subject, message } = payload
  if (!enquiryId || !name || !email || !subject || !message) {
    return { statusCode: 400, body: 'Missing required fields' }
  }

  const brevoApiKey = process.env.BREVO_API_KEY
  if (!brevoApiKey) {
    await logFailure(enquiryId, 'BREVO_API_KEY not configured')
    // The enquiry insert already succeeded — never fail the visitor's submission for this.
    return { statusCode: 200, body: JSON.stringify({ emailSent: false }) }
  }

  const notifyEmail = await resolveNotifyEmail()

  try {
    const response = await fetch('https://api.brevo.com/v3/smtpEmail', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'ANZ Agricrop Website', email: notifyEmail },
        to: [{ email: notifyEmail }],
        replyTo: { email, name },
        subject: `[${subject}] New enquiry from ${name}`,
        htmlContent: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Received:</strong> ${new Date().toISOString()}</p>
        `,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      await logFailure(enquiryId, `Brevo responded ${response.status}: ${body}`)
      return { statusCode: 200, body: JSON.stringify({ emailSent: false }) }
    }

    return { statusCode: 200, body: JSON.stringify({ emailSent: true }) }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    await logFailure(enquiryId, err.message, err.stack)
    // Insert already succeeded — the lead is safe. Never fail this response for a Brevo/network issue.
    return { statusCode: 200, body: JSON.stringify({ emailSent: false }) }
  }
}
