import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      trim: true,
    },
    clientName: {
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
      required: [true, 'Invoice amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: String,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      required: [true, 'Invoice status is required'],
      enum: ['paid', 'pending', 'overdue', 'partial'],
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ user: 1, invoiceNumber: 1 }, { unique: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
