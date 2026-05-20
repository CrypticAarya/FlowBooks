import { formatDate, formatMoney, shortId } from '../utils/format'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

export default function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
  deletingId,
  emptyTitle = 'No invoices yet',
  emptyDescription = 'Create your first invoice',
}) {
  if (invoices.length === 0) {
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
            <th className="px-4 sm:px-6 py-3 font-medium">Invoice ID</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Client</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Amount</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Date</th>
            <th className="px-4 sm:px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((inv) => (
            <tr key={inv._id} className="hover:bg-background/50">
              <td className="px-4 sm:px-6 py-4 font-medium text-white">{shortId(inv._id)}</td>
              <td className="px-4 sm:px-6 py-4 text-white">{inv.client}</td>
              <td className="px-4 sm:px-6 py-4 text-white">{formatMoney(inv.amount)}</td>
              <td className="px-4 sm:px-6 py-4">
                <StatusBadge status={inv.status} />
              </td>
              <td className="px-4 sm:px-6 py-4 text-muted">{formatDate(inv.date)}</td>
              <td className="px-4 sm:px-6 py-4 space-x-2 sm:space-x-3 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(inv)}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(inv._id)}
                  disabled={deletingId === inv._id}
                  className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {deletingId === inv._id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
