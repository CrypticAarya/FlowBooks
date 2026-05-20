import Invoice from '../models/Invoice.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
export const getInvoices = async (req, res, next) => {
  try {
    // Only fetch invoices that belong to the logged in user
    const invoices = await Invoice.find({ user: req.user.id }).sort({ createdAt: -1 });
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

    // Make sure the logged in user is the owner
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this invoice',
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
    
    // Check if invoice number is already taken for this specific user
    const existingInvoice = await Invoice.findOne({ invoiceNumber, user: req.user.id });
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
      user: req.user.id, // Attach the user to the invoice
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

    // Check ownership before updating
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this invoice',
      });
    }

    // Check unique constraint if invoiceNumber is changing for this user
    if (invoiceNumber && invoiceNumber !== invoice.invoiceNumber) {
      const duplicate = await Invoice.findOne({ invoiceNumber, user: req.user.id });
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
    // Find the invoice first to check ownership
    const invoice = await Invoice.findById(req.params.id);
    
    // Return a 404 response if the invoice does not exist
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Verify ownership
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this invoice',
      });
    }

    // Delete target invoice from MongoDB
    await invoice.deleteOne();

    // Return the required success payload
    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    // Forward any unexpected errors to our global error handling middleware
    next(error);
  }
};
