import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import TransactionTable from '../components/TransactionTable'
import { apiFetch } from '../utils/api'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Income')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    try {
      setLoading(true)
      setError('')
      const data = await apiFetch('/transactions')
      setTransactions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDescription('')
    setAmount('')
    setType('Income')
  }

  const handleClose = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const created = await apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          description,
          amount: Number(amount),
          type,
          date: new Date().toISOString(),
        }),
      })
      setTransactions((prev) => [created, ...prev])
      handleClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return

    try {
      await apiFetch(`/transactions/${id}`, { method: 'DELETE' })
      setTransactions((prev) => prev.filter((tx) => tx._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Transactions</h2>
          <p className="text-sm text-muted mt-1">Track income and expenses</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-accent text-background text-sm font-medium px-4 py-2.5 rounded-lg hover:brightness-110"
        >
          Add Transaction
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading transactions...</p>
      ) : (
        <TransactionTable transactions={transactions} onDelete={handleDelete} />
      )}

      <Modal isOpen={modalOpen} onClose={handleClose} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tx-description" className="block text-sm text-muted mb-1.5">
              Description
            </label>
            <input
              id="tx-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="tx-amount" className="block text-sm text-muted mb-1.5">
              Amount
            </label>
            <input
              id="tx-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="tx-type" className="block text-sm text-muted mb-1.5">
              Type
            </label>
            <select
              id="tx-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent text-background text-sm font-medium py-2.5 rounded-lg hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
