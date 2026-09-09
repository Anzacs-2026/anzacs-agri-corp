import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { enquiryService } from '../services/enquiryService'

const notifyBackend = (enquiryId: string, input: { name: string; email: string; phone: string; subject: string; message: string }) => {
  fetch('/.netlify/functions/send-enquiry-notification', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ enquiryId, ...input }),
  }).catch(() => {
    // Insert already succeeded — a notification failure must never surface to the visitor.
  })
}

const EnquiryForm = () => {
  const { data: settings } = useSiteSettings()
  const subjects = settings?.enquiry_subjects ?? ['General enquiry']

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    const input = { name, email, phone, subject: subject || subjects[0], message }

    try {
      const enquiry = await enquiryService.createEnquiry(input)
      notifyBackend(enquiry.id, input)

      setName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-4 py-8 text-left">
      <Label>
        Name
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Label>

      <Label>
        Email
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Label>

      <Label>
        Phone
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </Label>

      <Label>
        Subject
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded border border-forest/20 bg-cream px-3 py-2 text-forest focus:border-forest/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-1"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Label>

      <Label>
        Message
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
      </Label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <output className="text-sm text-green-700">
          Thanks — your enquiry has been sent. We'll get back to you soon.
        </output>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send enquiry'}
      </Button>
    </form>
  )
}

export default EnquiryForm
