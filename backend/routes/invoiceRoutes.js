import express from 'express';
import { 
  getInvoices, 
  getInvoiceById,
  createInvoice, 
  updateInvoice,
  deleteInvoice 
} from '../controllers/invoiceController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInvoices)
  .post(protect, createInvoice);

router.route('/:id')
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

export default router;
