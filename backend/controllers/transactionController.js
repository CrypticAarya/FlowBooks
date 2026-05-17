import Transaction from '../models/Transaction.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Public
export const createTransaction = async (req, res, next) => {
  try {
    const { client, project, amount, type, status } = req.body;
    
    const transaction = await Transaction.create({
      client,
      project,
      amount,
      type,
      status,
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
