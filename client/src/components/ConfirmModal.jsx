export default function ConfirmModal({
  isOpen,
  title = 'Confirm delete',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-glow">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-muted mt-2">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-border text-white text-sm font-medium py-2.5 rounded-lg hover:border-accent/50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
