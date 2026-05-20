import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoiceController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getInvoices)
router.post('/', createInvoice)
router.put('/:id', updateInvoice)
router.delete('/:id', deleteInvoice)

export default router
