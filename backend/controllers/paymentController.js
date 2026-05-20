import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import { logActivity } from './notificationController.js';

// @desc    Get all payments for the logged-in seller
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('invoice', 'invoiceNumber amount status')
      .sort({ paymentDate: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a payment and auto-settle invoice
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, paymentMethod, paymentStatus, transactionId, paymentDate, notes, customerName } = req.body;

    // Verify invoice exists and belongs to the seller
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Associated invoice not found' });
    }
    
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to settle this invoice' });
    }

    const payment = await Payment.create({
      user: req.user.id,
      invoice: invoiceId,
      customerName: customerName || invoice.clientName,
      amount: Number(amount),
      paymentMethod,
      paymentStatus,
      transactionId,
      paymentDate: paymentDate || Date.now(),
      notes
    });

    // Auto-settlement Logic: Update the linked Invoice's paidAmount and Status
    if (paymentStatus === 'Paid') {
      const currentPaid = invoice.paidAmount || 0;
      const newPaidAmount = currentPaid + Number(amount);
      
      invoice.paidAmount = newPaidAmount;
      
      if (newPaidAmount >= invoice.amount) {
        invoice.status = 'paid';
        await logActivity(req.user.id, 'Invoice Settled', `Invoice ${invoice.invoiceNumber} was fully paid ($${amount.toLocaleString()}).`, 'payment_received', invoice._id);
      } else if (newPaidAmount > 0) {
        invoice.status = 'partial';
        await logActivity(req.user.id, 'Partial Payment', `Received $${amount.toLocaleString()} payment for ${invoice.invoiceNumber}.`, 'payment_received', invoice._id);
      }
      
      await invoice.save();
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
