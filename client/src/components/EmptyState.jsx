export default function EmptyState({ title, description }) {
  return (
    <div className="py-14 px-6 text-center">
      <div className="mx-auto max-w-sm rounded-lg border border-dashed border-border bg-background/50 px-6 py-10">
        <p className="text-white font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted mt-2">{description}</p>
        )}
      </div>
    </div>
  )
}
