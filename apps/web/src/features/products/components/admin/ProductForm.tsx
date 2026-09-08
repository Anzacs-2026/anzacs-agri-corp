import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProductInput } from '../../types'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const specsToText = (specs: Record<string, string>) =>
  Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

const textToSpecs = (text: string): Record<string, string> => {
  const specs: Record<string, string> = {}
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(':')
      if (key && rest.length) {
        specs[key.trim()] = rest.join(':').trim()
      }
    })
  return specs
}

interface ProductFormProps {
  onSubmit: (input: ProductInput, photoFile: File | null) => void
  submitting: boolean
  initialValues?: ProductInput
}

const ProductForm = ({ onSubmit, submitting, initialValues }: ProductFormProps) => {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues))
  const [category, setCategory] = useState(initialValues?.category ?? '')
  const [shortDescription, setShortDescription] = useState(initialValues?.short_description ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [specsText, setSpecsText] = useState(initialValues ? specsToText(initialValues.specs) : '')
  const [traitsText, setTraitsText] = useState(initialValues?.traits.join(', ') ?? '')
  const [visible, setVisible] = useState(initialValues?.visible ?? true)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const traits = traitsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    onSubmit(
      {
        name,
        slug,
        category,
        short_description: shortDescription,
        description,
        specs: textToSpecs(specsText),
        traits,
        visible,
      },
      photoFile,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-4 py-8">
      <Label>
        Name
        <Input value={name} onChange={(e) => handleNameChange(e.target.value)} required />
      </Label>

      <Label>
        Slug
        <Input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
          }}
          required
        />
      </Label>

      <Label>
        Category
        <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
      </Label>

      <Label>
        Short description
        <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      </Label>

      <Label>
        Description
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </Label>

      <Label>
        Specs (one per line, "key: value")
        <Textarea value={specsText} onChange={(e) => setSpecsText(e.target.value)} rows={3} />
      </Label>

      <Label>
        Traits (comma-separated)
        <Input value={traitsText} onChange={(e) => setTraitsText(e.target.value)} />
      </Label>

      <label className="flex items-center gap-2 text-sm text-forest">
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
        Visible on public site
      </label>

      <Label>
        Photo
        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
      </Label>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}

export default ProductForm
