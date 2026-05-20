import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import InvoiceTable from '../components/InvoiceTable'
import { apiFetch } from '../utils/api'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('Pending')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      setLoading(true)
      setError('')
      const data = await apiFetch('/invoices')
      setInvoices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setClient('')
    setAmount('')
    setStatus('Pending')
  }

  const handleClose = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const created = await apiFetch('/invoices', {
        method: 'POST',
        body: JSON.stringify({
          client,
          amount: Number(amount),
          status,
          date: new Date().toISOString(),
        }),
      })
      setInvoices((prev) => [created, ...prev])
      handleClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return

    try {
      await apiFetch(`/invoices/${id}`, { method: 'DELETE' })
      setInvoices((prev) => prev.filter((inv) => inv._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Invoices</h2>
          <p className="text-sm text-muted mt-1">Manage client billing</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-accent text-background text-sm font-medium px-4 py-2.5 rounded-lg hover:brightness-110"
        >
          Create Invoice
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading invoices...</p>
      ) : (
        <InvoiceTable invoices={invoices} onDelete={handleDelete} />
      )}

      <Modal isOpen={modalOpen} onClose={handleClose} title="Create Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="inv-client" className="block text-sm text-muted mb-1.5">
              Client
            </label>
            <input
              id="inv-client"
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label htmlFor="inv-amount" className="block text-sm text-muted mb-1.5">
              Amount
            </label>
            <input
              id="inv-amount"
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
            <label htmlFor="inv-status" className="block text-sm text-muted mb-1.5">
              Status
            </label>
            <select
              id="inv-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent text-background text-sm font-medium py-2.5 rounded-lg hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Invoice'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
