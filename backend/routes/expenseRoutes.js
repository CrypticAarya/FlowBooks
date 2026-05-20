import express from 'express';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the JWT protect middleware to all expense routes
router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
