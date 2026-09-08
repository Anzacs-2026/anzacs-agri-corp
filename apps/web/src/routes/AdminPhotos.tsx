import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { photoService } from '@/features/photos/services/photoService'
import { useAdminPhotos, useSoftDeletePhoto, useUpdatePhotoLabel, useUploadPhoto } from '@/features/photos/hooks/usePhotos'

const AdminPhotos = () => {
  const { data: photos, isLoading } = useAdminPhotos()
  const upload = useUploadPhoto()
  const updateLabel = useUpdatePhotoLabel()
  const softDelete = useSoftDeletePhoto()
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = () => {
    if (!file) return
    upload.mutate({ file }, { onSuccess: () => setFile(null) })
  }

  if (isLoading) return <p className="py-16 text-center text-forest/60">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Photos</h1>

      <div className="mb-6 flex items-center gap-2">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button size="sm" onClick={handleUpload} disabled={!file || upload.isPending}>
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos?.map((photo) => (
          <div key={photo.id} className="flex flex-col gap-2">
            <img
              src={photoService.getPublicUrl(photo.storage_path)}
              alt={photo.alt_text ?? ''}
              className="aspect-square w-full rounded object-cover"
            />
            <Input
              defaultValue={photo.label ?? ''}
              placeholder="Label"
              onBlur={(e) => updateLabel.mutate({ id: photo.id, label: e.target.value })}
            />
            <button
              type="button"
              onClick={() => softDelete.mutate(photo.id)}
              className="text-sm text-red-700 underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPhotos
