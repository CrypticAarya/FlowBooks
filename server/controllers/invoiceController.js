import Invoice from '../models/Invoice.js'

// GET /api/invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .sort({ createdAt: -1 })

    res.json(invoices)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/invoices
export const createInvoice = async (req, res) => {
  try {
    const { client, amount, status, date } = req.body

    if (!client || amount === undefined || !status) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const invoice = await Invoice.create({
      user: req.user._id,
      client,
      amount: Number(amount),
      status,
      date: date || Date.now(),
    })

    res.status(201).json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    await invoice.deleteOne()
    res.json({ message: 'Invoice removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
