import Invoice from '../models/Invoice.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Public
export const createInvoice = async (req, res, next) => {
  try {
    const { invoiceId, clientName, project, amount, dueDate, status } = req.body;
    
    // Check if invoice ID is already taken
    const existingInvoice = await Invoice.findOne({ invoiceId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: `Invoice ID ${invoiceId} already exists`,
      });
    }

    const invoice = await Invoice.create({
      invoiceId,
      clientName,
      project,
      amount,
      dueDate,
      status,
    });

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Public
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    await invoice.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Invoice removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
