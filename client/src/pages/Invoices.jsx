import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import SearchFilterBar from '../components/SearchFilterBar'
import InvoiceTable from '../components/InvoiceTable'
import ErrorBox from '../components/ErrorBox'
import LoadingSpinner from '../components/LoadingSpinner'
import FieldError from '../components/FieldError'
import { apiFetch } from '../utils/api'
import { validateInvoice, inputClass } from '../utils/validation'
import { formatDate } from '../utils/format'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [client, setClient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('Pending')
  const [date, setDate] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

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
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setClient('')
    setAmount('')
    setStatus('Pending')
    setDate(new Date().toISOString().slice(0, 10))
    setFieldErrors({})
    setEditingId(null)
  }

  const openAdd = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (inv) => {
    setEditingId(inv._id)
    setClient(inv.client)
    setAmount(String(inv.amount))
    setStatus(inv.status)
    setDate(formatDate(inv.date))
    setFieldErrors({})
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const errors = validateInvoice({ client, amount, status })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setSaving(true)

    const body = {
      client,
      amount: Number(amount),
      status,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    }

    try {
      if (editingId) {
        const updated = await apiFetch(`/invoices/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        setInvoices((prev) =>
          prev.map((inv) => (inv._id === editingId ? updated : inv))
        )
        toast.success('Invoice updated')
      } else {
        const created = await apiFetch('/invoices', {
          method: 'POST',
          body: JSON.stringify(body),
        })
        setInvoices((prev) => [created, ...prev])
        toast.success('Invoice created')
      }
      handleClose()
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      if (err.errors) setFieldErrors(err.errors)
    } finally {
      setSaving(false)
    }
  }

  const requestDelete = (id) => setDeleteTarget(id)

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeletingId(deleteTarget)
      setError('')
      await apiFetch(`/invoices/${deleteTarget}`, { method: 'DELETE' })
      setInvoices((prev) => prev.filter((inv) => inv._id !== deleteTarget))
      toast.success('Invoice deleted')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.client
      .toLowerCase()
      .includes(search.toLowerCase().trim())
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const hasNoData = invoices.length === 0
  const emptyTitle = hasNoData ? 'No invoices yet' : 'No matching invoices found'
  const emptyDescription = hasNoData
    ? 'Create your first invoice'
    : 'Try a different search or filter'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Invoices</h2>
          <p className="text-sm text-muted mt-1">Manage client billing</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="w-full sm:w-auto bg-accent text-background text-sm font-medium px-4 py-2.5 rounded-lg hover:brightness-110"
        >
          Create Invoice
        </button>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <LoadingSpinner text="Loading invoices..." />
      ) : (
        <div className="space-y-4">
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search invoices..."
            filter={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { value: 'All', label: 'All' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
          <InvoiceTable
            invoices={filteredInvoices}
            onEdit={openEdit}
            onDelete={requestDelete}
            deletingId={deletingId}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title={editingId ? 'Edit Invoice' : 'Create Invoice'}
      >
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
              className={inputClass(fieldErrors.client)}
            />
            <FieldError message={fieldErrors.client} />
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
              className={inputClass(fieldErrors.amount)}
            />
            <FieldError message={fieldErrors.amount} />
          </div>

          <div>
            <label htmlFor="inv-status" className="block text-sm text-muted mb-1.5">
              Status
            </label>
            <select
              id="inv-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass(fieldErrors.status)}
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <FieldError message={fieldErrors.status} />
          </div>

          <div>
            <label htmlFor="inv-date" className="block text-sm text-muted mb-1.5">
              Date
            </label>
            <input
              id="inv-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent text-background text-sm font-medium py-2.5 rounded-lg hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving...' : editingId ? 'Update Invoice' : 'Save Invoice'}
          </button>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete invoice?"
        message="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={!!deletingId}
      />
    </div>
  )
}
