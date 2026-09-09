import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
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

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this photo?')) {
      softDelete.mutate(id)
    }
  }

  if (isLoading) return <p className="text-forest/60">Loading…</p>

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader title="Photos" description="Shared media library used across products and pages." />

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-dashed border-forest/20 bg-white p-4">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button size="sm" onClick={handleUpload} disabled={!file || upload.isPending}>
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="flex flex-col gap-2 rounded-xl border border-forest/10 bg-white p-2 shadow-sm">
            <img
              src={photoService.getPublicUrl(photo.storage_path)}
              alt={photo.alt_text ?? ''}
              className="aspect-square w-full rounded-md object-cover"
            />
            <Input
              defaultValue={photo.label ?? ''}
              placeholder="Label"
              onBlur={(e) => updateLabel.mutate({ id: photo.id, label: e.target.value })}
            />
            <button
              type="button"
              onClick={() => handleDelete(photo.id)}
              className="text-sm font-medium text-red-700 hover:underline"
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
