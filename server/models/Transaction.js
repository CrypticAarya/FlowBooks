import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ['Income', 'Expense'] },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
)

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction
