import express from 'express';
import { 
  getTransactions, 
  createTransaction, 
  deleteTransaction 
} from '../controllers/transactionController.js';

const router = express.Router();

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .delete(deleteTransaction);

export default router;
