import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Invoice',
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0.01, 'Amount must be positive'],
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'Stripe', 'Other'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
    default: 'Paid',
  },
  transactionId: {
    type: String,
    trim: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Payment', paymentSchema);
