import { formatDate, formatMoney, shortId } from '../utils/format'

export default function TransactionTable({ transactions, onDelete }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto shadow-glow">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-6 py-3 font-medium">ID</th>
            <th className="px-6 py-3 font-medium">Description</th>
            <th className="px-6 py-3 font-medium">Type</th>
            <th className="px-6 py-3 font-medium">Amount</th>
            <th className="px-6 py-3 font-medium">Date</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-muted">
                No transactions yet.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-background/50">
                <td className="px-6 py-4 text-muted">{shortId(tx._id)}</td>
                <td className="px-6 py-4 text-white">{tx.description}</td>
                <td className="px-6 py-4 text-white">{tx.type}</td>
                <td className="px-6 py-4 text-white">{formatMoney(tx.amount)}</td>
                <td className="px-6 py-4 text-muted">{formatDate(tx.date)}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onDelete(tx._id)}
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
