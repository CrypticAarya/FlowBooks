import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import SearchFilterBar from '../components/SearchFilterBar'
import TransactionTable from '../components/TransactionTable'
import ErrorBox from '../components/ErrorBox'
import LoadingSpinner from '../components/LoadingSpinner'
import FieldError from '../components/FieldError'
import { apiFetch } from '../utils/api'
import { validateTransaction, inputClass } from '../utils/validation'
import { formatDate } from '../utils/format'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('Income')
  const [date, setDate] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

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
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDescription('')
    setAmount('')
    setType('Income')
    setDate(new Date().toISOString().slice(0, 10))
    setFieldErrors({})
    setEditingId(null)
  }

  const openAdd = () => {
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (tx) => {
    setEditingId(tx._id)
    setDescription(tx.description)
    setAmount(String(tx.amount))
    setType(tx.type)
    setDate(formatDate(tx.date))
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

    const errors = validateTransaction({ description, amount, type })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setSaving(true)

    const body = {
      description,
      amount: Number(amount),
      type,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    }

    try {
      if (editingId) {
        const updated = await apiFetch(`/transactions/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        setTransactions((prev) =>
          prev.map((tx) => (tx._id === editingId ? updated : tx))
        )
        toast.success('Transaction updated')
      } else {
        const created = await apiFetch('/transactions', {
          method: 'POST',
          body: JSON.stringify(body),
        })
        setTransactions((prev) => [created, ...prev])
        toast.success('Transaction added')
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
      await apiFetch(`/transactions/${deleteTarget}`, { method: 'DELETE' })
      setTransactions((prev) => prev.filter((tx) => tx._id !== deleteTarget))
      toast.success('Transaction deleted')
      setDeleteTarget(null)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description
      .toLowerCase()
      .includes(search.toLowerCase().trim())
    const matchesType = typeFilter === 'All' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const hasNoData = transactions.length === 0
  const emptyTitle = hasNoData
    ? 'No transactions yet'
    : 'No matching transactions found'
  const emptyDescription = hasNoData
    ? 'Start by adding your first transaction'
    : 'Try a different search or filter'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Transactions</h2>
          <p className="text-sm text-muted mt-1">Track income and expenses</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="w-full sm:w-auto bg-accent text-background text-sm font-medium px-4 py-2.5 rounded-lg hover:brightness-110"
        >
          Add Transaction
        </button>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <LoadingSpinner text="Loading transactions..." />
      ) : (
        <div className="space-y-4">
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search transactions..."
            filter={typeFilter}
            onFilterChange={setTypeFilter}
            filterOptions={[
              { value: 'All', label: 'All' },
              { value: 'Income', label: 'Income' },
              { value: 'Expense', label: 'Expense' },
            ]}
          />
          <TransactionTable
            transactions={filteredTransactions}
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
        title={editingId ? 'Edit Transaction' : 'Add Transaction'}
      >
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
              className={inputClass(fieldErrors.description)}
            />
            <FieldError message={fieldErrors.description} />
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
              className={inputClass(fieldErrors.amount)}
            />
            <FieldError message={fieldErrors.amount} />
          </div>

          <div>
            <label htmlFor="tx-type" className="block text-sm text-muted mb-1.5">
              Type
            </label>
            <select
              id="tx-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass(fieldErrors.type)}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <FieldError message={fieldErrors.type} />
          </div>

          <div>
            <label htmlFor="tx-date" className="block text-sm text-muted mb-1.5">
              Date
            </label>
            <input
              id="tx-date"
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
            {saving ? 'Saving...' : editingId ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete transaction?"
        message="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={!!deletingId}
      />
    </div>
  )
}
