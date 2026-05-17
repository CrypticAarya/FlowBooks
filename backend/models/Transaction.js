import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    project: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: ['income', 'expense'],
    },
    status: {
      type: String,
      required: [true, 'Invoice status is required'],
      enum: ['paid', 'pending', 'overdue'],
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
