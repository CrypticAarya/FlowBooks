import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    // Check ownership
    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this customer' });
    }
    
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this customer' });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (customer.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this customer' });
    }

    await customer.deleteOne();
    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};
