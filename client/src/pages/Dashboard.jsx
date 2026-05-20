import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import StatCard from '../components/StatCard'
import DashboardCharts from '../components/DashboardCharts'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { apiFetch } from '../utils/api'
import { formatDate, formatMoney } from '../utils/format'

export default function Dashboard() {
  const location = useLocation()
  const [transactions, setTransactions] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch fresh data on mount and when navigating back to dashboard
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [txData, invData] = await Promise.all([
        apiFetch('/api/transactions'),
        apiFetch('/api/invoices'),
      ])

      setTransactions(txData)
      setInvoices(invData)
    } catch (err) {
      const msg = err.message || 'Failed to load dashboard data'
      setError(msg)
      toast.error(msg)
      setTransactions([])
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Refetch when user opens or returns to the dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      loadDashboard()
    }
  }, [loadDashboard, location.pathname])

  let revenue = 0
  let expenses = 0

  transactions.forEach((tx) => {
    if (tx.type === 'Income') revenue += tx.amount
    if (tx.type === 'Expense') expenses += tx.amount
  })

  const profit = revenue - expenses
  const recentTransactions = transactions.slice(0, 5)
  const recentInvoices = invoices.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
        <p className="text-sm text-muted mt-1">Overview of your finances</p>
      </div>

      {loading && (
        <div className="bg-card border border-border rounded-xl p-8 shadow-glow">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      )}

      {!loading && error && (
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-glow">
          <p className="text-white font-medium">Failed to load dashboard data</p>
          <p className="text-sm text-muted mt-2">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 bg-accent text-background text-sm font-medium px-5 py-2.5 rounded-lg hover:brightness-110"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stat cards — 1 col mobile, 2 tablet, 5 desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard title="Revenue" value={formatMoney(revenue)} />
            <StatCard title="Expenses" value={formatMoney(expenses)} />
            <StatCard title="Profit" value={formatMoney(profit)} />
            <StatCard title="Total Transactions" value={transactions.length} />
            <StatCard title="Total Invoices" value={invoices.length} />
          </div>

          <DashboardCharts transactions={transactions} />

          {/* Recent transactions */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-glow">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-medium text-white">Recent Transactions</h3>
            </div>

            {transactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Go to Transactions to add your first entry"
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentTransactions.map((tx) => (
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

          {/* Recent invoices */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-glow">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-medium text-white">Recent Invoices</h3>
            </div>

            {invoices.length === 0 ? (
              <EmptyState
                title="No invoices yet"
                description="Go to Invoices to create your first bill"
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentInvoices.map((inv) => (
                  <li
                    key={inv._id}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm"
                  >
                    <span className="text-white font-medium">{inv.client}</span>
                    <span className="flex flex-wrap items-center gap-3 shrink-0">
                      <span className="text-white">{formatMoney(inv.amount)}</span>
                      <StatusBadge status={inv.status} />
                      <span className="text-muted">{formatDate(inv.date)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
