export default function StatusBadge({ status }) {
  const styles = {
    Paid: 'bg-accent/20 text-accent',
    Pending: 'bg-yellow-500/20 text-yellow-400',
    Overdue: 'bg-red-500/20 text-red-400',
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || ''}`}>
      {status}
    </span>
  )
}
