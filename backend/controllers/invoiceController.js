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

// @desc    Get a single invoice
// @route   GET /api/invoices/:id
// @access  Public
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
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
    const { invoiceNumber, clientName, project, amount, dueDate, status } = req.body;
    
    // Check if invoice number is already taken
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: `Invoice number ${invoiceNumber} already exists`,
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber,
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

// @desc    Update an existing invoice
// @route   PUT /api/invoices/:id
// @access  Public
export const updateInvoice = async (req, res, next) => {
  try {
    const { invoiceNumber, clientName, project, amount, dueDate, status } = req.body;
    
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Check unique constraint if invoiceNumber is changing
    if (invoiceNumber && invoiceNumber !== invoice.invoiceNumber) {
      const duplicate = await Invoice.findOne({ invoiceNumber });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Invoice number ${invoiceNumber} already exists`,
        });
      }
    }

    // Perform the update
    invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { invoiceNumber, clientName, project, amount, dueDate, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
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
