import { formatDate, formatMoney, shortId } from '../utils/format'

function StatusBadge({ status }) {
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

export default function InvoiceTable({ invoices, onDelete }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto shadow-glow">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-6 py-3 font-medium">Invoice ID</th>
            <th className="px-6 py-3 font-medium">Client</th>
            <th className="px-6 py-3 font-medium">Amount</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Date</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted">
                No invoices yet.
              </td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-background/50">
                <td className="px-6 py-4 font-medium text-white">{shortId(inv._id)}</td>
                <td className="px-6 py-4 text-white">{inv.client}</td>
                <td className="px-6 py-4 text-white">{formatMoney(inv.amount)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-6 py-4 text-muted">{formatDate(inv.date)}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(inv._id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
