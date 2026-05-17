import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
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
    dueDate: {
      type: String,
      required: [true, 'Due date is required'],
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

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
