export default function FieldError({ message }) {
  if (!message) return null
  return <p className="text-xs text-red-400 mt-1">{message}</p>
}
