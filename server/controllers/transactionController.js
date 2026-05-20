import Transaction from '../models/Transaction.js'
import { validateTransaction } from '../utils/validators.js'

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, date } = req.body
    const { valid, errors } = validateTransaction({ description, amount, type })

    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors })
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      description: description.trim(),
      amount: Number(amount),
      type,
      date: date || Date.now(),
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const { description, amount, type, date } = req.body
    const { valid, errors } = validateTransaction({ description, amount, type })

    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors })
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    transaction.description = description.trim()
    transaction.amount = Number(amount)
    transaction.type = type
    transaction.date = date || transaction.date
    await transaction.save()

    res.json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    await transaction.deleteOne()
    res.json({ message: 'Transaction removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
