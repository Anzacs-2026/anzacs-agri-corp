import { useEffect, useRef } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    confirmRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-forest/50 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="font-serif text-lg text-forest">
          {title}
        </h2>
        {description && (
          <p id="confirm-dialog-description" className="mt-2 text-sm text-forest/70">
            {description}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            type="button"
            size="sm"
            onClick={onConfirm}
            className={cn(destructive && 'bg-red-700 text-white hover:opacity-90')}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
