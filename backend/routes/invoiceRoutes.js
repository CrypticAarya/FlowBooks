import express from 'express';
import { 
  getInvoices, 
  createInvoice, 
  deleteInvoice 
} from '../controllers/invoiceController.js';

const router = express.Router();

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .delete(deleteInvoice);

export default router;
