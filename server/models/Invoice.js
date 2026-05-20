import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ['Paid', 'Pending', 'Overdue'] },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
)

const Invoice = mongoose.model('Invoice', invoiceSchema)
export default Invoice
