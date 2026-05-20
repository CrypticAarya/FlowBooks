export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-muted text-sm py-8">
      <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      {text}
    </div>
  )
}
