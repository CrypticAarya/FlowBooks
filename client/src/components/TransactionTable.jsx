import { formatDate, formatMoney, shortId } from '../utils/format'
import EmptyState from './EmptyState'

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  deletingId,
  emptyTitle = 'No transactions yet',
  emptyDescription = 'Start by adding your first transaction',
}) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-glow">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto shadow-glow">
      <table className="w-full min-w-[640px] text-sm text-left">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-4 sm:px-6 py-3 font-medium">ID</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Description</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Type</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Amount</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Date</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((tx) => (
            <tr key={tx._id} className="hover:bg-background/50">
              <td className="px-4 sm:px-6 py-4 text-muted">{shortId(tx._id)}</td>
              <td className="px-4 sm:px-6 py-4 text-white">{tx.description}</td>
              <td className="px-4 sm:px-6 py-4 text-white">{tx.type}</td>
              <td className="px-4 sm:px-6 py-4 text-white">{formatMoney(tx.amount)}</td>
              <td className="px-4 sm:px-6 py-4 text-muted">{formatDate(tx.date)}</td>
              <td className="px-4 sm:px-6 py-4 space-x-2 sm:space-x-3 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(tx)}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(tx._id)}
                  disabled={deletingId === tx._id}
                  className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {deletingId === tx._id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
