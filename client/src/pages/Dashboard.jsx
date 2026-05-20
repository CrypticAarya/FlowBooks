import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { apiFetch } from '../utils/api'
import { formatDate, formatMoney } from '../utils/format'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    try {
      setLoading(true)
      const data = await apiFetch('/transactions')
      setTransactions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  let revenue = 0
  let expenses = 0

  transactions.forEach((tx) => {
    if (tx.type === 'Income') revenue += tx.amount
    if (tx.type === 'Expense') expenses += tx.amount
  })

  const profit = revenue - expenses
  const recent = transactions.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="text-sm text-muted mt-1">Overview of your finances</p>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenue" value={formatMoney(revenue)} />
        <StatCard title="Expenses" value={formatMoney(expenses)} />
        <StatCard title="Profit" value={formatMoney(profit)} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-glow">
        <p className="text-sm text-muted">Cash flow</p>
        <div className="mt-4 h-48 border border-dashed border-border rounded-lg flex items-center justify-center text-muted text-sm">
          Chart Coming Soon
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-glow">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-medium text-white">Recent Transactions</h3>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-muted text-sm">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="px-6 py-8 text-muted text-sm">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((tx) => (
              <li
                key={tx._id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm"
              >
                <span className="text-white">{tx.description}</span>
                <span className="flex items-center gap-4 shrink-0">
                  <span className={tx.type === 'Income' ? 'text-accent' : 'text-red-400'}>
                    {tx.type === 'Income' ? '+' : '-'}
                    {formatMoney(tx.amount)}
                  </span>
                  <span className="text-muted">{formatDate(tx.date)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
