import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['invoice_created', 'payment_received', 'invoice_overdue', 'expense_added', 'customer_added', 'payment_failed', 'reminder', 'system'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedEntity: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export default mongoose.model('Notification', notificationSchema);
