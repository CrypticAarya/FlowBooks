import Expense from '../models/Expense.js';

// @desc    Get all expenses for the authenticated seller
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  try {
    // Isolated read: only fetch expenses tied to req.user.id
    const expenses = await Expense.find({ user: req.user.id }).sort({ expenseDate: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id // Lock expense to the logged in user
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Isolated write: verify ownership before updating
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this expense' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Isolated delete: verify ownership before removing
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};
