import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  plan: {
    type: String,
    enum: ['Free', 'Pro', 'Business'],
    default: 'Free'
  },
  status: {
    type: String,
    enum: ['active', 'past_due', 'canceled'],
    default: 'active'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  renewalDate: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'failed'],
    default: 'paid'
  },
  // Feature gating logic
  features: {
    invoicesLimit: { type: Number, default: 5 }, // -1 implies unlimited
    customersLimit: { type: Number, default: 3 },
    hasAdvancedAnalytics: { type: Boolean, default: false },
    hasTeamSupport: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

export default mongoose.model('Subscription', subscriptionSchema);
