import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  businessName: { type: String, default: 'My Workspace' },
  ownerName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  logo: { type: String, default: '' },
  address: { type: String, default: '' },
  website: { type: String, default: '' },
  taxNumber: { type: String, default: '' },
  currency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'UTC' },
  invoicePrefix: { type: String, default: 'INV-' },
  themePreference: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' }
}, {
  timestamps: true
});

export default mongoose.model('BusinessProfile', businessProfileSchema);
