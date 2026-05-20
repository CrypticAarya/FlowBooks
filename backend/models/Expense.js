import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: ['Shipping', 'Packaging', 'Ads', 'Inventory', 'Software', 'Utilities', 'Miscellaneous'],
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash', 'Other'],
  },
  expenseDate: {
    type: Date,
    required: [true, 'Expense date is required'],
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Expense', expenseSchema);
